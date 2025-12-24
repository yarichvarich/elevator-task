import { InjectionManager } from "../core/injection/injectionManager";
import type { Passenger } from "../core/type/floorQueue";
import { SpawnData } from "../flow/data/spawnData";
import { PassengersData } from "./passengers";

export class ElevatorData {
  protected _passengerData: PassengersData =
    InjectionManager.inject(PassengersData);

  public currentFloor: number = 0;

  public arrivalOrder: SpawnData[] = [];
  // public lockedOrder: SpawnData | undefined = undefined;

  protected _lockedOrder: SpawnData | undefined = undefined;

  public get lockedOrder(): SpawnData | undefined {
    return this._lockedOrder;
  }

  public set lockedOrder(v: SpawnData | undefined) {
    this._lockedOrder = v;
  }

  public additionalPassengers: SpawnData[] = [];

  public reachedPassengerDestination: boolean = false;
  public reachedPassengerFloor: boolean = false;

  protected _targetFloor: number | undefined = undefined;

  protected isSameDirection(p1: Passenger, p2: Passenger): boolean {
    if (!this.reachedPassengerFloor) {
      return (p1.from - p1.to) * (p2.from - p2.to) >= 0;
    }

    return (p1.to - p1.from) * (p2.from - p2.to) >= 0;
  }

  protected canGetPassenger(p: Passenger): boolean {
    if (!this.lockedOrder) {
      return false;
    }

    const lockedPassenger = this.lockedOrder.passenger;

    const lockedTargetFloor = !this.reachedPassengerFloor
      ? lockedPassenger.from
      : lockedPassenger.to;

    const lockedTopSegment = Math.max(lockedTargetFloor, this.currentFloor);
    const lockedBotSegment = Math.min(lockedTargetFloor, this.currentFloor);

    const pTopSegment = Math.max(p.from, p.to);
    const pBotSegment = Math.min(p.from, p.to);

    return lockedTopSegment >= pTopSegment && lockedBotSegment <= pBotSegment;
  }

  public calculateTargetFloor(): number {
    if (!this.lockedOrder) {
      return this.currentFloor;
    }

    if (!this.reachedPassengerFloor) {
      return this.lockedOrder.passenger.from;
    }

    return this.lockedOrder.passenger.to;

    // const targetLockedFloor = !this.reachedPassengerFloor
    //   ? this.lockedOrder.passenger.from
    //   : this.lockedOrder.passenger.to;

    // const passengersWithSameDirection = this.arrivalOrder.filter((p) =>
    //   this.isSameDirection(this.lockedOrder!.passenger, p.passenger)
    // );

    // if (passengersWithSameDirection.length === 0) {
    //   return targetLockedFloor;
    // }

    // const passengersWithinReach = passengersWithSameDirection.filter((p) =>
    //   this.canGetPassenger(p.passenger)
    // );

    // if (passengersWithinReach.length === 0) {
    //   return targetLockedFloor;
    // }

    // const closestLoadPassengerFloor = passengersWithinReach.reduce(
    //   (closest, p) => {
    //     const closestDistance = Math.abs(
    //       closest.passenger.from - this.currentFloor
    //     );
    //     const passengerDistance = Math.abs(
    //       p.passenger.from - this.currentFloor
    //     );

    //     return passengerDistance < closestDistance ? p : closest;
    //   }
    // ).passenger.from;

    // if (this.additionalPassengers.length === 0) {
    //   return closestLoadPassengerFloor;
    // }

    // const closestUnloadPassengerFloor = this.additionalPassengers.reduce(
    //   (closest, p) => {
    //     const closestDistance = Math.abs(
    //       closest.passenger.to - this.currentFloor
    //     );
    //     const passengerDistance = Math.abs(p.passenger.to - this.currentFloor);
    //     return passengerDistance < closestDistance ? p : closest;
    //   }
    // ).passenger.to;

    // if (
    //   Math.abs(this.currentFloor - closestUnloadPassengerFloor) <=
    //   Math.abs(this.currentFloor - closestLoadPassengerFloor)
    // ) {
    //   return closestUnloadPassengerFloor;
    // }

    // return closestLoadPassengerFloor;
  }

  public tryPopLockedOrder() {
    if (this.currentFloor === this.lockedOrder?.passenger.to) {
      this.lockedOrder = undefined;
      this.reachedPassengerFloor = false;
    }
  }
}
