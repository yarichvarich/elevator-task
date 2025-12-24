import { GroupAction } from "../../core/action/groupAction";
import { Controller } from "../../core/controller/controller";
import { InjectionManager } from "../../core/injection/injectionManager";
import { ActionStates } from "../../core/type/actionState";
import { BaseEvents } from "../../core/type/baseEvent";
import { ElevatorData } from "../../model/elevatorData";
import { LoadPassenger } from "../action/loadPassenger";
import { MoveToThePassenger } from "../action/moveToThePassenger";
import { UnloadPassengers } from "../action/unloadPassengers";
import type { SpawnData } from "../data/spawnData";

export class ElevatorController extends Controller {
  protected _elevatorMoveSequence: GroupAction = new GroupAction();
  protected _elevatorData: ElevatorData = InjectionManager.inject(ElevatorData);

  protected _once = false;

  protected initHandlers(): void {
    this.addHandler(
      BaseEvents.sceneRebuildStarted,
      this.onSceneRebuildStarted,
      this
    );
    this.addHandler(BaseEvents.passengerArrived, this.onPassengerArrived, this);
    this.addHandler(BaseEvents.dataReady, this.onDataReady, this);
  }

  protected onDataReady(): void {}

  protected onSceneRebuildStarted(): void {}

  protected onPassengerArrived(data: SpawnData): void {
    this._elevatorData.arrivalOrder.push(data);
    this.runMoveSequence();
  }

  protected runMoveSequence(): void {
    if (this._elevatorMoveSequence.state === ActionStates.started) {
      return;
    }

    if (this._elevatorData.arrivalOrder.length === 0) {
      return;
    }

    if (this._elevatorData.lockedOrder === undefined) {
      this._elevatorData.lockedOrder = this._elevatorData.arrivalOrder.shift();
    }

    this.generateMoveSequence();

    this._elevatorMoveSequence
      .onSuccess(() => {
        this.runMoveSequence();
      })
      .start();
  }

  protected generateMoveSequence(): void {
    this._elevatorMoveSequence = new GroupAction();
    this._elevatorMoveSequence.addAction(
      InjectionManager.inject(UnloadPassengers)
    );
    this._elevatorMoveSequence.addAction(
      InjectionManager.inject(LoadPassenger)
    );
    this._elevatorMoveSequence.addAction(
      InjectionManager.inject(MoveToThePassenger)
    );
    // this._elevatorMoveSequence.addAction(InjectionManager.inject(UpdateOrder));
    // this._elevatorMoveSequence.addAction(
    //   InjectionManager.inject(MoveToTheDestination)
    // );
  }
}
