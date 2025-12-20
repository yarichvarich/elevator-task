import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import type { FloorQeueue } from "../../core/type/floorQueue";
import { FloorConfig } from "../../model/config/floorConfig";
import { PassengersData } from "../../model/passengers";

export class ResetData extends Action {
  protected _passengersData: PassengersData =
    InjectionManager.inject(PassengersData);
  protected _floorConfig: FloorConfig = InjectionManager.inject(FloorConfig);

  protected onExecute(): void {
    this._passengersData.floorQueues = [];
    this.generateClearQueues();

    this.resolve();
  }

  protected generateClearQueues(): void {
    const currentQueuesCount = this._floorConfig.floors;

    for (let i = 0; i < currentQueuesCount; i++) {
      const newQueue = { id: i, queue: [], isReady: false } as FloorQeueue;
      this._passengersData.floorQueues.push(newQueue);
    }
  }
}
