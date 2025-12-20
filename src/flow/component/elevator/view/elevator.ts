import { Container, Graphics } from "pixi.js";

import { ComponentLike } from "../../../../core/mixin/componentLike";
import { ElevatorConfig } from "../../../../model/config/elevatorConfig";
import { InjectionManager } from "../../../../core/injection/injectionManager";

export class Elevator extends ComponentLike(Container) {
  protected _elevatorConfig: ElevatorConfig =
    InjectionManager.inject(ElevatorConfig);

  public graphics: Graphics;

  constructor() {
    super();

    this.graphics = new Graphics();
    this.drawElevator();

    this.addChild(this.graphics);
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
}
