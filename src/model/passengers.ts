import type { FloorQeueue } from "../core/type/floorQueue";

export class PassengersData {
  public floorQueues: FloorQeueue[] = [];

  public shiftQueue(idx: number): void {
    this.floorQueues[idx].queue.shift();
    this.floorQueues[idx].isReady = false;
  }
}
