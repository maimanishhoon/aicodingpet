import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export type TokenPayload = { userId: string; email: string };
export const signAccessToken = (payload: TokenPayload) => jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" });
export const verifyAccessToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as TokenPayload;
