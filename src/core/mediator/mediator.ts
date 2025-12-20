import { Controller } from "../controller/controller";

export abstract class Mediator<ViewType> extends Controller {
  protected _view: ViewType;

  constructor(view: ViewType) {
    super();

    this._view = view;
  }

  public set view(component: ViewType) {
    this._view = component;
  }

  public get view(): ViewType {
    return this._view;
  }
}
