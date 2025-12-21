import { Mediator } from "../../../../core/mediator/mediator";
import { BaseEvents } from "../../../../core/type/baseEvent";
import { ComponentEvents } from "../../../../core/type/componentEvent";
import type { FloorsSelector } from "../view/floorsSelector";

export class FloorsSelectorMediator extends Mediator<FloorsSelector> {
  protected initComponentHandlers(): void {
    this.view.on(
      ComponentEvents.floorsChanged,
      this.onFloorsChanged.bind(this)
    );
  }

  protected initHandlers(): void {
    this.addHandler(BaseEvents.dataReady, this.onDataReady, this);
  }

  protected onDataReady(): void {
    this.view.locked = false;
  }

  protected onFloorsChanged(): void {
    this.emit(BaseEvents.floorsChanged);
  }
}
