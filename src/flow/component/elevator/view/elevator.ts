import { Container, Graphics } from "pixi.js";
import gsap from "gsap";
import { Power0 } from "gsap";

import { ComponentLike } from "../../../../core/mixin/componentLike";
import { ElevatorConfig } from "../../../../model/config/elevatorConfig";
import { InjectionManager } from "../../../../core/injection/injectionManager";
import { ElevatorData } from "../../../../model/elevatorData";
import type { MoveToFloorAnimationData } from "../../../data/moveToFloorAnimationData";
import { FloorConfig } from "../../../../model/config/floorConfig";

export class Elevator extends ComponentLike(Container) {
  protected _elevatorConfig: ElevatorConfig =
    InjectionManager.inject(ElevatorConfig);
  protected _floorConfig: FloorConfig = InjectionManager.inject(FloorConfig);

  protected _elevatorData: ElevatorData = InjectionManager.inject(ElevatorData);

  public graphics: Graphics;

  constructor() {
    super();

    this.graphics = new Graphics();
    this.drawElevator();

    this.addChild(this.graphics);

    this.position.y =
      this._floorConfig.floorHeight *
      (-this._elevatorData.currentFloor - 1 + this._floorConfig.floors);
  }

  protected onRemovedFromStage(): void {
    gsap.killTweensOf(this);
  }

  private drawElevator(): void {
    this.graphics
      .clear()
      .moveTo(0, 0)
      .lineTo(this._elevatorConfig.elevatorWidth, 0)
      .moveTo(0, 0)
      .lineTo(0, this._elevatorConfig.elevatorHeight)
      .moveTo(0, this._elevatorConfig.elevatorHeight)
      .lineTo(
        this._elevatorConfig.elevatorWidth,
        this._elevatorConfig.elevatorHeight
      )
      .stroke({
        width: 4,
        color: 0x000000,
      });
  }

  public playMoveToFloorAnimation(data: MoveToFloorAnimationData): void {
    const delta = data.nextFloor - data.previousFloor;
    const deltaAbs = Math.abs(delta);

    const nextPos = this.y - delta * this._floorConfig.floorHeight;
    gsap.to(this, {
      y: nextPos,
      duration: 0.8 * deltaAbs,
      onComplete: () => {
        if (data.callback) {
          data.callback();
        }
      },
      ease: Power0.easeInOut,
    });
  }
}
