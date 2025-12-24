import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { BaseEvents } from "../../core/type/baseEvent";
import { reparentKeepWorldPosition } from "../../core/utils/reparentKeepWorld";
import { ElevatorConfig } from "../../model/config/elevatorConfig";
import { ElevatorData } from "../../model/elevatorData";
import type { Elevator } from "../component/elevator/view/elevator";
import { LoadPassengerAnimationData } from "../data/loadPassengerAnimationData";

export class LoadAdditionalPassenger extends Action {
  protected _elevatorData: ElevatorData = InjectionManager.inject(ElevatorData);
  protected _elevatorConfig: ElevatorConfig =
    InjectionManager.inject(ElevatorConfig);

  protected guard(): boolean {
    return super.guard() && this._elevatorData.canLoadAdditionalPassenger();
  }

  protected onExecute(...args: any[]): void {
    console.log(
      "additionalPassengerCanbeLoaded",
      this._elevatorData.getAdditionalPassenger()
    );

    const addPassenger = this._elevatorData.getAdditionalPassenger();

    if (!addPassenger) {
      this.resolve();
      return;
    }

    console.log(this._elevatorData.calculateTargetFloor());

    const passengerView = addPassenger.view;
    let elevatorView: Elevator;

    const setElevatorView = (view: Elevator) => {
      elevatorView = view;
    };

    this.emitSync(BaseEvents.getElevatorView, { cb: setElevatorView });

    //@ts-expect-error
    if (elevatorView === undefined) {
      this.resolve();
      return;
    }

    if (passengerView === undefined) {
      this.resolve();
      return;
    }

    const currentCapacity = this._elevatorData.additionalPassengers.length + 1;
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
        this.emitSync(BaseEvents.playShiftQeueue, addPassenger);

        this._elevatorData.additionalPassengers.push(addPassenger);
        this._elevatorData.arrivalOrder =
          this._elevatorData.arrivalOrder.filter((p) => p !== addPassenger);

        this.resolve();
      })
    );
    // this.resolve();
  }
}
