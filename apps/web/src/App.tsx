import { useEffect, useState } from "react";
import { usePetState } from "./pet/usePetState";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const VSIX_PATH = "/codepet-ai-0.1.0.vsix";

const ROBOT_SVG = (mood: "idle" | "error" | "success") => {
  const eyeColor = mood === "error" ? "#ffffff" : "#ffffff";
  const borderColor = mood === "error" ? "#ffffff" : mood === "success" ? "#ffffff" : "#444444";
  const label = mood === "error" ? "! ALERT" : mood === "success" ? "✓ FIXED" : null;

  return `<svg width="96" height="96" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="60" cy="60" r="57" fill="#050505" stroke="${borderColor}" stroke-width="1.5"/>
    <path d="M 28 115 Q 60 88 92 115 L 96 120 L 24 120 Z" fill="#e0e0e0" stroke="#222" stroke-width="1"/>
    <ellipse cx="60" cy="94" rx="16" ry="5" fill="#141414" stroke="#333" stroke-width="1.2"/>
    <rect x="58.5" y="10" width="3" height="15" rx="1.5" fill="#888"/>
    <circle cx="60" cy="9" r="4.5" fill="#ffffff" filter="url(#glow)"/>
    <rect x="19" y="35" width="8" height="28" rx="4" fill="#333" stroke="#555" stroke-width="1.2"/>
    <rect x="93" y="35" width="8" height="28" rx="4" fill="#333" stroke="#555" stroke-width="1.2"/>
    <ellipse cx="60" cy="49" rx="36" ry="29" fill="#f5f5f5" stroke="#333" stroke-width="1.2"/>
    <ellipse cx="60" cy="51" rx="27" ry="19" fill="#000000" stroke="#262626" stroke-width="1.5"/>
    ${mood === "error"
      ? `<path d="M 44 43 L 53 52 M 53 43 L 44 52" stroke="${eyeColor}" stroke-width="3.2" stroke-linecap="round" filter="url(#glow)"/>
         <path d="M 67 43 L 76 52 M 76 43 L 67 52" stroke="${eyeColor}" stroke-width="3.2" stroke-linecap="round" filter="url(#glow)"/>
         <ellipse cx="60" cy="61" rx="4.5" ry="4" fill="${eyeColor}" filter="url(#glow)"/>
         <g transform="translate(42,2)"><rect x="0" y="0" width="36" height="11" rx="2" fill="#ffffff"/><text x="18" y="8.5" font-size="7.5" fill="#000" font-weight="900" text-anchor="middle" font-family="monospace">! ALERT</text></g>`
      : mood === "success"
      ? `<path d="M 43 47 Q 49 39 55 47" fill="none" stroke="${eyeColor}" stroke-width="3.5" stroke-linecap="round" filter="url(#glow)"/>
         <path d="M 65 47 Q 71 39 77 47" fill="none" stroke="${eyeColor}" stroke-width="3.5" stroke-linecap="round" filter="url(#glow)"/>
         <path d="M 52 57 Q 60 65 68 57" fill="none" stroke="${eyeColor}" stroke-width="3.2" stroke-linecap="round" filter="url(#glow)"/>
         <g transform="translate(40,2)"><rect x="0" y="0" width="40" height="11" rx="2" fill="#ffffff"/><text x="20" y="8.5" font-size="7.5" fill="#000" font-weight="900" text-anchor="middle" font-family="monospace">✓ FIXED</text></g>`
      : `<path d="M 44 47 Q 50 39 56 47" fill="none" stroke="${eyeColor}" stroke-width="3.5" stroke-linecap="round" filter="url(#glow)"/>
         <path d="M 64 47 Q 70 39 76 47" fill="none" stroke="${eyeColor}" stroke-width="3.5" stroke-linecap="round" filter="url(#glow)"/>
         <path d="M 53 58 Q 60 64 67 58" fill="none" stroke="${eyeColor}" stroke-width="3" stroke-linecap="round" filter="url(#glow)"/>`
    }
  </svg>`;
};

const FEATURES = [
  { icon: "⬡", title: "Permission-First Scanning", desc: "CodePet asks before it ever touches your code. Grant or revoke scanning permission anytime from the companion panel." },
  { icon: "⬡", title: "Every Language Supported", desc: "Python, TypeScript, JavaScript, C++, Java, Go, Rust, Swift, PHP, Ruby, SQL, Shell — all monitored in real time." },
  { icon: "⬡", title: "AI Error Explanation", desc: "One click gets you a beginner-friendly root cause breakdown of any compiler error, powered by your chosen AI model." },
  { icon: "⬡", title: "1-Click Code Fix", desc: "AI proposes a narrow, verified replacement for the broken line. Review the diff, apply with one click, undo anytime." },
  { icon: "⬡", title: "AI Code Generation", desc: "Type a natural language prompt in the companion panel. CodePet generates production-ready code you can copy instantly." },
  { icon: "⬡", title: "3D Companion Avatars", desc: "Five isometric 3D pets — Luffy Robot, Pixel Neko, Cyber Pup, Dev Dino, Glitch Fox — react live to your code state." },
];

const PROVIDERS = [
  { name: "Groq Cloud", note: "Llama 3.1 · 500+ tok/s", free: true },
  { name: "Google Gemini", note: "15 RPM / 1M TPM", free: true },
  { name: "SiliconFlow", note: "DeepSeek-V3 · Qwen 2.5", free: true },
  { name: "DeepSeek Official", note: "deepseek-chat · reasoner", free: true },
  { name: "Alibaba Qwen", note: "1M–2M free tokens", free: true },
  { name: "Zhipu GLM-4-Flash", note: "100% free forever", free: true },
  { name: "Moonshot AI (Kimi)", note: "Free signup credits", free: true },
  { name: "Ollama (Local)", note: "100% offline · private", free: true },
  { name: "OpenAI / ChatGPT", note: "gpt-4o-mini", free: false },
];

const INSTALL_STEPS = [
  { title: "Download the VSIX file", desc: "Click the download button above to get codepet-ai-0.1.0.vsix to your machine." },
  { title: "Open VS Code Command Palette", desc: "Press", code: "Cmd+Shift+P" , desc2: "(Mac) or", code2: "Ctrl+Shift+P", desc3: "(Windows/Linux)." },
  { title: "Install from VSIX", desc: "Type and select", code: "Extensions: Install from VSIX...", desc2: "then choose the downloaded file." },
  { title: "Reload VS Code", desc: "Click Reload Window when prompted, or restart VS Code." },
  { title: "Configure your AI provider", desc: "Click the CodePet icon in the Activity Bar → open Settings → paste your free API key (Groq or Gemini recommended)." },
];

export function App() {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [petMood, setPetMood] = useState<"idle" | "error" | "success">("idle");
  const pet = usePetState();

  useEffect(() => {
    fetch(`${apiUrl}/api/v1/health`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(() => { setApiOnline(true); pet.transition("coding"); })
      .catch(() => { setApiOnline(false); pet.transition("confused"); });
  }, []);

  // Cycle pet mood for demo
  useEffect(() => {
    const moods: Array<"idle" | "error" | "success"> = ["idle", "error", "success"];
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % moods.length; setPetMood(moods[i]); }, 2800);
    return () => clearInterval(id);
  }, []);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = VSIX_PATH;
    a.download = "codepet-ai-0.1.0.vsix";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="page">

      {/* ── Nav ── */}
      <nav className="nav">
        <div className="nav-brand">
          <div className="nav-dot" />
          CODEPET AI
        </div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#ai-models">AI Models</a></li>
          <li><a href="#download">Download</a></li>
          <li><a href="#install">Install</a></li>
          <li><a href="#download" className="nav-cta">↓ Get Extension</a></li>
        </ul>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-tag">
          <div className="hero-tag-dot" />
          VS Code Extension · v0.1.0 · Free
        </div>
        <h1>
          Your AI-Powered<br />
          <span>Coding Assistant</span>
        </h1>
        <p className="hero-sub">
          CodePet AI lives in your VS Code sidebar. It watches your code across every language,
          explains errors in plain English, and fixes them with one click — powered by free AI models.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={handleDownload}>
            ↓ Download Extension (.vsix)
          </button>
          <a className="btn-secondary" href="#features">
            See Features →
          </a>
        </div>

        {/* Terminal demo */}
        <div className="terminal-window">
          <div className="terminal-bar">
            <div className="t-dot" />
            <div className="t-dot" />
            <div className="t-dot" />
            <span className="terminal-title">codepet — VS Code Extension</span>
          </div>
          <div className="terminal-body">
            <div className="t-line"><span className="t-prompt">$</span><span className="t-cmd">codepet scan --file app.ts --language typescript</span></div>
            <div className="t-out">Scanning app.ts for diagnostics...</div>
            <div className="t-out">Language Server: TypeScript 5.7</div>
            <div className="t-out">Found 1 error on line 14</div>
            <div className="t-line"><span className="t-prompt">$</span><span className="t-cmd">codepet fix --line 14 --provider groq</span></div>
            <div className="t-out">Sending to Groq Cloud (llama-3.1-8b-instant)...</div>
            <div className="t-out">AI fix computed in 312ms</div>
            <div className="t-out t-success">✓ Line 14 corrected. Use Ctrl+Z to undo.</div>
            <div className="t-line"><span className="t-prompt">$</span><span className="t-cmd"><span className="t-cursor" /></span></div>
          </div>
        </div>
      </section>

      {/* ── Pet Demo ── */}
      <section className="pet-demo-section" id="companion">
        <div className="pet-demo-inner">
          <div className="pet-demo-visual">
            <div className="pet-demo-bar">
              <div className="t-dot" /><div className="t-dot" /><div className="t-dot" />
              <span className="pet-demo-title-bar">codepet.petView — Companion Panel</span>
            </div>
            <div className="pet-demo-body">
              <div
                className="robot-svg"
                dangerouslySetInnerHTML={{ __html: ROBOT_SVG(petMood) }}
              />
              <div className="pet-speech">
                {petMood === "idle" && <><strong>🐾 Luffy:</strong> Watching your code across all windows. Everything clean.</>}
                {petMood === "error" && <><strong>🚨 Luffy [Line 14]:</strong> Cannot find name 'resposne'. Did you mean 'response'?</>}
                {petMood === "success" && <><strong>✓ Luffy:</strong> Fixed line 14 — corrected typo 'resposne' → 'response'.</>}
              </div>
              {petMood === "error" && (
                <div className="pet-demo-actions">
                  <div className="pet-action-btn">💡 Explain</div>
                  <div className="pet-action-btn primary">🔧 Fix</div>
                </div>
              )}
            </div>
          </div>

          <div className="pet-demo-info">
            <div>
              <p className="section-label">Live Companion</p>
              <h2 className="section-title">Reacts to your code in real time</h2>
              <p className="section-desc">
                The companion panel sits in your VS Code sidebar and status bar.
                It watches diagnostics from every language server and reacts instantly —
                no manual scanning needed.
              </p>
            </div>
            <ul className="pet-feature-list">
              <li>Detects errors and warnings across all open files</li>
              <li>Shows the exact line, error message, and a suggested fix</li>
              <li>Pet mood changes — idle, alert, fixing, celebrating</li>
              <li>Choose from 5 avatar species and name your companion</li>
              <li>Mute notifications anytime with Do Not Disturb mode</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section" id="features">
        <div className="section-inner">
          <p className="section-label">What it does</p>
          <h2 className="section-title">Everything you need, nothing you don't</h2>
          <p className="section-desc">
            CodePet AI is a focused tool. It scans, explains, and fixes — without telemetry,
            without cloud accounts, without getting in your way.
          </p>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div className="feature-card" key={f.title}>
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Models ── */}
      <section className="section" id="ai-models">
        <div className="section-inner">
          <p className="section-label">AI Providers</p>
          <h2 className="section-title">Free AI models, your choice</h2>
          <p className="section-desc">
            CodePet works with 9 AI providers — most are completely free. No credit card required
            for Groq, Gemini, SiliconFlow, DeepSeek, Qwen, Zhipu, or Ollama.
          </p>
          <div className="providers-grid">
            {PROVIDERS.map(p => (
              <div className="provider-card" key={p.name}>
                <div className="provider-name">{p.name}</div>
                <div style={{ marginTop: 6, marginBottom: 6, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}>{p.note}</div>
                <span className={`provider-badge ${p.free ? "free" : ""}`}>{p.free ? "FREE" : "PAID"}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Download ── */}
      <section className="download-section" id="download">
        <div className="download-inner">
          <p className="section-label">Get CodePet AI</p>
          <h2 className="section-title">Download & install in 60 seconds</h2>
          <p className="section-desc">
            Install directly into VS Code from the VSIX file. No marketplace account needed.
            Works on macOS, Windows, and Linux.
          </p>

          <div className="download-grid">
            {/* VSIX Download */}
            <div className="download-card">
              <div className="download-card-title">
                <span>⬡</span> VS Code Extension
              </div>
              <p className="download-card-desc">
                The full CodePet AI companion — 3D avatars, multi-language scanning,
                AI error explanation, 1-click fixes, and code generation. All in one VSIX.
              </p>
              <div className="download-meta">
                <div className="download-meta-item"><strong>Version</strong> 0.1.0</div>
                <div className="download-meta-item"><strong>Engine</strong> VS Code ^1.95.0</div>
                <div className="download-meta-item"><strong>Type</strong> .vsix</div>
                <div className="download-meta-item"><strong>License</strong> Free</div>
              </div>
              <button className="btn-download" onClick={handleDownload}>
                ↓ Download codepet-ai-0.1.0.vsix
              </button>
            </div>

            {/* Quick start */}
            <div className="download-card">
              <div className="download-card-title">
                <span>⬡</span> Quick Start (F5 Dev Mode)
              </div>
              <p className="download-card-desc">
                Clone the repo and press F5 in VS Code to launch the extension in a development
                host window. Best for contributors and developers who want to explore the source.
              </p>
              <div className="download-meta">
                <div className="download-meta-item"><strong>Requires</strong> Node.js 20+</div>
                <div className="download-meta-item"><strong>Package</strong> npm workspaces</div>
              </div>
              <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 4, padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", lineHeight: 2, marginTop: 8 }}>
                <div><span style={{ color: "var(--text-dim)" }}>$</span> git clone &lt;repo-url&gt;</div>
                <div><span style={{ color: "var(--text-dim)" }}>$</span> npm install</div>
                <div><span style={{ color: "var(--text-dim)" }}>$</span> cd apps/vscode-extension</div>
                <div><span style={{ color: "var(--text-dim)" }}>$</span> npm run build</div>
                <div><span style={{ color: "var(--text-dim)" }}>#</span> <span style={{ color: "var(--text)" }}>Press F5 in VS Code</span></div>
              </div>
            </div>
          </div>

          {/* Install Steps */}
          <div className="install-steps" id="install">
            <div className="install-steps-header">Installation Guide — VSIX Method</div>
            {INSTALL_STEPS.map((s, i) => (
              <div className="install-step" key={i}>
                <div className="step-num">{i + 1}</div>
                <div className="step-content">
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">
                    {s.desc}
                    {"code" in s && <> <span className="step-code">{s.code}</span></>}
                    {"desc2" in s && <> {s.desc2}</>}
                    {"code2" in s && <> <span className="step-code">{s.code2}</span></>}
                    {"desc3" in s && <> {s.desc3}</>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="api-status">
            <div className={`status-dot ${apiOnline === false ? "offline" : ""}`} />
            {apiOnline === null
              ? "Connecting to CodePet API..."
              : apiOnline
              ? "codepet-api is online · http://localhost:3001"
              : "API offline — extension works standalone without the server"}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-brand">CODEPET AI · v0.1.0</div>
        <ul className="footer-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#ai-models">AI Models</a></li>
          <li><a href="#download">Download</a></li>
          <li><a href="#install">Install Guide</a></li>
        </ul>
        <div className="footer-copy">AI-Powered Coding Assistant for VS Code</div>
      </footer>

    </div>
  );
}
