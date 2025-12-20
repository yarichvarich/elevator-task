import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { CoreEvents } from "../../core/type/coreEvent";
import { App } from "../../application/app";
import { ApplicationData } from "../../model/applicationData";

export class InitApplication extends Action {
  protected _appConfig: ApplicationData =
    InjectionManager.inject(ApplicationData);

  protected onExecute(): void {
    const canvas = document.getElementById("app-canvas") as HTMLCanvasElement;

    if (canvas) {
      this._appConfig.canvas = canvas;

      App.init(
        {
          canvas,
          resizeTo: window,
          resolution: window.devicePixelRatio,
          backgroundColor: 0xffffff,
        },
        this.onApplicationInited.bind(this),
        this.onApplicationFailedToInit.bind(this)
      );
    } else {
      throw new Error("Failed to get canvas element");
    }
  }

  protected onApplicationInited(): void {
    this.emit(CoreEvents.applicationInited);
    this.resolve();
  }

  protected onApplicationFailedToInit(): void {}
}
