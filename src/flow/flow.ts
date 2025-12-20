import { GroupAction } from "../core/action/groupAction";
import { Controller } from "../core/controller/controller";
import { InjectionManager } from "../core/injection/injectionManager";
import { BaseEvents } from "../core/type/baseEvent";
import { CoreEvents } from "../core/type/coreEvent";
import { PassengersData } from "../model/passengers";
import { BuildLayout } from "./action/buildLayout";
import { BuildScene } from "./action/buildScene";
import { ResetData } from "./action/resetData";
import { CapacitySelectorMediator } from "./component/capacitySelector/mediator/capacitySelectorMediator";
import { ElevatorMediator } from "./component/elevator/mediator/elevatorMediator";
import { FloorsMediator } from "./component/floors/mediator/FloorsMediator";
import { FloorsSelectorMediator } from "./component/floorsSelector/mediator/floorsSelectorMediator";
import { SceneContainerMediator } from "./component/sceneContainer/mediator/sceneContainerMediator";
import { PassengersController } from "./controller/passengersController";

export class Flow extends Controller {
  protected initHandlers(): void {
    this.addHandler(CoreEvents.applicationInited, this.onAppReady, this);
    this.addHandler(BaseEvents.floorsChanged, this.onDataChanged, this);
    this.addHandler(BaseEvents.capacityChanged, this.onDataChanged, this);
  }

  protected initInjections(): void {
    //data
    InjectionManager.bind(PassengersData);
    //actions
    InjectionManager.bind(BuildLayout);
    InjectionManager.bind(BuildScene);
    InjectionManager.bind(ResetData);
    //mediators
    InjectionManager.bind(SceneContainerMediator).init();
    InjectionManager.bind(FloorsSelectorMediator).init();
    InjectionManager.bind(CapacitySelectorMediator).init();
    InjectionManager.bind(ElevatorMediator).init();
    InjectionManager.bind(FloorsMediator).init();
    //controllers
    InjectionManager.bind(PassengersController).init();
  }

  protected onAppReady(): void {
    const buildLayoutSequence = new GroupAction();

    buildLayoutSequence.addAction(InjectionManager.inject(BuildLayout));
    buildLayoutSequence.addAction(InjectionManager.inject(BuildScene));
    buildLayoutSequence.addAction(
      InjectionManager.inject(ResetData).onSuccess(() => {
        this.emit(BaseEvents.dataReady);
      })
    );

    buildLayoutSequence.start();
  }

  protected onDataChanged(): void {
    const resetSceneSequence = new GroupAction();
    this.emit(BaseEvents.sceneRebuildStarted);

    resetSceneSequence.addAction(
      InjectionManager.inject(BuildScene).onSuccess(() => {
        this.emit(BaseEvents.sceneRebuildEnded);
      })
    );
    resetSceneSequence.addAction(
      InjectionManager.inject(ResetData).onSuccess(() => {
        this.emit(BaseEvents.dataReady);
      })
    );

    resetSceneSequence.start();
  }
}
