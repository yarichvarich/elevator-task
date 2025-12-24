import { Container, Graphics, Text, TextStyle } from "pixi.js";
import gsap from "gsap";

import { ComponentLike } from "../../../../core/mixin/componentLike";
import type { SpawnData } from "../../../data/spawnData";
import { ElevatorConfig } from "../../../../model/config/elevatorConfig";
import { InjectionManager } from "../../../../core/injection/injectionManager";
import { FloorConfig } from "../../../../model/config/floorConfig";
import { PassengerConfig } from "../../../../model/config/passengerConfig";
import { PassengersData } from "../../../../model/passengers";
import type { LoadPassengerAnimationData } from "../../../data/loadPassengerAnimationData";
import type { UnloadPassengerAnimationData } from "../../../data/unloadPassengerAnimationData";

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
  protected _unloadAnimation: any;

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

    this._data.view = this;

    this.setupInitialAnimation();
  }

  protected onRemovedFromStage() {
    if (this._unloadAnimation) {
      this._unloadAnimation.kill();
      this._unloadAnimation = undefined;
    }

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
    gsap.killTweensOf(this);
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

          this._data.emit("passengerArrived", this._data);
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

  public playLoadAnimation(data: LoadPassengerAnimationData): void {
    gsap.killTweensOf(this);

    gsap.to(this, {
      x: data.destination,
      onComplete: () => {
        if (data.callback) {
          data.callback();
        }
      },
    });
  }

  public playUnloadAnimation(data: UnloadPassengerAnimationData): void {
    gsap.killTweensOf(this);

    const animation = gsap.timeline();
    this._unloadAnimation = animation;

    animation.to(this, {
      x: data.destination,
      onComplete: () => {
        if (!this.parent) return;
        if (data.callback) {
          data.callback();
        }
      },
      duration: 0.6,
    });
    animation.to(this, {
      x: this._floorsConfig.floorWidth,
      duration: 15,
      onComplete: () => {
        if ((this as any).destroyed) return;
        this.destroy();
      },
    });
  }

  public shiftPassenger(): void {
    if (this._data.queuePosition !== 0) {
      this._data.queuePosition--;
    }

    this.setupInitialAnimation();
  }

  public get id(): string {
    if (this._data) {
      return this._data.passenger.id;
    }
    return "";
  }

  public get data(): SpawnData {
    return this._data;
  }
}
