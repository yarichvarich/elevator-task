import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { App } from "../../application/app";
import { SceneContainerMediator } from "../component/sceneContainer/mediator/sceneContainerMediator";

export class BuildLayout extends Action {
  protected onExecute(...args: any[]): void {
    const sceneContainerMediator: SceneContainerMediator =
      InjectionManager.inject(SceneContainerMediator);

    App.stage.addChild(sceneContainerMediator.view);
  }
}
