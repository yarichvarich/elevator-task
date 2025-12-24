import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { BaseEvents } from "../../core/type/baseEvent";
import { reparentKeepWorldPosition } from "../../core/utils/reparentKeepWorld";
import { ElevatorConfig } from "../../model/config/elevatorConfig";
import { FloorConfig } from "../../model/config/floorConfig";
import { ElevatorData } from "../../model/elevatorData";
import type { Elevator } from "../component/elevator/view/elevator";
import type { Floors } from "../component/floors/view/floor";
import type { SpawnData } from "../data/spawnData";
import { UnloadPassengerAnimationData } from "../data/unloadPassengerAnimationData";

export class UnloadPassengers extends Action {
  protected _elevatorData: ElevatorData = InjectionManager.inject(ElevatorData);
  protected _elevatorConfig: ElevatorConfig =
    InjectionManager.inject(ElevatorConfig);
  protected _floorConfig: FloorConfig = InjectionManager.inject(FloorConfig);

  protected get isOrderFulfilled(): boolean {
    if (!this._elevatorData.lockedOrder) {
      return false;
    }

    return (
      this._elevatorData.lockedOrder.passenger.to ===
      this._elevatorData.currentFloor
    );
  }

  protected get passengersToUnload(): SpawnData[] {
    if (!this._elevatorData.lockedOrder) {
      return [];
    }

    return this._elevatorData.additionalPassengers.filter(
      (ap) => ap.passenger.to === this._elevatorData.currentFloor
    );
  }

  protected playUnloadAdditionalPassengers(
    elevatorView: Elevator,
    floorsView: Floors
  ): void {
    const animation = gsap.timeline();

    const elevatorWidth = this._elevatorConfig.elevatorWidth;

    this.passengersToUnload.forEach((p) => {
      animation.to(this, {
        duration: 0.3,
        onComplete: () => {
          const destination = elevatorWidth + 5;

          p.view?.playUnloadAnimation(
            new UnloadPassengerAnimationData(destination, () => {
              reparentKeepWorldPosition(p.view, floorsView);
              this.passengersToUnload.shift();
            })
          );
        },
      });
    });
  }

  protected guard(): boolean {
    return (
      this._elevatorData.currentFloor ===
        this._elevatorData.lockedOrder?.passenger.to &&
      this._elevatorData.reachedPassengerFloor
    );
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

    // if (
    //   this._elevatorData.currentFloor ===
    //     this._elevatorData.lockedOrder.passenger.to &&
    //   this._elevatorData.reachedPassengerFloor
    // ) {
    order.view.playUnloadAnimation(
      new UnloadPassengerAnimationData(passengerDestination, () => {
        reparentKeepWorldPosition(order.view, floorsView);
        this._elevatorData.tryPopLockedOrder();
        this.resolve();
      })
    );
    // } else {
    //   this.resolve();
    // }
  }
}
