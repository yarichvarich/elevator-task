import { Mediator } from "../../../../core/mediator/mediator";
import { BaseEvents } from "../../../../core/type/baseEvent";
import { ComponentEvents } from "../../../../core/type/componentEvent";
import type { CapacitySelector } from "../view/capacitySelector";

export class CapacitySelectorMediator extends Mediator<CapacitySelector> {
  protected initComponentHanlders(): void {
    this.view.on(ComponentEvents.capacityChanged, this.onCapacityChanged, this);
  }

  protected initHandlers(): void {
    this.addHandler(BaseEvents.dataReady, this.onDataReady, this);
  }

  protected onDataReady(): void {
    this.view.locked = false;
  }

  protected onCapacityChanged(): void {
    this.emit(BaseEvents.capacityChanged);
  }
}
