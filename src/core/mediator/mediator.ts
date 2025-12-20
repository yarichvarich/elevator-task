import { Controller } from "../controller/controller";

export abstract class Mediator<ViewType> extends Controller {
  protected _view: ViewType;

  protected createComponents(): void {}

  constructor(view: ViewType) {
    super();

    this._view = view;
  }

  public init(): void {
    super.init();

    this.createComponents();
  }

  public set view(component: ViewType) {
    this._view = component;
  }

  public get view(): ViewType {
    return this._view;
  }
}
