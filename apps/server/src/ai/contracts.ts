import { z } from "zod";

export const debugRequestSchema = z.object({
  language: z.enum(["swift", "javascript"]),
  code: z.string().min(1).max(20_000),
  diagnostic: z.object({ message: z.string().min(1).max(2_000), line: z.number().int().positive(), column: z.number().int().positive(), severity: z.enum(["ERROR", "WARNING", "INFORMATION"]) }),
  learningLevel: z.enum(["beginner", "intermediate", "advanced"]).default("beginner")
});
export type DebugRequest = z.infer<typeof debugRequestSchema>;
export const aiAnswerSchema = z.object({
  errorType: z.string().min(1), severity: z.enum(["ERROR", "WARNING", "INFORMATION"]), line: z.number().int().positive(),
  explanation: z.string().min(1), rootCause: z.string().min(1), suggestedFix: z.string().min(1), concept: z.string().min(1), learningTip: z.string().min(1), confidence: z.number().min(0).max(1)
});
export type AiAnswer = z.infer<typeof aiAnswerSchema>;
export const fixRequestSchema = debugRequestSchema.extend({ documentVersion: z.number().int().nonnegative(), range: z.object({ startLine: z.number().int().nonnegative(), startCharacter: z.number().int().nonnegative(), endLine: z.number().int().nonnegative(), endCharacter: z.number().int().nonnegative() }), originalText: z.string().min(1).max(4_000) });
export const fixAnswerSchema = z.object({ explanation: z.string().min(1).max(2_000), correctedText: z.string().min(1).max(4_000), confidence: z.number().min(0).max(1), safety: z.enum(["SAFE_SINGLE_RANGE", "REQUIRES_REVIEW"]), compilerVerified: z.boolean().default(false) });
export type FixRequest = z.infer<typeof fixRequestSchema>;
export type FixAnswer = z.infer<typeof fixAnswerSchema>;
