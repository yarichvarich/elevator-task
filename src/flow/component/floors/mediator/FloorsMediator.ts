import { Mediator } from "../../../../core/mediator/mediator";
import { BaseEvents } from "../../../../core/type/baseEvent";
import type { SpawnData } from "../../../data/spawnData";
import type { Floors } from "../view/floor";

export class FloorsMediator extends Mediator<Floors> {
  protected initHandlers(): void {
    this.addHandler(BaseEvents.passengerSpawned, this.onPassengerSpawned, this);
  }

  protected onPassengerSpawned(data: SpawnData): void {
    this.view.addPassenger(data);
  }
}
