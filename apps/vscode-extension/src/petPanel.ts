import * as vscode from "vscode";
import { renderPetAvatarSvg, renderRobotAvatarSvg, renderDottedPetSvg, type PetSpecies, type PetMood } from "./dottedPet";
import { AiClient, PROVIDER_GUIDES, type AiProviderType } from "./aiClient";

export interface DiagnosticSnapshot {
  fileName: string;
  uri?: string;
  filePath?: string;
  version?: number;
  errors: number;
  warnings: number;
  message?: string;
  line?: number;
  language?: string;
  suggestion?: string;
}

export class PetPanel {
  public static current: PetPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private disposables: vscode.Disposable[] = [];
  private lastSnapshot?: DiagnosticSnapshot;

  private constructor(panel: vscode.WebviewPanel, private readonly extensionUri: vscode.Uri) {
    this.panel = panel;
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    this.panel.webview.onDidReceiveMessage(async (message) => {
      await this.handleMessage(message);
    }, null, this.disposables);

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("codepet")) {
        this.syncConfigToWebview();
      }
    }, null, this.disposables);

    this.render();
  }

  public static createOrShow(extensionUri: vscode.Uri, requestedColumn?: vscode.ViewColumn): PetPanel {
    const column = requestedColumn || (vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.One);

    if (PetPanel.current) {
      PetPanel.current.panel.reveal(column, true);
      PetPanel.current.syncConfigToWebview();
      return PetPanel.current;
    }

    const panel = vscode.window.createWebviewPanel(
      "codepetAssistant",
      "CodePet Terminal Studio",
      { viewColumn: column, preserveFocus: true },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri]
      }
    );

    PetPanel.current = new PetPanel(panel, extensionUri);
    return PetPanel.current;
  }

  public update(snapshot: DiagnosticSnapshot) {
    this.lastSnapshot = snapshot;
    const mood: PetMood = snapshot.errors > 0 ? "error" : snapshot.warnings > 0 ? "warning" : "watching";
    const config = vscode.workspace.getConfiguration("codepet");
    const name = config.get<string>("petName", "luffy");
    const species = config.get<PetSpecies>("petSpecies", "bot");
    const svg = renderPetAvatarSvg({ species, mood, name, size: 96 });

    this.panel.webview.postMessage({
      type: "diagnostics",
      snapshot,
      mood,
      svg
    });
  }

  public showFixing(line: number) {
    const config = vscode.workspace.getConfiguration("codepet");
    const name = config.get<string>("petName", "luffy");
    const species = config.get<PetSpecies>("petSpecies", "bot");
    const svg = renderPetAvatarSvg({ species, mood: "watching", name, size: 96 });

    this.panel.webview.postMessage({
      type: "fixing",
      line,
      svg
    });
  }

  public showFixSuccess(msg: string) {
    const config = vscode.workspace.getConfiguration("codepet");
    const name = config.get<string>("petName", "luffy");
    const species = config.get<PetSpecies>("petSpecies", "bot");
    const svg = renderPetAvatarSvg({ species, mood: "celebrating", name, size: 96 });

    this.panel.webview.postMessage({
      type: "fixSuccess",
      message: msg,
      svg
    });
  }

  public showChatGenerating(prompt: string) {
    this.panel.webview.postMessage({
      type: "chatGenerating",
      prompt
    });
  }

  public showChatResult(data: { prompt: string; code: string; language?: string; provider?: string; explanation?: string }) {
    const config = vscode.workspace.getConfiguration("codepet");
    const name = config.get<string>("petName", "luffy");
    const species = config.get<PetSpecies>("petSpecies", "bot");
    const svg = renderPetAvatarSvg({ species, mood: "celebrating", name, size: 96 });

    this.panel.webview.postMessage({
      type: "chatResult",
      prompt: data.prompt,
      code: data.code,
      language: data.language || "typescript",
      provider: data.provider || "AI",
      explanation: data.explanation || "Here is your generated code:",
      svg
    });
  }

  public showChatSuccess(message: string) {
    const config = vscode.workspace.getConfiguration("codepet");
    const name = config.get<string>("petName", "luffy");
    const species = config.get<PetSpecies>("petSpecies", "bot");
    const svg = renderPetAvatarSvg({ species, mood: "celebrating", name, size: 96 });

    this.panel.webview.postMessage({
      type: "chatSuccess",
      message,
      svg
    });
  }

  public showChatError(error: string) {
    const config = vscode.workspace.getConfiguration("codepet");
    const name = config.get<string>("petName", "luffy");
    const species = config.get<PetSpecies>("petSpecies", "bot");
    const svg = renderPetAvatarSvg({ species, mood: "error", name, size: 96 });

    this.panel.webview.postMessage({
      type: "chatError",
      error,
      svg
    });
  }

  public updatePet(name: string, species: PetSpecies) {
    const mood: PetMood = this.lastSnapshot?.errors ? "error" : "watching";
    this.panel.webview.postMessage({
      type: "petUpdated",
      name,
      species,
      svg: renderPetAvatarSvg({
        species,
        mood,
        name,
        size: 96
      })
    });
  }

  public updatePermission(permission: "granted" | "denied" | "not_asked") {
    this.panel.webview.postMessage({
      type: "permissionUpdated",
      permission
    });
  }

  private syncConfigToWebview() {
    const config = vscode.workspace.getConfiguration("codepet");
    const name = config.get<string>("petName", "luffy");
    const species = config.get<PetSpecies>("petSpecies", "bot");
    const provider = config.get<AiProviderType>("aiProvider", "groq");
    const apiKey = config.get<string>("apiKey", "");
    const model = config.get<string>("aiModel", "");
    const ollamaUrl = config.get<string>("ollamaBaseUrl", "http://localhost:11434");
    const permission = config.get<string>("scanningPermission", "granted");

    this.panel.webview.postMessage({
      type: "configSync",
      config: { name, species, provider, apiKey, model, ollamaUrl, permission }
    });
  }

  private async handleMessage(message: any) {
    const config = vscode.workspace.getConfiguration("codepet");

    if (message.type === "savePet") {
      const newName = String(message.name || "luffy").trim().slice(0, 24) || "luffy";
      const newSpecies = (message.species as PetSpecies) || "bot";

      await Promise.all([
        config.update("petName", newName, vscode.ConfigurationTarget.Global),
        config.update("petSpecies", newSpecies, vscode.ConfigurationTarget.Global)
      ]);

      const mood: PetMood = this.lastSnapshot?.errors ? "error" : "watching";
      this.panel.webview.postMessage({
        type: "petUpdated",
        name: newName,
        species: newSpecies,
        svg: renderPetAvatarSvg({
          species: newSpecies,
          mood,
          name: newName,
          size: 96
        })
      });

      vscode.window.showInformationMessage(`🐾 ${newName} (${newSpecies}) profile saved.`);
    }

    if (message.type === "setPermission") {
      const permission = message.permission === "granted" ? "granted" : "denied";
      await config.update("scanningPermission", permission, vscode.ConfigurationTarget.Global);
      this.panel.webview.postMessage({
        type: "permissionUpdated",
        permission
      });
      if (permission === "granted") {
        vscode.commands.executeCommand("codepet.analyzeCurrentFile");
      }
    }

    if (message.type === "saveAiConfig") {
      const provider = message.provider as AiProviderType;
      const apiKey = String(message.apiKey || "").trim();
      const model = String(message.model || "").trim();
      const ollamaUrl = String(message.ollamaUrl || "").trim();

      await Promise.all([
        config.update("aiProvider", provider, vscode.ConfigurationTarget.Global),
        config.update("apiKey", apiKey, vscode.ConfigurationTarget.Global),
        config.update("aiModel", model, vscode.ConfigurationTarget.Global),
        config.update("ollamaBaseUrl", ollamaUrl, vscode.ConfigurationTarget.Global)
      ]);

      this.panel.webview.postMessage({
        type: "aiConfigSaved",
        provider,
        model
      });

      vscode.window.showInformationMessage(`AI configured: ${PROVIDER_GUIDES[provider]?.name || provider}`);
    }

    if (message.type === "testAiConnection") {
      const provider = message.provider as AiProviderType;
      const apiKey = String(message.apiKey || "").trim();
      const model = String(message.model || "").trim();
      const ollamaUrl = String(message.ollamaUrl || "").trim();

      const result = await AiClient.testConnection({ provider, apiKey, model, ollamaUrl });
      this.panel.webview.postMessage({
        type: "testAiResult",
        result
      });
    }

    if (message.type === "triggerExplain" || message.type === "explainError") {
      vscode.commands.executeCommand("codepet.explainCurrentError", message);
    }

    if (message.type === "triggerFix" || message.type === "fixError") {
      vscode.commands.executeCommand("codepet.autoFixCurrentError", message);
    }

    if (message.type === "enterApiKey") {
      vscode.commands.executeCommand("codepet.enterApiKey");
    }

    if (message.type === "webviewReady") {
      vscode.commands.executeCommand("codepet.analyzeCurrentFile");
    }

    if (message.type === "chatPrompt") {
      vscode.commands.executeCommand("codepet.handleChatPrompt", message.prompt);
    }

    if (message.type === "copyToClipboard") {
      await vscode.env.clipboard.writeText(String(message.text || ""));
      vscode.window.showInformationMessage("🐾 Code copied to clipboard!");
    }

    if (message.type === "openExternal") {
      if (message.url) {
        vscode.env.openExternal(vscode.Uri.parse(message.url));
      }
    }
  }

  private render() {
    this.panel.webview.html = this.getHtml();
  }

  private getHtml(): string {
    const config = vscode.workspace.getConfiguration("codepet");
    const name = escapeHtml(config.get<string>("petName", "luffy"));
    const species = config.get<PetSpecies>("petSpecies", "bot");
    const provider = config.get<AiProviderType>("aiProvider", "groq");
    const apiKey = escapeHtml(config.get<string>("apiKey", ""));
    const model = escapeHtml(config.get<string>("aiModel", ""));
    const ollamaUrl = escapeHtml(config.get<string>("ollamaBaseUrl", "http://localhost:11434"));
    const permission = config.get<string>("scanningPermission", "granted");

    const initialMood: PetMood = this.lastSnapshot?.errors ? "error" : "watching";
    const initialSvg = renderPetAvatarSvg({ species, mood: initialMood, name, size: 96 });
    const guidesJson = JSON.stringify(PROVIDER_GUIDES);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodePet Terminal Studio</title>
  <style>
    :root {
      --bg: #000000;
      --card-bg: #0a0a0a;
      --card-border: #222222;
      --bubble-bg: #0c0c0c;
      --border-highlight: #333333;
      --text: #f0f0f0;
      --text-muted: #888888;
      --font-mono: ui-monospace, "SF Mono", "Cascadia Code", Menlo, Monaco, Consolas, monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-mono);
      font-size: 12px;
      line-height: 1.45;
      padding: 16px;
      overflow-x: hidden;
      user-select: none;
    }

    /* Terminal Window Header */
    .terminal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 8px;
      margin-bottom: 12px;
      font-size: 11px;
      color: var(--text-muted);
      letter-spacing: 0.5px;
    }

    .terminal-dots {
      display: flex;
      gap: 5px;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #333333;
    }

    .btn-header-gear {
      background: transparent;
      border: none;
      color: #888888;
      font-size: 13px;
      cursor: pointer;
      transition: color 0.15s;
    }
    .btn-header-gear:hover { color: #ffffff; }

    /* ONLY THIS COMPANION SECTION SHOWN BY DEFAULT */
    .terminal-hero {
      background: #060606;
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 12px;
    }

    .companion-layout {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 14px;
      width: 100%;
    }

    /* Left Avatar Column */
    .avatar-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      width: 96px;
    }

    .avatar-badge {
      width: 96px;
      height: 96px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s ease;
    }

    .avatar-badge:hover {
      transform: scale(1.04);
    }

    .avatar-name {
      font-size: 12px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.5px;
      margin-top: 5px;
      text-transform: lowercase;
    }

    .avatar-status {
      font-size: 9px;
      color: #888888;
      letter-spacing: 0.5px;
      margin-top: 1px;
    }

    /* Right Speech Bubble pointing to avatar */
    .speech-bubble {
      flex: 1;
      position: relative;
      background: var(--bubble-bg);
      border: 1px solid var(--border-highlight);
      border-radius: 8px;
      padding: 12px 14px;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.85);
      animation: popIn 0.2s ease-out;
      min-width: 0;
    }

    .speech-bubble::before {
      content: "";
      position: absolute;
      top: 24px;
      left: -8px;
      border-width: 8px 8px 8px 0;
      border-style: solid;
      border-color: transparent var(--border-highlight) transparent transparent;
    }

    .speech-bubble::after {
      content: "";
      position: absolute;
      top: 25px;
      left: -6.5px;
      border-width: 7px 7px 7px 0;
      border-style: solid;
      border-color: transparent var(--bubble-bg) transparent transparent;
    }

    @media (max-width: 380px) {
      .companion-layout {
        flex-direction: column;
        align-items: center;
      }
      .avatar-col {
        width: 100%;
        margin-bottom: 8px;
      }
      .speech-bubble::before {
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        border-width: 0 8px 8px 8px;
        border-color: transparent transparent var(--border-highlight) transparent;
      }
      .speech-bubble::after {
        top: -6.5px;
        left: 50%;
        transform: translateX(-50%);
        border-width: 0 7px 7px 7px;
        border-color: transparent transparent var(--bubble-bg) transparent;
      }
    }

    .bubble-header {
      font-weight: 700;
      font-size: 11px;
      color: #ffffff;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
    }

    .bubble-badge {
      font-size: 9px;
      color: #888888;
      background: #141414;
      border: 1px solid #282828;
      padding: 1px 5px;
      border-radius: 3px;
      letter-spacing: 0.5px;
    }

    .bubble-text {
      font-size: 11.5px;
      color: #cccccc;
      line-height: 1.45;
      white-space: pre-wrap;
      word-break: break-word;
      margin-bottom: 10px;
    }

    .bubble-actions {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    /* Monochromatic Terminal Action Buttons */
    .btn-term {
      background: #141414;
      color: #ffffff;
      border: 1px solid #333333;
      border-radius: 4px;
      padding: 5px 12px;
      font-family: inherit;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s ease;
    }

    .btn-term:hover {
      background: #242424;
      border-color: #666666;
    }

    .btn-fix {
      background: #ffffff;
      color: #000000;
      border-color: #ffffff;
      font-weight: 800;
    }

    .btn-fix:hover {
      background: #d4d4d4;
      border-color: #d4d4d4;
    }

    /* Terminal Chat Box (Write Code Directly to Editor) */
    .terminal-chat-row {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #080808;
      border: 1px solid var(--border-highlight);
      border-radius: 6px;
      padding: 6px 10px;
      margin-top: 10px;
    }

    .chat-symbol {
      color: #888888;
      font-weight: 700;
      font-size: 12px;
    }

    .terminal-chat-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #ffffff;
      font-family: inherit;
      font-size: 11px;
    }

    .terminal-chat-input::placeholder {
      color: #555555;
    }

    .btn-send {
      background: #ffffff;
      color: #000000;
      border: none;
      border-radius: 4px;
      padding: 5px 12px;
      font-family: inherit;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
    }
    .btn-send:hover { background: #dcdcdc; }

    /* Generated Code Card Inside Extension */
    .code-result-card {
      margin-top: 12px;
      background: #0d0d0d;
      border: 1px solid #2e2e2e;
      border-radius: 6px;
      overflow: hidden;
      animation: popIn 0.2s ease-out;
    }
    .code-result-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      background: #141414;
      border-bottom: 1px solid #222222;
    }
    .code-result-tags {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .code-tag-lang {
      font-size: 9.5px;
      font-weight: 700;
      color: #38bdf8;
      background: #082f49;
      border: 1px solid #0284c7;
      padding: 1px 6px;
      border-radius: 3px;
      letter-spacing: 0.5px;
    }
    .code-tag-provider {
      font-size: 9.5px;
      color: #888888;
    }
    .code-result-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn-copy-code {
      background: #ffffff;
      color: #000000;
      border: none;
      border-radius: 4px;
      padding: 3px 10px;
      font-family: inherit;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-copy-code:hover {
      background: #e2e8f0;
    }
    .btn-copy-code.copied {
      background: #22c55e !important;
      color: #ffffff !important;
    }
    .btn-close-code {
      background: transparent;
      border: none;
      color: #888888;
      cursor: pointer;
      font-size: 12px;
      padding: 2px 4px;
    }
    .btn-close-code:hover {
      color: #ffffff;
    }
    .code-result-prompt {
      padding: 6px 12px;
      font-size: 10.5px;
      color: #94a3b8;
      background: #101010;
      border-bottom: 1px solid #1c1c1c;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .code-result-body {
      padding: 12px;
      max-height: 320px;
      overflow-y: auto;
      overflow-x: auto;
      background: #080808;
    }
    .code-result-body pre {
      margin: 0;
    }
    .code-result-body code {
      font-family: var(--font-mono);
      font-size: 12px;
      line-height: 1.5;
      color: #e2e8f0;
      white-space: pre;
      user-select: text;
    }

    /* Collapsible Configuration Section (Hidden after save / by default) */
    .settings-container {
      display: none;
      margin-top: 14px;
      animation: popIn 0.2s ease-out;
    }

    .settings-container.open {
      display: block;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 6px;
      padding: 14px;
      margin-bottom: 14px;
    }

    .card-title {
      font-size: 11px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-group {
      margin-bottom: 10px;
    }

    .form-group label {
      display: block;
      font-size: 11px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .form-control {
      width: 100%;
      background: #000000;
      border: 1px solid #2a2a2a;
      border-radius: 4px;
      color: #f0f0f0;
      padding: 6px 8px;
      font-size: 11px;
      font-family: inherit;
      transition: border-color 0.15s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #666666;
    }

    .portal-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #ffffff;
      text-decoration: underline;
      font-size: 11px;
      margin: 4px 0 8px 0;
      cursor: pointer;
    }

    .guide-box {
      background: #040404;
      border: 1px solid #1e1e1e;
      border-radius: 4px;
      padding: 10px;
      margin: 10px 0;
      font-size: 11px;
    }

    .guide-step {
      display: flex;
      gap: 6px;
      margin-bottom: 4px;
      color: #bbbbbb;
    }

    .test-result-banner {
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 11px;
      margin-top: 8px;
      display: none;
    }
    .test-result-banner.success {
      display: block;
      background: #141414;
      border: 1px solid #ffffff;
      color: #ffffff;
      font-weight: 700;
    }
    .test-result-banner.error {
      display: block;
      background: #141414;
      border: 1px solid #666666;
      color: #ff6b6b;
    }

    .save-toast {
      position: fixed;
      top: 10px;
      right: 10px;
      background: #ffffff;
      color: #000000;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      opacity: 0;
      pointer-events: none;
      transform: translateY(-6px);
      transition: all 0.2s ease;
      z-index: 10000;
    }
    .save-toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    @keyframes popIn {
      from { opacity: 0; transform: translateY(3px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>

  <div id="saveToast" class="save-toast">✓ Saved</div>

  <!-- Terminal Top Navigation -->
  <div class="terminal-header">
    <div class="terminal-dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
    <span>>_ CODEPET STUDIO</span>
    <button class="btn-header-gear" id="btnToggleSettings" title="Toggle Settings">⚙️</button>
  </div>

  <!-- ONLY THIS COMPANION SECTION SHOWN BY DEFAULT -->
  <div class="terminal-hero">
    <div class="companion-layout">
      <!-- Left Column: Circular Robot Avatar -->
      <div class="avatar-col">
        <div class="avatar-badge" id="petAvatarWrapper" title="Click to toggle Settings">
          ${initialSvg}
        </div>
        <div class="avatar-name" id="petTitle">${name}</div>
        <div class="avatar-status" id="petBadge">● ${permission === 'granted' ? 'WATCHING' : 'STANDBY'}</div>
      </div>

      <!-- Right Column: Speech bubble pointing to avatar -->
      <div class="speech-bubble" id="bubblePopup">
        <div class="bubble-header">
          <span id="bubbleTitle">🐾 ${name}</span>
          <span class="bubble-badge" id="bubbleBadgeTag">[IDLE]</span>
        </div>
        <div class="bubble-text" id="bubbleText">
          ${permission === 'granted'
            ? "Hello! How can I help you today?\\nWatching your code across all windows. Everything clean."
            : "Can I scan your code for errors across all languages and help correct them?"}
        </div>
        <div class="bubble-actions" id="bubbleActions">
          ${permission === 'granted'
            ? ''
            : '<button class="btn-term btn-fix" id="btnAllow">✅ Allow</button><button class="btn-term" id="btnDeny">❌ Deny</button>'}
        </div>
      </div>
    </div>

    <!-- Terminal Chat Box (Prompt AI to generate code) -->
    <div class="terminal-chat-row">
      <span class="chat-symbol">></span>
      <input type="text" id="chatInput" class="terminal-chat-input" placeholder="Type prompt to generate code (e.g. create a debounce function)..." />
      <button id="btnSendPrompt" class="btn-send">✨ Generate Code</button>
    </div>

    <!-- Generated Code Card (Displays code inside extension for user to copy & paste) -->
    <div class="code-result-card" id="codeResultCard" style="display: none;">
      <div class="code-result-top">
        <div class="code-result-tags">
          <span class="code-tag-lang" id="codeResultLang">TYPESCRIPT</span>
          <span class="code-tag-provider" id="codeResultProvider">AI Generated</span>
        </div>
        <div class="code-result-actions">
          <button class="btn-copy-code" id="btnCopyCode" title="Copy code to clipboard">📋 Copy Code</button>
          <button class="btn-close-code" id="btnCloseCode" title="Close code preview">✕</button>
        </div>
      </div>
      <div class="code-result-prompt" id="codeResultPrompt"></div>
      <div class="code-result-body">
        <pre><code id="codeResultCode"></code></pre>
      </div>
    </div>
  </div>

  <!-- COLLAPSIBLE SETTINGS: Hidden once configured / after save -->
  <div class="settings-container" id="settingsContainer">
    <!-- Profile & Species -->
    <div class="card">
      <h2 class="card-title">>_ Pet Profile</h2>
      
      <div class="form-group">
        <label for="speciesSelect">Species Avatar</label>
        <select id="speciesSelect" class="form-control">
          <option value="bot" ${species === "bot" ? "selected" : ""}>🤖 Luffy Robot (Cute Robot Companion)</option>
          <option value="cat" ${species === "cat" ? "selected" : ""}>🐱 Pixel Neko (Claude Code Dotted Cat)</option>
          <option value="dog" ${species === "dog" ? "selected" : ""}>🐶 Cyber Pup (Dotted Dog)</option>
          <option value="dino" ${species === "dino" ? "selected" : ""}>🦖 Dev Dino (Dotted Dinosaur)</option>
          <option value="fox" ${species === "fox" ? "selected" : ""}>🦊 Glitch Fox (Dotted Fox)</option>
        </select>
      </div>

      <div class="form-group">
        <label for="petNameInput">Pet Name</label>
        <input id="petNameInput" class="form-control" maxlength="24" value="${name}" placeholder="Pet name (e.g. luffy)...">
      </div>

      <button id="btnSaveProfile" class="btn-term btn-fix">Save Profile</button>
    </div>

    <!-- AI Brain Setup -->
    <div class="card">
      <h2 class="card-title">>_ AI Brain & Free API Models</h2>

      <div class="form-group">
        <label for="providerSelect">Provider</label>
        <select id="providerSelect" class="form-control">
          <option value="groq" ${provider === "groq" ? "selected" : ""}>Groq Cloud (100% Free · Llama 3.1 8B)</option>
          <option value="gemini" ${provider === "gemini" ? "selected" : ""}>Google Gemini (15 RPM Free Tier)</option>
          <option value="siliconflow" ${provider === "siliconflow" ? "selected" : ""}>SiliconFlow (Free DeepSeek & Qwen)</option>
          <option value="deepseek" ${provider === "deepseek" ? "selected" : ""}>DeepSeek Official (Free Credits)</option>
          <option value="qwen" ${provider === "qwen" ? "selected" : ""}>Alibaba Qwen (1M Free Tokens)</option>
          <option value="zhipu" ${provider === "zhipu" ? "selected" : ""}>Zhipu AI (GLM-4-Flash 100% Free)</option>
          <option value="moonshot" ${provider === "moonshot" ? "selected" : ""}>Moonshot AI (Kimi Free Credits)</option>
          <option value="ollama" ${provider === "ollama" ? "selected" : ""}>Ollama (Local · 100% Free Offline & Private)</option>
          <option value="openai" ${provider === "openai" ? "selected" : ""}>OpenAI / ChatGPT</option>
          <option value="backend" ${provider === "backend" ? "selected" : ""}>CodePet Local Backend</option>
        </select>
      </div>

      <div id="guideBox" class="guide-box">
        <div id="guideBadge" style="font-weight: 700; color: #ffffff; margin-bottom: 4px;">Free Tier Available</div>
        <div id="guideNote" style="color: #888888; margin-bottom: 6px;"></div>
        <a id="guidePortalLink" class="portal-link" href="#">Get Free API Key ↗</a>
        <div id="guideStepsList"></div>
      </div>

      <div class="form-group" id="modelGroup">
        <label for="modelSelect">Model</label>
        <select id="modelSelect" class="form-control"></select>
      </div>

      <div class="form-group" id="apiKeyGroup">
        <label for="apiKeyInput">API Key</label>
        <input id="apiKeyInput" type="password" class="form-control" value="${apiKey}" placeholder="Paste API key...">
      </div>

      <div class="form-group" id="ollamaGroup" style="display: none;">
        <label for="ollamaUrlInput">Ollama URL</label>
        <input id="ollamaUrlInput" class="form-control" value="${ollamaUrl}" placeholder="http://localhost:11434">
      </div>

      <div style="display: flex; gap: 8px; margin-top: 10px;">
        <button id="btnSaveAiConfig" class="btn-term btn-fix">Save AI Settings</button>
        <button id="btnTestAiConnection" class="btn-term">Test Connection</button>
      </div>

      <div id="testResultBanner" class="test-result-banner"></div>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    const PROVIDER_GUIDES = ${guidesJson};

    let currentPermission = '${permission}';
    let currentModel = '${model}';
    let currentSnapshot = null;
    let isFixing = false;
    let fixCooldownUntil = 0;
    let fixingTimer = null;

    function setFixing(val) {
      isFixing = val;
      if (fixingTimer) clearTimeout(fixingTimer);
      if (val) {
        fixingTimer = setTimeout(() => { isFixing = false; }, 8000);
      }
    }

    const petTitle = document.getElementById('petTitle');
    const petBadge = document.getElementById('petBadge');
    const petNameInput = document.getElementById('petNameInput');
    const speciesSelect = document.getElementById('speciesSelect');
    const btnSaveProfile = document.getElementById('btnSaveProfile');
    const petAvatarWrapper = document.getElementById('petAvatarWrapper');
    const bubblePopup = document.getElementById('bubblePopup');
    const bubbleTitle = document.getElementById('bubbleTitle');
    const bubbleText = document.getElementById('bubbleText');
    const bubbleActions = document.getElementById('bubbleActions');
    const saveToast = document.getElementById('saveToast');

    const chatInput = document.getElementById('chatInput');
    const btnSendPrompt = document.getElementById('btnSendPrompt');

    let latestGeneratedCode = '';
    const codeResultCard = document.getElementById('codeResultCard');
    const codeResultLang = document.getElementById('codeResultLang');
    const codeResultProvider = document.getElementById('codeResultProvider');
    const codeResultPrompt = document.getElementById('codeResultPrompt');
    const codeResultCode = document.getElementById('codeResultCode');

    function copyToClipboard(textToCopy, btnElem) {
      if (!textToCopy) return;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy);
        }
      } catch (err) {}
      vscode.postMessage({ type: 'copyToClipboard', text: textToCopy });

      if (btnElem) {
        const oldHtml = btnElem.innerHTML;
        btnElem.innerHTML = '✓ Copied!';
        btnElem.classList.add('copied');
        setTimeout(() => {
          btnElem.innerHTML = oldHtml;
          btnElem.classList.remove('copied');
        }, 2500);
      }
    }

    const settingsContainer = document.getElementById('settingsContainer');
    const btnToggleSettings = document.getElementById('btnToggleSettings');

    const providerSelect = document.getElementById('providerSelect');
    const modelSelect = document.getElementById('modelSelect');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKeyGroup = document.getElementById('apiKeyGroup');
    const ollamaGroup = document.getElementById('ollamaGroup');
    const ollamaUrlInput = document.getElementById('ollamaUrlInput');
    const btnSaveAiConfig = document.getElementById('btnSaveAiConfig');
    const btnTestAiConnection = document.getElementById('btnTestAiConnection');
    const testResultBanner = document.getElementById('testResultBanner');

    const guideBadge = document.getElementById('guideBadge');
    const guideNote = document.getElementById('guideNote');
    const guidePortalLink = document.getElementById('guidePortalLink');
    const guideStepsList = document.getElementById('guideStepsList');

    function showToast(msg) {
      saveToast.textContent = msg;
      saveToast.classList.add('show');
      setTimeout(() => saveToast.classList.remove('show'), 2000);
    }

    function toggleSettings(forceOpen) {
      if (forceOpen === true) {
        settingsContainer.classList.add('open');
      } else if (forceOpen === false) {
        settingsContainer.classList.remove('open');
      } else {
        settingsContainer.classList.toggle('open');
      }
    }
    btnToggleSettings.onclick = () => toggleSettings();
    petAvatarWrapper.onclick = () => toggleSettings();

    // Send Chat Prompt to generate code in extension
    function sendChat() {
      const text = chatInput.value.trim();
      if (!text) return;
      chatInput.value = '';
      btnSendPrompt.textContent = '⏳ Thinking...';
      btnSendPrompt.disabled = true;
      bubbleBadge.textContent = '[GENERATING]';
      bubbleText.textContent = 'Generating code with AI for: \"' + text + '\"...';
      bubbleActions.innerHTML = '';
      if (codeResultCard) codeResultCard.style.display = 'none';
      vscode.postMessage({ type: 'chatPrompt', prompt: text });
    }
    btnSendPrompt.onclick = sendChat;
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChat();
      }
    });

    // Inform VS Code that studio webview is mounted & ready
    vscode.postMessage({ type: 'webviewReady' });

    // Global Event Delegation for ALL buttons in Studio
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      if (btn.id === 'btnCopyCode' || btn.id === 'btnCopyFromBubble' || btn.classList.contains('btn-copy-code')) {
        e.preventDefault();
        copyToClipboard(latestGeneratedCode, btn);
      } else if (btn.id === 'btnCloseCode') {
        e.preventDefault();
        if (codeResultCard) codeResultCard.style.display = 'none';
      } else if (btn.id === 'btnFix' || btn.classList.contains('btn-fix-action')) {
        e.preventDefault();
        e.stopPropagation();
        if (isFixing) return;
        setFixing(true);
        const targetLine = currentSnapshot ? (currentSnapshot.line || 1) : 1;
        bubbleBadge.textContent = '[FIXING...]';
        bubbleText.textContent = '🧠 Fixing line ' + targetLine + ' using AI...';
        bubbleActions.innerHTML = '<span style="color:#888;font-size:10px;">🤖 Applying AI code correction...</span>';
        vscode.postMessage({
          type: 'fixError',
          uri: currentSnapshot ? currentSnapshot.uri : undefined,
          line: currentSnapshot ? currentSnapshot.line : undefined,
          suggestion: currentSnapshot ? currentSnapshot.suggestion : undefined,
          message: currentSnapshot ? currentSnapshot.message : undefined
        });
      } else if (btn.id === 'btnExplain' || btn.classList.contains('btn-explain-action')) {
        e.preventDefault();
        e.stopPropagation();
        setFixing(false);
        bubbleBadge.textContent = '[ANALYZING...]';
        vscode.postMessage({
          type: 'explainError',
          uri: currentSnapshot ? currentSnapshot.uri : undefined,
          line: currentSnapshot ? currentSnapshot.line : undefined
        });
      } else if (btn.id === 'btnEnterApiKey' || btn.classList.contains('btn-enter-key')) {
        e.preventDefault();
        setFixing(false);
        vscode.postMessage({ type: 'enterApiKey' });
      } else if (btn.id === 'btnReconfig' || btn.classList.contains('btn-reconfig-action')) {
        e.preventDefault();
        setFixing(false);
        toggleSettings(true);
      } else if (btn.id === 'btnAllow') {
        e.preventDefault();
        currentPermission = 'granted';
        vscode.postMessage({ type: 'setPermission', permission: 'granted' });
        bubbleText.textContent = 'Watching your code across all windows. Everything clean.';
        bubbleActions.innerHTML = '';
      } else if (btn.id === 'btnDeny') {
        e.preventDefault();
        currentPermission = 'denied';
        vscode.postMessage({ type: 'setPermission', permission: 'denied' });
        bubbleText.textContent = 'Scanning paused.';
        bubbleActions.innerHTML = '';
      }
    });

    function updateProviderGuide() {
      const p = providerSelect.value;
      const guide = PROVIDER_GUIDES[p];
      if (!guide) return;

      guideBadge.textContent = guide.badge;
      guideNote.textContent = guide.freeTierNote;
      guidePortalLink.textContent = 'Get ' + guide.name + ' API Key ↗';
      guidePortalLink.onclick = (e) => {
        e.preventDefault();
        vscode.postMessage({ type: 'openExternal', url: guide.portalUrl });
      };

      guideStepsList.innerHTML = '';
      guide.steps.forEach((step, idx) => {
        const div = document.createElement('div');
        div.className = 'guide-step';
        div.innerHTML = '<span style="color:#666;">[' + (idx + 1) + ']</span><span>' + step + '</span>';
        guideStepsList.appendChild(div);
      });

      modelSelect.innerHTML = '';
      guide.suggestedModels.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        if (m === currentModel || (!currentModel && m === guide.defaultModel)) {
          opt.selected = true;
        }
        modelSelect.appendChild(opt);
      });

      if (p === 'ollama') {
        apiKeyGroup.style.display = 'none';
        ollamaGroup.style.display = 'block';
      } else if (p === 'backend') {
        apiKeyGroup.style.display = 'none';
        ollamaGroup.style.display = 'none';
      } else {
        apiKeyGroup.style.display = 'block';
        ollamaGroup.style.display = 'none';
      }
    }

    providerSelect.addEventListener('change', () => {
      currentModel = '';
      updateProviderGuide();
    });
    updateProviderGuide();

    petNameInput.addEventListener('input', (e) => {
      const val = e.target.value.trim() || 'luffy';
      petTitle.textContent = val;
      bubbleTitle.textContent = '🐾 ' + val;
    });

    btnSaveProfile.addEventListener('click', () => {
      const name = petNameInput.value.trim() || 'luffy';
      const species = speciesSelect.value;
      petTitle.textContent = name;
      bubbleTitle.textContent = '🐾 ' + name;

      vscode.postMessage({
        type: 'savePet',
        name: name,
        species: species
      });

      showToast('✓ Profile saved');
      // Collapse settings after saving to keep UI clean
      toggleSettings(false);
    });

    btnSaveAiConfig.addEventListener('click', () => {
      const provider = providerSelect.value;
      const apiKey = apiKeyInput.value.trim();
      const model = modelSelect.value.trim();
      const ollamaUrl = ollamaUrlInput.value.trim();

      vscode.postMessage({
        type: 'saveAiConfig',
        provider,
        apiKey,
        model,
        ollamaUrl
      });

      showToast('✓ AI Settings saved');
      // Collapse settings after saving to keep UI clean
      toggleSettings(false);
    });

    btnTestAiConnection.addEventListener('click', () => {
      testResultBanner.className = 'test-result-banner';
      testResultBanner.textContent = 'Testing connection...';
      testResultBanner.style.display = 'block';

      vscode.postMessage({
        type: 'testAiConnection',
        provider: providerSelect.value,
        apiKey: apiKeyInput.value.trim(),
        model: modelSelect.value.trim(),
        ollamaUrl: ollamaUrlInput.value.trim()
      });
    });

    window.addEventListener('message', (event) => {
      const data = event.data;

      if (data.type === 'petUpdated') {
        petTitle.textContent = data.name;
        bubbleTitle.textContent = '🐾 ' + data.name;
        petNameInput.value = data.name;
        speciesSelect.value = data.species;
        if (data.svg) {
          petAvatarWrapper.innerHTML = data.svg;
        }
        showToast('✓ ' + data.name);
      }

      if (data.type === 'fixing') {
        setFixing(true);
        bubbleTitle.textContent = '🧠 ' + petTitle.textContent;
        bubbleBadge.textContent = '[FIXING...]';
        bubbleText.textContent = 'Analyzing and fixing line ' + (data.line || '') + ' using AI...';
        bubbleActions.innerHTML = '<span style="color:#888;font-size:10px;">🤖 Applying AI code correction...</span>';
        if (data.svg) {
          petAvatarWrapper.innerHTML = data.svg;
        }
      }

      if (data.type === 'showExplanation') {
        setFixing(false);
        bubbleTitle.textContent = '💡 ' + petTitle.textContent + ' [Explanation]';
        bubbleText.textContent = data.explanation;
        bubbleActions.innerHTML = '<button class="btn-term btn-fix btn-fix-action" id="btnFix">🔧 Fix with AI</button>';
      }

      if (data.type === 'fixSuccess') {
        setFixing(false);
        fixCooldownUntil = Date.now() + 3500;
        bubbleTitle.textContent = '✓ ' + petTitle.textContent;
        bubbleText.textContent = data.message;
        bubbleActions.innerHTML = '';
        if (data.svg) {
          petAvatarWrapper.innerHTML = data.svg;
        }
        showToast('✓ Fixed!');
      }

      if (data.type === 'chatGenerating') {
        btnSendPrompt.textContent = '⏳ Thinking...';
        btnSendPrompt.disabled = true;
        bubbleBadge.textContent = '[GENERATING]';
        bubbleText.textContent = 'Thinking & generating code with AI for: \"' + data.prompt + '\"...';
        bubbleActions.innerHTML = '';
        if (codeResultCard) codeResultCard.style.display = 'none';
      }

      if (data.type === 'chatResult') {
        btnSendPrompt.textContent = '✨ Generate Code';
        btnSendPrompt.disabled = false;
        latestGeneratedCode = data.code || '';
        fixCooldownUntil = Date.now() + 6000;
        bubbleTitle.textContent = '✨ ' + petTitle.textContent;
        bubbleBadge.textContent = '[CODE READY]';
        bubbleText.textContent = 'Here is your generated code for: \"' + data.prompt + '\". Click "Copy Code" to copy & paste anywhere!';
        bubbleActions.innerHTML = '<button class="btn-term btn-fix" id="btnCopyFromBubble">📋 Copy Code</button>';
        if (data.svg) {
          petAvatarWrapper.innerHTML = data.svg;
        }

        if (codeResultCard) {
          codeResultLang.textContent = (data.language || 'code').toUpperCase();
          codeResultProvider.textContent = data.provider || 'AI Generated';
          codeResultPrompt.textContent = '> ' + data.prompt;
          codeResultCode.textContent = data.code || '';
          codeResultCard.style.display = 'block';
          codeResultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        showToast('✨ Code generated!');
      }

      if (data.type === 'chatSuccess') {
        btnSendPrompt.textContent = '✨ Generate Code';
        btnSendPrompt.disabled = false;
        bubbleTitle.textContent = '✓ ' + petTitle.textContent;
        bubbleBadge.textContent = '[DONE]';
        bubbleText.textContent = data.message;
        bubbleActions.innerHTML = '';
        if (data.svg) {
          petAvatarWrapper.innerHTML = data.svg;
        }
        showToast('✓ Code ready!');
      }

      if (data.type === 'chatError') {
        btnSendPrompt.textContent = '✨ Generate Code';
        btnSendPrompt.disabled = false;
        setFixing(false);
        bubbleTitle.textContent = '⚠️ ' + petTitle.textContent;
        bubbleBadge.textContent = '[AI NOTICE]';
        bubbleText.textContent = data.error;
        bubbleActions.innerHTML = '<button class="btn-term btn-fix btn-enter-key" id="btnEnterApiKey">🔑 Enter API Key</button><button class="btn-term btn-reconfig-action" id="btnReconfig">⚙️ Settings</button>';
        if (data.svg) {
          petAvatarWrapper.innerHTML = data.svg;
        }
      }

      if (data.type === 'testAiResult') {
        const r = data.result;
        testResultBanner.style.display = 'block';
        if (r.ok) {
          testResultBanner.className = 'test-result-banner success';
          testResultBanner.textContent = '✓ ' + r.message + (r.latencyMs ? ' (' + r.latencyMs + 'ms)' : '');
          if (r.activeModel) {
            modelSelect.value = r.activeModel;
            currentModel = r.activeModel;
          }
        } else {
          testResultBanner.className = 'test-result-banner error';
          testResultBanner.textContent = '✗ ' + r.message;
        }
      }

      if (data.type === 'diagnostics') {
        const s = data.snapshot;
        currentSnapshot = s;

        // If currently fixing or celebrating recent fix, do not interrupt speech bubble
        if (isFixing || Date.now() < fixCooldownUntil) {
          return;
        }

        if (data.svg) {
          petAvatarWrapper.innerHTML = data.svg;
        }

        if (currentPermission !== 'granted') return;

        if (s.errors > 0) {
          bubbleTitle.textContent = '🚨 ' + petTitle.textContent + ' [Line ' + (s.line || 1) + ']';
          bubbleText.textContent = s.suggestion || s.message || ('Error on line ' + (s.line || 1));
          bubbleActions.innerHTML = '<button class="btn-term btn-explain-action" id="btnExplain">💡 Explain</button><button class="btn-term btn-fix btn-fix-action" id="btnFix">🔧 Fix</button>';
        } else {
          bubbleTitle.textContent = '🐾 ' + petTitle.textContent;
          bubbleBadge.textContent = '[IDLE]';
          bubbleText.textContent = 'Watching ' + s.fileName + '. Everything clean.';
          bubbleActions.innerHTML = '';
        }
      }

      if (data.type === 'configSync') {
        const c = data.config;
        if (c.name) {
          petTitle.textContent = c.name;
          bubbleTitle.textContent = '🐾 ' + c.name;
          petNameInput.value = c.name;
        }
        if (c.species) {
          speciesSelect.value = c.species;
        }
        if (c.provider) {
          providerSelect.value = c.provider;
          currentModel = c.model || '';
          updateProviderGuide();
        }
        if (c.apiKey !== undefined) apiKeyInput.value = c.apiKey;
        if (c.ollamaUrl !== undefined) ollamaUrlInput.value = c.ollamaUrl;
      }
    });
  </script>
</body>
</html>`;
  }

  public dispose() {
    PetPanel.current = undefined;
    this.panel.dispose();
    while (this.disposables.length) {
      const d = this.disposables.pop();
      if (d) d.dispose();
    }
  }
}

function escapeHtml(val: string): string {
  return val.replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
