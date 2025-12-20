export const ActionStates = {
  started: "started",
  pending: "pending",
  failed: "failed",
} as const;

export type ActionState = (typeof ActionStates)[keyof typeof ActionStates];
