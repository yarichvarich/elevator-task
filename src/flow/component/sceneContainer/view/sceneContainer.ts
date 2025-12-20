import { Container, Sprite } from "pixi.js";
import gsap from "gsap";

import type { TransitionEffectData } from "../../../../core/data/transitionEffectData";
import { snapshotContainer } from "../../../../core/utils/snapshootTool";
import { App } from "../../../../application/app";
import { ComponentLike } from "../../../../core/mixin/componentLike";
import { FloorsSelector } from "../../floorsSelector/view/floorsSelector";

export class SceneContainer extends ComponentLike(Container) {
  public snapshot: Sprite = new Sprite();

  public floorsSelector: FloorsSelector = new FloorsSelector();

  protected onAddedToStage(): void {
    this.addChild(this.snapshot);
    this.addChild(this.floorsSelector);
  }

  public onFloorsChanged(data: TransitionEffectData): void {
    this.snapshot = snapshotContainer(this, this.snapshot, App.renderer);
    this.snapshot.alpha = 1;

    gsap.killTweensOf(this);
    gsap.to(this.snapshot, { alpha: 0, duration: data.duration });
  }
}
