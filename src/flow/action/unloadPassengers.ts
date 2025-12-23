import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { BaseEvents } from "../../core/type/baseEvent";
import { reparentKeepWorldPosition } from "../../core/utils/reparentKeepWorld";
import { ElevatorConfig } from "../../model/config/elevatorConfig";
import { FloorConfig } from "../../model/config/floorConfig";
import { ElevatorData } from "../../model/elevatorData";
import type { Elevator } from "../component/elevator/view/elevator";
import type { Floors } from "../component/floors/view/floor";
import type { PassengerWidget } from "../component/floors/view/passenger";
import { UnloadPassengerAnimationData } from "../data/unloadPassengerAnimationData";

export class UnloadPassengers extends Action {
  protected _elevatorData: ElevatorData = InjectionManager.inject(ElevatorData);
  protected _elevatorConfig: ElevatorConfig =
    InjectionManager.inject(ElevatorConfig);
  protected _floorConfig: FloorConfig = InjectionManager.inject(FloorConfig);

  protected guard(): boolean {
    return super.guard();
  }

  protected onExecute(): void {
    if (!this._elevatorData.lockedOrder) {
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

    this.emit(BaseEvents.getFloorsView, { cb: setFloorView });

    const order = this._elevatorData.lockedOrder;

    this.emit(BaseEvents.getElevatorView, { cb: setElevatorView });

    //@ts-expect-error
    if (elevatorView === undefined || order.view === undefined) {
      this.resolve();
      return;
    }

    const elevatorWidth = this._elevatorConfig.elevatorWidth;

    const passengerDestination = 5 + elevatorWidth;

    order.view.playUnloadAnimation(
      new UnloadPassengerAnimationData(passengerDestination, () => {
        reparentKeepWorldPosition(order.view, floorsView);
        this._elevatorData.lockedOrder = undefined;
        this.resolve();
      })
    );
  }
}
