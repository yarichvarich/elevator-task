import { InjectionManager } from "../core/injection/injectionManager";
import type { Passenger } from "../core/type/floorQueue";
import { SpawnData } from "../flow/data/spawnData";
import { ElevatorConfig } from "./config/elevatorConfig";
import { PassengersData } from "./passengers";

export class ElevatorData {
  protected _passengerData: PassengersData =
    InjectionManager.inject(PassengersData);

  protected _elevatorConfig: ElevatorConfig =
    InjectionManager.inject(ElevatorConfig);

  public currentFloor: number = 0;

  public arrivalOrder: SpawnData[] = [];

  public lockedOrder: SpawnData | undefined = undefined;

  public additionalPassengers: SpawnData[] = [];

  public reachedPassengerDestination: boolean = false;
  public reachedPassengerFloor: boolean = false;
  public loadedMainPassenger: boolean = false;

  protected _targetFloor: number | undefined = undefined;

  protected isSameDirection(p1: Passenger, p2: Passenger): boolean {
    if (this.loadedMainPassenger) {
      return (p1.from - p1.to) * (p2.from - p2.to) >= 0;
    }

    return (p1.to - p1.from) * (p2.from - p2.to) >= 0;
  }

  protected canGetPassenger(p: Passenger): boolean {
    if (!this.lockedOrder) {
      return false;
    }

    const lockedPassenger = this.lockedOrder.passenger;

    const lockedTargetFloor = !this.loadedMainPassenger
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
      // if (this.additionalPassengers.length !== 0) {
      // }
      //  else {
      return this.currentFloor;
      // }
    }

    const targetLockedFloor = !this.loadedMainPassenger
      ? this.lockedOrder.passenger.from
      : this.lockedOrder.passenger.to;

    const passengersWithSameDirection = this.arrivalOrder.filter((p) =>
      this.isSameDirection(this.lockedOrder!.passenger, p.passenger)
    );

    if (passengersWithSameDirection.length === 0) {
      return targetLockedFloor;
    }

    const passengersWithinReach = passengersWithSameDirection.filter((p) =>
      this.canGetPassenger(p.passenger)
    );

    if (passengersWithinReach.length === 0) {
      console.log("cannot reach", passengersWithSameDirection);
      return targetLockedFloor;
    }

    const closestLoadPassengerFloor = passengersWithinReach.reduce(
      (closest, p) => {
        const closestDistance = Math.abs(
          closest.passenger.from - this.currentFloor
        );
        const passengerDistance = Math.abs(
          p.passenger.from - this.currentFloor
        );

        return passengerDistance < closestDistance ? p : closest;
      }
    ).passenger.from;

    console.log(passengersWithinReach);

    if (this.additionalPassengers.length === 0) {
      console.log("load1");

      return closestLoadPassengerFloor;
    }

    const closestUnloadPassengerFloor = this.additionalPassengers.reduce(
      (closest, p) => {
        const closestDistance = Math.abs(
          closest.passenger.to - this.currentFloor
        );
        const passengerDistance = Math.abs(p.passenger.to - this.currentFloor);
        return passengerDistance < closestDistance ? p : closest;
      }
    ).passenger.to;

    if (this.additionalPassengers.length + 1 >= this._elevatorConfig.capacity) {
      console.log("unload1");

      return closestUnloadPassengerFloor;
    }

    if (
      Math.abs(this.currentFloor - closestUnloadPassengerFloor) <=
      Math.abs(this.currentFloor - closestLoadPassengerFloor)
    ) {
      console.log("unload");

      return closestUnloadPassengerFloor;
    }

    console.log("load");
    return closestLoadPassengerFloor;
  }

  public getAdditionalPassenger() {
    return this.arrivalOrder.find(
      (p) => p.passenger.from === this.currentFloor
    );
  }

  public tryPopLockedOrder() {
    if (this.currentFloor === this.lockedOrder?.passenger.to) {
      this.lockedOrder = undefined;
      this.reachedPassengerFloor = false;
      this.loadedMainPassenger = false;
    }
  }

  public canMove() {
    return (
      !!this.lockedOrder &&
      !this.canLoad() &&
      !this.canUnload() &&
      !this.canLoadAdditionalPassenger()
    );
  }

  public canLoad() {
    const canLock = !!this.lockedOrder;

    return (
      this.reachedPassengerFloor &&
      !this.loadedMainPassenger &&
      !this.canUnload() &&
      !this.canUnloadAdditionalPassenger()
    );
  }

  public canUnload() {
    const orderActive = !!this.lockedOrder;

    if (!orderActive) {
      return false;
    }

    const onMainPassengerFloor =
      this.lockedOrder?.passenger.to === this.currentFloor;
    const onAdditionalPassengerFloor =
      this.additionalPassengers.filter(
        (p) => p.passenger.to === this.currentFloor
      ).length !== 0;

    return onMainPassengerFloor && this.loadedMainPassenger;
  }

  public canLoadAdditionalPassenger() {
    const capacityNotReached =
      this.additionalPassengers.length + 1 < this._elevatorConfig.capacity;
    const onPassengersFloor = !!this.getAdditionalPassenger();
    return (
      !!this.lockedOrder && capacityNotReached && onPassengersFloor
      // this.loadedMainPassenger
    );
  }

  public canUnloadAdditionalPassenger() {
    return (
      this.additionalPassengers.length > 0 &&
      this.additionalPassengers.some(
        (p) => p.passenger.to === this.currentFloor
      )
    );
  }
}
