import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { App } from "../../application/app";
import { SceneContainerMediator } from "../component/sceneContainer/mediator/sceneContainerMediator";
import { FloorsSelectorMediator } from "../component/floorsSelector/mediator/floorsSelectorMediator";
import { CapacitySelectorMediator } from "../component/capacitySelector/mediator/capacitySelectorMediator";
import { SceneContainer } from "../component/sceneContainer/view/sceneContainer";
import { FloorsSelector } from "../component/floorsSelector/view/floorsSelector";
import { CapacitySelector } from "../component/capacitySelector/view/capacitySelector";

export class BuildLayout extends Action {
  protected onExecute(): void {
    const sceneContainerMediator: SceneContainerMediator =
      InjectionManager.inject(SceneContainerMediator);
    const floorsSelectorMediator: FloorsSelectorMediator =
      InjectionManager.inject(FloorsSelectorMediator);
    const capacitySelectorMediator: CapacitySelectorMediator =
      InjectionManager.inject(CapacitySelectorMediator);

    sceneContainerMediator.view = new SceneContainer();

    floorsSelectorMediator.view = new FloorsSelector();
    capacitySelectorMediator.view = new CapacitySelector();

    App.stage.addChild(
      sceneContainerMediator.view,
      floorsSelectorMediator.view,
      capacitySelectorMediator.view
    );

    this.resolve();
  }
}
