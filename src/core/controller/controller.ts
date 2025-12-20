import { EventBus } from "../eventBus/eventBus";
import type { Callback } from "../type/callback";

export abstract class Controller {
  protected initHandlers(): void {}
  protected initInjections(): void {}

  protected _handlers: Map<Callback<void>, Callback<void>> = new Map();

  protected addHandler(
    message: string,
    handler: Callback<void>,
    scope: any
  ): void {
    const scopedHandler = handler.bind(scope);
    this._handlers.set(handler, scopedHandler);
    EventBus.addHandler(message, scopedHandler);
  }

  protected emit(message: string, data?: any): void {
    EventBus.emit(message, data);
  }

  protected removeHandler(message: string, handler: Callback<void>): void {
    const mapQuery = this._handlers.get(handler);

    if (mapQuery) {
      const scopedHandler = mapQuery;
      EventBus.removeHandler(message, scopedHandler);
    }
  }

  public init(): void {
    this.initHandlers();
    this.initInjections();
  }
}
