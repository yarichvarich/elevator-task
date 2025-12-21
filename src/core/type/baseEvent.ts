export const BaseEvents = {
  floorsChanged: "base.floorsChanged",
  capacityChanged: "base.capacityChanged",
  sceneRebuildStarted: "base.sceneRebuildStarted",
  sceneRebuildEnded: "base.sceneRebuildEnded",
  passengerSpawned: "base.passengerSpawned",
  dataReady: "base.dataReady",
  passengerArrived: "base.passengerArrived",
  getPassegerView: "base.getPassengerView",
  getElevatorView: "base.getElevatorView",
  getFloorsView: "base.getFloorView",
  playLoadPassengerAnimation: "base.playLoadPassengerAnimation",
  playMoveToFloorAnimation: "base.moveToFloorAnimation",
  playShiftQeueue: "base.playShiftQueue",
} as const;

export type BaseEvent = (typeof BaseEvents)[keyof typeof BaseEvents];
