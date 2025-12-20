import { Container, Graphics } from "pixi.js";

import { ComponentLike } from "../../../../core/mixin/componentLike";

export class Elevator extends ComponentLike(Container) {
  public static elevatorWidth: number = 40;
  public static elevatorHeight: number = 60;

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
      .lineTo(Elevator.elevatorWidth, 0)
      .moveTo(0, 0)
      .lineTo(0, Elevator.elevatorHeight)
      .moveTo(0, Elevator.elevatorHeight)
      .lineTo(Elevator.elevatorWidth, Elevator.elevatorHeight)
      .stroke({
        width: 4,
        color: 0x000000,
      });
  }
}
