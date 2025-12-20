export const ComponentEvents = {
  elevatorCapacityChanged: "component.elevatorCapacityChanged",
  floorsChanged: "component.floorsChanged",
};

export type ComponentEvent =
  (typeof ComponentEvents)[keyof typeof ComponentEvents];
