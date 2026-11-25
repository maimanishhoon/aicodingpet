import { motion } from "framer-motion";

export type PetState = "idle" | "sleeping" | "thinking" | "coding" | "error" | "warning" | "explaining" | "fixing" | "success" | "celebrating" | "confused";
type Props = { state: PetState; name: string; color?: string };
const copy: Record<PetState, string> = {
  idle: "Keeping you company",
  sleeping: "Resting between sessions",
  thinking: "Thinking it through",
  coding: "Watching diagnostics",
  error: "Paw raised — an error needs attention",
  warning: "I spotted a warning",
  explaining: "Explaining the root cause",
  fixing: "Preparing a verified fix",
  success: "That issue is resolved!",
  celebrating: "Great learning milestone!",
  confused: "I need more context"
};

export function Pet({ state, name, color = "#38bdf8" }: Props) {
  return (
    <section className={`pet-card pet-${state}`} aria-live="polite">
      <motion.div
        className="pet"
        animate={
          state === "error"
            ? { y: [0, -10, 0], rotate: [0, -5, 0] }
            : state === "celebrating"
            ? { rotate: [0, 10, -10, 0], y: [0, -12, 0] }
            : { y: [0, -3, 0] }
        }
        transition={{ duration: state === "error" ? 0.55 : 1.8, repeat: Infinity }}
      >
        <div className="ear left" style={{ background: color }} />
        <div className="ear right" style={{ background: color }} />
        <div className="face" style={{ background: color }}>
          <span className="eye">●</span>
          <span className="eye">●</span>
          <span className="nose">●</span>
          <span className="mouth">⌣</span>
        </div>
        <div className="paw">✦</div>
      </motion.div>
      <div>
        <p className="eyebrow">{state.replace(/(^\w)/, (char) => char.toUpperCase())}</p>
        <h2>{name}</h2>
        <p>{copy[state]}</p>
      </div>
    </section>
  );
}
