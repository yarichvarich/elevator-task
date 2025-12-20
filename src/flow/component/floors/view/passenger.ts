import { Container, Graphics, Text, TextStyle } from "pixi.js";
import gsap from "gsap";

import { ComponentLike } from "../../../../core/mixin/componentLike";
import type { SpawnData } from "../../../data/spawnData";
import { ElevatorConfig } from "../../../../model/config/elevatorConfig";
import { InjectionManager } from "../../../../core/injection/injectionManager";
import { FloorConfig } from "../../../../model/config/floorConfig";
import { PassengerConfig } from "../../../../model/config/passengerConfig";
import { PassengersData } from "../../../../model/passengers";

export class PassengerWidget extends ComponentLike(Container) {
  protected _elevatorConfig: ElevatorConfig =
    InjectionManager.inject(ElevatorConfig);
  protected _floorsConfig: FloorConfig = InjectionManager.inject(FloorConfig);
  protected _passengerConfig: PassengerConfig =
    InjectionManager.inject(PassengerConfig);
  protected _passengersData: PassengersData =
    InjectionManager.inject(PassengersData);

  public graphic: Graphics;
  public textLabel: Text;

  protected _data: SpawnData;

  constructor(data: SpawnData) {
    super();

    this._data = data;

    this.pivot.x = this._passengerConfig.passengerWidth;
    this.pivot.y = this._passengerConfig.passengerHeight;

    this.position.x = this._floorsConfig.floorWidth;
    this.position.y =
      this._floorsConfig.floorHeight *
      (this._floorsConfig.floors - 1 - data.passenger.from);
    this.graphic = new Graphics();
    this.addChild(this.graphic);

    const style = new TextStyle({
      fontSize: 14,
      fill: 0xffffff,
      align: "center",
    });

    this.textLabel = new Text({
      text: data.passenger.to,
      style,
    });
    this.draw();

    this.textLabel.anchor.set(0.5);
    this.textLabel.position.set(
      this.graphic.width / 2,
      this.graphic.height / 2
    );
    this.addChild(this.textLabel);

    this.setupInitialAnimation();
  }

  protected onRemovedFromStage() {
    gsap.killTweensOf(this);
  }

  protected getTargetPositionX() {
    return (
      this._data.queuePosition *
        (this._passengerConfig.passengerWidth +
          this._passengerConfig.personalSpace) +
      this._passengerConfig.passengerWidth
    );
  }

  public setupInitialAnimation(): void {
    const targetPosition = this.getTargetPositionX();
    const duration =
      Math.abs(targetPosition - this.x) / this._passengerConfig.passengerSpeed;

    gsap.to(this, {
      x: targetPosition,
      duration,
      onComplete: () => {
        if (this._data.queuePosition === 0) {
          this._passengersData.floorQueues[this._data.passenger.from].isReady =
            true;
        }
      },
    });
  }

  private draw(): void {
    const goingUp = this._data.passenger.from < this._data.passenger.to;
    const color = goingUp ? 0x2ecc71 : 0xe74c3c;

    this.graphic
      .clear()
      .rect(0, 0, 15, 25)
      .fill({ color })
      .stroke({ width: 2, color: 0x000000 });
  }
}
