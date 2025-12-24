import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { BaseEvents } from "../../core/type/baseEvent";
import { reparentKeepWorldPosition } from "../../core/utils/reparentKeepWorld";
import { ElevatorConfig } from "../../model/config/elevatorConfig";
import { ElevatorData } from "../../model/elevatorData";
import type { Elevator } from "../component/elevator/view/elevator";
import type { Floors } from "../component/floors/view/floor";
import { UnloadPassengerAnimationData } from "../data/unloadPassengerAnimationData";

export class UnloadAdditionalPassenger extends Action {
  protected _elevatorData: ElevatorData = InjectionManager.inject(ElevatorData);
  protected _elevatorConfig: ElevatorConfig =
    InjectionManager.inject(ElevatorConfig);

  protected guard(): boolean {
    return super.guard() && this._elevatorData.canUnloadAdditionalPassenger();
  }

  protected onExecute(): void {
    if (this._elevatorData.additionalPassengers.length === 0) {
      this.resolve();
      return;
    }

    const additionalPassenger = this._elevatorData.additionalPassengers.find(
      (p) => p.passenger.to === this._elevatorData.currentFloor
    );

    if (!additionalPassenger) {
      this.resolve();
      return;
    }

    this._elevatorData.additionalPassengers =
      this._elevatorData.additionalPassengers.filter(
        (p) => p !== additionalPassenger
      );

    const passengerView = additionalPassenger.view;

    if (!passengerView) {
      this.resolve();
      return;
    }

    let elevatorView: Elevator;
    let floorsView: Floors;

    const setElevatorView = (view: Elevator) => {
      elevatorView = view;
    };

    const setFloorView = (view: Floors) => {
      floorsView = view;
    };

    this.emitSync(BaseEvents.getFloorsView, { cb: setFloorView });

    const order = this._elevatorData.lockedOrder;

    this.emitSync(BaseEvents.getElevatorView, { cb: setElevatorView });

    //@ts-expect-error
    if (elevatorView === undefined || order.view === undefined) {
      this.resolve();
      return;
    }

    const elevatorWidth = this._elevatorConfig.elevatorWidth;

    const passengerDestination = 5 + elevatorWidth;

    passengerView.playUnloadAnimation(
      new UnloadPassengerAnimationData(passengerDestination, () => {
        reparentKeepWorldPosition(passengerView, floorsView);
        this._elevatorData.needSorting = true;
        this.resolve();
      })
    );
  }
}
