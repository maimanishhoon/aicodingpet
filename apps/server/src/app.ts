import cors from "cors";
import express from "express";
import pino from "pino";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { debugRequestSchema, aiAnswerSchema, fixAnswerSchema, fixRequestSchema } from "./ai/contracts.js";
import { AiUnavailableError, getAiProvider } from "./ai/provider.js";
import { listExercises, listTopics, unavailableProgress } from "./modules/learning.js";

export function createApp() {
  const app = express();
  const logger = pino({ level: env.NODE_ENV === "production" ? "info" : "debug" });

  app.disable("x-powered-by");
  app.use((_request, response, next) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("Referrer-Policy", "no-referrer");
    next();
  });
  app.use(pinoHttp({ logger }));
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/v1/health", (_request, response) => {
    response.status(200).json({ status: "ok", service: "codepet-api" });
  });
  app.post("/api/v1/debug/explain", async (request, response) => {
    const parsed = debugRequestSchema.safeParse(request.body);
    if (!parsed.success) return response.status(400).json({ error: "Invalid debug request", details: parsed.error.flatten() });
    try {
      const result = aiAnswerSchema.parse(await getAiProvider().explain(parsed.data));
      return response.status(200).json(result);
    } catch (error) {
      if (error instanceof AiUnavailableError) return response.status(503).json({ error: error.message });
      request.log.error(error, "AI explanation failed");
      return response.status(502).json({ error: "AI provider failed" });
    }
  });
  app.post("/api/v1/debug/fix", async (request, response) => {
    const parsed = fixRequestSchema.safeParse(request.body);
    if (!parsed.success) return response.status(400).json({ error: "Invalid correction request", details: parsed.error.flatten() });
    try { return response.status(200).json(fixAnswerSchema.parse(await getAiProvider().fix(parsed.data))); }
    catch (error) { if (error instanceof AiUnavailableError) return response.status(503).json({ error: error.message }); request.log.error(error, "AI correction failed"); return response.status(502).json({ error: "AI provider failed" }); }
  });
  app.get("/api/v1/learning/topics", listTopics);
  app.get("/api/v1/learning/exercises", listExercises);
  app.get("/api/v1/learning/progress", unavailableProgress);
  app.get("/api/v1/dashboard/overview", unavailableProgress);

  app.use((_request, response) => response.status(404).json({ error: "Not found" }));
  return app;
}
