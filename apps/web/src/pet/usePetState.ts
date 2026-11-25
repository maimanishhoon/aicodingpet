import { useCallback, useMemo, useState } from "react";
import type { PetState } from "./Pet";

const allowed: Record<PetState, PetState[]> = {
  idle: ["sleeping", "thinking", "coding", "error", "warning", "success"], sleeping: ["idle"], thinking: ["explaining", "confused", "idle"], coding: ["error", "warning", "success", "idle"], error: ["thinking", "explaining", "fixing", "idle"], warning: ["thinking", "idle"], explaining: ["fixing", "idle"], fixing: ["success", "confused", "idle"], success: ["celebrating", "idle"], celebrating: ["idle"], confused: ["thinking", "idle"]
};
export function usePetState(initial: PetState = "idle") {
  const [state, setState] = useState<PetState>(initial);
  const transition = useCallback((next: PetState) => { if (allowed[state].includes(next)) setState(next); }, [state]);
  return useMemo(() => ({ state, transition, allowed: allowed[state] }), [state, transition]);
}
