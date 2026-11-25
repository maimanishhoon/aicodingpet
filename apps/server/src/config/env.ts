import "dotenv/config";
import { z } from "zod";

const environment = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(32).default("development-only-secret-must-be-replaced"),
  AI_PROVIDER: z.enum(["none", "openai", "gemini", "groq", "deepseek", "qwen", "siliconflow", "zhipu", "moonshot", "ollama"]).default("none"),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  DEEPSEEK_API_KEY: z.string().optional(),
  QWEN_API_KEY: z.string().optional(),
  SILICONFLOW_API_KEY: z.string().optional(),
  ZHIPU_API_KEY: z.string().optional(),
  MOONSHOT_API_KEY: z.string().optional(),
  OLLAMA_BASE_URL: z.string().default("http://localhost:11434"),
  AI_MODEL: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini")
});

export const env = environment.parse(process.env);
