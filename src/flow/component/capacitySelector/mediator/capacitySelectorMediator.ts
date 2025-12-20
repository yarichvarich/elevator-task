import { Mediator } from "../../../../core/mediator/mediator";
import { BaseEvents } from "../../../../core/type/baseEvent";
import type { CapacitySelector } from "../view/capacitySelector";

export class CapacitySelectorMediator extends Mediator<CapacitySelector> {
  protected initHandlers(): void {
    this.addHandler(BaseEvents.floorsChanged, this.onEvent, this);
  }

  protected onEvent() {}
}
