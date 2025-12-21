export const ComponentEvents = {
  elevatorCapacityChanged: "component.elevatorCapacityChanged",
  floorsChanged: "component.floorsChanged",
  capacityChanged: "component.capacityChanged",
  passengerArrived: "component.passengerArrived",
};

export type ComponentEvent =
  (typeof ComponentEvents)[keyof typeof ComponentEvents];
