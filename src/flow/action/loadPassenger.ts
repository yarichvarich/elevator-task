import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { BaseEvents } from "../../core/type/baseEvent";
import { reparentKeepWorldPosition } from "../../core/utils/reparentKeepWorld";
import { ElevatorConfig } from "../../model/config/elevatorConfig";
import { ElevatorData } from "../../model/elevatorData";
import type { Elevator } from "../component/elevator/view/elevator";
import type { PassengerWidget } from "../component/floors/view/passenger";
import { LoadPassengerAnimationData } from "../data/loadPassengerAnimationData";

export class LoadPassenger extends Action {
  protected _elevatorData: ElevatorData = InjectionManager.inject(ElevatorData);
  protected _elevatorConfig: ElevatorConfig =
    InjectionManager.inject(ElevatorConfig);

  protected guard(): boolean {
    return super.guard();
  }

  protected onExecute(): void {
    if (!this._elevatorData.lockedOrder) {
      this.resolve();
      return;
    }
    let passengerView: PassengerWidget;
    let elevatorView: Elevator;

    const setPassengerView = (view: PassengerWidget) => {
      passengerView = view;
    };

    const setElevatorView = (view: Elevator) => {
      elevatorView = view;
    };

    const order = this._elevatorData.lockedOrder;

    this.emit(BaseEvents.getPassegerView, {
      id: order.passenger.id,
      cb: setPassengerView,
    });

    this.emit(BaseEvents.getElevatorView, { cb: setElevatorView });

    //@ts-expect-error
    if (elevatorView === undefined || passengerView === undefined) {
      this.resolve();
      return;
    }

    const currentCapacity = this._elevatorData.capacity;
    const maxCapacity = this._elevatorConfig.capacity;
    const elevatorWidth = this._elevatorConfig.elevatorWidth;

    const passengerDestination =
      -5 -
      elevatorWidth +
      (currentCapacity / maxCapacity) * elevatorWidth +
      passengerView.x;

    passengerView.playLoadAnimation(
      new LoadPassengerAnimationData(passengerDestination, () => {
        reparentKeepWorldPosition(passengerView, elevatorView);

        this.resolve();
      })
    );
  }
}
