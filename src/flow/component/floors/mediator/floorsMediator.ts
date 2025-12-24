import { InjectionManager } from "../../../../core/injection/injectionManager";
import { Mediator } from "../../../../core/mediator/mediator";
import { BaseEvents } from "../../../../core/type/baseEvent";
import { ComponentEvents } from "../../../../core/type/componentEvent";
import { PassengersData } from "../../../../model/passengers";
import type { SpawnData } from "../../../data/spawnData";
import type { Floors } from "../view/floor";
import type { PassengerWidget } from "../view/passenger";

export class FloorsMediator extends Mediator<Floors> {
  protected _passengersData: PassengersData =
    InjectionManager.inject(PassengersData);

  protected initComponentHandlers(): void {
    this.view.on(
      ComponentEvents.passengerArrived,
      this.onPassengerArrived.bind(this)
    );
  }

  protected initHandlers(): void {
    this.addHandler(BaseEvents.passengerSpawned, this.onPassengerSpawned, this);
    this.addHandler(BaseEvents.getPassegerView, this.onGetPassengerView, this);
    this.addHandler(BaseEvents.playShiftQeueue, this.onPlayShiftQueue, this);
    this.addHandler(BaseEvents.getFloorsView, this.onGetFloorView, this);
  }

  protected onGetFloorView({ cb }: { cb: (view: Floors) => void }) {
    cb(this.view);
  }

  protected onPassengerSpawned(data: SpawnData): void {
    this.view.addPassenger(data);
  }

  protected onPlayShiftQueue(data: SpawnData): void {
    this._passengersData.shiftQueue(data.passenger.from);
    this.view.removePassengerFromList(data.passenger.id);
    this.view.playShiftQueue(data);
  }

  protected onPassengerArrived(data: SpawnData): void {
    this.emit(BaseEvents.passengerArrived, data);
  }

  protected onGetPassengerView({
    id,
    cb,
  }: {
    id: string;
    cb: (view: PassengerWidget) => void;
  }): void {
    this.view.getPassenger(id, cb);
  }
}
