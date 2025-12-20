import { TransitionEffectData } from "../../../../core/data/transitionEffectData";
import { Mediator } from "../../../../core/mediator/mediator";
import { BaseEvents } from "../../../../core/type/baseEvent";
import { SceneContainer } from "../view/sceneContainer";

export class SceneContainerMediator extends Mediator<SceneContainer> {
  protected initHandlers(): void {
    this.addHandler(
      BaseEvents.sceneRebuildStarted,
      this.onRebuildStarted,
      this
    );
    this.addHandler(BaseEvents.capacityChanged, this.onRebuildStarted, this);
    this.addHandler(BaseEvents.sceneRebuildEnded, this.onRebuildEnded, this);
  }

  protected onRebuildStarted(): void {
    this.view.rebuildStarted();
  }

  protected onRebuildEnded(): void {
    this.view.rebuildEnded(new TransitionEffectData(0.7));
  }
}
