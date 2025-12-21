export const ElevatorStates = {
  waiting: "waiting",
  movingUp: "movingUp",
  movingDown: "movingDown",
  loadingPassengers: "loadingPassengers",
  unloadingPassengers: "unloadingPassengers",
};

export type ElevatorState =
  (typeof ElevatorStates)[keyof typeof ElevatorStates];
