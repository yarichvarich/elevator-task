import type { EventEmitter } from "pixi.js";

import { Controller } from "../controller/controller";

export abstract class Mediator<
  ViewType extends EventEmitter,
> extends Controller {
  protected _view: ViewType;

  constructor(view: ViewType) {
    super();

    this._view = view;
  }

  protected initComponentHandlers(): void {}

  public set view(component: ViewType) {
    if (this._view) this._view.removeAllListeners();

    this._view = component;
    this.initComponentHandlers();
  }

  public get view(): ViewType {
    return this._view;
  }
}
