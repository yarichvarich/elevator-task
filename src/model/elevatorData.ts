import type { SpawnData } from "../flow/data/spawnData";

export class ElevatorData {
  public currentFloor: number = 0;

  public arrivalOrder: SpawnData[] = [];
  public lockedOrder: SpawnData | undefined = undefined;

  public reachedPassengerDestination: boolean = false;
  public reachedPassengerFloor: boolean = false;

  public capacity: number = 0;
}
