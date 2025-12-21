import { Mediator } from "../../../../core/mediator/mediator";
import { BaseEvents } from "../../../../core/type/baseEvent";
import type { MoveToFloorAnimationData } from "../../../data/moveToFloorAnimationData";
import type { Elevator } from "../view/elevator";

export class ElevatorMediator extends Mediator<Elevator> {
  protected initHandlers(): void {
    this.addHandler(
      BaseEvents.playMoveToFloorAnimation,
      this.onPlayMoveToFloorAnimation,
      this
    );

    this.addHandler(BaseEvents.getElevatorView, this.onGetElevatorView, this);
  }

  protected onPlayMoveToFloorAnimation(data: MoveToFloorAnimationData): void {
    this.view.playMoveToFloorAnimation(data);
  }

  protected onGetElevatorView({ cb }: { cb: (view: Elevator) => void }): void {
    cb(this.view);
  }
}
