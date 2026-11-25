import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../auth/tokens.js";
export type AuthenticatedRequest = Request & { user?: { userId: string; email: string } };
export function requireAuth(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const token = request.header("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return response.status(401).json({ error: "Authentication required" });
  try { request.user = verifyAccessToken(token); next(); } catch { response.status(401).json({ error: "Invalid or expired access token" }); }
}
