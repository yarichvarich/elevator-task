import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import type { FloorQeueue } from "../../core/type/floorQueue";
import { FloorConfig } from "../../model/config/floorConfig";
import { ElevatorData } from "../../model/elevatorData";
import { PassengersData } from "../../model/passengers";

export class ResetData extends Action {
  protected _passengersData: PassengersData =
    InjectionManager.inject(PassengersData);
  protected _elevatorData: ElevatorData = InjectionManager.inject(ElevatorData);

  protected _floorConfig: FloorConfig = InjectionManager.inject(FloorConfig);

  protected onExecute(): void {
    this.clearFloorsData();
    this.clearElevatorData();

    this.resolve();
  }

  protected clearFloorsData(): void {
    this._passengersData.floorQueues = [];

    const currentQueuesCount = this._floorConfig.floors;

    for (let i = 0; i < currentQueuesCount; i++) {
      const newQueue = { id: i, queue: [], isReady: false } as FloorQeueue;
      this._passengersData.floorQueues.push(newQueue);
    }
  }

  protected clearElevatorData(): void {
    this._elevatorData.arrivalOrder = [];
    this._elevatorData.currentFloor = 0;
    this._elevatorData.lockedOrder = undefined;
    this._elevatorData.reachedPassengerDestination = false;
    this._elevatorData.reachedPassengerFloor = false;
  }
}
