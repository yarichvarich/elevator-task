export const ComponentEvents = {
  elevatorCapacityChanged: "component.elevatorCapacityChanged",
  floorsChanged: "component.floorsChanged",
  capacityChanged: "component.capacityChanged",
};

export type ComponentEvent =
  (typeof ComponentEvents)[keyof typeof ComponentEvents];
