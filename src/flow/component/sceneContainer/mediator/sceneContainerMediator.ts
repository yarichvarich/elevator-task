import type { TransitionEffectData } from "../../../../core/data/transitionEffectData";
import { Mediator } from "../../../../core/mediator/mediator";
import { BaseEvents } from "../../../../core/type/baseEvent";
import { SceneContainer } from "../view/sceneContainer";

export class SceneContainerMediator extends Mediator<SceneContainer> {
  protected initHandlers(): void {
    this.addHandler(BaseEvents.floorsChanged, this.onFloorsChanged, this);
  }

  protected onFloorsChanged(data: TransitionEffectData): void {
    this.view.onFloorsChanged(data);
  }
}
