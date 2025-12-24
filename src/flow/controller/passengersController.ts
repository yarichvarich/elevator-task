import { v4 as uuidv4 } from "uuid";
import gsap from "gsap";

import { Controller } from "../../core/controller/controller";
import { InjectionManager } from "../../core/injection/injectionManager";
import { FloorConfig } from "../../model/config/floorConfig";
import { PassengersData } from "../../model/passengers";
import { BaseEvents } from "../../core/type/baseEvent";
import { SpawnData } from "../data/spawnData";

export class PassengersController extends Controller {
  protected _passengersData: PassengersData =
    InjectionManager.inject(PassengersData);
  protected _floorsConfig: FloorConfig = InjectionManager.inject(FloorConfig);
  protected _readyToExecute = false;

  protected _spawnCall?: ReturnType<typeof gsap.delayedCall>;
  protected _spawnInterval: number = 4;

  protected initHandlers(): void {
    this.addHandler(BaseEvents.floorsChanged, this.onDataChanged, this);
    this.addHandler(BaseEvents.capacityChanged, this.onDataChanged, this);
    this.addHandler(BaseEvents.dataReady, this.startSpawn, this);
    this.addHandler(BaseEvents.playShiftQeueue, this.startSpawn, this);
  }

  protected onDataChanged(): void {
    this._readyToExecute = false;
    this._spawnCall?.kill();
  }

  protected startSpawn() {
    this._readyToExecute = true;

    this._spawnCall = gsap.delayedCall(
      this._spawnInterval,
      this.spawnPassenger.bind(this)
    );
  }

  protected spawnPassenger(): void {
    if (!this._readyToExecute) {
      return;
    }

    const freeFloors = this._passengersData.floorQueues.filter(
      (q) => q.queue.length < this._floorsConfig.maxFloorCapacity
    );

    if (freeFloors.length === 0) {
      return;
    }

    const randomFromFloorIdx = Math.floor(Math.random() * freeFloors.length);

    const randomFloor = this._passengersData.floorQueues.find(
      (q) => q.id === freeFloors[randomFromFloorIdx].id
    );

    const otherFloors = this._passengersData.floorQueues.filter(
      (q) => q.id !== randomFloor?.id
    );

    const randomToFloorIdx = Math.floor(Math.random() * otherFloors.length);

    const targetRandomFloor = this._passengersData.floorQueues.find(
      (q) => q.id === otherFloors[randomToFloorIdx].id
    );

    if (randomFloor === undefined || targetRandomFloor === undefined) {
      return;
    }

    const passenger = {
      id: uuidv4(),
      from: randomFloor?.id,
      to: targetRandomFloor?.id,
    };

    randomFloor.queue.push(passenger);
    this.emit(
      BaseEvents.passengerSpawned,
      new SpawnData(passenger, randomFloor.queue.length - 1)
    );
    this._spawnCall = gsap.delayedCall(
      this._spawnInterval,
      this.spawnPassenger.bind(this)
    );
  }
}
