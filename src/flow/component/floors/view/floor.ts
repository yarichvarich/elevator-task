import { Container, Graphics } from "pixi.js";

import { ComponentLike } from "../../../../core/mixin/componentLike";
import { InjectionManager } from "../../../../core/injection/injectionManager";
import { FloorConfig } from "../../../../model/config/floorConfig";
import { ElevatorConfig } from "../../../../model/config/elevatorConfig";
import type { SpawnData } from "../../../data/spawnData";
import { PassengerWidget } from "./passenger";

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

    this._passengerList.push(passengerWidget);
    this.addChild(passengerWidget);
  }

  protected onResize(width: number, height: number): void {
    this.drawFloors();
  }
}
