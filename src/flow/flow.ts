import { Controller } from "../core/controller/controller";
import { TransitionEffectData } from "../core/data/transitionEffectData";
import { InjectionManager } from "../core/injection/injectionManager";
import { BaseEvents } from "../core/type/baseEvent";
import { CoreEvents } from "../core/type/coreEvent";
import { BuildLayout } from "./action/buildLayout";
import { SceneContainerMediator } from "./component/sceneContainer/mediator/sceneContainerMediator";

export class Flow extends Controller {
  protected initHandlers(): void {
    this.addHandler(CoreEvents.applicationInited, this.onAppReady, this);
  }

  protected initInjections(): void {
    //actions
    InjectionManager.bind(BuildLayout);
    //mediators
    InjectionManager.bind(SceneContainerMediator).init();
  }

  protected onAppReady(): void {
    InjectionManager.inject(BuildLayout).start();

    setInterval(() => {
      this.emit(BaseEvents.floorsChanged, new TransitionEffectData(0.5));
    }, 1000);
  }
}
