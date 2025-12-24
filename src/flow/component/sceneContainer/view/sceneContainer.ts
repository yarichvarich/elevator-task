import { Container, Sprite } from "pixi.js";
import gsap from "gsap";

import type { TransitionEffectData } from "../../../../core/data/transitionEffectData";
import { snapshotContainer } from "../../../../core/utils/snapshootTool";
import { ComponentLike } from "../../../../core/mixin/componentLike";
import { App } from "../../../../application/app";

export class SceneContainer extends ComponentLike(Container) {
  public snapshot: Sprite = new Sprite();
  public content: Container = new Container();

  constructor() {
    super();

    this.position.x = 100;
    this.position.y = 100;
    this.addChild(this.snapshot);
    this.addChild(this.content);
  }

  public center(): void {
    this.position.x = this._sceneWidth / 2 - this.width / 2;
    this.position.y = this._sceneHeight / 2 - this.height / 2;
  }

  protected onAddedToStage(): void {
    this.center();
  }

  protected onResize(): void {
    this.center();
  }

  protected onRemovedFromStage(): void {
    gsap.killTweensOf(this.snapshot);
    gsap.killTweensOf(this.content);
  }

  public rebuildStarted(): void {
    if (this.children.includes(this.snapshot)) {
      this.removeChild(this.snapshot);
    }

    this.snapshot = snapshotContainer(this, this.snapshot, App.renderer);

    this.addChild(this.snapshot);

    this.snapshot = snapshotContainer(
      this.content,
      this.snapshot,
      App.renderer
    );
    this.snapshot.alpha = 1;
    this.content.alpha = 0;
  }

  public rebuildEnded(data: TransitionEffectData): void {
    gsap.killTweensOf(this.snapshot);
    gsap.to(this.snapshot, { alpha: 0, duration: data.duration });

    gsap.killTweensOf(this.content);
    gsap.to(this.content, { alpha: 1, duration: data.duration });
  }
}
