import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { BaseEvents } from "../../core/type/baseEvent";
import { reparentKeepWorldPosition } from "../../core/utils/reparentKeepWorld";
import { ElevatorConfig } from "../../model/config/elevatorConfig";
import { ElevatorData } from "../../model/elevatorData";
import type { Elevator } from "../component/elevator/view/elevator";
import { LoadPassengerAnimationData } from "../data/loadPassengerAnimationData";

export class LoadPassenger extends Action {
  protected _elevatorData: ElevatorData = InjectionManager.inject(ElevatorData);
  protected _elevatorConfig: ElevatorConfig =
    InjectionManager.inject(ElevatorConfig);

  protected guard(): boolean {
    return super.guard() && this._elevatorData.canLoad();
  }

  protected loadMainPassenger() {
    if (!this._elevatorData.lockedOrder) {
      this._elevatorData.lockedOrder = this._elevatorData.arrivalOrder.shift();
      this.resolve();
      return;
    }

    const passengerView = this._elevatorData.lockedOrder.view;
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

    const currentCapacity = 0;
    const maxCapacity = this._elevatorConfig.capacity;
    const elevatorWidth = this._elevatorConfig.elevatorWidth;

    const passengerDestination =
      -5 -
      elevatorWidth +
      (currentCapacity / maxCapacity) * elevatorWidth +
      passengerView.x;

    this._elevatorData.lockedOrder.view?.playLoadAnimation(
      new LoadPassengerAnimationData(passengerDestination, () => {
        if (passengerView && elevatorView && passengerView.parent) {
          reparentKeepWorldPosition(passengerView, elevatorView);
        }

        this.emitSync(
          BaseEvents.playShiftQeueue,
          this._elevatorData.lockedOrder
        );

        this._elevatorData.tryPopLockedOrder();
        this._elevatorData.loadedMainPassenger = true;

        this.resolve();
      })
    );
  }

  protected onExecute(): void {
    if (
      this._elevatorData.lockedOrder?.passenger.from ===
      this._elevatorData.currentFloor
    ) {
      this.loadMainPassenger();
      return;
    }
  }
}
