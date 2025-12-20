import type { Container } from "pixi.js";

import { App } from "../../application/app";

type Constructor<T> = new (...args: any[]) => T;

export function ComponentLike<TBase extends Constructor<Container>>(
  Base: TBase
) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);

      this.on("added", this._handleAdded);
      this.on("removed", this._handleRemoved);
    }

    private _handleAdded = () => {
      this.onAddedToStage(App.renderer.width, App.renderer.height);

      App.renderer.on("resize", this._handleResize);
    };

    private _handleRemoved = () => {
      App.renderer.off("resize", this._handleResize);

      this.onRemovedFromStage();
    };

    private _handleResize = (width: number, height: number) => {
      this.onResize(width, height);
    };

    protected onAddedToStage(width: number, height: number): void {}

    protected onRemovedFromStage(): void {}

    protected onResize(width: number, height: number): void {}
  };
}
