import { Container, Graphics } from "pixi.js";

import { ComponentLike } from "../../../../core/mixin/componentLike";
import { InjectionManager } from "../../../../core/injection/injectionManager";
import { FloorConfig } from "../../../../model/config/floorConfig";
import { ElevatorConfig } from "../../../../model/config/elevatorConfig";
import type { SpawnData } from "../../../data/spawnData";
import { PassengerWidget } from "./passenger";
import { ComponentEvents } from "../../../../core/type/componentEvent";

export class Floors extends ComponentLike(Container) {
  protected _floorsConfig: FloorConfig = InjectionManager.inject(FloorConfig);
  protected _elevatorConfig: ElevatorConfig =
    InjectionManager.inject(ElevatorConfig);

  private graphics: Graphics;
  protected _passengerList: PassengerWidget[] = [];

  constructor() {
    super();

    this.graphics = new Graphics();
    this.addChild(this.graphics);

    this.drawFloors();

    this.position.set(
      this._elevatorConfig.elevatorWidth + 5,
      this._elevatorConfig.elevatorHeight
    );
  }

  public playShiftQueue(data: SpawnData): void {
    this._passengerList.forEach((p) => {
      if (p.data.passenger.from === data.passenger.from) {
        p.shiftPassenger();
      }
    });
  }

  public removePassengerFromList(id: string): void {
    this._passengerList = this._passengerList.filter(
      (p) => p.data.passenger.id !== id
    );
  }

  private drawFloors(): void {
    const { floors, floorHeight } = this._floorsConfig;

    const width = this._floorsConfig.floorWidth;

    this.graphics.clear();

    for (let i = 0; i < floors; i++) {
      const y = i * floorHeight;

      this.graphics.moveTo(0, y).lineTo(width, y);
    }

    this.graphics.stroke({
      width: 2,
      color: 0x000000,
    });
  }

  public addPassenger(data: SpawnData): void {
    const passengerWidget = new PassengerWidget(data);

    data.view = passengerWidget;

    data.on("passengerArrived", () => {
      this.emit(ComponentEvents.passengerArrived, data);
    });

    this._passengerList.push(passengerWidget);
    this.addChild(passengerWidget);
  }

  protected onResize(): void {
    this.drawFloors();
  }

  public getPassenger(id: string, cb: (view: PassengerWidget) => void): void {
    const passenger = this._passengerList.find((p) => p.id === id);

    if (passenger) {
      cb(passenger);
    }
  }
}
