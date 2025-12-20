import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { ElevatorMediator } from "../component/elevator/mediator/elevatorMediator";
import { Elevator } from "../component/elevator/view/elevator";
import { FloorsMediator } from "../component/floors/mediator/FloorsMediator";
import { Floors } from "../component/floors/view/floor";
import { SceneContainerMediator } from "../component/sceneContainer/mediator/sceneContainerMediator";

export class BuildScene extends Action {
  protected removePreviousBuild(): void {
    const sceneContainerMediator: SceneContainerMediator =
      InjectionManager.inject(SceneContainerMediator);

    const elevatorMediator: ElevatorMediator =
      InjectionManager.inject(ElevatorMediator);

    const floorsMediator: FloorsMediator =
      InjectionManager.inject(FloorsMediator);

    sceneContainerMediator.view.content.removeChild(
      elevatorMediator.view,
      floorsMediator.view
    );
  }

  protected onExecute(): void {
    this.removePreviousBuild();

    const sceneContainerMediator: SceneContainerMediator =
      InjectionManager.inject(SceneContainerMediator);

    const elevatorMediator: ElevatorMediator =
      InjectionManager.inject(ElevatorMediator);

    const floorsMediator: FloorsMediator =
      InjectionManager.inject(FloorsMediator);

    elevatorMediator.view = new Elevator();
    floorsMediator.view = new Floors();

    sceneContainerMediator.view.content.addChild(
      elevatorMediator.view,
      floorsMediator.view
    );

    sceneContainerMediator.view.center();

    this.resolve();
  }
}
