export const CoreEvents = {
  applicationInited: "core.applicationInited",
} as const;

export type CoreEvent = (typeof CoreEvents)[keyof typeof CoreEvents];
