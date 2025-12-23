import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { BaseEvents } from "../../core/type/baseEvent";
import { ElevatorData } from "../../model/elevatorData";
import { PassengersData } from "../../model/passengers";
import type { Floors } from "../component/floors/view/floor";

export class UpdateOrder extends Action {
  protected _elevatorData: ElevatorData = InjectionManager.inject(ElevatorData);
  protected _passengerData: PassengersData =
    InjectionManager.inject(PassengersData);

  protected onExecute(): void {
    const lockedOrder = this._elevatorData.lockedOrder;
    if (!lockedOrder) {
      this.resolve();
      return;
    }

    let floorsView: Floors;

    const setFloorView = (view: Floors) => {
      floorsView = view;
    };

    this.emit(BaseEvents.getFloorsView, { cb: setFloorView });

    //@ts-expect-error
    if (!floorsView) {
      this.resolve();
      return;
    }

    floorsView.removePassengerFromList(lockedOrder.passenger.id);
    this.emit(BaseEvents.playShiftQeueue, { from: lockedOrder.passenger.from });

    this.resolve();
  }
}
