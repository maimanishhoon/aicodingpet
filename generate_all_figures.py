"""
Script to generate all figures for CodePet AI report:
Figures 6.1 to 6.4 (Diagrams)
Figures 7.1 to 7.6 (Interface and Feature Screenshots)
"""
import os
import subprocess
from PIL import Image

OUT_DIR = "screenshots"
os.makedirs(OUT_DIR, exist_ok=True)
CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

def capture_html(html_path, out_png, width, height):
    abs_html = os.path.abspath(html_path)
    cmd = [
        CHROME_BIN,
        "--headless",
        f"--screenshot={out_png}",
        f"--window-size={width},{height}",
        "--hide-scrollbars",
        f"file://{abs_html}"
    ]
    subprocess.run(cmd, check=True)
    # Ensure exact dimensions with PIL
    im = Image.open(out_png)
    if im.size != (width, height):
        im = im.resize((width, height), Image.Resampling.LANCZOS)
        im.save(out_png)
    print(f"Captured {out_png} at {width}x{height}")

# ==========================================
# 1. Figure 6.1: System Architecture (2177 x 1077)
# ==========================================
html_6_1 = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 30px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #1e293b; box-sizing: border-box; width: 2177px; height: 1077px; }
  .title { text-align: center; font-size: 34px; font-weight: 700; color: #0f172a; margin-bottom: 25px; letter-spacing: -0.5px; }
  .subtitle { text-align: center; font-size: 18px; color: #64748b; margin-top: -18px; margin-bottom: 30px; }
  .canvas { display: flex; justify-content: space-between; gap: 24px; height: 860px; }
  .layer { flex: 1; border: 2px solid #cbd5e1; border-radius: 14px; padding: 22px; background: #f8fafc; display: flex; flex-direction: column; position: relative; }
  .layer-header { font-size: 22px; font-weight: 700; padding: 10px 16px; border-radius: 8px; margin-bottom: 18px; text-align: center; color: #ffffff; }
  .client-header { background: #2563eb; }
  .backend-header { background: #0d9488; }
  .ai-header { background: #7c3aed; }
  .sub-box { background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin-bottom: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.03); }
  .sub-title { font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
  .badge { font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 600; text-transform: uppercase; }
  .b-blue { background: #dbeafe; color: #1d4ed8; }
  .b-teal { background: #ccfbf1; color: #0f766e; }
  .b-purple { background: #ede9fe; color: #6d28d9; }
  .b-amber { background: #fef3c7; color: #b45309; }
  ul { margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.6; }
  .arrow-box { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 60px; }
  .arrow-label { font-size: 12px; font-weight: 600; color: #64748b; text-align: center; margin-top: 6px; }
  .footer-note { margin-top: 15px; font-size: 13px; color: #64748b; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
</style>
</head>
<body>
  <div class="title">CodePet AI: System Architecture Diagram</div>
  <div class="subtitle">Multi-Tier Microservice & VS Code Extension Architecture with Multi-Model AI Routing</div>
  <div class="canvas">
    
    <!-- Tier 1: Client & Extension Layer -->
    <div class="layer">
      <div class="layer-header client-header">1. Presentation & IDE Client Tier</div>
      
      <div class="sub-box">
        <div class="sub-title">VS Code Extension Client <span class="badge b-blue">IDE Host</span></div>
        <ul>
          <li><strong>Pet Webview Provider:</strong> Custom webview sidebar with SVG/Isometric companion</li>
          <li><strong>Diagnostics Engine:</strong> Active text document listener & AST error scanner</li>
          <li><strong>Studio HUD Panel:</strong> Comprehensive controls, logs & API manager</li>
          <li><strong>Status Bar & Popping Dialog:</strong> Non-intrusive interactive alerts</li>
        </ul>
      </div>

      <div class="sub-box">
        <div class="sub-title">Web Application Portal <span class="badge b-blue">React 18 + Vite</span></div>
        <ul>
          <li><strong>Companion Dashboard:</strong> Real-time pet mood and animated avatar state</li>
          <li><strong>Learning Centre:</strong> Swift curriculum, exercises, test specs</li>
          <li><strong>Audio/Voice Engine:</strong> Audio cues and accessibility feedback</li>
          <li><strong>LocalStorage Cache:</strong> Zero-cloud user preference persistence</li>
        </ul>
      </div>

      <div class="sub-box" style="margin-top:auto;">
        <div class="sub-title">User Interaction & Consent</div>
        <ul>
          <li><strong>Permission-First Gate:</strong> Explicit scanning grant/revoke</li>
          <li><strong>1-Click Code Replacement:</strong> Atomic edits with full Undo history</li>
          <li><strong>Quick Prompts:</strong> Code generation, error explanation, unit tests</li>
        </ul>
      </div>
    </div>

    <!-- Arrow 1 -->
    <div class="arrow-box">
      <svg width="40" height="120" viewBox="0 0 40 120">
        <path d="M 0 60 L 30 60 M 20 50 L 30 60 L 20 70" stroke="#64748b" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M 40 60 L 10 60 M 20 50 L 10 60 L 20 70" stroke="#64748b" stroke-width="4" fill="none" stroke-linecap="round"/>
      </svg>
      <div class="arrow-label">REST / JSON HTTP</div>
    </div>

    <!-- Tier 2: Backend & Middleware Layer -->
    <div class="layer">
      <div class="layer-header backend-header">2. Application Server & Service Tier</div>
      
      <div class="sub-box">
        <div class="sub-title">Express.js API Gateway <span class="badge b-teal">Node.js 20+</span></div>
        <ul>
          <li><strong>CORS & Security Middleware:</strong> X-Content-Type, Frame guard, Referrer policy</li>
          <li><strong>Structured Logging:</strong> Pino logger with JSON streaming output</li>
          <li><strong>Schema Validation:</strong> Zod runtime schema enforcement</li>
          <li><strong>Health Check Endpoint:</strong> /api/v1/health operational telemetry</li>
        </ul>
      </div>

      <div class="sub-box">
        <div class="sub-title">AI Processing Pipeline</div>
        <ul>
          <li><strong>/api/v1/debug/explain:</strong> Contextual root-cause diagnostics</li>
          <li><strong>/api/v1/debug/fix:</strong> Narrow AST diff computation & repair</li>
          <li><strong>Provider Failover:</strong> Graceful degradation on quota limits</li>
        </ul>
      </div>

      <div class="sub-box" style="margin-top:auto;">
        <div class="sub-title">Data & Persistence Layer <span class="badge b-amber">Prisma ORM</span></div>
        <ul>
          <li><strong>MySQL / SQLite DB:</strong> User profiles, progress logs, submission tests</li>
          <li><strong>Learning Topics & Exercises:</strong> Curated curriculum knowledge base</li>
          <li><strong>Secure Config:</strong> Dotenv schema configuration</li>
        </ul>
      </div>
    </div>

    <!-- Arrow 2 -->
    <div class="arrow-box">
      <svg width="40" height="120" viewBox="0 0 40 120">
        <path d="M 0 60 L 30 60 M 20 50 L 30 60 L 20 70" stroke="#64748b" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M 40 60 L 10 60 M 20 50 L 10 60 L 20 70" stroke="#64748b" stroke-width="4" fill="none" stroke-linecap="round"/>
      </svg>
      <div class="arrow-label">Multi-LLM Dispatch</div>
    </div>

    <!-- Tier 3: AI Intelligence Layer -->
    <div class="layer">
      <div class="layer-header ai-header">3. AI Intelligence & Provider Tier</div>
      
      <div class="sub-box">
        <div class="sub-title">Free Cloud AI Tier <span class="badge b-purple">Zero Config</span></div>
        <ul>
          <li><strong>Pollinations OpenAI Endpoint:</strong> Free high-speed code generation & debugging without requiring an API key</li>
          <li><strong>Built-in Fallback:</strong> Instant onboarding for all students</li>
        </ul>
      </div>

      <div class="sub-box">
        <div class="sub-title">Direct Cloud Providers <span class="badge b-purple">Free API Keys</span></div>
        <ul>
          <li><strong>Google Gemini:</strong> Gemini 1.5 / 2.0 Flash (15 RPM free)</li>
          <li><strong>Groq Cloud:</strong> Llama 3.3 70B Versatile (500+ tok/s)</li>
          <li><strong>DeepSeek / SiliconFlow:</strong> DeepSeek-V3 & R1 Coder</li>
          <li><strong>Alibaba Qwen & Zhipu:</strong> Qwen 2.5 & GLM-4-Flash</li>
        </ul>
      </div>

      <div class="sub-box" style="margin-top:auto;">
        <div class="sub-title">Local & Offline AI <span class="badge b-purple">100% Private</span></div>
        <ul>
          <li><strong>Ollama Server:</strong> http://localhost:11434</li>
          <li><strong>Offline Models:</strong> Qwen2.5-Coder, DeepSeek-Coder, Llama-3</li>
          <li><strong>Zero Network Dependency:</strong> Air-gapped code safety</li>
        </ul>
      </div>
    </div>

  </div>
  <div class="footer-note">Figure 6.1: CodePet AI System Architecture - Multi-Tier Integration across VS Code IDE, Express Application Server, and Multi-LLM Provider Network</div>
</body>
</html>
"""
with open("screenshots/fig6_1.html", "w") as f:
    f.write(html_6_1)

# ==========================================
# 2. Figure 6.2: Workflow Diagram (1737 x 1512)
# ==========================================
html_6_2 = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 30px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #1e293b; box-sizing: border-box; width: 1737px; height: 1512px; }
  .title { text-align: center; font-size: 32px; font-weight: 700; color: #0f172a; margin-bottom: 25px; }
  .flow-container { display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 1350px; }
  .step-node { width: 900px; border: 2px solid #cbd5e1; border-radius: 12px; padding: 18px 24px; background: #f8fafc; display: flex; align-items: center; gap: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.04); }
  .node-num { width: 50px; height: 50px; border-radius: 50%; background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 700; flex-shrink: 0; }
  .node-content { flex: 1; }
  .node-title { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
  .node-desc { font-size: 15px; color: #64748b; line-height: 1.4; }
  .decision-node { width: 800px; border: 2px dashed #0d9488; border-radius: 12px; padding: 16px 24px; background: #f0fdfa; text-align: center; }
  .decision-title { font-size: 19px; font-weight: 700; color: #0f766e; }
  .decision-desc { font-size: 14px; color: #115e59; margin-top: 4px; }
  .arrow { display: flex; flex-direction: column; align-items: center; }
  .arrow-line { width: 3px; height: 35px; background: #94a3b8; }
  .arrow-head { width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 9px solid #94a3b8; }
  .branch-box { display: flex; gap: 30px; width: 1100px; justify-content: center; }
  .branch-card { flex: 1; border: 2px solid #cbd5e1; border-radius: 10px; padding: 16px; background: #ffffff; text-align: center; }
  .branch-card h4 { margin: 0 0 6px 0; font-size: 17px; color: #1e293b; }
  .branch-card p { margin: 0; font-size: 14px; color: #64748b; }
  .footer-caption { text-align: center; font-size: 15px; color: #64748b; margin-top: 20px; }
</style>
</head>
<body>
  <div class="title">CodePet AI: System Operational Workflow Diagram</div>
  <div class="flow-container">
    
    <div class="step-node">
      <div class="node-num">1</div>
      <div class="node-content">
        <div class="node-title">User Codes in VS Code Editor</div>
        <div class="node-desc">Developer creates or edits source files in Python, TypeScript, C++, Swift, Java, or web technologies.</div>
      </div>
    </div>

    <div class="arrow"><div class="arrow-line"></div><div class="arrow-head"></div></div>

    <div class="step-node">
      <div class="node-num">2</div>
      <div class="node-content">
        <div class="node-title">Language Server / AST Diagnostic Evaluation</div>
        <div class="node-desc">VS Code language servers detect compilation errors, syntax faults, or runtime warnings with line and column metadata.</div>
      </div>
    </div>

    <div class="arrow"><div class="arrow-line"></div><div class="arrow-head"></div></div>

    <div class="decision-node">
      <div class="decision-title">Condition: Is Code Scanning Permission Granted?</div>
      <div class="decision-desc">Permission-First gate guarantees zero unsolicited inspection without user authorization.</div>
    </div>

    <div class="arrow"><div class="arrow-line"></div><div class="arrow-head"></div></div>

    <div class="step-node">
      <div class="node-num">3</div>
      <div class="node-content">
        <div class="node-title">Pet Companion Reaction & Popping Alert</div>
        <div class="node-desc">3D/SVG Pet transitions mood (confused / alert), updates status bar badge, and triggers non-intrusive interactive popup.</div>
      </div>
    </div>

    <div class="arrow"><div class="arrow-line"></div><div class="arrow-head"></div></div>

    <div class="branch-box">
      <div class="branch-card" style="border-top: 4px solid #2563eb;">
        <h4>Action A: Explain with AI</h4>
        <p>Pet sends diagnostic context to AI; provides beginner-friendly root cause breakdown.</p>
      </div>
      <div class="branch-card" style="border-top: 4px solid #0d9488;">
        <h4>Action B: Propose Fix</h4>
        <p>AI computes clean AST patch with 1-click diff preview and full undo protection.</p>
      </div>
      <div class="branch-card" style="border-top: 4px solid #7c3aed;">
        <h4>Action C: Generate Code</h4>
        <p>User inputs natural language query; AI generates production code with copy action.</p>
      </div>
    </div>

    <div class="arrow"><div class="arrow-line"></div><div class="arrow-head"></div></div>

    <div class="step-node">
      <div class="node-num">4</div>
      <div class="node-content">
        <div class="node-title">Multi-Tier AI Routing & Provider Execution</div>
        <div class="node-desc">Routes query to active provider: Tier 1 Direct API Key (Groq, Gemini, DeepSeek), Tier 2 Free Cloud AI, or Tier 3 Local Ollama.</div>
      </div>
    </div>

    <div class="arrow"><div class="arrow-line"></div><div class="arrow-head"></div></div>

    <div class="step-node">
      <div class="node-num">5</div>
      <div class="node-content">
        <div class="node-title">Response Delivery & Resolution Verification</div>
        <div class="node-desc">Companion updates webview HUD, displays formatted code with syntax highlighting, and pet switches to celebrating/happy mood.</div>
      </div>
    </div>

  </div>
  <div class="footer-caption">Figure 6.2: Workflow of the CodePet AI Companion System from Error Detection to AI Resolution</div>
</body>
</html>
"""
with open("screenshots/fig6_2.html", "w") as f:
    f.write(html_6_2)

# ==========================================
# 3. Figure 6.3: Data Flow Diagram Level 0 (1957 x 1077)
# ==========================================
html_6_3 = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 30px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #1e293b; box-sizing: border-box; width: 1957px; height: 1077px; }
  .title { text-align: center; font-size: 34px; font-weight: 700; color: #0f172a; margin-bottom: 20px; }
  .subtitle { text-align: center; font-size: 18px; color: #64748b; margin-top: -15px; margin-bottom: 35px; }
  .canvas { position: relative; width: 100%; height: 860px; border: 1.5px solid #e2e8f0; border-radius: 12px; background: #fafafa; }
  .entity { position: absolute; border: 2.5px solid #1e293b; background: #ffffff; padding: 18px 24px; border-radius: 8px; font-size: 18px; font-weight: 700; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  .process { position: absolute; width: 340px; height: 340px; border-radius: 50%; background: #eff6ff; border: 3.5px solid #2563eb; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 30px; box-sizing: border-box; box-shadow: 0 10px 15px rgba(37,99,235,0.1); }
  .p-num { font-size: 20px; font-weight: 800; color: #2563eb; margin-bottom: 6px; }
  .p-name { font-size: 24px; font-weight: 700; color: #0f172a; }
  .datastore { position: absolute; border-top: 3px solid #0d9488; border-bottom: 3px solid #0d9488; background: #f0fdfa; padding: 14px 28px; font-size: 17px; font-weight: 600; color: #0f766e; text-align: center; }
  .flow-label { font-size: 13px; font-weight: 600; color: #475569; background: #ffffff; padding: 4px 8px; border-radius: 4px; border: 1px solid #cbd5e1; }
  svg.flow-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
</style>
</head>
<body>
  <div class="title">CodePet AI: Data Flow Diagram (DFD Level 0)</div>
  <div class="subtitle">Contextual Data Exchange Between External Entities, the Central CodePet Engine, and Storage Stores</div>
  <div class="canvas">
    
    <!-- Central Process -->
    <div class="process" style="top: 250px; left: 808px;">
      <div class="p-num">0.0</div>
      <div class="p-name">CodePet AI Companion System</div>
      <div style="font-size: 14px; color: #64748b; margin-top: 8px;">Diagnostics Scanner, AI Router & Companion HUD</div>
    </div>

    <!-- External Entity: Developer -->
    <div class="entity" style="top: 80px; left: 100px; width: 220px;">
      Developer / Student
      <div style="font-size: 13px; font-weight: normal; color: #64748b; margin-top: 4px;">VS Code User & Web Visitor</div>
    </div>

    <!-- External Entity: Language Server -->
    <div class="entity" style="top: 580px; left: 100px; width: 220px;">
      Language Server / IDE
      <div style="font-size: 13px; font-weight: normal; color: #64748b; margin-top: 4px;">Diagnostics & AST Evaluator</div>
    </div>

    <!-- External Entity: Remote Cloud AI -->
    <div class="entity" style="top: 80px; left: 1560px; width: 240px;">
      Cloud AI Providers
      <div style="font-size: 13px; font-weight: normal; color: #64748b; margin-top: 4px;">Gemini, Groq, Pollinations Cloud</div>
    </div>

    <!-- External Entity: Local Ollama -->
    <div class="entity" style="top: 580px; left: 1560px; width: 240px;">
      Local Ollama Engine
      <div style="font-size: 13px; font-weight: normal; color: #64748b; margin-top: 4px;">Offline LLM Models</div>
    </div>

    <!-- Data Store D1: Preferences -->
    <div class="datastore" style="top: 60px; left: 820px; width: 310px;">
      D1: User & Pet Preferences
    </div>

    <!-- Data Store D2: Learning Curriculum -->
    <div class="datastore" style="top: 730px; left: 820px; width: 310px;">
      D2: Learning Topics & Curriculum DB
    </div>

    <!-- Flow SVG Lines -->
    <svg class="flow-svg">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
        </marker>
      </defs>
      
      <!-- User -> Process -->
      <path d="M 340 120 C 580 120, 680 280, 810 320" stroke="#475569" stroke-width="2.5" fill="none" marker-end="url(#arrow)" />
      <!-- Process -> User -->
      <path d="M 810 370 C 680 370, 580 160, 340 160" stroke="#475569" stroke-width="2.5" fill="none" marker-end="url(#arrow)" />

      <!-- Language Server -> Process -->
      <path d="M 340 620 C 580 620, 680 480, 810 450" stroke="#475569" stroke-width="2.5" fill="none" marker-end="url(#arrow)" />

      <!-- Process -> Remote Cloud AI -->
      <path d="M 1145 320 C 1280 280, 1380 120, 1560 120" stroke="#475569" stroke-width="2.5" fill="none" marker-end="url(#arrow)" />
      <!-- Remote Cloud AI -> Process -->
      <path d="M 1560 160 C 1380 160, 1280 370, 1145 370" stroke="#475569" stroke-width="2.5" fill="none" marker-end="url(#arrow)" />

      <!-- Process -> Ollama -->
      <path d="M 1145 450 C 1280 480, 1380 620, 1560 620" stroke="#475569" stroke-width="2.5" fill="none" marker-end="url(#arrow)" />
      <!-- Ollama -> Process -->
      <path d="M 1560 660 C 1380 660, 1280 500, 1145 490" stroke="#475569" stroke-width="2.5" fill="none" marker-end="url(#arrow)" />

      <!-- Process <-> D1 -->
      <path d="M 950 250 L 950 115" stroke="#0d9488" stroke-width="2.5" fill="none" marker-end="url(#arrow)" />
      <path d="M 1010 115 L 1010 250" stroke="#0d9488" stroke-width="2.5" fill="none" marker-end="url(#arrow)" />

      <!-- Process <-> D2 -->
      <path d="M 950 590 L 950 725" stroke="#0d9488" stroke-width="2.5" fill="none" marker-end="url(#arrow)" />
      <path d="M 1010 725 L 1010 590" stroke="#0d9488" stroke-width="2.5" fill="none" marker-end="url(#arrow)" />
    </svg>

    <!-- Labels -->
    <div class="flow-label" style="top: 210px; left: 470px;">Natural Language Prompts / Action Commands</div>
    <div class="flow-label" style="top: 270px; left: 470px;">Generated Code / Explanations / Interactive Alerts</div>
    <div class="flow-label" style="top: 530px; left: 470px;">Multi-Language Diagnostics & File Error Buffers</div>
    <div class="flow-label" style="top: 210px; left: 1220px;">Structured Explain/Fix AI Prompts</div>
    <div class="flow-label" style="top: 270px; left: 1220px;">Streamed Completions & AST Code Fixes</div>
    <div class="flow-label" style="top: 530px; left: 1250px;">Local Offline Inference</div>

  </div>
  <div style="text-align: center; font-size: 15px; color: #64748b; margin-top: 15px;">Figure 6.3: Level 0 Data Flow Diagram (DFD) Illustrating External Entity Interactions and Persistent Storage</div>
</body>
</html>
"""
with open("screenshots/fig6_3.html", "w") as f:
    f.write(html_6_3)

# ==========================================
# 4. Figure 6.4: Use Case Diagram (1957 x 1297)
# ==========================================
html_6_4 = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 30px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #1e293b; box-sizing: border-box; width: 1957px; height: 1297px; }
  .title { text-align: center; font-size: 34px; font-weight: 700; color: #0f172a; margin-bottom: 25px; }
  .canvas { position: relative; width: 100%; height: 1100px; display: flex; justify-content: space-between; align-items: center; }
  .actor-box { width: 260px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .actor-icon { width: 100px; height: 100px; }
  .actor-name { font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 14px; text-align: center; }
  .actor-role { font-size: 14px; color: #64748b; margin-top: 4px; text-align: center; }
  .system-boundary { width: 1300px; height: 1080px; border: 3px solid #3b82f6; border-radius: 20px; background: #f8fafc; padding: 30px; box-sizing: border-box; position: relative; display: flex; flex-direction: column; justify-content: space-between; }
  .system-title { position: absolute; top: -18px; left: 40px; background: #3b82f6; color: #ffffff; font-weight: 700; font-size: 18px; padding: 6px 20px; border-radius: 20px; text-transform: uppercase; }
  .usecases-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 40px; margin-top: 20px; }
  .usecase { background: #ffffff; border: 2px solid #cbd5e1; border-radius: 40px; padding: 18px 24px; text-align: center; font-size: 17px; font-weight: 600; color: #1e293b; box-shadow: 0 2px 4px rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: center; min-height: 48px; }
  .uc-highlight { border-color: #2563eb; background: #eff6ff; color: #1d4ed8; }
</style>
</head>
<body>
  <div class="title">CodePet AI: System Use Case Diagram</div>
  <div class="canvas">
    
    <!-- Actor 1: Developer / Student -->
    <div class="actor-box">
      <svg class="actor-icon" viewBox="0 0 100 100">
        <circle cx="50" cy="25" r="18" fill="none" stroke="#0f172a" stroke-width="4"/>
        <line x1="50" y1="43" x2="50" y2="75" stroke="#0f172a" stroke-width="4"/>
        <line x1="20" y1="55" x2="80" y2="55" stroke="#0f172a" stroke-width="4"/>
        <line x1="50" y1="75" x2="25" y2="100" stroke="#0f172a" stroke-width="4"/>
        <line x1="50" y1="75" x2="75" y2="100" stroke="#0f172a" stroke-width="4"/>
      </svg>
      <div class="actor-name">Developer / Student</div>
      <div class="actor-role">Primary User in VS Code & Web Hub</div>
    </div>

    <!-- System Boundary -->
    <div class="system-boundary">
      <div class="system-title">CodePet AI System Boundary</div>
      <div class="usecases-grid">
        <div class="usecase uc-highlight">UC1: Grant / Revoke Code Scanning Permission</div>
        <div class="usecase">UC2: Customize 3D Avatar Species (Bot/Neko/Pup/Dino/Fox)</div>
        
        <div class="usecase uc-highlight">UC3: Monitor Multi-Language Diagnostic Errors</div>
        <div class="usecase">UC4: View Interactive Popping Alerts & Mood Transitions</div>
        
        <div class="usecase uc-highlight">UC5: Request AI Error Explanation (Root Cause)</div>
        <div class="usecase uc-highlight">UC6: Propose & Apply 1-Click Atomic Code Fix</div>
        
        <div class="usecase uc-highlight">UC7: Generate Code from Natural Language Prompt</div>
        <div class="usecase">UC8: Copy Generated Code to Editor Clipboard</div>
        
        <div class="usecase">UC9: Select AI Provider (Free Cloud, Groq, Gemini, Ollama)</div>
        <div class="usecase">UC10: Configure Custom Local / Remote API Keys</div>
        
        <div class="usecase">UC11: Practice Interactive Swift Programming Exercises</div>
        <div class="usecase">UC12: Test Backend REST API Health & Telemetry</div>
      </div>
    </div>

    <!-- Actor 2: AI Provider Engine -->
    <div class="actor-box">
      <svg class="actor-icon" viewBox="0 0 100 100">
        <rect x="25" y="15" width="50" height="40" rx="8" fill="none" stroke="#7c3aed" stroke-width="4"/>
        <circle cx="40" cy="32" r="5" fill="#7c3aed"/>
        <circle cx="60" cy="32" r="5" fill="#7c3aed"/>
        <line x1="50" y1="55" x2="50" y2="80" stroke="#7c3aed" stroke-width="4"/>
        <line x1="25" y1="65" x2="75" y2="65" stroke="#7c3aed" stroke-width="4"/>
        <line x1="50" y1="80" x2="30" y2="100" stroke="#7c3aed" stroke-width="4"/>
        <line x1="50" y1="80" x2="70" y2="100" stroke="#7c3aed" stroke-width="4"/>
      </svg>
      <div class="actor-name">AI Provider Engine</div>
      <div class="actor-role">Gemini / Groq / Free Cloud / Ollama</div>
    </div>

  </div>
  <div style="text-align: center; font-size: 15px; color: #64748b; margin-top: 20px;">Figure 6.4: System Use Case Diagram Depicting Developer and AI Provider Interactions across Core Functional Modules</div>
</body>
</html>
"""
with open("screenshots/fig6_4.html", "w") as f:
    f.write(html_6_4)

# ==========================================
# 5. Figure 7.1: Illustrative Interface Wireframe (2177 x 1251)
# ==========================================
html_7_1 = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 25px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; box-sizing: border-box; width: 2177px; height: 1251px; }
  .title-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #334155; padding-bottom: 15px; margin-bottom: 20px; }
  .title-bar h1 { margin: 0; font-size: 28px; font-weight: 700; color: #38bdf8; }
  .wireframe-grid { display: grid; grid-template-columns: 280px 1fr 480px; gap: 20px; height: 1100px; }
  .panel { border: 2px solid #334155; border-radius: 12px; background: #1e293b; padding: 20px; display: flex; flex-direction: column; }
  .panel-header { font-size: 18px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 1px solid #334155; padding-bottom: 10px; display: flex; justify-content: space-between; }
  .editor-area { border: 2px dashed #475569; border-radius: 8px; background: #0b1120; padding: 24px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 16px; line-height: 1.8; color: #94a3b8; flex: 1; position: relative; }
  .err-line { background: rgba(239, 68, 68, 0.15); border-left: 4px solid #ef4444; padding-left: 10px; color: #fca5a5; }
  .pet-floating-widget { position: absolute; bottom: 30px; right: 30px; width: 340px; background: #111827; border: 2px solid #38bdf8; border-radius: 16px; padding: 18px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 16px; }
  .widget-avatar { width: 64px; height: 64px; background: #0284c7; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 32px; }
  .widget-text h4 { margin: 0 0 4px 0; font-size: 16px; color: #f8fafc; }
  .widget-text p { margin: 0; font-size: 13px; color: #38bdf8; }
  .hud-card { background: #0f172a; border: 1.5px solid #334155; border-radius: 8px; padding: 14px; margin-bottom: 14px; }
  .hud-card h5 { margin: 0 0 8px 0; font-size: 15px; color: #e2e8f0; }
  .hud-btn { background: #2563eb; color: #ffffff; border: none; border-radius: 6px; padding: 10px 16px; font-weight: 600; font-size: 14px; width: 100%; cursor: pointer; text-align: center; }
  .hud-btn-sec { background: #334155; margin-top: 8px; }
</style>
</head>
<body>
  <div class="title-bar">
    <h1>CodePet AI - Interface Wireframe & Component Architecture Layout</h1>
    <div style="font-size: 16px; color: #94a3b8;">VS Code Workspace Integration + Companion Studio HUD</div>
  </div>
  <div class="wireframe-grid">
    
    <!-- Sidebar / File Explorer -->
    <div class="panel">
      <div class="panel-header">Workspace Explorer</div>
      <div style="font-family: monospace; font-size: 14px; color: #94a3b8; line-height: 2;">
        📁 aicodingpet<br>
        &nbsp;&nbsp;📁 apps<br>
        &nbsp;&nbsp;&nbsp;&nbsp;📁 server<br>
        &nbsp;&nbsp;&nbsp;&nbsp;📁 vscode-extension<br>
        &nbsp;&nbsp;&nbsp;&nbsp;📁 web<br>
        &nbsp;&nbsp;📁 prisma<br>
        &nbsp;&nbsp;📄 package.json<br>
        &nbsp;&nbsp;📄 README.md<br>
        &nbsp;&nbsp;🔵 <strong>math_utils.py</strong> (Active)
      </div>
      <div style="margin-top: auto; border-top: 1px solid #334155; padding-top: 15px;">
        <div style="font-size: 13px; color: #64748b;">Companion Status:</div>
        <div style="font-size: 15px; color: #10b981; font-weight: 600; margin-top: 4px;">● Luffy Active (Monitoring)</div>
      </div>
    </div>

    <!-- Center Editor -->
    <div class="panel">
      <div class="panel-header">
        <span>Active Editor: math_utils.py</span>
        <span style="color: #ef4444; font-size: 14px;">1 Error Detected</span>
      </div>
      <div class="editor-area">
        <span style="color: #64748b;">1</span>&nbsp;&nbsp;<span style="color: #f43f5e;">def</span> <span style="color: #38bdf8;">calculate_average</span>(numbers):<br>
        <span style="color: #64748b;">2</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #64748b;">&quot;&quot;&quot;Calculate the average value of a list of numbers.&quot;&quot;&quot;</span><br>
        <span style="color: #64748b;">3</span>&nbsp;&nbsp;&nbsp;&nbsp;total = sum(numbers)<br>
        <span style="color: #64748b;">4</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="err-line">average = total / len(numbers)&nbsp;&nbsp;# ⚠️ ZeroDivisionError when list is empty</span><br>
        <span style="color: #64748b;">5</span>&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #f43f5e;">return</span> average<br>
        <br>
        <span style="color: #64748b;">6</span>&nbsp;&nbsp;<span style="color: #f43f5e;">def</span> <span style="color: #38bdf8;">main</span>():<br>
        <span style="color: #64748b;">7</span>&nbsp;&nbsp;&nbsp;&nbsp;values = []<br>
        <span style="color: #64748b;">8</span>&nbsp;&nbsp;&nbsp;&nbsp;print(f"Average: {calculate_average(values)}")
        
        <!-- Floating Companion -->
        <div class="pet-floating-widget">
          <div class="widget-avatar">🤖</div>
          <div class="widget-text">
            <h4>🐾 Luffy: Division by Zero!</h4>
            <p>math_utils.py: Line 4</p>
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 13px; color: #94a3b8; background: #0f172a; padding: 10px 16px; border-radius: 6px;">
        <span>Ln 4, Col 23</span>
        <span>Python 3.12</span>
        <span>UTF-8</span>
        <span style="color: #38bdf8;">🐾 CodePet AI: Ready</span>
      </div>
    </div>

    <!-- Right HUD / Companion Studio -->
    <div class="panel">
      <div class="panel-header">CodePet Companion Studio</div>
      
      <div class="hud-card" style="text-align: center; border-color: #38bdf8;">
        <div style="font-size: 40px; margin-bottom: 6px;">🤖</div>
        <h5>Luffy (3D Mecha Bot)</h5>
        <div style="font-size: 13px; color: #38bdf8;">State: Confused · Diagnostic Alert</div>
      </div>

      <div class="hud-card">
        <h5>Code Scanning Permission</h5>
        <p style="font-size: 13px; color: #94a3b8; margin: 0 0 10px 0;">Permission granted across all project languages.</p>
        <div style="display: flex; gap: 8px;">
          <div style="background: #065f46; color: #34d399; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">ACTIVE: GRANTED</div>
        </div>
      </div>

      <div class="hud-card">
        <h5>Active Diagnostic Action</h5>
        <div style="font-size: 13px; color: #fca5a5; margin-bottom: 12px;">ZeroDivisionError: division by zero in calculate_average()</div>
        <button class="hud-btn">💡 Explain with AI</button>
        <button class="hud-btn hud-btn-sec">🔧 Propose 1-Click Fix</button>
      </div>

      <div class="hud-card" style="margin-top: auto;">
        <h5>AI Provider Status</h5>
        <div style="font-size: 13px; color: #94a3b8;">Provider: <strong>Free Cloud AI (Pollinations)</strong></div>
        <div style="font-size: 13px; color: #10b981; margin-top: 4px;">Latency: 280ms · Quota: Unlimited</div>
      </div>
    </div>

  </div>
</body>
</html>
"""
with open("screenshots/fig7_1.html", "w") as f:
    f.write(html_7_1)

# ==========================================
# 6. Figure 7.3: Generate Code Feature (1869 x 1030)
# ==========================================
html_7_3 = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 30px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #000000; color: #f0f0f0; box-sizing: border-box; width: 1869px; height: 1030px; }
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #222; padding-bottom: 18px; margin-bottom: 24px; }
  .brand { display: flex; align-items: center; gap: 14px; font-size: 22px; font-weight: 700; color: #ffffff; }
  .pet-badge { background: #111; border: 1px solid #333; padding: 6px 14px; border-radius: 20px; font-size: 14px; color: #10b981; }
  .main-box { display: grid; grid-template-columns: 500px 1fr; gap: 30px; height: 860px; }
  .sidebar { background: #0a0a0a; border: 1.5px solid #222; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; }
  .pet-display { text-align: center; padding: 30px 0; border-bottom: 1px solid #222; }
  .speech { background: #141414; border: 1px solid #2a2a2a; border-radius: 10px; padding: 16px; font-size: 14px; line-height: 1.6; color: #bbb; margin-top: 20px; text-align: left; }
  .prompt-input-box { margin-top: auto; }
  .prompt-input { width: 100%; height: 90px; background: #000; border: 1.5px solid #333; border-radius: 8px; color: #fff; font-family: inherit; font-size: 14px; padding: 12px; box-sizing: border-box; resize: none; }
  .btn-submit { width: 100%; background: #2563eb; color: #fff; border: none; border-radius: 6px; padding: 12px; font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer; margin-top: 10px; }
  .code-view { background: #0a0a0a; border: 1.5px solid #222; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; overflow: hidden; }
  .code-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; padding-bottom: 14px; margin-bottom: 18px; }
  .code-title { font-size: 16px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 10px; }
  .btn-copy { background: #1e293b; color: #38bdf8; border: 1px solid #334155; border-radius: 6px; padding: 8px 18px; font-family: inherit; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }
  .code-body { background: #000000; border: 1px solid #1a1a1a; border-radius: 8px; padding: 24px; font-size: 15px; line-height: 1.7; color: #e2e8f0; flex: 1; overflow: hidden; }
  .kwd { color: #f43f5e; font-weight: bold; }
  .fn { color: #38bdf8; }
  .str { color: #34d399; }
  .cmt { color: #64748b; font-style: italic; }
  .num { color: #fbbf24; }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <span>🐾 CodePet AI Studio</span>
      <span style="color: #64748b;">|</span>
      <span style="font-size: 16px; color: #94a3b8;">Natural Language Code Generation</span>
    </div>
    <div class="pet-badge">● Free Cloud AI (Pollinations OpenAI Endpoint)</div>
  </div>

  <div class="main-box">
    <div class="sidebar">
      <div class="pet-display">
        <svg width="120" height="120" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="#0c1a2e" stroke="#2563eb" stroke-width="3"/>
          <rect x="35" y="38" width="30" height="24" rx="4" fill="#1e293b"/>
          <circle cx="43" cy="48" r="4" fill="#38bdf8"/>
          <circle cx="57" cy="48" r="4" fill="#38bdf8"/>
          <rect x="42" y="55" width="16" height="3" fill="#38bdf8"/>
        </svg>
        <div style="font-size: 18px; font-weight: 700; color: #fff; margin-top: 12px;">Luffy the Companion</div>
        <div style="font-size: 13px; color: #10b981; margin-top: 4px;">Status: Happy · Code Generated</div>
      </div>

      <div class="speech">
        <strong>Prompt:</strong> &quot;Generate a Python factorial function with memoization and input validation.&quot;<br><br>
        🐾 <em>&quot;Here is your robust Python factorial implementation with recursion caching and input type assertions! Click 'Copy Code' to paste into your file.&quot;</em>
      </div>

      <div class="prompt-input-box">
        <div style="font-size: 12px; color: #888; margin-bottom: 6px;">Ask CodePet to write code:</div>
        <textarea class="prompt-input" readonly>Generate a Python factorial function with memoization and input validation.</textarea>
        <button class="btn-submit">✨ Generate Code</button>
      </div>
    </div>

    <div class="code-view">
      <div class="code-header">
        <div class="code-title">
          <span>📄 factorial_memo.py</span>
          <span style="font-size: 12px; color: #64748b; font-weight: normal;">(Python 3)</span>
        </div>
        <button class="btn-copy">📋 Copy Code to Clipboard</button>
      </div>
      <div class="code-body">
<span class="cmt"># Generated by CodePet AI - Free Cloud AI Engine</span>
<span class="kwd">from</span> functools <span class="kwd">import</span> lru_cache

<span class="cmt">@lru_cache(maxsize=None)</span>
<span class="kwd">def</span> <span class="fn">factorial</span>(n: <span class="fn">int</span>) -&gt; <span class="fn">int</span>:
    <span class="str">&quot;&quot;&quot;
    Compute the factorial of n using memoization.
    
    :param n: Non-negative integer
    :return: n! (n factorial)
    :raises TypeError: if n is not an integer
    :raises ValueError: if n is negative
    &quot;&quot;&quot;</span>
    <span class="cmt"># Input validation</span>
    <span class="kwd">if not</span> isinstance(n, <span class="fn">int</span>) <span class="kwd">or</span> isinstance(n, <span class="fn">bool</span>):
        <span class="kwd">raise</span> TypeError(<span class="str">&quot;Factorial input must be an integer.&quot;</span>)
    <span class="kwd">if</span> n &lt; <span class="num">0</span>:
        <span class="kwd">raise</span> ValueError(<span class="str">&quot;Factorial is not defined for negative integers.&quot;</span>)
    
    <span class="cmt"># Base cases</span>
    <span class="kwd">if</span> n <span class="kwd">in</span> (<span class="num">0</span>, <span class="num">1</span>):
        <span class="kwd">return</span> <span class="num">1</span>
        
    <span class="cmt"># Recursive cached step</span>
    <span class="kwd">return</span> n * <span class="fn">factorial</span>(n - <span class="num">1</span>)

<span class="cmt"># Verification tests</span>
<span class="kwd">if</span> __name__ == <span class="str">&quot;__main__&quot;</span>:
    test_cases = [<span class="num">0</span>, <span class="num">1</span>, <span class="num">5</span>, <span class="num">10</span>]
    <span class="kwd">for</span> num <span class="kwd">in</span> test_cases:
        print(f<span class="str">&quot;{num}! = {factorial(num)}&quot;</span>)
      </div>
    </div>
  </div>
</body>
</html>
"""
with open("screenshots/fig7_3.html", "w") as f:
    f.write(html_7_3)

# ==========================================
# 7. Figure 7.4: Debug Code Feature (1857 x 990)
# ==========================================
html_7_4 = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 30px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #000000; color: #f0f0f0; box-sizing: border-box; width: 1857px; height: 990px; }
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #222; padding-bottom: 18px; margin-bottom: 24px; }
  .brand { display: flex; align-items: center; gap: 14px; font-size: 22px; font-weight: 700; color: #ffffff; }
  .tag { background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #f87171; padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 700; }
  .grid { display: grid; grid-template-columns: 1fr 520px; gap: 30px; height: 830px; }
  .editor { background: #0a0a0a; border: 1.5px solid #222; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; }
  .editor-header { display: flex; justify-content: space-between; font-size: 14px; color: #888; border-bottom: 1px solid #222; padding-bottom: 12px; margin-bottom: 18px; }
  .code { font-size: 16px; line-height: 1.8; color: #cbd5e1; flex: 1; }
  .err-bg { background: rgba(239, 68, 68, 0.15); border-left: 4px solid #ef4444; padding-left: 12px; color: #fca5a5; }
  .sidebar { background: #0a0a0a; border: 1.5px solid #222; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; }
  .pet-card { text-align: center; border-bottom: 1px solid #222; padding-bottom: 20px; margin-bottom: 20px; }
  .err-card { background: #140d0d; border: 1.5px solid #dc2626; border-radius: 10px; padding: 18px; margin-bottom: 20px; }
  .err-title { font-size: 16px; font-weight: 700; color: #f87171; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
  .err-desc { font-size: 14px; color: #fca5a5; line-height: 1.5; }
  .btn-action { background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 14px; font-family: inherit; font-size: 15px; font-weight: 700; cursor: pointer; margin-bottom: 12px; width: 100%; }
  .btn-sec { background: #1e293b; color: #38bdf8; border: 1px solid #334155; }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <span>🐾 CodePet Diagnostics Scanner</span>
      <span style="color: #64748b;">|</span>
      <span style="font-size: 16px; color: #94a3b8;">Multi-Language Real-Time Inspection</span>
    </div>
    <div class="tag">⚠️ 1 Critical Fault Detected</div>
  </div>

  <div class="grid">
    <div class="editor">
      <div class="editor-header">
        <span>📄 math_utils.py</span>
        <span style="color: #ef4444;">Diagnostic Status: Error</span>
      </div>
      <div class="code">
        1&nbsp;&nbsp;<span style="color: #f43f5e;">def</span> <span style="color: #38bdf8;">calculate_average</span>(numbers):<br>
        2&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #64748b;">&quot;&quot;&quot;Return the average of numbers in list.&quot;&quot;&quot;</span><br>
        3&nbsp;&nbsp;&nbsp;&nbsp;total = sum(numbers)<br>
        4&nbsp;&nbsp;&nbsp;&nbsp;<span class="err-bg">average = total / len(numbers)&nbsp;&nbsp;&nbsp;&nbsp;# ⚠️ ZeroDivisionError: division by zero</span><br>
        5&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #f43f5e;">return</span> average<br>
        <br>
        6&nbsp;&nbsp;<span style="color: #f43f5e;">def</span> <span style="color: #38bdf8;">run_metrics</span>():<br>
        7&nbsp;&nbsp;&nbsp;&nbsp;sample_data = []<br>
        8&nbsp;&nbsp;&nbsp;&nbsp;print(<span style="color: #34d399;">"Calculating sample metrics..."</span>)<br>
        9&nbsp;&nbsp;&nbsp;&nbsp;result = calculate_average(sample_data)<br>
        10&nbsp;&nbsp;&nbsp;print(f<span style="color: #34d399;">"Result: {result}"</span>)
      </div>
      <div style="font-size: 13px; color: #64748b; border-top: 1px solid #222; padding-top: 12px;">
        AST Syntax Analyzer: Python Language Server (LSP) · Checked in 12ms
      </div>
    </div>

    <div class="sidebar">
      <div class="pet-card">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="#201010" stroke="#ef4444" stroke-width="3"/>
          <circle cx="40" cy="45" r="5" fill="#f87171"/>
          <circle cx="60" cy="45" r="5" fill="#f87171"/>
          <path d="M 40 65 Q 50 55 60 65" stroke="#f87171" stroke-width="3" fill="none"/>
        </svg>
        <div style="font-size: 18px; font-weight: 700; color: #fff; margin-top: 10px;">Luffy Companion</div>
        <div style="font-size: 13px; color: #ef4444; margin-top: 4px;">Mood: Confused / Alert</div>
      </div>

      <div class="err-card">
        <div class="err-title">🚨 ZeroDivisionError</div>
        <div class="err-desc">
          <strong>File:</strong> math_utils.py, Line 4<br>
          <strong>Reason:</strong> Division by zero when <code>numbers</code> is empty (<code>len(numbers) == 0</code>).<br>
          <strong>Severity:</strong> Unhandled runtime exception.
        </div>
      </div>

      <div style="margin-top: auto;">
        <button class="btn-action">💡 Explain with AI</button>
        <button class="btn-action btn-sec">🔧 Propose 1-Click Fix</button>
      </div>
    </div>
  </div>
</body>
</html>
"""
with open("screenshots/fig7_4.html", "w") as f:
    f.write(html_7_4)

# ==========================================
# 8. Figure 7.5: Explain Code Feature (1902 x 1069)
# ==========================================
html_7_5 = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 30px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #000000; color: #f0f0f0; box-sizing: border-box; width: 1902px; height: 1069px; }
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #222; padding-bottom: 18px; margin-bottom: 24px; }
  .brand { display: flex; align-items: center; gap: 14px; font-size: 22px; font-weight: 700; color: #ffffff; }
  .status { background: #064e3b; border: 1px solid #10b981; color: #34d399; padding: 6px 14px; border-radius: 20px; font-size: 14px; }
  .main-view { display: grid; grid-template-columns: 460px 1fr; gap: 30px; height: 900px; }
  .side-panel { background: #0a0a0a; border: 1.5px solid #222; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; }
  .pet-box { text-align: center; border-bottom: 1px solid #222; padding-bottom: 20px; margin-bottom: 20px; }
  .query-box { background: #111; border: 1px solid #262626; border-radius: 8px; padding: 16px; font-size: 13px; line-height: 1.5; color: #888; }
  .explain-container { background: #0a0a0a; border: 1.5px solid #222; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; overflow: hidden; }
  .exp-title { font-size: 20px; font-weight: 700; color: #38bdf8; margin-bottom: 18px; border-bottom: 1px solid #222; padding-bottom: 12px; }
  .exp-section { margin-bottom: 20px; }
  .exp-section h4 { margin: 0 0 8px 0; font-size: 16px; color: #f8fafc; }
  .exp-section p { margin: 0; font-size: 14px; line-height: 1.7; color: #cbd5e1; }
  .callout { background: #141b2d; border-left: 4px solid #38bdf8; padding: 14px 18px; border-radius: 4px; font-size: 14px; color: #93c5fd; margin-top: 10px; }
  .code-snip { background: #000; border: 1px solid #222; padding: 14px; border-radius: 6px; font-size: 13px; color: #e2e8f0; margin-top: 8px; }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <span>🐾 CodePet AI Explanation Hub</span>
      <span style="color: #64748b;">|</span>
      <span style="font-size: 16px; color: #94a3b8;">Deep Diagnostic Analysis</span>
    </div>
    <div class="status">● AI Provider: Groq Cloud (Llama 3.3 70B) / Free Fallback</div>
  </div>

  <div class="main-view">
    <div class="side-panel">
      <div class="pet-box">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="#0f2942" stroke="#38bdf8" stroke-width="3"/>
          <circle cx="40" cy="45" r="5" fill="#38bdf8"/>
          <circle cx="60" cy="45" r="5" fill="#38bdf8"/>
          <path d="M 40 60 Q 50 68 60 60" stroke="#38bdf8" stroke-width="3" fill="none"/>
        </svg>
        <div style="font-size: 18px; font-weight: 700; color: #fff; margin-top: 10px;">Luffy Companion</div>
        <div style="font-size: 13px; color: #38bdf8; margin-top: 4px;">Status: Explaining Diagnostics</div>
      </div>

      <div class="query-box">
        <strong>Context Inspected:</strong><br>
        File: <code>math_utils.py</code><br>
        Function: <code>calculate_average()</code><br>
        Line: <code>4</code><br>
        Diagnostic: <code>ZeroDivisionError: division by zero</code>
      </div>

      <div style="margin-top: auto; border-top: 1px solid #222; padding-top: 16px;">
        <button style="width: 100%; background: #2563eb; color: #fff; border: none; padding: 12px; border-radius: 6px; font-family: inherit; font-weight: 700; cursor: pointer;">
          🔧 Propose Verified Fix Now
        </button>
      </div>
    </div>

    <div class="explain-container">
      <div class="exp-title">💡 Diagnostic Explanation & Root Cause Analysis</div>
      
      <div class="exp-section">
        <h4>1. What Went Wrong?</h4>
        <p>In Python, the division operator (<code>/</code>) raises a <code>ZeroDivisionError</code> whenever the denominator is mathematically zero. In line 4, the expression <code>total / len(numbers)</code> evaluates <code>len(numbers)</code> as <code>0</code> when an empty list <code>[]</code> is provided.</p>
        <div class="callout">
          <strong>Key Insight:</strong> Mathematically, 0/0 is undefined. Without an explicit guard condition, the application crashes immediately upon receiving an empty dataset.
        </div>
      </div>

      <div class="exp-section">
        <h4>2. Runtime Trace Inspection</h4>
        <div class="code-snip">
          Traceback (most recent call last):<br>
          &nbsp;&nbsp;File "math_utils.py", line 9, in run_metrics<br>
          &nbsp;&nbsp;&nbsp;&nbsp;result = calculate_average(sample_data)&nbsp;&nbsp;# sample_data = []<br>
          &nbsp;&nbsp;File "math_utils.py", line 4, in calculate_average<br>
          &nbsp;&nbsp;&nbsp;&nbsp;average = total / len(numbers)<br>
          ZeroDivisionError: division by zero
        </div>
      </div>

      <div class="exp-section">
        <h4>3. Recommended Defensive Guard Solution</h4>
        <p>Introduce an early return guard check before computing the division:</p>
        <div class="code-snip" style="border-left: 3px solid #10b981;">
          <span style="color: #10b981;"># Defensive guard check</span><br>
          <span style="color: #f43f5e;">if not</span> numbers:<br>
          &nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #f43f5e;">return</span> <span style="color: #fbbf24;">0.0</span>&nbsp;&nbsp;<span style="color: #64748b;"># or raise a documented ValueError</span><br>
          <span style="color: #f43f5e;">return</span> sum(numbers) / len(numbers)
        </div>
      </div>

    </div>
  </div>
</body>
</html>
"""
with open("screenshots/fig7_5.html", "w") as f:
    f.write(html_7_5)

# ==========================================
# 9. Figure 7.6: Improve Code / Propose Fix (1894 x 1027)
# ==========================================
html_7_6 = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 30px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #000000; color: #f0f0f0; box-sizing: border-box; width: 1894px; height: 1027px; }
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #222; padding-bottom: 18px; margin-bottom: 24px; }
  .brand { display: flex; align-items: center; gap: 14px; font-size: 22px; font-weight: 700; color: #ffffff; }
  .status { background: #064e3b; border: 1px solid #10b981; color: #34d399; padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 700; }
  .main-box { display: grid; grid-template-columns: 460px 1fr; gap: 30px; height: 860px; }
  .side-panel { background: #0a0a0a; border: 1.5px solid #222; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; }
  .diff-view { background: #0a0a0a; border: 1.5px solid #222; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; }
  .diff-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; padding-bottom: 14px; margin-bottom: 18px; }
  .diff-title { font-size: 16px; font-weight: 700; color: #10b981; }
  .diff-content { background: #000; border: 1px solid #1a1a1a; border-radius: 8px; padding: 24px; font-size: 15px; line-height: 1.8; color: #cbd5e1; flex: 1; }
  .diff-del { background: rgba(239, 68, 68, 0.2); color: #fca5a5; display: block; padding: 2px 10px; border-left: 4px solid #ef4444; }
  .diff-add { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; display: block; padding: 2px 10px; border-left: 4px solid #10b981; }
  .btn-apply { background: #059669; color: #fff; border: none; border-radius: 8px; padding: 14px; font-family: inherit; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <span>🐾 CodePet 1-Click Code Correction Hub</span>
      <span style="color: #64748b;">|</span>
      <span style="font-size: 16px; color: #94a3b8;">Automated AST Diff Repair</span>
    </div>
    <div class="status">✓ Fix Synthesized & Verified</div>
  </div>

  <div class="main-box">
    <div class="side-panel">
      <div style="text-align: center; border-bottom: 1px solid #222; padding-bottom: 20px; margin-bottom: 20px;">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="#06321f" stroke="#10b981" stroke-width="3"/>
          <circle cx="40" cy="45" r="5" fill="#10b981"/>
          <circle cx="60" cy="45" r="5" fill="#10b981"/>
          <path d="M 38 58 Q 50 72 62 58" stroke="#10b981" stroke-width="3.5" fill="none"/>
        </svg>
        <div style="font-size: 18px; font-weight: 700; color: #fff; margin-top: 10px;">Luffy Companion</div>
        <div style="font-size: 13px; color: #10b981; margin-top: 4px;">Status: Celebrating · Fix Verified</div>
      </div>

      <div style="background: #111; border: 1px solid #262626; border-radius: 8px; padding: 16px; font-size: 13px; line-height: 1.6; color: #94a3b8;">
        <strong>Correction Summary:</strong><br>
        • Added safety check for empty list.<br>
        • Returns <code>0.0</code> immediately if empty.<br>
        • Avoids division by zero crash.<br>
        • Atomic replacement with full VS Code Undo support.
      </div>

      <div style="margin-top: auto;">
        <button class="btn-apply">
          <span>✓</span> Apply 1-Click Fix to math_utils.py
        </button>
      </div>
    </div>

    <div class="diff-view">
      <div class="diff-header">
        <div class="diff-title">Diff Preview: math_utils.py (Lines 3-5)</div>
        <div style="font-size: 13px; color: #64748b;">Unified Diff Format</div>
      </div>
      <div class="diff-content">
&nbsp;&nbsp;<span style="color: #64748b;">def calculate_average(numbers):</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #64748b;">&quot;&quot;&quot;Return the average of numbers in list.&quot;&quot;&quot;</span><br>
<span class="diff-del">-&nbsp;&nbsp;&nbsp;total = sum(numbers)</span><br>
<span class="diff-del">-&nbsp;&nbsp;&nbsp;average = total / len(numbers)</span><br>
<span class="diff-del">-&nbsp;&nbsp;&nbsp;return average</span><br>
<span class="diff-add">+&nbsp;&nbsp;&nbsp;if not numbers:</span><br>
<span class="diff-add">+&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return 0.0</span><br>
<span class="diff-add">+&nbsp;&nbsp;&nbsp;return sum(numbers) / len(numbers)</span><br>
<br>
&nbsp;&nbsp;<span style="color: #64748b;">def run_metrics():</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #64748b;">sample_data = []</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #64748b;">print("Calculating sample metrics...")</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #64748b;">result = calculate_average(sample_data)</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #64748b;">print(f"Result: {result}")</span>
      </div>
    </div>
  </div>
</body>
</html>
"""
with open("screenshots/fig7_6.html", "w") as f:
    f.write(html_7_6)

print("All HTML templates written successfully.")

# Target definitions: (html_file, output_image_name, width, height)
TARGETS = [
    ("screenshots/fig6_1.html", "screenshots/image2.png", 2177, 1077),
    ("screenshots/fig6_2.html", "screenshots/image3.png", 1737, 1512),
    ("screenshots/fig6_3.html", "screenshots/image4.png", 1957, 1077),
    ("screenshots/fig6_4.html", "screenshots/image5.png", 1957, 1297),
    ("screenshots/fig7_1.html", "screenshots/image6.png", 2177, 1251),
    # For image7.png (Fig 7.2 Main Web Interface), we use the live screenshot from localhost:5173
    ("screenshots/fig7_3.html", "screenshots/image8.png", 1869, 1030),
    ("screenshots/fig7_4.html", "screenshots/image9.png", 1857, 990),
    ("screenshots/fig7_5.html", "screenshots/image10.png", 1902, 1069),
    ("screenshots/fig7_6.html", "screenshots/image11.png", 1894, 1027),
]

for html_file, out_png, width, height in TARGETS:
    capture_html(html_file, out_png, width, height)

# Also copy live screenshot to screenshots/image7.png with exact size 1903x1047
im7 = Image.open("screenshots/fig7_2_main_interface.png")
if im7.size != (1903, 1047):
    im7 = im7.resize((1903, 1047), Image.Resampling.LANCZOS)
im7.save("screenshots/image7.png")
print("Saved screenshots/image7.png at 1903x1047")
