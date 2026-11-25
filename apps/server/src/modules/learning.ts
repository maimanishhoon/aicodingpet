import type { Request, Response } from "express";

const topics = [
  { slug: "variables", title: "Variables and Constants", level: "beginner" },
  { slug: "data-types", title: "Swift Data Types", level: "beginner" },
  { slug: "conditions", title: "Conditions", level: "beginner" },
  { slug: "optionals", title: "Optionals", level: "intermediate" },
  { slug: "functions", title: "Functions", level: "beginner" },
  { slug: "collections", title: "Arrays and Dictionaries", level: "intermediate" }
];
const exercises = [
  { id: "swift-variables-1", topic: "variables", title: "Make a greeting", prompt: "Declare a constant named greeting whose value is \"Hello, CodePet!\".", expectedOutput: "Hello, CodePet!", tests: ["greeting is a let constant", "greeting has the expected String value"] },
  { id: "swift-optionals-1", topic: "optionals", title: "Safely unwrap a name", prompt: "Print a name only when the optional contains a value.", expectedOutput: "Ada", tests: ["Uses optional binding", "Does not force unwrap"] }
];
export function listTopics(_request: Request, response: Response) { response.json({ topics }); }
export function listExercises(request: Request, response: Response) { const topic = typeof request.query.topic === "string" ? request.query.topic : undefined; response.json({ exercises: topic ? exercises.filter(item => item.topic === topic) : exercises }); }
export function unavailableProgress(_request: Request, response: Response) { response.status(503).json({ error: "Learning progress requires a migrated MySQL database and authenticated user." }); }
