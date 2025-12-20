import { Controller } from "../core/controller/controller";
import { InjectionManager } from "../core/injection/injectionManager";
import { CoreEvents } from "../core/type/coreEvent";
import { BuildLayout } from "./action/buildLayout";
import { CapacitySelectorMediator } from "./component/capacitySelector/mediator/capacitySelectorMediator";
import { ElevatorMediator } from "./component/elevator/mediator/elevatorMediator";
import { FloorsSelectorMediator } from "./component/floorsSelector/mediator/floorsSelectorMediator";
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
    InjectionManager.bind(FloorsSelectorMediator).init();
    InjectionManager.bind(CapacitySelectorMediator).init();
    InjectionManager.bind(ElevatorMediator).init();
  }

  protected onAppReady(): void {
    InjectionManager.inject(BuildLayout).start();
  }
}
