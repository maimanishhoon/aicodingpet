# CodePet AI 🐾

Professional, developer-first 3D coding companion for VS Code. Features animated **3D Hovering Pet Avatars**, **Permission-First multi-language code scanning**, and built-in integration with all leading **free AI models**.

---

## ✨ What's New & Upgraded

### 1. 3D Hovering Screen Companion (No Emojis, Ultra Professional)
- Replaced old emojis with **Isometric 3D Hovering Pet Models**:
  - **🐶 3D Cyber Pup**: Isometric hound with faceted ears, glowing cyber collar, and 3D tail.
  - **🐱 3D Pixel Neko**: Isometric cat with faceted 3D ears, whisker lights, and curling 3D tail.
  - **🤖 3D Mecha Bot**: Floating 3D drone with hovering thruster rings and glowing visor.
  - **🦖 3D Dev Dino**: Isometric dinosaur with back ridges and wagging tail.
  - **🦊 3D Glitch Fox**: Sleek isometric fox with layered geometric depth.
- **3D Physics & Floating Motion**:
  - Floats smoothly on the screen with dynamic ambient occlusion and a 3D ground drop-shadow that contracts and expands as the pet hovers.
  - Sits permanently in the **bottom-right corner** of the screen and status bar.

### 2. Permission-First Code Scanning & Correction
- **Explicit Consent**: Before inspecting your code, CodePet asks:
  > `🐾 [Pet Name]: "Hi! Would you like me to scan your code for errors across all languages and help correct them?"`
  - **`[✅ Yes, scan & correct my code]`**: Scanning is enabled across all files.
  - **`[❌ No, do not scan]`**: CodePet stays in standby mode and will **NEVER** scan, inspect, or modify your code without your permission.
- You can also grant or revoke permission anytime directly from the **Code Scanning Permission** control card in the assistant.

### 3. Scans Every Programming Language
CodePet is no longer limited to Swift or JavaScript. It actively monitors errors and warnings across **all programming languages**:
- Python, JavaScript, TypeScript, C, C++, C#, Java, Go, Rust, PHP, Ruby, Swift, Kotlin, Dart, HTML, CSS, SQL, Shell/Bash, JSON, YAML, etc.
- When an error is introduced, your 3D pet raises an alert in the bottom-right corner and pops up an interactive dialogue.

### 4. Interactive Popping Dialogue & 1-Click Fix
When an error is detected in your code:
- Your 3D pet alerts you: `🐾 [Name]: [language] Line X: <Error Message>`
- Action buttons:
  - **`💡 Explain with AI`**: Instant beginner-friendly explanation of why it failed.
  - **`🔧 Propose Fix`**: Proposes a verified narrow code replacement with 1-click diff review and full VS Code Undo protection.
  - **`Open Assistant`**: Full companion HUD and AI settings.
  - **`Mute (10m)`**: Snoozes notifications.

### 5. Color Picker Removed & Instant Name Persistence
- The unstyled color box has been completely removed.
- Renaming your pet immediately updates all UI headers, speech bubbles, and status badges in real time.

### 6. Free AI Models & Step-by-Step API Setup Hub
Includes 1-click links and setup guides for all top free and open providers:
- **Google Gemini** (15 RPM / 1M TPM Free Forever, No Credit Card)
- **Groq Cloud** (100% Free Forever, 500+ tok/s)
- **SiliconFlow (硅基流动)** (Free DeepSeek-V3, DeepSeek-R1, Qwen 2.5 Coder Cloud)
- **DeepSeek Official** (`deepseek-chat`, `deepseek-reasoner`)
- **Alibaba Qwen (通义千问)** (1M-2M Free Tokens)
- **Zhipu AI (智谱清言)** (`glm-4-flash` 100% Free Public Model)
- **Moonshot AI (Kimi)** (Free initial credits)
- **Ollama (Local)** (100% Free Offline, 0 API Keys)
- **OpenAI / ChatGPT** (`gpt-4o-mini`)

---

## 🚀 How to Install and Run in VS Code

### Option A: Install the New VSIX into Your VS Code (Fastest)
1. In your VS Code, press **`Cmd + Shift + P`** (Mac) or **`Ctrl + Shift + P`** (Windows/Linux).
2. Type and select: **`Extensions: Install from VSIX...`**
3. Select the freshly built package:
   ```
   apps/vscode-extension/codepet-ai-0.1.0.vsix
   ```
4. Click **Reload Window** (or restart VS Code).
5. Look at the **bottom-right corner**: your 3D Pet is now active and will ask you for scanning permission!

### Option B: Run in Extension Development Host (Press F5)
1. Open this repository in VS Code.
2. Press **`F5`** (or go to **Run and Debug** and click **Run CodePet Extension**).
3. A new development window will open with the latest 3D companion running.
