export const BaseEvents = {
  floorsChanged: "base.floorsChanged",
  capacityChanged: "base.capacityChanged",
} as const;

export type BaseEvent = (typeof BaseEvents)[keyof typeof BaseEvents];
