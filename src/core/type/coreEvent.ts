export const CoreEvents = {
  applicationInited: "appliactionInited",
} as const;

export type CoreEvent = (typeof CoreEvents)[keyof typeof CoreEvents];
