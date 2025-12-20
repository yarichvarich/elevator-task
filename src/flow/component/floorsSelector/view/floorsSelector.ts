import {
  Container,
  Graphics,
  Text,
  TextStyle,
  FederatedPointerEvent,
  type Renderer,
} from "pixi.js";

import { FloorConfig } from "../../../../model/config/floorConfig";
import { InjectionManager } from "../../../../core/injection/injectionManager";
import { ComponentLike } from "../../../../core/mixin/componentLike";

export class FloorsSelector extends ComponentLike(Container) {
  protected _floorConfig: FloorConfig = InjectionManager.inject(FloorConfig);

  public leftButton: Graphics;
  public rightButton: Graphics;
  public labelText: Text;

  constructor() {
    super();
    this.leftButton = this.createTriangleButton("left");
    this.leftButton.on("pointerdown", this.onLeftClick.bind(this));

    this.rightButton = this.createTriangleButton("right");
    this.rightButton.on("pointerdown", this.onRightClick.bind(this));

    const style = new TextStyle({ fontSize: 24, fill: 0x000000 });
    this.labelText = new Text({
      text: this._floorConfig.floors.toString(),
      style,
    });
    this.labelText.anchor.set(0.5);

    const spacing = 50;
    this.leftButton.position.set(-spacing, 0);
    this.rightButton.position.set(spacing, 0);
    this.labelText.position.set(0, 0);

    this.addChild(this.leftButton, this.rightButton, this.labelText);
  }

  private createTriangleButton(direction: "left" | "right"): Graphics {
    const graphics = new Graphics();
    graphics.interactive = true;
    graphics.eventMode = "static";
    graphics.cursor = "pointer";

    const size = 20;

    graphics
      .moveTo(direction === "left" ? size / 2 : -size / 2, -size)
      .lineTo(direction === "left" ? -size / 2 : size / 2, 0)
      .lineTo(direction === "left" ? size / 2 : -size / 2, size)
      .closePath()
      .fill({ color: 0x3498db })
      .stroke({ width: 2, color: 0x000000 });

    return graphics;
  }

  private onLeftClick(_e: FederatedPointerEvent) {
    if (this.value > this._floorConfig.minFloors) this.value--;
  }

  private onRightClick(_e: FederatedPointerEvent) {
    if (this.value < this._floorConfig.maxFloors) this.value++;
  }

  public get value() {
    return this._floorConfig.floors;
  }
  public set value(v: number) {
    if (v < this._floorConfig.minFloors) v = this._floorConfig.minFloors;
    if (v > this._floorConfig.maxFloors) v = this._floorConfig.maxFloors;
    this._floorConfig.floors = v;
    this.labelText.text = this._floorConfig.floors.toString();
  }

  protected onResize(width: number, height: number): void {
    this.position.set(width / 3, (height * 9) / 10);
  }

  protected onAddedToStage(width: number, height: number): void {
    this.position.set(width / 3, (height * 9) / 10);
  }
}
