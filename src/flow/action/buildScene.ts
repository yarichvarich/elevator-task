import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { ElevatorMediator } from "../component/elevator/mediator/elevatorMediator";
import { Elevator } from "../component/elevator/view/elevator";
import { FloorsMediator } from "../component/floors/mediator/floorsMediator";
import { Floors } from "../component/floors/view/floor";
import { SceneContainerMediator } from "../component/sceneContainer/mediator/sceneContainerMediator";

export class BuildScene extends Action {
  protected removePreviousBuild(): void {
    const sceneContainerMediator = InjectionManager.inject(
      SceneContainerMediator
    );

    const elevatorMediator = InjectionManager.inject(ElevatorMediator);

    const floorsMediator = InjectionManager.inject(FloorsMediator);

    const oldElevator = elevatorMediator.view;
    const oldFloors = floorsMediator.view;

    if (oldElevator) {
      sceneContainerMediator.view.content.removeChild(oldElevator);
      oldElevator.destroy({ children: true });
    }

    if (oldFloors) {
      sceneContainerMediator.view.content.removeChild(oldFloors);
      oldFloors.destroy({ children: true });
    }
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
