import {
  Application,
  Container,
  type ApplicationOptions,
  type Renderer,
} from "pixi.js";

import type { Callback } from "../../core/type/callback";

export class App {
  private _pixiApp: Application = new Application();

  static #instance: App;

  public static get instance(): App {
    if (!App.#instance) {
      App.#instance = new App();
    }

    return App.#instance;
  }

  public static init(
    options: Partial<ApplicationOptions>,
    onSuccess: Callback<void>,
    onFailure: Callback<void>
  ): void {
    App.instance._pixiApp
      .init(options)
      .catch(onFailure.bind(this))
      .then(onSuccess.bind(this));
  }

  public static get stage(): Container {
    return App.instance._pixiApp.stage;
  }

  public static get renderer(): Renderer {
    return App.instance._pixiApp.renderer;
  }
}
