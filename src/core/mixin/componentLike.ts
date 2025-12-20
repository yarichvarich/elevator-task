import type { Container } from "pixi.js";

import { App } from "../../application/app";

type Constructor<T> = new (...args: any[]) => T;

export function ComponentLike<TBase extends Constructor<Container>>(
  Base: TBase
) {
  return class extends Base {
    protected _sceneWidth = 0;
    protected _sceneHeight = 0;

    constructor(...args: any[]) {
      super(...args);

      this.on("added", this._handleAdded);
      this.on("removedfromstage", this._handleRemovedFromStage);
      this.on("destroyed", this._handleDestroyed);
    }

    private _handleAdded = () => {
      this._sceneWidth = App.renderer.width;
      this._sceneHeight = App.renderer.height;
      this.onAddedToStage(this._sceneWidth, this._sceneHeight);
      App.renderer.on("resize", this._handleResize);
    };

    private _handleRemovedFromStage = () => {
      App.renderer.off("resize", this._handleResize);
      this.onRemovedFromStage();
    };

    private _handleDestroyed = () => {
      App.renderer.off("resize", this._handleResize);
      this.onRemovedFromStage();
    };

    private _handleResize = (w: number, h: number) => {
      this._sceneWidth = w;
      this._sceneHeight = h;
      this.onResize(w, h);
    };

    protected onAddedToStage(_: number, __: number): void {}
    protected onRemovedFromStage(): void {}
    protected onResize(_: number, __: number): void {}
  };
}
