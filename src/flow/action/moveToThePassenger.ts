import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { BaseEvents } from "../../core/type/baseEvent";
import { ElevatorData } from "../../model/elevatorData";
import { MoveToFloorAnimationData } from "../data/moveToFloorAnimationData";

export class MoveToThePassenger extends Action {
  protected _elevatorData: ElevatorData = InjectionManager.inject(ElevatorData);

  protected guard(): boolean {
    return super.guard() && this._elevatorData.canMove();
  }

  protected onExecute(): void {
    if (this._elevatorData.lockedOrder === undefined) {
      this.resolve();
      return;
    }

    const nextFloor = this._elevatorData.calculateTargetFloor();

    console.log(
      "nextFloror",
      nextFloor,
      "targetFloor",
      this._elevatorData.lockedOrder.passenger,
      this._elevatorData
    );

    this.emit(
      BaseEvents.playMoveToFloorAnimation,
      new MoveToFloorAnimationData(
        this._elevatorData.currentFloor,
        nextFloor,
        () => {
          this._elevatorData.currentFloor = nextFloor;
          this._elevatorData.reachedPassengerFloor =
            this._elevatorData.currentFloor ===
            this._elevatorData.lockedOrder!.passenger.from;
          console.log("reachedFloor");
          this.resolve();
        }
      )
    );
  }
}
