import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { BaseEvents } from "../../core/type/baseEvent";
import { ElevatorData } from "../../model/elevatorData";
import { PassengersData } from "../../model/passengers";

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

    this.resolve();
  }
}
