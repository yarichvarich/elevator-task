export const BaseEvents = {
  floorsChanged: "base.floorsChanged",
  capacityChanged: "base.capacityChanged",
  sceneRebuildStarted: "base.sceneRebuildStarted",
  sceneRebuildEnded: "base.sceneRebuildEnded",
  passengerSpawned: "base.passengerSpawned",
  dataReady: "base.dataReady",
} as const;

export type BaseEvent = (typeof BaseEvents)[keyof typeof BaseEvents];
