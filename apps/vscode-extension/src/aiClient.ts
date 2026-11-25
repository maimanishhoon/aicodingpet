import * as vscode from "vscode";

export type AiProviderType =
  | "gemini"
  | "groq"
  | "siliconflow"
  | "deepseek"
  | "qwen"
  | "zhipu"
  | "moonshot"
  | "ollama"
  | "openai"
  | "backend";

export interface ProviderGuide {
  id: AiProviderType;
  name: string;
  badge: string;
  isFree: boolean;
  freeTierNote: string;
  portalUrl: string;
  defaultModel: string;
  suggestedModels: string[];
  requiresApiKey: boolean;
  steps: string[];
}

export const PROVIDER_GUIDES: Record<AiProviderType, ProviderGuide> = {
  groq: {
    id: "groq",
    name: "Groq Cloud (Llama 3.1 & 3.3)",
    badge: "100% Free Forever (500+ tok/s)",
    isFree: true,
    freeTierNote: "100% Free Tier with ultra-fast inference speeds. Generous free daily request allowances.",
    portalUrl: "https://console.groq.com/keys",
    defaultModel: "llama-3.1-8b-instant",
    suggestedModels: [
      "llama-3.1-8b-instant",
      "llama-3.3-70b-versatile",
      "llama3-70b-8192",
      "llama3-8b-8192",
      "mixtral-8x7b-32768",
      "gemma2-9b-it"
    ],
    requiresApiKey: true,
    steps: [
      "Open Groq Console at https://console.groq.com/keys",
      "Sign up or log in using GitHub or Google.",
      "Click 'Create API Key', name it 'CodePet', and submit.",
      "Copy the API key (starts with 'gsk_') and paste it below.",
      "Click 'Test & Save Connection'."
    ]
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    badge: "Free Tier (15 RPM / 1M TPM)",
    isFree: true,
    freeTierNote: "Free forever tier available. 15 requests per minute, 1M tokens/min. No credit card required.",
    portalUrl: "https://aistudio.google.com/app/apikey",
    defaultModel: "gemini-1.5-flash",
    suggestedModels: ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro"],
    requiresApiKey: true,
    steps: [
      "Open Google AI Studio at https://aistudio.google.com/app/apikey",
      "Sign in with your Google account.",
      "Click '+ Create API key' (100% free, no billing setup required).",
      "Copy your key and paste it into the CodePet API Key field below.",
      "Click 'Test & Save Connection'."
    ]
  },
  siliconflow: {
    id: "siliconflow",
    name: "SiliconFlow (硅基流动 Free Cloud)",
    badge: "Free Chinese & Open Models",
    isFree: true,
    freeTierNote: "Provides 100% free public access to DeepSeek V3/R1, Qwen 2.5 Coder, and GLM-4 without credit card.",
    portalUrl: "https://cloud.siliconflow.cn/account/ak",
    defaultModel: "deepseek-ai/DeepSeek-V3",
    suggestedModels: [
      "deepseek-ai/DeepSeek-V3",
      "deepseek-ai/DeepSeek-R1",
      "Qwen/Qwen2.5-Coder-7B-Instruct",
      "Qwen/Qwen2.5-7B-Instruct",
      "THUDM/glm-4-9b-chat"
    ],
    requiresApiKey: true,
    steps: [
      "Go to SiliconFlow Cloud: https://cloud.siliconflow.cn/account/ak",
      "Sign up with your email or phone (receives 14M-20M free tokens on sign up + permanent free model tier).",
      "Click 'API 密钥 / API Keys' in the sidebar.",
      "Click '新建 API 密钥 / Create API Key' and copy it.",
      "Paste into CodePet below and select your free model (e.g. DeepSeek-V3 or Qwen2.5-Coder)."
    ]
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek Official",
    badge: "Free Credits / Ultra Low Cost",
    isFree: true,
    freeTierNote: "New signups receive free trial balance. Industry-leading coding benchmark.",
    portalUrl: "https://platform.deepseek.com/api_keys",
    defaultModel: "deepseek-chat",
    suggestedModels: ["deepseek-chat", "deepseek-reasoner"],
    requiresApiKey: true,
    steps: [
      "Open DeepSeek Platform: https://platform.deepseek.com/api_keys",
      "Sign up with email or phone number.",
      "Go to 'API Keys' and click 'Create API Key'.",
      "Copy your key (starts with 'sk-') and paste it below."
    ]
  },
  qwen: {
    id: "qwen",
    name: "Alibaba Qwen (通义千问 / 阿里云百炼)",
    badge: "1M Free Tokens",
    isFree: true,
    freeTierNote: "1,000,000 to 2,000,000 free tokens provided on Model Studio / Bailian activation.",
    portalUrl: "https://bailian.console.aliyun.com/",
    defaultModel: "qwen-plus",
    suggestedModels: ["qwen-plus", "qwen-turbo", "qwen2.5-coder-7b-instruct", "qwen-max"],
    requiresApiKey: true,
    steps: [
      "Visit Alibaba Cloud Bailian Console: https://bailian.console.aliyun.com/",
      "Sign in with your Alibaba Cloud account.",
      "Click 'API-KEY' in the top/left navigation to create a new key.",
      "Copy your key and paste it below."
    ]
  },
  zhipu: {
    id: "zhipu",
    name: "Zhipu AI GLM (智谱清言 BigModel)",
    badge: "100% Free Public Model (GLM-4-Flash)",
    isFree: true,
    freeTierNote: "GLM-4-Flash is permanently 100% free with unlimited access for all registered developers.",
    portalUrl: "https://open.bigmodel.cn/usercenter/apikeys",
    defaultModel: "glm-4-flash",
    suggestedModels: ["glm-4-flash", "glm-4"],
    requiresApiKey: true,
    steps: [
      "Go to Zhipu BigModel platform: https://open.bigmodel.cn/usercenter/apikeys",
      "Sign up or log in with your phone or email.",
      "Click '查看 API Key' (View API Key) or generate a new one.",
      "Copy the key and paste it below."
    ]
  },
  moonshot: {
    id: "moonshot",
    name: "Moonshot AI (Kimi / 月之暗面)",
    badge: "Free Credits on Signup",
    isFree: true,
    freeTierNote: "Complimentary initial token quota for developers upon registration.",
    portalUrl: "https://platform.moonshot.cn/console/api-keys",
    defaultModel: "moonshot-v1-8k",
    suggestedModels: ["moonshot-v1-8k", "moonshot-v1-32k"],
    requiresApiKey: true,
    steps: [
      "Open Moonshot Developer Console: https://platform.moonshot.cn/console/api-keys",
      "Sign up and verify your account.",
      "Create an API key in the API Keys section.",
      "Copy the key and paste it below."
    ]
  },
  ollama: {
    id: "ollama",
    name: "Ollama (Local / 100% Offline & Private)",
    badge: "100% Free & Local (0 API Keys)",
    isFree: true,
    freeTierNote: "Runs on your own machine. Zero costs, zero API keys, 100% private and offline.",
    portalUrl: "https://ollama.com",
    defaultModel: "deepseek-r1:latest",
    suggestedModels: ["deepseek-r1:latest", "qwen2.5-coder:latest", "llama3.2:latest"],
    requiresApiKey: false,
    steps: [
      "Download Ollama from https://ollama.com and run it.",
      "Open your terminal and run: ollama run deepseek-r1:8b (or ollama run qwen2.5-coder:7b)",
      "Ollama starts on http://localhost:11434.",
      "No API key needed! Simply choose Ollama and click 'Test & Save Connection'."
    ]
  },
  openai: {
    id: "openai",
    name: "OpenAI / ChatGPT",
    badge: "Industry Standard",
    isFree: false,
    freeTierNote: "Pay-as-you-go with free trial credit on qualifying developer accounts.",
    portalUrl: "https://platform.openai.com/api-keys",
    defaultModel: "gpt-4o-mini",
    suggestedModels: ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"],
    requiresApiKey: true,
    steps: [
      "Visit OpenAI API dashboard: https://platform.openai.com/api-keys",
      "Sign in with your OpenAI account.",
      "Click '+ Create new secret key'.",
      "Copy your key and paste it below."
    ]
  },
  backend: {
    id: "backend",
    name: "CodePet Local Backend",
    badge: "Self-Hosted / Proxy",
    isFree: true,
    freeTierNote: "Uses your configured local CodePet Docker/Express backend server.",
    portalUrl: "http://localhost:3001/api/v1/health",
    defaultModel: "server-managed",
    suggestedModels: ["server-managed"],
    requiresApiKey: false,
    steps: [
      "Start the CodePet local server with 'npm run dev'.",
      "The server connects automatically to http://localhost:3001."
    ]
  }
};

export interface AiExplanationResult {
  errorType: string;
  line: number;
  explanation: string;
  rootCause: string;
  suggestedFix: string;
  concept: string;
  learningTip: string;
  provider: string;
}

export interface AiFixResult {
  explanation: string;
  correctedText: string;
  confidence: number;
  safety: "SAFE_SINGLE_RANGE" | "REQUIRES_REVIEW";
  compilerVerified: boolean;
  provider: string;
}

export class AiClient {
  static getEffectiveConfig() {
    const config = vscode.workspace.getConfiguration("codepet");
    const provider = config.get<AiProviderType>("aiProvider", "groq");
    let apiKey = config.get<string>("apiKey", "").trim();

    // Check environment variables if not set in VS Code settings
    if (!apiKey) {
      if (provider === "groq" && process.env.GROQ_API_KEY) {
        apiKey = process.env.GROQ_API_KEY.trim();
      } else if (provider === "gemini" && (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)) {
        apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "").trim();
      } else if (provider === "openai" && process.env.OPENAI_API_KEY) {
        apiKey = process.env.OPENAI_API_KEY.trim();
      } else if (provider === "deepseek" && process.env.DEEPSEEK_API_KEY) {
        apiKey = process.env.DEEPSEEK_API_KEY.trim();
      } else if (provider === "siliconflow" && process.env.SILICONFLOW_API_KEY) {
        apiKey = process.env.SILICONFLOW_API_KEY.trim();
      }
    }

    const rawModel = config.get<string>("aiModel", "").trim();
    const guide = PROVIDER_GUIDES[provider];

    let model = rawModel;
    // Cross-provider model sanitize: auto-correct if settings contain a model from a different provider
    if (provider === "gemini") {
      if (!model || !model.toLowerCase().includes("gemini")) {
        model = "gemini-1.5-flash";
      }
    } else if (provider === "groq") {
      if (!model || model.toLowerCase().includes("gemini")) {
        model = "llama-3.1-8b-instant";
      }
    } else if (provider === "deepseek") {
      if (!model || !model.toLowerCase().includes("deepseek")) {
        model = "deepseek-chat";
      }
    } else if (!model) {
      model = guide?.defaultModel || "default";
    }

    const ollamaUrl = config.get<string>("ollamaBaseUrl", "http://localhost:11434").trim();
    const backendUrl = config.get<string>("apiBaseUrl", "http://localhost:3001").trim();
    const petName = config.get<string>("petName", "luffy").trim();

    return { provider, apiKey, model, ollamaUrl, backendUrl, petName };
  }

  static async testConnection(options: {
    provider: AiProviderType;
    apiKey: string;
    model?: string;
    ollamaUrl?: string;
  }): Promise<{ ok: boolean; message: string; latencyMs?: number; activeModel?: string }> {
    const { provider, apiKey, model, ollamaUrl } = options;
    const guide = PROVIDER_GUIDES[provider];
    const targetModel = model?.trim() || guide?.defaultModel || "default";
    const startTime = Date.now();

    try {
      // 1. Groq Cloud (with dynamic models auto-discovery)
      if (provider === "groq") {
        if (!apiKey) return { ok: false, message: "Groq API key is required. Get one free at console.groq.com/keys" };
        const cleanKey = apiKey.trim().replace(/^["']|["']$/g, "");

        // Step 1: Validate key against Groq's models list
        const modelsRes = await fetchWithTimeout("https://api.groq.com/openai/v1/models", {
          method: "GET",
          headers: { Authorization: `Bearer ${cleanKey}` }
        }, 8000);

        if (!modelsRes.ok) {
          const errText = await modelsRes.text();
          return { ok: false, message: `Groq key authentication failed (${modelsRes.status}): ${errText.slice(0, 140)}` };
        }

        const modelsData = (await modelsRes.json()) as any;
        const availableIds: string[] = (modelsData.data || []).map((m: any) => m.id);

        // Pick a guaranteed working model
        let modelToUse = targetModel;
        if (!availableIds.includes(modelToUse)) {
          if (availableIds.includes("llama-3.1-8b-instant")) {
            modelToUse = "llama-3.1-8b-instant";
          } else if (availableIds.includes("llama3-8b-8192")) {
            modelToUse = "llama3-8b-8192";
          } else if (availableIds.length > 0) {
            modelToUse = availableIds[0];
          }
        }

        // Step 2: Test ping completion
        const pingRes = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanKey}`
          },
          body: JSON.stringify({
            model: modelToUse,
            messages: [{ role: "user", content: "ping" }],
            max_tokens: 5
          })
        }, 8000);

        if (!pingRes.ok) {
          const errBody = await pingRes.text();
          return { ok: false, message: `Groq ping failed: ${errBody.slice(0, 140)}` };
        }

        return {
          ok: true,
          message: `Connected to Groq successfully! Active Model: ${modelToUse}`,
          latencyMs: Date.now() - startTime,
          activeModel: modelToUse
        };
      }

      // 2. Google Gemini
      if (provider === "gemini") {
        if (!apiKey) return { ok: false, message: "Gemini API key is required. Click 'Get Free API Key' to generate one." };
        const cleanKey = apiKey.trim().replace(/^["']|["']$/g, "");
        let modelToTry = targetModel && targetModel.toLowerCase().includes("gemini") ? targetModel : "gemini-1.5-flash";
        const candidateModels = [modelToTry, "gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro"];
        const uniqueModels = [...new Set(candidateModels)];

        let lastErr = "";
        for (const m of uniqueModels) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(cleanKey)}`;
            const res = await fetchWithTimeout(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": cleanKey
              },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: "ping" }] }]
              })
            }, 8000);

            if (res.ok) {
              return {
                ok: true,
                message: `Connected to Google Gemini successfully! Active Model: ${m}`,
                latencyMs: Date.now() - startTime,
                activeModel: m
              };
            }
            const errBody = await res.text();
            let errMsg = errBody;
            try {
              const p = JSON.parse(errBody);
              errMsg = p.error?.message || errBody;
            } catch {}
            lastErr = `${m} (${res.status}): ${errMsg.slice(0, 150)}`;
          } catch (e: any) {
            lastErr = e instanceof Error ? e.message : String(e);
          }
        }
        return { ok: false, message: `Gemini authentication failed: ${lastErr}` };
      }

      // 3. Ollama (Local)
      if (provider === "ollama") {
        const baseUrl = (ollamaUrl || "http://localhost:11434").replace(/\/+$/, "");
        const res = await fetchWithTimeout(`${baseUrl}/api/tags`, { method: "GET" }, 4000);
        if (!res.ok) return { ok: false, message: `Ollama returned HTTP ${res.status}. Is Ollama running on ${baseUrl}?` };
        return { ok: true, message: `Connected to local Ollama successfully!`, latencyMs: Date.now() - startTime };
      }

      // 4. Other OpenAI-Compatible Endpoints
      const endpointMap: Record<string, string> = {
        siliconflow: "https://api.siliconflow.cn/v1",
        deepseek: "https://api.deepseek.com",
        qwen: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        zhipu: "https://open.bigmodel.cn/api/paas/v4",
        moonshot: "https://api.moonshot.cn/v1",
        openai: "https://api.openai.com/v1"
      };

      const base = endpointMap[provider];
      if (base) {
        if (!apiKey) return { ok: false, message: `${guide.name} API key is required.` };
        const cleanKey = apiKey.trim().replace(/^["']|["']$/g, "");
        const res = await fetchWithTimeout(`${base}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanKey}`
          },
          body: JSON.stringify({
            model: targetModel,
            messages: [{ role: "user", content: "ping" }],
            max_tokens: 5
          })
        }, 10000);

        if (!res.ok) {
          const text = await res.text();
          return { ok: false, message: `${guide.name} returned HTTP ${res.status}: ${text.slice(0, 160)}` };
        }
        return { ok: true, message: `Connected to ${guide.name} (${targetModel}) successfully!`, latencyMs: Date.now() - startTime };
      }

      if (provider === "backend") {
        const res = await fetchWithTimeout("http://localhost:3001/api/v1/health", { method: "GET" }, 4000);
        if (!res.ok) return { ok: false, message: "Local backend is unreachable. Start it with 'npm run dev'." };
        return { ok: true, message: "Connected to CodePet local backend!", latencyMs: Date.now() - startTime };
      }

      return { ok: false, message: `Unknown provider: ${provider}` };
    } catch (e) {
      return { ok: false, message: e instanceof Error ? e.message : "Connection failed. Please check network/proxy." };
    }
  }

  static async explainDiagnostic(params: {
    code: string;
    language: string;
    diagnosticMessage: string;
    line: number;
    column: number;
  }): Promise<AiExplanationResult> {
    const config = this.getEffectiveConfig();

    if (config.apiKey || config.provider === "ollama" || config.provider === "backend") {
      try {
        const systemPrompt = `You are ${config.petName}, a friendly code tutor. Explain the coding error warmly and concisely. Return valid JSON only with keys:
{
  "errorType": "string (e.g. SyntaxError, TypeError, ReferenceError)",
  "explanation": "clear, friendly explanation in 1-2 sentences",
  "rootCause": "why this happened in ${params.language}",
  "suggestedFix": "short code or action to fix it",
  "concept": "relevant programming concept",
  "learningTip": "one practical tip for next time"
}`;

        const userPrompt = `Language: ${params.language}\nLine ${params.line}, Column ${params.column}\nCompiler/Diagnostic: ${params.diagnosticMessage}\n\nCode snippet:\n\`\`\`${params.language}\n${params.code}\n\`\`\``;

        const raw = await this.callAiCompletion(config, systemPrompt, userPrompt);
        const parsed = JSON.parse(extractJson(raw)) as Record<string, string>;
        return {
          errorType: parsed.errorType || "Diagnostic Alert",
          line: params.line,
          explanation: parsed.explanation || raw.slice(0, 200),
          rootCause: parsed.rootCause || params.diagnosticMessage,
          suggestedFix: parsed.suggestedFix || "Review highlighted line.",
          concept: parsed.concept || `${params.language} Syntax & Semantics`,
          learningTip: parsed.learningTip || "Keep coding! You'll master this in no time.",
          provider: config.provider
        };
      } catch {
        // Fallback gracefully to offline analyzer
      }
    }

    return this.generateOfflineExplanation(params);
  }

  static async fixDiagnostic(params: {
    code: string;
    language: string;
    diagnosticMessage: string;
    line: number;
    column: number;
    originalText: string;
  }): Promise<AiFixResult> {
    const config = this.getEffectiveConfig();
    const hasAiAuth = Boolean(config.apiKey) || config.provider === "ollama";

    if (hasAiAuth) {
      try {
        const systemPrompt = `You are ${config.petName}, an expert coding AI companion that fixes code errors.
Your task is to fix the problematic line of code accurately based on the compiler diagnostic and context.
You MUST output your response in valid JSON with this exact format:
{
  "explanation": "concise explanation of what was fixed",
  "correctedText": "the exact fixed replacement line of code"
}
Output ONLY the JSON object. Do not include markdown code blocks or conversational text outside the JSON.`;

        const userPrompt = `Language: ${params.language}
Diagnostic/Error: ${params.diagnosticMessage}
Target Line Number: ${params.line}
Original Problematic Line:
${params.originalText}

Surrounding Code Context:
\`\`\`${params.language}
${params.code}
\`\`\`

Return only the JSON object with "explanation" and "correctedText" to replace the original line.`;

        const raw = await this.callAiCompletion(config, systemPrompt, userPrompt);
        const parsedResult = parseAiFixResponse(raw, params.originalText);
        if (parsedResult && parsedResult.correctedText.trim() !== params.originalText.trim()) {
          return {
            explanation: parsedResult.explanation || `Applied automated correction on line ${params.line}`,
            correctedText: parsedResult.correctedText,
            confidence: 0.95,
            safety: "SAFE_SINGLE_RANGE",
            compilerVerified: false,
            provider: config.provider
          };
        }
      } catch (err) {
        console.warn(`[CodePet] AI completion failed (${config.provider}):`, err);
        // Try offline fallback first
        const offline = this.generateOfflineFix(params);
        if (offline.correctedText && offline.correctedText.trim() !== params.originalText.trim()) {
          return offline;
        }
        throw err;
      }
    }

    // Attempt offline heuristic fix
    const offlineResult = this.generateOfflineFix(params);
    if (offlineResult.correctedText && offlineResult.correctedText.trim() !== params.originalText.trim()) {
      return offlineResult;
    }

    if (!hasAiAuth && config.provider !== "backend") {
      throw new Error(`API_KEY_REQUIRED:${config.provider}`);
    }

    return offlineResult;
  }

  static detectPromptLanguage(prompt: string, fallbackLang?: string): string {
    const p = prompt.toLowerCase();
    if (/\b(python|py)\b/.test(p)) return "python";
    if (/\b(typescript|ts)\b/.test(p)) return "typescript";
    if (/\b(javascript|js|node|express)\b/.test(p)) return "javascript";
    if (/\b(html)\b/.test(p)) return "html";
    if (/\b(css|scss|tailwind)\b/.test(p)) return "css";
    if (/\b(sql|postgres|mysql)\b/.test(p)) return "sql";
    if (/\b(rust|rs)\b/.test(p)) return "rust";
    if (/\b(go|golang)\b/.test(p)) return "go";
    if (/\b(java)\b/.test(p)) return "java";
    if (/\b(c\+\+|cpp)\b/.test(p)) return "cpp";
    if (/\b(c#|csharp)\b/.test(p)) return "csharp";
    if (/\b(php)\b/.test(p)) return "php";
    if (/\b(bash|sh|shell)\b/.test(p)) return "bash";
    if (/\b(json)\b/.test(p)) return "json";
    return fallbackLang || "typescript";
  }

  private static extractCleanCode(raw: string, defaultLang: string): { code: string; language: string } {
    const trimmed = raw.trim();
    // Look for standard markdown code fence: ```language\n...```
    const fenceMatch = trimmed.match(/```([a-zA-Z0-9_#-]*)\r?\n([\s\S]*?)```/);
    if (fenceMatch) {
      const codeLang = fenceMatch[1]?.trim() || defaultLang;
      return { code: fenceMatch[2].trim(), language: codeLang };
    }
    // Remove standalone fences if any
    const clean = trimmed
      .replace(/^```[a-zA-Z0-9_#-]*\r?\n?/, "")
      .replace(/\r?\n?```$/, "")
      .trim();
    return { code: clean, language: defaultLang };
  }

  static generateOfflineCode(prompt: string, language: string): { code: string; language: string } | null {
    const p = prompt.toLowerCase();
    const lang = language.toLowerCase();

    // 1. Debounce
    if (p.includes("debounce")) {
      if (lang === "python") {
        return {
          language: "python",
          code: `import time
from functools import wraps

def debounce(wait_seconds: float):
    """Decorator that delays execution of a function until wait_seconds have elapsed."""
    def decorator(fn):
        last_called = 0.0
        @wraps(fn)
        def wrapper(*args, **kwargs):
            nonlocal last_called
            now = time.time()
            if now - last_called >= wait_seconds:
                last_called = now
                return fn(*args, **kwargs)
        return wrapper
    return decorator`
        };
      }
      return {
        language: lang === "javascript" ? "javascript" : "typescript",
        code: `/**
 * Creates a debounced function that delays invoking fn until after wait ms
 * have elapsed since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}`
      };
    }

    // 2. Throttle
    if (p.includes("throttle")) {
      return {
        language: lang === "javascript" ? "javascript" : "typescript",
        code: `/**
 * Creates a throttled function that only invokes fn at most once per every wait ms.
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
  };
}`
      };
    }

    // 3. Binary Search
    if (p.includes("binary search") || p.includes("binarysearch")) {
      if (lang === "python") {
        return {
          language: "python",
          code: `def binary_search(arr: list, target) -> int:
    """Returns the index of target in sorted arr, or -1 if not found."""
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
        };
      }
      return {
        language: lang === "javascript" ? "javascript" : "typescript",
        code: `/**
 * Binary search implementation on a sorted array.
 * Returns the index of target, or -1 if not found.
 */
export function binarySearch<T>(arr: T[], target: T): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}`
      };
    }

    // 4. QuickSort / Sorting
    if (p.includes("quicksort") || p.includes("quick sort")) {
      return {
        language: lang === "python" ? "python" : (lang === "javascript" ? "javascript" : "typescript"),
        code: lang === "python"
          ? `def quicksort(arr: list) -> list:
    """Quicksort implementation in Python."""
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`
          : `/**
 * Quicksort implementation in TypeScript.
 */
export function quickSort<T>(arr: T[]): T[] {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), ...middle, ...quickSort(right)];
}`
      };
    }

    // 5. Express Router / Server
    if (p.includes("express") || p.includes("router") || p.includes("api endpoint")) {
      return {
        language: "typescript",
        code: `import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

// GET all items
router.get("/items", async (req: Request, res: Response) => {
  try {
    res.json({ success: true, items: [] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST new item
router.post("/items", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    res.status(201).json({ success: true, created: body });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;`
      };
    }

    // 6. Fetch / API Request
    if (p.includes("fetch") || p.includes("api request") || p.includes("http request") || p.includes("axios")) {
      return {
        language: "typescript",
        code: `/**
 * Reusable HTTP fetch helper with error handling.
 */
export async function requestJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(\`Request failed with status \${response.status}: \${response.statusText}\`);
  }

  return response.json() as Promise<T>;
}`
      };
    }

    // 7. React Component / Counter / Hook
    if (p.includes("react") || p.includes("counter") || p.includes("hook") || p.includes("component")) {
      return {
        language: "typescript",
        code: `import React, { useState, useEffect } from "react";

interface CounterProps {
  initialValue?: number;
  step?: number;
}

export const Counter: React.FC<CounterProps> = ({ initialValue = 0, step = 1 }) => {
  const [count, setCount] = useState<number>(initialValue);

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <button onClick={() => setCount(prev => prev - step)}>-{step}</button>
      <span style={{ fontWeight: "bold" }}>Count: {count}</span>
      <button onClick={() => setCount(prev => prev + step)}>+{step}</button>
      <button onClick={() => setCount(initialValue)}>Reset</button>
    </div>
  );
};`
      };
    }

    // 8. Fibonacci
    if (p.includes("fibonacci")) {
      return {
        language: lang === "python" ? "python" : (lang === "javascript" ? "javascript" : "typescript"),
        code: lang === "python"
          ? `def fibonacci(n: int) -> int:
    """Returns the n-th Fibonacci number."""
    if n <= 0:
        return 0
    if n == 1:
        return 1
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr`
          : `/**
 * Computes the n-th Fibonacci number (O(n) time, O(1) space).
 */
export function fibonacci(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}`
      };
    }

    // 9. Deep Clone
    if (p.includes("deep clone") || p.includes("deepclone") || p.includes("clone object")) {
      return {
        language: "typescript",
        code: `/**
 * Creates a deep clone of any object or array.
 */
export function deepClone<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Date) return new Date(value.getTime()) as any;
  if (Array.isArray(value)) return value.map(item => deepClone(item)) as any;

  const copy = {} as Record<string, any>;
  for (const key of Object.keys(value as any)) {
    copy[key] = deepClone((value as any)[key]);
  }
  return copy as T;
}`
      };
    }

    // 10. Sleep / Delay
    if (p.includes("sleep") || p.includes("delay")) {
      return {
        language: lang === "python" ? "python" : "typescript",
        code: lang === "python"
          ? `import time

def sleep_ms(milliseconds: int):
    """Sleeps for the specified number of milliseconds."""
    time.sleep(milliseconds / 1000.0)`
          : `/**
 * Promise-based delay helper.
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));`
      };
    }

    // 11. General clean template for any other prompt
    const cleanFnName = p.replace(/[^a-zA-Z0-9]/g, " ").trim().split(/\s+/).slice(0, 3).map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join("") || "solution";
    return {
      language: lang,
      code: lang === "python"
        ? `# Implementation for: ${prompt}
def ${cleanFnName}(*args, **kwargs):
    """
    Auto-generated function for: ${prompt}
    """
    # TODO: Add specific business logic
    print("Executing ${cleanFnName}")
    return {"status": "success", "args": args}`
        : `/**
 * Implementation for: ${prompt}
 */
export function ${cleanFnName}(...args: any[]) {
  // TODO: Add specific business logic
  console.log("Executing ${cleanFnName}:", args);
  return { status: "success", timestamp: Date.now() };
}`
    };
  }

  private static async callFreeCloudAi(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      const res = await fetchWithTimeout("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          model: "openai",
          code: true
        })
      }, 15000);

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim()) return text;
      }
    } catch (e) {
      console.warn("[CodePet] Free Cloud AI POST error:", e);
    }

    // Secondary attempt with prompt in URL
    const query = encodeURIComponent(`${systemPrompt}\n\nTask: ${userPrompt}`);
    const resGet = await fetchWithTimeout(`https://text.pollinations.ai/${query}?model=openai`, {
      method: "GET"
    }, 15000);

    if (!resGet.ok) throw new Error(`Free AI request failed with status ${resGet.status}`);
    const textGet = await resGet.text();
    if (!textGet || !textGet.trim()) throw new Error("Free AI returned empty content");
    return textGet;
  }

  static async generateCode(params: {
    prompt: string;
    language?: string;
    currentCode?: string;
  }): Promise<{ code: string; explanation: string; language: string; provider: string }> {
    const config = this.getEffectiveConfig();
    const detectedLang = this.detectPromptLanguage(params.prompt, params.language);
    const hasKey = Boolean(config.apiKey) || config.provider === "ollama" || config.provider === "backend";

    const systemPrompt = `You are ${config.petName}, an expert coding AI companion.
Generate clean, production-ready ${detectedLang} code that directly fulfills the prompt.
Output ONLY the code inside a markdown code fence like \`\`\`${detectedLang} ... \`\`\` without conversational filler.`;

    const userPrompt = `Target Language: ${detectedLang}\nPrompt: ${params.prompt}\n` +
      (params.currentCode ? `Current file context:\n${params.currentCode.slice(0, 1500)}` : "");

    // 1. If user configured an API key or local Ollama, call their chosen provider first
    if (hasKey) {
      try {
        const raw = await this.callAiCompletion(config, systemPrompt, userPrompt);
        const extracted = this.extractCleanCode(raw, detectedLang);
        return {
          code: extracted.code,
          language: extracted.language || detectedLang,
          explanation: `Generated with ${config.provider.toUpperCase()} AI`,
          provider: `${config.provider.toUpperCase()} AI`
        };
      } catch (aiErr: any) {
        console.warn("[CodePet] Configured AI provider failed, falling back to free cloud AI:", aiErr);
      }
    }

    // 2. Free Cloud AI (Zero setup, works immediately for any prompt)
    try {
      const freeAiRaw = await this.callFreeCloudAi(systemPrompt, userPrompt);
      if (freeAiRaw && freeAiRaw.trim()) {
        const extracted = this.extractCleanCode(freeAiRaw, detectedLang);
        return {
          code: extracted.code,
          language: extracted.language || detectedLang,
          explanation: `Generated with CodePet AI`,
          provider: hasKey ? `${config.provider.toUpperCase()} (Cloud AI)` : "CodePet AI"
        };
      }
    } catch (freeErr: any) {
      console.warn("[CodePet] Free cloud AI failed, falling back to offline engine:", freeErr);
    }

    // 3. Offline template generator fallback (when network is completely unavailable)
    const offline = this.generateOfflineCode(params.prompt, detectedLang);
    if (offline) {
      return {
        code: offline.code,
        language: offline.language,
        explanation: `Generated offline template. Connect to the internet or configure an API key in Settings for full generative AI.`,
        provider: "CodePet Offline Engine"
      };
    }

    throw new Error("Unable to generate code. Please check your internet connection or enter an API key in Settings.");
  }

  private static generateOfflineExplanation(params: {
    code: string;
    language: string;
    diagnosticMessage: string;
    line: number;
    column: number;
  }): AiExplanationResult {
    const msg = params.diagnosticMessage.toLowerCase();
    let errorType = "Syntax Alert";
    let explanation = `There is an issue on line ${params.line} in your ${params.language} code.`;
    let rootCause = params.diagnosticMessage;
    let suggestedFix = "Review the highlighted code range and check syntax.";
    let concept = "Code Correctness";
    let learningTip = "Double-check brackets, declarations, and punctuation.";

    if (msg.includes("cannot find name") || msg.includes("is not defined") || msg.includes("undeclared")) {
      const match = params.diagnosticMessage.match(/['"]([^'"]+)['"]/);
      const varName = match ? match[1] : "variable";
      errorType = "Reference / Identifier Error";
      explanation = `The identifier '${varName}' is used on line ${params.line} before it was defined or imported.`;
      rootCause = `The compiler cannot find any declaration or import matching '${varName}' in the current scope.`;
      suggestedFix = `Declare '${varName}' using 'let / const / var' or import it from the required module.`;
      concept = "Variable Scope & Declarations";
      learningTip = "Always declare variables before using them.";
    } else if (msg.includes("unexpected token") || msg.includes("expected") || msg.includes("syntaxerror")) {
      errorType = "Syntax Error";
      explanation = `The compiler encountered unexpected syntax near line ${params.line}.`;
      rootCause = `Missing or mismatched punctuation such as a semicolon, bracket, or quotation mark.`;
      suggestedFix = "Check for unclosed parentheses '()', braces '{}', or missing commas.";
      concept = "Language Grammar & Punctuation";
      learningTip = "Modern editors highlight matching bracket pairs to help avoid syntax bugs.";
    } else if (msg.includes("not assignable to") || msg.includes("type mismatch")) {
      errorType = "Type Mismatch Error";
      explanation = `A value of an incompatible type is being assigned on line ${params.line}.`;
      rootCause = params.diagnosticMessage;
      suggestedFix = "Convert or cast the value to the expected type, or update the variable type definition.";
      concept = "Static Type Checking";
      learningTip = "Explicit type annotations catch subtle runtime bugs early.";
    }

    return {
      errorType,
      line: params.line,
      explanation,
      rootCause,
      suggestedFix,
      concept,
      learningTip,
      provider: "built-in offline engine"
    };
  }

  public static generateOfflineFix(params: {
    code: string;
    language: string;
    diagnosticMessage: string;
    line: number;
    column: number;
    originalText: string;
  }): AiFixResult {
    let correctedText = params.originalText;
    let explanation = "Adjusted syntax based on language heuristics.";

    const msg = (params.diagnosticMessage || "").toLowerCase();
    const line = params.originalText;

    const typoMap: Record<string, string> = {
      // Imports & Exports
      mport: "import", impot: "import", imprt: "import", inport: "import", improt: "import", imort: "import",
      exprot: "export", exprt: "export", expor: "export", expot: "export",
      form: "from", fomr: "from", frmo: "from",
      // Declarations & Keywords
      cosnt: "const", cnost: "const", cont: "const", csont: "const", cnst: "const",
      fucntion: "function", funciton: "function", functino: "function", funtion: "function", fnction: "function",
      retrun: "return", retunr: "return", reutrn: "return", retrn: "return", retun: "return",
      whlie: "while", whil: "while",
      calss: "class", clas: "class", clsas: "class",
      interafce: "interface", itnerface: "interface", interfce: "interface",
      tpye: "type", tyep: "type",
      extneds: "extends", exteds: "extends",
      implments: "implements", implenets: "implements",
      defualt: "default", defautl: "default",
      asnyc: "async", awiat: "await", awit: "await",
      flase: "false", ture: "true", treu: "true",
      nul: "null", nll: "null",
      undefiend: "undefined", undifined: "undefined",
      // Python & General
      prnt: "print", pirnt: "print", prin: "print", pritn: "print",
      dfe: "def", edf: "def",
      fro: "for", ofr: "for",
      eif: "elif", eilf: "elif",
      esle: "else",
      lamda: "lambda", lmbda: "lambda",
      exept: "except", excpet: "except",
      fianlly: "finally",
      slef: "self", sefl: "self",
      // Common JS/TS Built-ins & Methods
      conosle: "console", cosnole: "console",
      prase: "parse", strigify: "stringify", lenght: "length",
      logg: "log", loog: "log"
    };

    // 1. Suggestion in diagnostic message: "Did you mean '...'?"
    const didYouMean = params.diagnosticMessage.match(/Did you mean ['"]?([^'"?]+)['"]?/i);
    if (didYouMean && didYouMean[1]) {
      const target = didYouMean[1].trim();
      if (target.toLowerCase() !== "to fix it") {
        const words = line.match(/\b[a-zA-Z_$][\w$]*\b/g) || [];
        for (const w of words) {
          if (w !== target && (typoMap[w.toLowerCase()] === target || w.length > 2)) {
            correctedText = line.replace(new RegExp(`\\b${w}\\b`), target);
            explanation = `Corrected '${w}' to '${target}'`;
            break;
          }
        }
      }
    }

    // 2. Keyword typo scan across all words on line
    if (correctedText === line) {
      const words = line.match(/\b[a-zA-Z_$][\w$]*\b/g) || [];
      for (const w of words) {
        const lower = w.toLowerCase();
        if (typoMap[lower]) {
          const target = typoMap[lower];
          correctedText = line.replace(new RegExp(`\\b${w}\\b`), target);
          explanation = `Corrected typo '${w}' to '${target}'`;
          break;
        }
      }
    }

    // 3. Unquoted module imports (e.g. import express from express; -> import express from "express";)
    if (correctedText === line && /^\s*import\s+[\w\s{},*]+\s+from\s+[a-zA-Z0-9_@\/-]+;?\s*$/.test(line)) {
      correctedText = line.replace(/(\bfrom\s+)([a-zA-Z0-9_@\/-]+)(;?\s*)$/, '$1"$2"$3');
      if (correctedText !== line) {
        explanation = "Enclosed module import path in quotes.";
      }
    }

    // 4. Expected colon in Python (def, class, if, elif, else, for, while, try, except, finally, with)
    if (correctedText === line && (params.language === "python" || params.code.includes("def ") || params.code.includes("import "))) {
      if (/^\s*(def|class|if|elif|else|for|while|try|except|finally|with)\b/.test(line) && !line.trimEnd().endsWith(":")) {
        correctedText = line.trimEnd() + ":";
        explanation = "Appended missing colon ':'.";
      }
    }

    // 5. Python booleans and None (true -> True, false -> False, null/none -> None)
    if (correctedText === line && params.language === "python") {
      const pyFixed = line
        .replace(/\btrue\b/g, "True")
        .replace(/\bfalse\b/g, "False")
        .replace(/\b(null|none)\b/g, "None");
      if (pyFixed !== line) {
        correctedText = pyFixed;
        explanation = "Corrected Python boolean / None capitalization.";
      }
    }

    // 6. Expected semicolon in C-style languages
    if (correctedText === line && (msg.includes("expected ';'") || msg.includes("missing semicolon") || msg.includes("';' expected"))) {
      if (!correctedText.trimEnd().endsWith(";")) {
        correctedText = correctedText.trimEnd() + ";";
        explanation = "Appended missing semicolon ';'.";
      }
    }

    // 7. Unclosed quotes
    if (correctedText === line) {
      const doubleQuotes = (line.match(/(?<!\\)"/g) || []).length;
      const singleQuotes = (line.match(/(?<!\\)'/g) || []).length;
      if (doubleQuotes % 2 !== 0) {
        correctedText = line.trimEnd() + '"';
        explanation = 'Closed unclosed quote \'"\'.';
      } else if (singleQuotes % 2 !== 0) {
        correctedText = line.trimEnd() + "'";
        explanation = "Closed unclosed quote '\''.";
      }
    }

    // 8. Unclosed parentheses
    if (correctedText === line) {
      const openParen = (line.match(/\(/g) || []).length;
      const closeParen = (line.match(/\)/g) || []).length;
      if (openParen > closeParen) {
        const needed = ")".repeat(openParen - closeParen);
        const needsSemi = ["typescript", "javascript", "java", "c", "cpp"].includes(params.language) ? ";" : "";
        correctedText = line.trimEnd() + needed + needsSemi;
        explanation = `Closed unclosed parentheses '${needed}'.`;
      }
    }

    // 9. Arrow function missing =>
    if (correctedText === line && /^\s*(const|let|var)\s+\w+\s*=\s*\([^)]*\)\s*\{/.test(line)) {
      correctedText = line.replace(/(\([^)]*\))\s*\{/, "$1 => {");
      explanation = "Added missing '=>' arrow operator.";
    }

    // 10. Common method typos (console.logg, JSON.prase)
    if (correctedText === line) {
      if (line.includes("console.logg")) {
        correctedText = line.replace("console.logg", "console.log");
        explanation = "Corrected 'console.logg' to 'console.log'.";
      } else if (line.includes("JSON.prase")) {
        correctedText = line.replace("JSON.prase", "JSON.parse");
        explanation = "Corrected 'JSON.prase' to 'JSON.parse'.";
      } else if (line.includes("JSON.strigify")) {
        correctedText = line.replace("JSON.strigify", "JSON.stringify");
        explanation = "Corrected 'JSON.strigify' to 'JSON.stringify'.";
      }
    }

    // 11. Unclosed curly braces or '}' expected
    if (correctedText === line) {
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      if (openBraces > closeBraces || msg.includes("'}' expected") || msg.includes("expected '}'")) {
        const needed = "}".repeat(Math.max(1, openBraces - closeBraces));
        if (line.trimEnd().endsWith("{")) {
          correctedText = line.trimEnd() + " " + needed;
        } else {
          correctedText = line.trimEnd() + needed;
        }
        explanation = `Closed unclosed block '${needed}'.`;
      }
    }

    // 12. Unclosed square brackets or ']' expected
    if (correctedText === line) {
      const openSquare = (line.match(/\[/g) || []).length;
      const closeSquare = (line.match(/\]/g) || []).length;
      if (openSquare > closeSquare || msg.includes("']' expected") || msg.includes("expected ']'")) {
        const needed = "]".repeat(Math.max(1, openSquare - closeSquare));
        const needsSemi = ["typescript", "javascript", "java", "c", "cpp"].includes(params.language) ? ";" : "";
        correctedText = line.trimEnd() + needed + needsSemi;
        explanation = `Closed unclosed bracket '${needed}'.`;
      }
    }

    return {
      explanation,
      correctedText,
      confidence: 0.9,
      safety: "SAFE_SINGLE_RANGE",
      compilerVerified: false,
      provider: "built-in rule engine"
    };
  }

  private static async callAiCompletion(
    config: ReturnType<typeof AiClient.getEffectiveConfig>,
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    const { provider, apiKey, model, ollamaUrl, backendUrl } = config;
    const cleanKey = apiKey.trim().replace(/^["']|["']$/g, "");

    // 1. Groq Cloud (with automatic fallback to llama-3.1-8b-instant if 404 occurs)
    if (provider === "groq") {
      if (!cleanKey) throw new Error("Groq API Key is missing.");
      let targetModel = model || "llama-3.1-8b-instant";

      let res = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cleanKey}`
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        })
      }, 15000);

      // If model not found (404), automatically fallback to llama-3.1-8b-instant
      if (res.status === 404 && targetModel !== "llama-3.1-8b-instant") {
        targetModel = "llama-3.1-8b-instant";
        res = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanKey}`
          },
          body: JSON.stringify({
            model: targetModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ]
          })
        }, 15000);
      }

      if (!res.ok) throw new Error(`Groq failed (${res.status}): ${await res.text()}`);
      const body = (await res.json()) as any;
      const content = body.choices?.[0]?.message?.content;
      if (!content) throw new Error("Groq returned empty content.");
      return content;
    }

    // 2. Google Gemini
    if (provider === "gemini") {
      if (!cleanKey) throw new Error("Gemini API Key is missing. Click settings to configure.");
      let modelToUse = model && model.toLowerCase().includes("gemini") ? model : "gemini-1.5-flash";
      const candidateModels = [modelToUse, "gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro"];
      const uniqueModels = [...new Set(candidateModels)];

      let lastError = "";
      for (const m of uniqueModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(cleanKey)}`;
          const res = await fetchWithTimeout(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": cleanKey
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: `${systemPrompt}\n\nTask:\n${userPrompt}` }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 2048
              }
            })
          }, 15000);

          if (res.ok) {
            const body = (await res.json()) as any;
            const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              return text;
            }
            if (body.candidates?.[0]?.finishReason) {
              lastError = `Gemini (${m}) finished with: ${body.candidates[0].finishReason}`;
            }
          } else {
            const errBody = await res.text();
            let msg = errBody;
            try {
              const parsed = JSON.parse(errBody);
              msg = parsed.error?.message || errBody;
            } catch {}
            lastError = `Gemini (${m}) HTTP ${res.status}: ${msg}`;
          }
        } catch (fetchErr: any) {
          lastError = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
        }
      }

      throw new Error(lastError || "Gemini returned empty or invalid response.");
    }

    // 3. Local Backend
    if (provider === "backend") {
      const res = await fetchWithTimeout(`${backendUrl}/api/v1/debug/fix`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "javascript",
          code: userPrompt,
          originalText: userPrompt.slice(0, 100),
          diagnostic: { message: userPrompt.slice(0, 100), line: 1, column: 1, severity: "ERROR" },
          documentVersion: 1,
          range: { startLine: 0, startCharacter: 0, endLine: 0, endCharacter: 10 }
        })
      }, 10000);
      if (!res.ok) throw new Error(`Backend returned HTTP ${res.status}`);
      return JSON.stringify(await res.json());
    }

    // 4. OpenAI-Compatible & Ollama
    let endpoint = "";
    if (provider === "siliconflow") endpoint = "https://api.siliconflow.cn/v1/chat/completions";
    else if (provider === "deepseek") endpoint = "https://api.deepseek.com/chat/completions";
    else if (provider === "qwen") endpoint = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
    else if (provider === "zhipu") endpoint = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
    else if (provider === "moonshot") endpoint = "https://api.moonshot.cn/v1/chat/completions";
    else if (provider === "openai") endpoint = "https://api.openai.com/v1/chat/completions";
    else if (provider === "ollama") endpoint = `${ollamaUrl.replace(/\/+$/, "")}/v1/chat/completions`;

    if (!endpoint) throw new Error(`Unsupported AI provider: ${provider}`);

    if (!cleanKey && provider !== "ollama") {
      throw new Error(`${PROVIDER_GUIDES[provider]?.name || provider} API Key is missing. Click settings to configure.`);
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (cleanKey) headers.Authorization = `Bearer ${cleanKey}`;

    const res = await fetchWithTimeout(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: model || PROVIDER_GUIDES[provider]?.defaultModel || "default",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    }, 20000);

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`${provider} failed (${res.status}): ${err.slice(0, 160)}`);
    }

    const body = (await res.json()) as any;
    const content = body.choices?.[0]?.message?.content;
    if (!content) throw new Error(`${provider} returned empty content.`);
    return content;
  }
}

export function parseAiFixResponse(raw: string, originalText: string): { explanation: string; correctedText: string } | null {
  if (!raw) return null;
  const trimmed = raw.trim();

  // Try 1: Clean markdown fences and attempt JSON.parse
  let cleanJsonStr = trimmed;
  if (cleanJsonStr.startsWith("```")) {
    cleanJsonStr = cleanJsonStr.replace(/^```[a-zA-Z0-9_-]*\r?\n?/, "").replace(/\r?\n?```$/, "").trim();
  }

  // Extract from outer braces if there's surrounding text
  const braceMatch = cleanJsonStr.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    cleanJsonStr = braceMatch[0];
  }

  try {
    const parsed = JSON.parse(cleanJsonStr);
    if (parsed && typeof parsed.correctedText === "string") {
      const corrected = preserveIndentation(originalText, parsed.correctedText);
      return {
        explanation: String(parsed.explanation || "Corrected code with AI"),
        correctedText: corrected
      };
    }
  } catch {
    // Standard parse failed, proceed to fallback extractors
  }

  // Try 2: Regex extraction for "correctedText": "..."
  const textMatch = raw.match(/"correctedText"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (textMatch && textMatch[1]) {
    try {
      const unescaped = JSON.parse(`"${textMatch[1]}"`);
      const explMatch = raw.match(/"explanation"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      const expl = explMatch ? explMatch[1] : "Corrected code with AI";
      return {
        explanation: expl,
        correctedText: preserveIndentation(originalText, unescaped)
      };
    } catch {}
  }

  // Try 3: Regex extraction for multi-line or triple-quoted correctedText
  const tripleMatch = raw.match(/"correctedText"\s*:\s*"""([\s\S]*?)"""/) || raw.match(/"correctedText"\s*:\s*`([^`]*)`/);
  if (tripleMatch && tripleMatch[1].trim()) {
    return {
      explanation: "Applied AI code correction",
      correctedText: preserveIndentation(originalText, tripleMatch[1].trim())
    };
  }

  // Try 4: Direct markdown code block in response
  const codeBlockMatch = raw.match(/```[a-zA-Z0-9_-]*\r?\n([\s\S]*?)\r?\n```/);
  if (codeBlockMatch && codeBlockMatch[1].trim()) {
    const code = codeBlockMatch[1].trim();
    if (!code.includes('"correctedText"') && code !== originalText.trim()) {
      return {
        explanation: "Corrected code using AI",
        correctedText: preserveIndentation(originalText, code)
      };
    }
  }

  return null;
}

export function preserveIndentation(original: string, corrected: string): string {
  const origIndent = original.match(/^([ \t]+)/)?.[1] || "";
  if (!origIndent) return corrected;
  const lines = corrected.split(/\r?\n/);
  if (lines.length > 0 && !lines[0].startsWith(" ") && !lines[0].startsWith("\t")) {
    return lines.map(line => (line.trim().length > 0 && !line.startsWith(" ") && !line.startsWith("\t") ? origIndent + line : line)).join("\n");
  }
  return corrected;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (match) return match[0];
  return trimmed;
}
