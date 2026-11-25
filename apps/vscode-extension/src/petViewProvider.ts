import * as vscode from "vscode";
import { renderPetAvatarSvg, renderRobotAvatarSvg, renderDottedPetSvg, type PetSpecies, type PetMood } from "./dottedPet";

export class PetViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "codepet.petView";
  private _views: Set<vscode.WebviewView> = new Set();

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._views.add(webviewView);
    webviewView.onDidDispose(() => {
      this._views.delete(webviewView);
    });

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      if (data.type === "setPermission") {
        await vscode.workspace.getConfiguration("codepet").update("scanningPermission", data.permission, vscode.ConfigurationTarget.Global);
        this.updatePermission(data.permission);
        if (data.permission === "granted") {
          vscode.commands.executeCommand("codepet.analyzeCurrentFile");
        }
      }
      if (data.type === "explainError") {
        vscode.commands.executeCommand("codepet.explainCurrentError", data);
      }
      if (data.type === "fixError" || data.type === "triggerFix") {
        vscode.commands.executeCommand("codepet.autoFixCurrentError", data);
      }
      if (data.type === "enterApiKey") {
        vscode.commands.executeCommand("codepet.enterApiKey");
      }
      if (data.type === "webviewReady") {
        vscode.commands.executeCommand("codepet.analyzeCurrentFile");
      }
      if (data.type === "chatPrompt") {
        vscode.commands.executeCommand("codepet.handleChatPrompt", data.prompt);
      }
      if (data.type === "copyToClipboard") {
        await vscode.env.clipboard.writeText(String(data.text || ""));
        vscode.window.showInformationMessage("🐾 Code copied to clipboard!");
      }
      if (data.type === "savePet") {
        const newName = String(data.name || "luffy").trim().slice(0, 24) || "luffy";
        const newSpecies = (data.species as PetSpecies) || "bot";
        await Promise.all([
          vscode.workspace.getConfiguration("codepet").update("petName", newName, vscode.ConfigurationTarget.Global),
          vscode.workspace.getConfiguration("codepet").update("petSpecies", newSpecies, vscode.ConfigurationTarget.Global)
        ]);
        this.updatePet(newName, newSpecies);
        vscode.window.showInformationMessage(`🐾 ${newName} (${newSpecies}) updated.`);
      }
      if (data.type === "saveAiConfig") {
        const config = vscode.workspace.getConfiguration("codepet");
        await Promise.all([
          config.update("aiProvider", data.provider, vscode.ConfigurationTarget.Global),
          config.update("apiKey", String(data.apiKey || "").trim(), vscode.ConfigurationTarget.Global),
          config.update("aiModel", String(data.model || "").trim(), vscode.ConfigurationTarget.Global),
          config.update("ollamaBaseUrl", String(data.ollamaUrl || "").trim(), vscode.ConfigurationTarget.Global)
        ]);
        vscode.window.showInformationMessage(`AI configured: ${data.provider}`);
      }
      if (data.type === "testAiConnection") {
        const provider = (data.provider || "gemini") as any;
        const apiKey = String(data.apiKey || "").trim();
        const model = String(data.model || "").trim();
        const config = vscode.workspace.getConfiguration("codepet");
        const ollamaUrl = config.get<string>("ollamaBaseUrl", "http://localhost:11434");
        try {
          const { AiClient } = await import("./aiClient");
          const result = await AiClient.testConnection({ provider, apiKey, model, ollamaUrl });
          this.postToAll({ type: "testAiResult", result });
        } catch (err: any) {
          this.postToAll({
            type: "testAiResult",
            result: { ok: false, message: err?.message || String(err) }
          });
        }
      }
      if (data.type === "openStudio") {
        vscode.commands.executeCommand("codepet.openAssistant");
      }
    });
  }

  private postToAll(message: any) {
    for (const v of this._views) {
      try {
        v.webview.postMessage(message);
      } catch (err) {
        console.warn("[CodePet] postToAll error:", err);
      }
    }
  }

  public updateDiagnostics(snapshot: { fileName: string; uri?: string; errors: number; warnings: number; message?: string; line?: number; suggestion?: string }) {
    const config = vscode.workspace.getConfiguration("codepet");
    const name = config.get<string>("petName", "luffy");
    const species = config.get<PetSpecies>("petSpecies", "bot");
    const mood: PetMood = snapshot.errors > 0 ? "error" : snapshot.warnings > 0 ? "warning" : "watching";
    const svg = renderPetAvatarSvg({ species, mood, name, size: 96 });

    this.postToAll({
      type: "diagnostics",
      snapshot,
      mood,
      svg
    });
  }

  public showExplanation(explanation: string) {
    this.postToAll({
      type: "showExplanation",
      explanation
    });
  }

  public showFixing(line: number) {
    const config = vscode.workspace.getConfiguration("codepet");
    const name = config.get<string>("petName", "luffy");
    const species = config.get<PetSpecies>("petSpecies", "bot");
    const svg = renderPetAvatarSvg({ species, mood: "watching", name, size: 96 });

    this.postToAll({
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

    this.postToAll({
      type: "fixSuccess",
      message: msg,
      svg
    });
  }

  public showChatGenerating(prompt: string) {
    this.postToAll({
      type: "chatGenerating",
      prompt
    });
  }

  public showChatResult(data: { prompt: string; code: string; language?: string; provider?: string; explanation?: string }) {
    const config = vscode.workspace.getConfiguration("codepet");
    const name = config.get<string>("petName", "luffy");
    const species = config.get<PetSpecies>("petSpecies", "bot");
    const svg = renderPetAvatarSvg({ species, mood: "celebrating", name, size: 96 });

    this.postToAll({
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

    this.postToAll({
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

    this.postToAll({
      type: "chatError",
      error,
      svg
    });
  }

  public updatePermission(permission: "granted" | "denied" | "not_asked") {
    this.postToAll({
      type: "permissionUpdated",
      permission
    });
  }

  public updatePet(name: string, species: PetSpecies) {
    const mood: PetMood = "watching";
    this.postToAll({
      type: "petUpdated",
      name,
      species,
      svg: renderPetAvatarSvg({ species, mood: "watching", name, size: 96 })
    });
  }

  private _getHtmlForWebview(_webview: vscode.Webview): string {
    const config = vscode.workspace.getConfiguration("codepet");
    const name = escapeHtml(config.get<string>("petName", "luffy"));
    const species = config.get<PetSpecies>("petSpecies", "bot");
    const permission = config.get<string>("scanningPermission", "granted");
    const provider = config.get<string>("aiProvider", "groq");
    const apiKey = escapeHtml(config.get<string>("apiKey", ""));
    const model = escapeHtml(config.get<string>("aiModel", ""));
    const ollamaUrl = escapeHtml(config.get<string>("ollamaBaseUrl", "http://localhost:11434"));

    const svg = renderPetAvatarSvg({ species, mood: "watching", name, size: 96 });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodePet Terminal</title>
  <style>
    :root {
      --bg: #000000;
      --bubble-bg: #0a0a0a;
      --card-bg: #0c0c0c;
      --border: #222222;
      --border-focus: #444444;
      --text: #f0f0f0;
      --text-muted: #888888;
      --font-mono: ui-monospace, "SF Mono", "Cascadia Code", Menlo, Monaco, Consolas, monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-mono);
      font-size: 12px;
      line-height: 1.45;
      padding: 10px;
      user-select: none;
      overflow-x: hidden;
    }

    /* Terminal Window Header */
    .terminal-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: 6px;
      margin-bottom: 10px;
      font-size: 10px;
      color: var(--text-muted);
      letter-spacing: 0.5px;
    }

    .terminal-dots {
      display: flex;
      gap: 4px;
    }

    .terminal-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #333333;
    }

    .btn-header-icon {
      background: transparent;
      border: none;
      color: #888888;
      cursor: pointer;
      font-size: 11px;
      padding: 0 4px;
    }
    .btn-header-icon:hover { color: #ffffff; }

    /* Companion Layout: Avatar on Left, Speech Bubble on Right */
    .companion-layout {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 12px;
      width: 100%;
      margin-bottom: 10px;
    }

    /* Left Column: Avatar */
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
      font-size: 11px;
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

    /* Right Column: Speech Bubble */
    .speech-bubble {
      flex: 1;
      position: relative;
      background: var(--bubble-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 14px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.9);
      animation: popIn 0.2s ease-out;
      min-width: 0;
    }

    /* Pointer arrow pointing LEFT towards the avatar */
    .speech-bubble::before {
      content: "";
      position: absolute;
      top: 24px;
      left: -8px;
      border-width: 8px 8px 8px 0;
      border-style: solid;
      border-color: transparent var(--border) transparent transparent;
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

    /* Stack on very narrow panels (<250px) */
    @media (max-width: 250px) {
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
        border-color: transparent transparent var(--border) transparent;
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
      border: 1px solid #2a2a2a;
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

    /* Pure Monochromatic Terminal Buttons */
    .btn-term {
      background: #121212;
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
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }

    .btn-term:hover {
      background: #222222;
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

    .btn-fix:active {
      transform: translateY(1px);
    }

    /* Terminal Chat Box Underneath */
    .terminal-chat-row {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #0a0a0a;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 4px 8px;
      margin-top: 8px;
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
      padding: 4px 10px;
      font-family: inherit;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
    }
    .btn-send:hover { background: #dcdcdc; }

    /* Generated Code Card Inside Extension */
    .code-result-card {
      margin-top: 10px;
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
      padding: 6px 10px;
      background: #141414;
      border-bottom: 1px solid #222222;
    }
    .code-result-tags {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .code-tag-lang {
      font-size: 9px;
      font-weight: 700;
      color: #38bdf8;
      background: #082f49;
      border: 1px solid #0284c7;
      padding: 1px 5px;
      border-radius: 3px;
      letter-spacing: 0.5px;
    }
    .code-tag-provider {
      font-size: 9px;
      color: #888888;
    }
    .code-result-actions {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .btn-copy-code {
      background: #ffffff;
      color: #000000;
      border: none;
      border-radius: 4px;
      padding: 3px 8px;
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
      font-size: 11px;
      padding: 2px 4px;
    }
    .btn-close-code:hover {
      color: #ffffff;
    }
    .code-result-prompt {
      padding: 5px 10px;
      font-size: 10px;
      color: #94a3b8;
      background: #101010;
      border-bottom: 1px solid #1c1c1c;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .code-result-body {
      padding: 10px;
      max-height: 260px;
      overflow-y: auto;
      overflow-x: auto;
      background: #080808;
    }
    .code-result-body pre {
      margin: 0;
    }
    .code-result-body code {
      font-family: var(--font-mono);
      font-size: 11.5px;
      line-height: 1.5;
      color: #e2e8f0;
      white-space: pre;
      user-select: text;
    }

    /* Collapsible Settings Drawer (Hidden by default / after save) */
    .settings-drawer {
      display: none;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 12px;
      margin-top: 10px;
      animation: popIn 0.2s ease-out;
    }

    .settings-drawer.open {
      display: block;
    }

    .drawer-title {
      font-size: 11px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .form-group {
      margin-bottom: 8px;
    }

    .form-group label {
      display: block;
      font-size: 10px;
      color: var(--text-muted);
      margin-bottom: 3px;
    }

    .form-control {
      width: 100%;
      background: #000000;
      border: 1px solid #2a2a2a;
      border-radius: 4px;
      color: #f0f0f0;
      padding: 5px 7px;
      font-size: 11px;
      font-family: inherit;
    }
    .form-control:focus { outline: none; border-color: #555555; }

    .test-result-banner {
      font-size: 10.5px;
      padding: 6px 8px;
      border-radius: 4px;
      margin-top: 6px;
      line-height: 1.4;
      display: none;
      word-break: break-word;
    }
    .test-result-banner.success {
      display: block;
      background: #0a2010;
      color: #4ade80;
      border: 1px solid #166534;
    }
    .test-result-banner.error {
      display: block;
      background: #250a0a;
      color: #f87171;
      border: 1px solid #991b1b;
    }
    .test-result-banner.info {
      display: block;
      background: #111111;
      color: #94a3b8;
      border: 1px solid #334155;
    }

    @keyframes popIn {
      from { opacity: 0; transform: translateY(3px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <!-- Monochromatic Header -->
  <div class="terminal-top-bar">
    <div class="terminal-dots">
      <div class="terminal-dot"></div>
      <div class="terminal-dot"></div>
      <div class="terminal-dot"></div>
    </div>
    <span>>_ CODEPET COMPANION</span>
    <button class="btn-header-icon" id="btnToggleSettings" title="Toggle Settings">⚙️</button>
  </div>

  <!-- ONLY THIS COMPANION SECTION SHOWN BY DEFAULT -->
  <div class="companion-layout">
    <!-- Left Avatar Column -->
    <div class="avatar-col">
      <div class="avatar-badge" id="avatarBadge" title="Click to toggle Settings">
        ${svg}
      </div>
      <div class="avatar-name" id="avatarName">${name}</div>
      <div class="avatar-status" id="avatarStatus">● WATCHING</div>
    </div>

    <!-- Right Speech Bubble Attached to Avatar -->
    <div class="speech-bubble" id="speechBubble">
      <div class="bubble-header" id="bubbleHeader">
        <span class="bubble-title" id="bubbleTitle">🐾 ${name}</span>
        <span class="bubble-badge" id="bubbleBadge">[IDLE]</span>
      </div>
      <div class="bubble-text" id="bubbleText">
        ${permission === 'granted'
          ? "Hello! How can I help you today?\\nWatching your code across all windows."
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

  <!-- Collapsible Settings (Hidden by default / after save) -->
  <div class="settings-drawer" id="settingsDrawer">
    <div class="drawer-title">
      <span>⚙️ Settings & API</span>
      <button class="btn-header-icon" id="btnCloseDrawer">✕</button>
    </div>

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

    <div class="form-group">
      <label for="providerSelect">AI Provider</label>
      <select id="providerSelect" class="form-control">
        <option value="groq" ${provider === "groq" ? "selected" : ""}>Groq Cloud (100% Free · Llama 3.1 8B)</option>
        <option value="gemini" ${provider === "gemini" ? "selected" : ""}>Google Gemini (15 RPM Free Tier)</option>
        <option value="siliconflow" ${provider === "siliconflow" ? "selected" : ""}>SiliconFlow (Free DeepSeek & Qwen)</option>
        <option value="deepseek" ${provider === "deepseek" ? "selected" : ""}>DeepSeek Official (Free Credits)</option>
        <option value="qwen" ${provider === "qwen" ? "selected" : ""}>Alibaba Qwen (1M Free Tokens)</option>
        <option value="zhipu" ${provider === "zhipu" ? "selected" : ""}>Zhipu AI (GLM-4-Flash 100% Free)</option>
        <option value="moonshot" ${provider === "moonshot" ? "selected" : ""}>Moonshot AI (Kimi Free Credits)</option>
        <option value="ollama" ${provider === "ollama" ? "selected" : ""}>Ollama (100% Free Local Offline)</option>
        <option value="openai" ${provider === "openai" ? "selected" : ""}>OpenAI / ChatGPT</option>
        <option value="backend" ${provider === "backend" ? "selected" : ""}>CodePet Local Backend</option>
      </select>
    </div>

    <div class="form-group">
      <label for="apiKeyInput">API Key</label>
      <input id="apiKeyInput" type="password" class="form-control" value="${apiKey}" placeholder="Paste API Key...">
    </div>

    <div class="form-group">
      <label for="modelInput">Model Override (Optional)</label>
      <input id="modelInput" class="form-control" value="${model}" placeholder="Leave blank for recommended default">
    </div>

    <div id="testResultBanner" class="test-result-banner"></div>

    <div style="display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap;">
      <button id="btnSaveAllSettings" class="btn-term btn-fix">Save Settings</button>
      <button id="btnTestAiConnection" class="btn-term">⚡ Test API</button>
      <button id="btnOpenStudioFull" class="btn-term">Full Studio</button>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    let currentPermission = '${permission}';
    let currentSnapshot = null;
    let isFixing = false;
    let isGenerating = false;
    let fixCooldownUntil = 0;
    let fixingTimer = null;
    let generatingTimer = null;

    function setFixing(val) {
      isFixing = val;
      if (fixingTimer) clearTimeout(fixingTimer);
      if (val) {
        fixingTimer = setTimeout(() => { isFixing = false; }, 8000);
      }
    }

    function setGenerating(val) {
      isGenerating = val;
      if (generatingTimer) clearTimeout(generatingTimer);
      if (val) {
        generatingTimer = setTimeout(() => { isGenerating = false; }, 25000);
      }
    }

    const speechBubble = document.getElementById('speechBubble');
    const bubbleTitle = document.getElementById('bubbleTitle');
    const bubbleBadge = document.getElementById('bubbleBadge');
    const bubbleText = document.getElementById('bubbleText');
    const bubbleActions = document.getElementById('bubbleActions');
    const avatarBadge = document.getElementById('avatarBadge');
    const avatarName = document.getElementById('avatarName');
    const avatarStatus = document.getElementById('avatarStatus');

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

    const settingsDrawer = document.getElementById('settingsDrawer');
    const btnToggleSettings = document.getElementById('btnToggleSettings');
    const btnCloseDrawer = document.getElementById('btnCloseDrawer');
    const speciesSelect = document.getElementById('speciesSelect');
    const petNameInput = document.getElementById('petNameInput');
    const providerSelect = document.getElementById('providerSelect');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const modelInput = document.getElementById('modelInput');
    const testResultBanner = document.getElementById('testResultBanner');
    const btnTestAiConnection = document.getElementById('btnTestAiConnection');
    const btnSaveAllSettings = document.getElementById('btnSaveAllSettings');
    const btnOpenStudioFull = document.getElementById('btnOpenStudioFull');

    // Toggle Settings Drawer
    function toggleSettings(forceOpen) {
      if (forceOpen === true) {
        settingsDrawer.classList.add('open');
      } else if (forceOpen === false) {
        settingsDrawer.classList.remove('open');
      } else {
        settingsDrawer.classList.toggle('open');
      }
    }
    btnToggleSettings.onclick = () => toggleSettings();
    btnCloseDrawer.onclick = () => toggleSettings(false);
    avatarBadge.onclick = () => toggleSettings();

    // Dynamic API Key placeholder based on selected provider
    function updateKeyPlaceholder() {
      const p = providerSelect.value;
      if (p === 'gemini') {
        apiKeyInput.placeholder = 'AIzaSy... (Paste Google Gemini API Key)';
      } else if (p === 'groq') {
        apiKeyInput.placeholder = 'gsk_... (Paste Groq API Key)';
      } else if (p === 'siliconflow') {
        apiKeyInput.placeholder = 'sk-... (Paste SiliconFlow API Key)';
      } else if (p === 'deepseek') {
        apiKeyInput.placeholder = 'sk-... (Paste DeepSeek API Key)';
      } else if (p === 'ollama') {
        apiKeyInput.placeholder = 'None needed (Local Ollama)';
      } else {
        apiKeyInput.placeholder = 'Paste ' + p + ' API key...';
      }
    }
    providerSelect.addEventListener('change', updateKeyPlaceholder);
    updateKeyPlaceholder();

    // Test API Connection
    btnTestAiConnection.onclick = () => {
      const provider = providerSelect.value;
      const apiKey = apiKeyInput.value.trim();
      const model = modelInput.value.trim();
      testResultBanner.className = 'test-result-banner info';
      testResultBanner.textContent = '⚡ Testing connection to ' + provider + '...';
      vscode.postMessage({
        type: 'testAiConnection',
        provider,
        apiKey,
        model
      });
    };

    // Send Chat Prompt (Generates code and displays in extension only)
    function sendPrompt() {
      const text = chatInput.value.trim();
      if (!text) return;
      chatInput.value = '';
      setGenerating(true);
      btnSendPrompt.textContent = '⏳ Thinking...';
      btnSendPrompt.disabled = true;
      bubbleBadge.textContent = '[GENERATING]';
      bubbleText.textContent = 'Generating code with AI for: \"' + text + '\"...';
      bubbleActions.innerHTML = '';
      if (codeResultCard) codeResultCard.style.display = 'none';
      vscode.postMessage({ type: 'chatPrompt', prompt: text });
    }
    btnSendPrompt.onclick = sendPrompt;
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendPrompt();
      }
    });

    // Save Settings
    btnSaveAllSettings.onclick = () => {
      const name = petNameInput.value.trim() || 'luffy';
      const species = speciesSelect.value;
      const provider = providerSelect.value;
      const apiKey = apiKeyInput.value.trim();
      const model = modelInput.value.trim();

      vscode.postMessage({
        type: 'savePet',
        name,
        species
      });

      vscode.postMessage({
        type: 'saveAiConfig',
        provider,
        apiKey,
        model
      });

      // Automatically collapse settings after save — show only companion section!
      toggleSettings(false);
    };

    btnOpenStudioFull.onclick = () => vscode.postMessage({ type: 'openStudio' });

    // Inform VS Code that webview is mounted & ready to receive current file diagnostics
    vscode.postMessage({ type: 'webviewReady' });

    // Global Event Delegation for ALL buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      if (btn.id === 'btnFix' || btn.classList.contains('btn-fix-action')) {
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
      } else if (btn.id === 'btnCopyCode' || btn.id === 'btnCopyFromBubble' || btn.classList.contains('btn-copy-code')) {
        e.preventDefault();
        copyToClipboard(latestGeneratedCode, btn);
      } else if (btn.id === 'btnCloseCode') {
        e.preventDefault();
        if (codeResultCard) codeResultCard.style.display = 'none';
      } else if (btn.id === 'btnAllow') {
        e.preventDefault();
        currentPermission = 'granted';
        vscode.postMessage({ type: 'setPermission', permission: 'granted' });
        bubbleBadge.textContent = '[ACTIVE]';
        bubbleText.textContent = 'Scanning permitted! Watching your code.';
        bubbleActions.innerHTML = '';
      } else if (btn.id === 'btnDeny') {
        e.preventDefault();
        currentPermission = 'denied';
        vscode.postMessage({ type: 'setPermission', permission: 'denied' });
        bubbleBadge.textContent = '[PAUSED]';
        bubbleText.textContent = 'Code scanning paused.';
        bubbleActions.innerHTML = '';
      }
    });

    window.addEventListener('message', (e) => {
      const msg = e.data;

      if (msg.type === 'petUpdated') {
        avatarName.textContent = msg.name;
        bubbleTitle.textContent = '🐾 ' + msg.name;
        petNameInput.value = msg.name;
        speciesSelect.value = msg.species;
        if (msg.svg) avatarBadge.innerHTML = msg.svg;
      }

      if (msg.type === 'fixing') {
        setFixing(true);
        bubbleTitle.textContent = '🧠 ' + avatarName.textContent;
        bubbleBadge.textContent = '[FIXING...]';
        bubbleText.textContent = 'Analyzing and fixing line ' + (msg.line || '') + ' using AI...';
        bubbleActions.innerHTML = '<span style="color:#888;font-size:10px;">🤖 Applying AI code correction...</span>';
        if (msg.svg) avatarBadge.innerHTML = msg.svg;
      }

      if (msg.type === 'showExplanation') {
        setFixing(false);
        bubbleTitle.textContent = '💡 ' + avatarName.textContent + ' [Explanation]';
        bubbleBadge.textContent = '[EXPLAIN]';
        bubbleText.textContent = msg.explanation;
        bubbleActions.innerHTML = '<button class="btn-term btn-fix btn-fix-action" id="btnFix">🔧 Fix with AI</button>';
      }

      if (msg.type === 'fixSuccess') {
        setFixing(false);
        fixCooldownUntil = Date.now() + 3500;
        bubbleTitle.textContent = '✓ ' + avatarName.textContent;
        bubbleBadge.textContent = '[FIXED]';
        bubbleText.textContent = msg.message;
        bubbleActions.innerHTML = '';
        if (msg.svg) avatarBadge.innerHTML = msg.svg;
      }

      if (msg.type === 'chatGenerating') {
        setGenerating(true);
        btnSendPrompt.textContent = '⏳ Thinking...';
        btnSendPrompt.disabled = true;
        bubbleBadge.textContent = '[GENERATING]';
        bubbleText.textContent = 'Thinking & generating code with AI for: \"' + msg.prompt + '\"...';
        bubbleActions.innerHTML = '';
        if (codeResultCard) codeResultCard.style.display = 'none';
      }

      if (msg.type === 'chatResult') {
        setGenerating(false);
        btnSendPrompt.textContent = '✨ Generate Code';
        btnSendPrompt.disabled = false;
        latestGeneratedCode = msg.code || '';
        fixCooldownUntil = Date.now() + 6000;
        bubbleTitle.textContent = '✨ ' + avatarName.textContent;
        bubbleBadge.textContent = '[CODE READY]';
        bubbleText.textContent = 'Here is your generated code for: \"' + msg.prompt + '\". Click "Copy Code" to copy & paste anywhere!';
        bubbleActions.innerHTML = '<button class="btn-term btn-fix" id="btnCopyFromBubble">📋 Copy Code</button>';
        if (msg.svg) avatarBadge.innerHTML = msg.svg;

        if (codeResultCard) {
          codeResultLang.textContent = (msg.language || 'code').toUpperCase();
          codeResultProvider.textContent = msg.provider || 'AI Generated';
          codeResultPrompt.textContent = '> ' + msg.prompt;
          codeResultCode.textContent = msg.code || '';
          codeResultCard.style.display = 'block';
          codeResultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }

      if (msg.type === 'chatSuccess') {
        setGenerating(false);
        btnSendPrompt.textContent = '✨ Generate Code';
        btnSendPrompt.disabled = false;
        fixCooldownUntil = Date.now() + 4000;
        bubbleTitle.textContent = '✓ ' + avatarName.textContent;
        bubbleBadge.textContent = '[DONE]';
        bubbleText.textContent = msg.message;
        bubbleActions.innerHTML = '';
        if (msg.svg) avatarBadge.innerHTML = msg.svg;
      }

      if (msg.type === 'chatError') {
        setGenerating(false);
        btnSendPrompt.textContent = '✨ Generate Code';
        btnSendPrompt.disabled = false;
        bubbleTitle.textContent = '⚠️ ' + avatarName.textContent;
        bubbleBadge.textContent = '[AI NOTICE]';
        bubbleText.textContent = msg.error;
        bubbleActions.innerHTML = '<button class="btn-term btn-fix btn-enter-key" id="btnEnterApiKey">🔑 Enter API Key</button><button class="btn-term btn-reconfig-action" id="btnReconfig">⚙️ Settings</button>';
        if (msg.svg) avatarBadge.innerHTML = msg.svg;
      }

      if (msg.type === 'testAiResult') {
        const r = msg.result;
        if (r && r.ok) {
          testResultBanner.className = 'test-result-banner success';
          testResultBanner.textContent = '✓ ' + r.message + (r.latencyMs ? ' (' + r.latencyMs + 'ms)' : '');
          if (r.activeModel && (!modelInput.value.trim() || modelInput.value.trim().toLowerCase().includes('gemini') || modelInput.value.trim().toLowerCase().includes('llama'))) {
            modelInput.value = r.activeModel;
          }
        } else {
          testResultBanner.className = 'test-result-banner error';
          testResultBanner.textContent = '✗ ' + (r && r.message ? r.message : 'Connection failed');
        }
      }

      if (msg.type === 'diagnostics') {
        const s = msg.snapshot;
        currentSnapshot = s;

        // If currently fixing, generating AI code, or celebrating recent fix, do not interrupt speech bubble
        if (isFixing || isGenerating || Date.now() < fixCooldownUntil) {
          return;
        }

        if (msg.svg) avatarBadge.innerHTML = msg.svg;

        if (currentPermission !== 'granted') return;

        if (s.errors > 0) {
          bubbleTitle.textContent = '🚨 ' + avatarName.textContent + ' [Line ' + (s.line || 1) + ']';
          bubbleBadge.textContent = '[ERROR]';
          bubbleText.textContent = s.suggestion || s.message || ('Error on line ' + (s.line || 1));
          bubbleActions.innerHTML = '<button class="btn-term btn-explain-action" id="btnExplain">💡 Explain</button><button class="btn-term btn-fix btn-fix-action" id="btnFix">🔧 Fix</button>';
          avatarStatus.textContent = '● ALERT';
          avatarStatus.style.color = '#ffffff';
        } else {
          bubbleTitle.textContent = '🐾 ' + avatarName.textContent;
          bubbleBadge.textContent = '[IDLE]';
          bubbleText.textContent = 'Watching ' + s.fileName + '. Everything clean.';
          bubbleActions.innerHTML = '';
          avatarStatus.textContent = '● WATCHING';
          avatarStatus.style.color = '#888888';
        }
      }
    });
  </script>
</body>
</html>`;
  }
}

function escapeHtml(val: string): string {
  return val.replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
