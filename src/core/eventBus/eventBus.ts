import { EventEmitter } from "pixi.js";

import type { Callback } from "../type/callback";

export class EventBus extends EventEmitter {
  static #instance: EventEmitter;

  private constructor() {
    super();
  }

  public static get instance() {
    if (!EventBus.#instance) {
      EventBus.#instance = new EventEmitter();
    }

    return EventBus.#instance;
  }

  public static emit(message: string, data?: any): void {
    EventBus.instance.emit(message, data);
  }

  public static addHandler(message: string, handler: Callback<void>): void {
    EventBus.instance.on(message, handler);
  }

  public static removeHandler(message: string, handler: Callback<void>): void {
    EventBus.instance.off(message, handler);
  }

  public static removeMessageHandlers(message: string): void {
    EventBus.instance.off(message);
  }

  public static removeAllHandlers(): void {
    EventBus.instance.removeAllListeners();
  }
}
