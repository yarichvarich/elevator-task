export const BaseEvents = {
  floorsChanged: "base.floorsChanged",
} as const;

export type BaseEvent = (typeof BaseEvents)[keyof typeof BaseEvents];
