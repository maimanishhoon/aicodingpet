import * as vscode from "vscode";
import { PetPanel, type DiagnosticSnapshot } from "./petPanel";
import { PetViewProvider } from "./petViewProvider";
import { AiClient, PROVIDER_GUIDES, type AiProviderType } from "./aiClient";

let autoMode = false;
let isFixingInProgress = false;
let fixingStartTime = 0;
let panel: PetPanel | undefined;
let viewProvider: PetViewProvider | undefined;
let statusBarItem: vscode.StatusBarItem | undefined;
let lastActiveDocumentUri: vscode.Uri | undefined;
let lastDiagnosticSnapshot: DiagnosticSnapshot | undefined;

export function getLastSnapshot(): DiagnosticSnapshot | undefined {
  return lastDiagnosticSnapshot;
}

export function activate(context: vscode.ExtensionContext) {
  // 1. Register Webview View Provider (Activity Bar & Explorer Beside Code)
  viewProvider = new PetViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(PetViewProvider.viewType, viewProvider, {
      webviewOptions: { retainContextWhenHidden: true }
    })
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("codepet.petViewExplorer", viewProvider, {
      webviewOptions: { retainContextWhenHidden: true }
    })
  );

  // 2. Status Bar Item in the bottom-right corner
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = "codepet.openCompanionBeside";
  updateStatusBar(statusBarItem, 0, 0);
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  const debounceMs = vscode.workspace.getConfiguration("codepet").get<number>("debounceMs", 300);
  const update = debounce(() => examineActiveDocument(statusBarItem!), debounceMs);

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(event => {
      if (isSupported(event.document)) {
        lastActiveDocumentUri = event.document.uri;
        update();
      }
    })
  );

  context.subscriptions.push(vscode.languages.onDidChangeDiagnostics(() => update()));
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor && isSupported(editor.document)) {
        lastActiveDocumentUri = editor.document.uri;
      }
      update();
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(event => {
      if (
        event.affectsConfiguration("codepet.petName") ||
        event.affectsConfiguration("codepet.petSpecies") ||
        event.affectsConfiguration("codepet.scanningPermission")
      ) {
        const petName = getPetName();
        const species = vscode.workspace.getConfiguration("codepet").get<any>("petSpecies", "bot");
        const perm = getScanningPermission();
        viewProvider?.updatePet(petName, species);
        viewProvider?.updatePermission(perm);
        panel?.updatePet(petName, species);
        panel?.updatePermission(perm);
        if (statusBarItem) examineActiveDocument(statusBarItem);
      }
    })
  );

  // Commands
  context.subscriptions.push(vscode.commands.registerCommand("codepet.openCompanionBeside", () => openPanel(context, vscode.ViewColumn.Beside)));
  context.subscriptions.push(vscode.commands.registerCommand("codepet.openAssistant", () => openPanel(context)));
  context.subscriptions.push(vscode.commands.registerCommand("codepet.analyzeCurrentFile", () => examineActiveDocument(statusBarItem!, true)));
  context.subscriptions.push(vscode.commands.registerCommand("codepet.explainCurrentError", (data?: any) => explainCurrentDiagnostic(data)));
  context.subscriptions.push(vscode.commands.registerCommand("codepet.autoFixCurrentError", (data?: any) => autoFixCurrentDiagnostic(data)));
  context.subscriptions.push(vscode.commands.registerCommand("codepet.fixCurrentError", (data?: any) => autoFixCurrentDiagnostic(data)));
  context.subscriptions.push(vscode.commands.registerCommand("codepet.enterApiKey", () => promptForApiKey()));
  context.subscriptions.push(vscode.commands.registerCommand("codepet.handleChatPrompt", (prompt: string) => handleChatPrompt(prompt)));
  context.subscriptions.push(vscode.commands.registerCommand("codepet.toggleAutoMode", () => {
    autoMode = !autoMode;
    vscode.window.showInformationMessage(`🐾 ${getPetName()}: Auto mode ${autoMode ? "enabled" : "disabled"}.`);
  }));
  context.subscriptions.push(vscode.commands.registerCommand("codepet.openSettings", () => {
    vscode.commands.executeCommand("workbench.action.openSettings", "@ext:codepet.codepet-vscode-extension");
  }));

  if (!context.globalState.get<boolean>("codepet.onboarded")) {
    openPanel(context);
    void context.globalState.update("codepet.onboarded", true);
  }

  update();
}

function getPetName(): string {
  return vscode.workspace.getConfiguration("codepet").get<string>("petName", "luffy").trim() || "luffy";
}

function getScanningPermission(): "granted" | "denied" | "not_asked" {
  return vscode.workspace.getConfiguration("codepet").get<any>("scanningPermission", "granted");
}

function updateStatusBar(item: vscode.StatusBarItem, errors: number, warnings: number) {
  const petName = getPetName();
  const perm = getScanningPermission();

  if (perm !== "granted") {
    item.text = `$(shield) ${petName}: Standby`;
    item.tooltip = `${petName} is resting. Click to enable scanning.`;
    item.backgroundColor = undefined;
    return;
  }

  if (errors > 0) {
    item.text = `$(error) ${petName}: ${errors} error${errors > 1 ? "s" : ""}`;
    item.tooltip = `${petName} spotted ${errors} error(s). Click to review on avatar.`;
    item.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
  } else if (warnings > 0) {
    item.text = `$(warning) ${petName}: ${warnings} warning${warnings > 1 ? "s" : ""}`;
    item.tooltip = `${petName} noticed ${warnings} warning(s). Click to review.`;
    item.backgroundColor = new vscode.ThemeColor("statusBarItem.warningBackground");
  } else {
    item.text = `$(robot) ${petName}: Watching`;
    item.tooltip = `${petName} is watching your code across all languages. All clear!`;
    item.backgroundColor = undefined;
  }
}

function examineActiveDocument(status: vscode.StatusBarItem, force = false) {
  if (isFixingInProgress && !force) {
    return;
  }
  const perm = getScanningPermission();
  if (perm !== "granted") {
    updateStatusBar(status, 0, 0);
    return;
  }

  let editor = vscode.window.activeTextEditor;
  if (!editor || !isSupported(editor.document)) {
    editor = vscode.window.visibleTextEditors.find(e => isSupported(e.document));
  }
  if (!editor || !isSupported(editor.document)) {
    updateStatusBar(status, 0, 0);
    return;
  }

  lastActiveDocumentUri = editor.document.uri;

  const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
  const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error);
  const warnings = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning);

  let firstError = errors[0];
  let line = firstError ? firstError.range.start.line + 1 : undefined;

  let suggestion = firstError?.message;
  if (firstError) {
    const lineText = editor.document.lineAt(firstError.range.start.line).text.trim();
    const typoMatch = lineText.match(/\b(mport|impot|imprt|inport|improt)\b/i);
    if (typoMatch) {
      suggestion = "Unknown keyword or identifier. Did you mean 'import'?";
    } else if (lineText.match(/\b(cosnt|cnost|cont)\b/i)) {
      suggestion = "Unknown keyword. Did you mean 'const'?";
    } else if (lineText.match(/\b(fucntion|funciton|functino)\b/i)) {
      suggestion = "Unknown keyword. Did you mean 'function'?";
    } else if (lineText.match(/\b(retrun|retunr)\b/i)) {
      suggestion = "Unknown keyword. Did you mean 'return'?";
    }
  } else {
    // If language server has not produced diagnostics yet, check document lines for quick typo detection
    for (let i = 0; i < Math.min(200, editor.document.lineCount); i++) {
      const lineText = editor.document.lineAt(i).text.trim();
      const match = lineText.match(/\b(mport|impot|imprt|inport|improt|cosnt|cnost|cont|fucntion|funciton|functino|retrun|retunr|whlie|calss)\b/i);
      if (match) {
        line = i + 1;
        const typoWord = match[1].toLowerCase();
        const corrected = typoWord.startsWith("mp") || typoWord.startsWith("im") || typoWord.startsWith("in") ? "import"
          : typoWord.startsWith("co") || typoWord.startsWith("cn") ? "const"
          : typoWord.startsWith("fu") || typoWord.startsWith("fn") ? "function"
          : typoWord.startsWith("re") ? "return"
          : typoWord.startsWith("wh") ? "while"
          : "class";
        suggestion = `Unknown keyword '${match[1]}'. Did you mean '${corrected}'?`;
        const diag = new vscode.Diagnostic(
          new vscode.Range(new vscode.Position(i, 0), new vscode.Position(i, lineText.length)),
          suggestion,
          vscode.DiagnosticSeverity.Error
        );
        errors.push(diag);
        firstError = diag;
        break;
      }
    }
  }

  const snapshot: DiagnosticSnapshot = {
    fileName: getBaseFileName(editor.document.fileName),
    uri: editor.document.uri.toString(),
    filePath: editor.document.fileName,
    version: editor.document.version,
    errors: errors.length,
    warnings: warnings.length,
    message: firstError?.message || suggestion,
    line,
    language: editor.document.languageId,
    suggestion
  };

  lastDiagnosticSnapshot = snapshot;
  updateStatusBar(status, errors.length, warnings.length);

  panel?.update(snapshot);
  viewProvider?.updateDiagnostics(snapshot);
}

export async function promptForApiKey(targetProvider?: AiProviderType) {
  const config = vscode.workspace.getConfiguration("codepet");
  const provider = targetProvider || config.get<AiProviderType>("aiProvider", "groq");
  const guide = PROVIDER_GUIDES[provider] || PROVIDER_GUIDES.groq;

  const enteredKey = await vscode.window.showInputBox({
    prompt: `Enter API Key for ${guide.name} (${guide.badge})`,
    placeHolder: `Paste your ${guide.name} API key here...`,
    password: true,
    ignoreFocusOut: true,
    validateInput: val => (val.trim().length === 0 ? "API key cannot be empty" : null)
  });

  if (enteredKey) {
    const cleanKey = enteredKey.trim().replace(/^["']|["']$/g, "");
    await config.update("apiKey", cleanKey, vscode.ConfigurationTarget.Global);
    await config.update("aiProvider", provider, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`🐾 CodePet: ${guide.name} API key saved!`);
    return cleanKey;
  }
  return undefined;
}

/**
 * When user clicks [ 💡 Explain ], the avatar explains the problem directly.
 */
async function explainCurrentDiagnostic(params?: { uri?: string; line?: number }) {
  const petName = getPetName();
  let doc: vscode.TextDocument | undefined;

  if (params?.uri) {
    try {
      doc = await vscode.workspace.openTextDocument(vscode.Uri.parse(params.uri));
    } catch {}
  }

  if (!doc) {
    doc = await resolveTargetDocument();
  }

  if (!doc) {
    vscode.window.showWarningMessage(`🐾 ${petName}: Please open a code file to explain errors.`);
    return;
  }

  const diagnostics = vscode.languages.getDiagnostics(doc.uri);
  const targetLine = params?.line !== undefined ? Number(params.line) : undefined;

  let diag = (targetLine !== undefined)
    ? (diagnostics.find(d => (d.range.start.line + 1 === targetLine) && d.severity === vscode.DiagnosticSeverity.Error)
      || diagnostics.find(d => (d.range.start.line + 1 === targetLine)))
    : undefined;

  if (!diag) {
    diag = diagnostics.find(d => d.severity === vscode.DiagnosticSeverity.Error)
        || diagnostics.find(d => d.severity === vscode.DiagnosticSeverity.Warning);
  }

  if (!diag) {
    viewProvider?.showExplanation(`Everything in ${getBaseFileName(doc.fileName)} looks clean! No compiler errors detected.`);
    return;
  }

  const range = diag.range;
  const start = Math.max(0, range.start.line - 6);
  const end = Math.min(doc.lineCount - 1, range.end.line + 6);
  const contextSnippet = doc.getText(new vscode.Range(new vscode.Position(start, 0), doc.lineAt(end).range.end));

  try {
    const result = await AiClient.explainDiagnostic({
      code: contextSnippet,
      language: doc.languageId,
      diagnosticMessage: diag.message,
      line: range.start.line + 1,
      column: range.start.character + 1
    });

    const explanationText = `${result.explanation}\n\nRoot Cause: ${result.rootCause}\nSuggested Fix: ${result.suggestedFix}`;
    viewProvider?.showExplanation(explanationText);
  } catch (err) {
    viewProvider?.showExplanation(`Analysis: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * When user clicks [ 🔧 Fix ], automatically fix the problematic line using AI!
 */
async function autoFixCurrentDiagnostic(params?: { uri?: string; line?: number; suggestion?: string; message?: string }) {
  const petName = getPetName();
  if (isFixingInProgress && Date.now() - fixingStartTime < 8000) {
    return;
  }
  isFixingInProgress = true;
  fixingStartTime = Date.now();
  console.log("[CodePet] >>> autoFixCurrentDiagnostic called with params:", params);

  try {
    // 1. Resolve Target Document & Editor
    let doc: vscode.TextDocument | undefined;

    if (params?.uri) {
      try {
        const parsedUri = vscode.Uri.parse(params.uri);
        doc = await vscode.workspace.openTextDocument(parsedUri);
      } catch (e) {
        console.warn("[CodePet] Failed to open params.uri:", params.uri, e);
      }
    }

    if (!doc || !isSupported(doc)) {
      doc = await resolveTargetDocument();
    }

    if (!doc) {
      const msg = "Please open a code file in the editor to fix.";
      viewProvider?.showChatError(msg);
      panel?.showChatError(msg);
      vscode.window.showWarningMessage(`🐾 ${petName}: ${msg}`);
      return;
    }

    // 2. Identify the active or visible TextEditor for this document
    let editor = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === doc!.uri.toString())
              || vscode.window.activeTextEditor;
    if (!editor || editor.document.uri.toString() !== doc.uri.toString()) {
      try {
        editor = await vscode.window.showTextDocument(doc, { viewColumn: vscode.ViewColumn.One, preserveFocus: false });
      } catch {}
    }

    // 3. Determine target line (0-indexed)
    let targetLineIndex = -1;
    const requestedLine = params?.line !== undefined ? Number(params.line) : undefined;
    if (requestedLine !== undefined && !isNaN(requestedLine) && requestedLine > 0 && requestedLine <= doc.lineCount) {
      targetLineIndex = requestedLine - 1;
    }

    const diagnostics = vscode.languages.getDiagnostics(doc.uri);
    let matchedDiag: vscode.Diagnostic | undefined;

    if (targetLineIndex >= 0) {
      matchedDiag = diagnostics.find(d => d.range.start.line === targetLineIndex);
    }

    // If target line was not explicitly given, infer from cursor selection or first error
    if (targetLineIndex < 0) {
      if (editor && editor.selection) {
        const cursorLine = editor.selection.active.line;
        const diagOnCursor = diagnostics.find(d => d.range.start.line === cursorLine);
        if (diagOnCursor) {
          targetLineIndex = cursorLine;
          matchedDiag = diagOnCursor;
        }
      }
      if (targetLineIndex < 0) {
        matchedDiag = diagnostics.find(d => d.severity === vscode.DiagnosticSeverity.Error)
                   || diagnostics.find(d => d.severity === vscode.DiagnosticSeverity.Warning);
        if (matchedDiag) {
          targetLineIndex = matchedDiag.range.start.line;
        }
      }
      if (targetLineIndex < 0) {
        // Quick scan for obvious typo keywords
        for (let i = 0; i < Math.min(200, doc.lineCount); i++) {
          const lt = doc.lineAt(i).text.trim();
          if (/\b(mport|impot|imprt|inport|improt|cosnt|cnost|cont|fucntion|funciton|functino|retrun|retunr|whlie|calss)\b/i.test(lt)) {
            targetLineIndex = i;
            break;
          }
        }
      }
      if (targetLineIndex < 0 && editor && editor.selection) {
        targetLineIndex = editor.selection.active.line;
      }
      if (targetLineIndex < 0) {
        targetLineIndex = 0;
      }
    }

    targetLineIndex = Math.max(0, Math.min(doc.lineCount - 1, targetLineIndex));
    const humanLine = targetLineIndex + 1;
    let lineObj = doc.lineAt(targetLineIndex);
    let lineText = lineObj.text;

    // Visual feedback in companion webview: Show fixing in progress
    viewProvider?.showFixing(humanLine);
    panel?.showFixing(humanLine);

    const diagMsg = params?.suggestion || params?.message || matchedDiag?.message || `Syntax or logic issue on line ${humanLine}`;

    let newLineText = lineText;
    let fixSummary = "";
    let isFixed = false;

    // Strategy 0: Official VS Code CodeActions (Native QuickFix)
    try {
      const codeActions = await vscode.commands.executeCommand<(vscode.CodeAction | vscode.Command)[]>(
        "vscode.executeCodeActionProvider",
        doc.uri,
        lineObj.range
      );
      if (codeActions && codeActions.length > 0) {
        for (const action of codeActions) {
          if ("edit" in action && action.edit && action.edit.has(doc.uri)) {
            const applied = await vscode.workspace.applyEdit(action.edit);
            if (applied) {
              await doc.save();
              const title = action.title || `QuickFix on line ${humanLine}`;
              viewProvider?.showFixSuccess(`✓ Fixed: ${title}`);
              panel?.showFixSuccess(`✓ Fixed: ${title}`);
              vscode.window.showInformationMessage(`🐾 ${petName}: ✓ ${title}`);
              setTimeout(() => { if (statusBarItem) examineActiveDocument(statusBarItem, true); }, 500);
              return;
            }
          }
        }
      }
    } catch (caErr) {
      console.warn("[CodePet] executeCodeActionProvider fallback:", caErr);
    }

    const effectiveCfg = AiClient.getEffectiveConfig();
    const hasAiAuth = Boolean(effectiveCfg.apiKey) || effectiveCfg.provider === "ollama";

    // Strategy 1: AI Code Fix Engine (Runs first when AI provider & key are configured)
    if (hasAiAuth) {
      try {
        const start = Math.max(0, targetLineIndex - 8);
        const end = Math.min(doc.lineCount - 1, targetLineIndex + 8);
        const context = doc.getText(new vscode.Range(new vscode.Position(start, 0), doc.lineAt(end).range.end));

        const fixResult = await AiClient.fixDiagnostic({
          code: context,
          language: doc.languageId,
          diagnosticMessage: diagMsg,
          line: humanLine,
          column: 1,
          originalText: lineText
        });

        if (fixResult && fixResult.correctedText && fixResult.correctedText.trim() !== lineText.trim()) {
          newLineText = fixResult.correctedText;
          fixSummary = fixResult.explanation || `AI correction applied on line ${humanLine}`;
          isFixed = true;
        }
      } catch (aiErr: any) {
        const errStr = aiErr instanceof Error ? aiErr.message : String(aiErr);
        console.warn(`[CodePet] AI fix error (${effectiveCfg.provider}):`, errStr);
        // Do not block user: fall through to offline syntax repair engine below!
      }
    }

    // Strategy 2: Instant Heuristic & Offline Syntax Repair Engine
    // (Resolves typos, missing quotes, brackets, colons, arrows immediately if AI is offline, failed, or keyless)
    if (!isFixed) {
      const offline = AiClient.generateOfflineFix({
        code: lineText,
        language: doc.languageId,
        diagnosticMessage: diagMsg,
        line: humanLine,
        column: 1,
        originalText: lineText
      });
      if (offline && offline.correctedText && offline.correctedText.trim() !== lineText.trim()) {
        newLineText = offline.correctedText;
        fixSummary = offline.explanation || `Syntax repair on line ${humanLine}`;
        isFixed = true;
      }
    }

    // Strategy 3: If still not fixed and user has no API key, prompt them to configure one
    if (!isFixed && !hasAiAuth && effectiveCfg.provider !== "backend") {
      const guide = PROVIDER_GUIDES[effectiveCfg.provider] || PROVIDER_GUIDES.groq;
      const key = await promptForApiKey(effectiveCfg.provider);
      if (key) {
        isFixingInProgress = false;
        return autoFixCurrentDiagnostic(params);
      } else {
        viewProvider?.showChatError(`API key required for ${guide.name}. Click [🔑 Enter API Key] below to configure.`);
        panel?.showChatError(`API key required for ${guide.name}. Click [🔑 Enter API Key] below to configure.`);
        return;
      }
    }

    // 4. Apply the fix directly to the editor AND file system (3-Layer Bulletproof Execution)
    if (isFixed && newLineText !== lineText) {
      const lineRange = lineObj.range;
      let editApplied = false;

      // Layer 1: WorkspaceEdit
      try {
        const wsEdit = new vscode.WorkspaceEdit();
        wsEdit.replace(doc.uri, lineRange, newLineText);
        editApplied = await vscode.workspace.applyEdit(wsEdit);
      } catch (e) {
        console.warn("[CodePet] applyEdit error:", e);
      }

      // Layer 2: TextEditor.edit
      if (!editApplied && editor) {
        try {
          editApplied = await editor.edit(builder => {
            builder.replace(lineRange, newLineText);
          }, { undoStopBefore: true, undoStopAfter: true });
        } catch (e) {
          console.warn("[CodePet] editor.edit error:", e);
        }
      }

      // Layer 3: Direct Workspace FS Write fallback (guaranteed to apply even when editor doesn't have focus)
      if (!editApplied) {
        try {
          const fullContent = doc.getText();
          const docLines = fullContent.split(/\r?\n/);
          if (targetLineIndex >= 0 && targetLineIndex < docLines.length) {
            docLines[targetLineIndex] = newLineText;
            const updated = docLines.join(doc.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n");
            await vscode.workspace.fs.writeFile(doc.uri, Buffer.from(updated, "utf8"));
            editApplied = true;
          }
        } catch (fsErr) {
          console.error("[CodePet] Direct file write fallback failed:", fsErr);
        }
      }

      if (editApplied) {
        try {
          await doc.save();
        } catch {}

        if (editor) {
          try {
            const newRange = new vscode.Range(
              new vscode.Position(targetLineIndex, 0),
              new vscode.Position(targetLineIndex, newLineText.length)
            );
            editor.selection = new vscode.Selection(newRange.start, newRange.end);
            editor.revealRange(newRange, vscode.TextEditorRevealType.InCenter);
          } catch {}
        }

        const successMsg = `✓ Fixed line ${humanLine} (${fixSummary})!`;
        viewProvider?.showFixSuccess(successMsg);
        panel?.showFixSuccess(successMsg);
        vscode.window.showInformationMessage(`🐾 ${petName}: ${successMsg}`);

        setTimeout(() => {
          if (statusBarItem) examineActiveDocument(statusBarItem, true);
        }, 600);
        return;
      }
    }

    const noFixMsg = `Could not automatically determine safe fix for line ${humanLine}. Check your API settings or click [Explain] for root cause analysis.`;
    viewProvider?.showChatError(noFixMsg);
    panel?.showChatError(noFixMsg);
    vscode.window.showWarningMessage(`🐾 ${petName}: ${noFixMsg}`);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[CodePet] autoFixCurrentDiagnostic fatal error:", err);
    viewProvider?.showChatError(`Fix error: ${errorMsg}`);
    panel?.showChatError(`Fix error: ${errorMsg}`);
    vscode.window.showErrorMessage(`🐾 ${petName}: Fix failed (${errorMsg})`);
  } finally {
    isFixingInProgress = false;
  }
}

/**
 * When user asks for code in the chat box, AI generates the code and displays it
 * inside the extension so the user can easily copy and paste wherever they want.
 * Does NOT write into the active editor.
 */
async function handleChatPrompt(promptText: string) {
  const petName = getPetName();
  const effectiveCfg = AiClient.getEffectiveConfig();
  const provider = effectiveCfg.provider;

  viewProvider?.showChatGenerating(promptText);
  panel?.showChatGenerating(promptText);

  // Optional: Read context from currently active editor if open
  let lang = "typescript";
  let currentCode = "";
  try {
    const activeDoc = vscode.window.activeTextEditor?.document;
    if (activeDoc) {
      lang = activeDoc.languageId || "typescript";
      currentCode = activeDoc.getText() || "";
    }
  } catch {}

  // 30-second hard ceiling — if everything stalls the UI still recovers
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out after 30s. Check your internet connection or add an API key in Settings.")), 30000)
  );

  try {
    const result = await Promise.race([
      AiClient.generateCode({ prompt: promptText, language: lang, currentCode }),
      timeoutPromise
    ]);

    viewProvider?.showChatResult({
      prompt: promptText,
      code: result.code,
      language: result.language,
      provider: result.provider,
      explanation: result.explanation
    });

    panel?.showChatResult({
      prompt: promptText,
      code: result.code,
      language: result.language,
      provider: result.provider,
      explanation: result.explanation
    });

    vscode.window.showInformationMessage(`🐾 ${petName}: Generated ${result.language} code! Click "Copy Code" in CodePet to paste anywhere.`);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[CodePet] AI generation error:", err);
    viewProvider?.showChatError(`${errMsg}`);
    panel?.showChatError(`${errMsg}`);
    vscode.window.showErrorMessage(`🐾 ${petName}: ${errMsg}`);
  }
}

/**
 * Resolves the target document even when focus was shifted to a webview sidebar or panel.
 */
async function resolveTargetDocument(): Promise<vscode.TextDocument | undefined> {
  const active = vscode.window.activeTextEditor;
  if (active && isSupported(active.document)) {
    lastActiveDocumentUri = active.document.uri;
    return active.document;
  }

  const visible = vscode.window.visibleTextEditors.find(e => isSupported(e.document));
  if (visible) {
    lastActiveDocumentUri = visible.document.uri;
    return visible.document;
  }

  if (lastActiveDocumentUri) {
    try {
      const doc = await vscode.workspace.openTextDocument(lastActiveDocumentUri);
      if (doc && isSupported(doc)) return doc;
    } catch {}
  }

  const openDoc = vscode.workspace.textDocuments.find(d => isSupported(d));
  if (openDoc) return openDoc;

  return undefined;
}

function openPanel(context?: vscode.ExtensionContext, column?: vscode.ViewColumn) {
  const extUri = context?.extensionUri || vscode.extensions.getExtension("codepet-local.codepet-ai")?.extensionUri || vscode.Uri.file(__dirname);
  panel = PetPanel.createOrShow(extUri, column);
  if (statusBarItem) examineActiveDocument(statusBarItem);
}

function getBaseFileName(fullPath: string): string {
  const parts = fullPath.split(/[\/\\]/);
  return parts[parts.length - 1] || fullPath;
}

function isSupported(document: vscode.TextDocument): boolean {
  if (document.uri.scheme !== "file" && document.uri.scheme !== "untitled") return false;
  const lang = document.languageId;
  const ignored = ["Log", "log", "output", "git", "git-commit", "search-result"];
  return !ignored.includes(lang);
}

function debounce(callback: () => void, wait: number) {
  let timer: NodeJS.Timeout | undefined;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(callback, wait);
  };
}

export function deactivate() {
  panel = undefined;
  statusBarItem?.dispose();
}
