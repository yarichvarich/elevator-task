import { GroupAction } from "../core/action/groupAction";
import { Controller } from "../core/controller/controller";
import { InjectionManager } from "../core/injection/injectionManager";
import { BaseEvents } from "../core/type/baseEvent";
import { CoreEvents } from "../core/type/coreEvent";
import { ElevatorData } from "../model/elevatorData";
import { PassengersData } from "../model/passengers";
import { BuildLayout } from "./action/buildLayout";
import { BuildScene } from "./action/buildScene";
import { LoadAdditionalPassenger } from "./action/loadAdditionalPassenger";
import { LoadPassenger } from "./action/loadPassenger";
import { MoveToThePassenger } from "./action/moveToThePassenger";
import { ResetData } from "./action/resetData";
import { SortAdditionalPassengers } from "./action/sortAdditionalPassengers";
import { UnloadAdditionalPassenger } from "./action/unloadAdditionalPassenger";
import { UnloadPassengers } from "./action/unloadPassengers";
import { CapacitySelectorMediator } from "./component/capacitySelector/mediator/capacitySelectorMediator";
import { ElevatorMediator } from "./component/elevator/mediator/elevatorMediator";
import { FloorsMediator } from "./component/floors/mediator/floorsMediator";
import { FloorsSelectorMediator } from "./component/floorsSelector/mediator/floorsSelectorMediator";
import { SceneContainerMediator } from "./component/sceneContainer/mediator/sceneContainerMediator";
import { ElevatorController } from "./controller/elevatorController";
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
    InjectionManager.bind(ElevatorData);
    //actions
    InjectionManager.bind(BuildLayout);
    InjectionManager.bind(BuildScene);
    InjectionManager.bind(ResetData);
    InjectionManager.bind(MoveToThePassenger);
    InjectionManager.bind(UnloadPassengers);
    InjectionManager.bind(LoadPassenger);
    InjectionManager.bind(LoadAdditionalPassenger);
    InjectionManager.bind(UnloadAdditionalPassenger);
    InjectionManager.bind(SortAdditionalPassengers);
    //mediators
    InjectionManager.bind(SceneContainerMediator).init();
    InjectionManager.bind(FloorsSelectorMediator).init();
    InjectionManager.bind(CapacitySelectorMediator).init();
    InjectionManager.bind(ElevatorMediator).init();
    InjectionManager.bind(FloorsMediator).init();
    //controllers
    InjectionManager.bind(PassengersController).init();
    InjectionManager.bind(ElevatorController).init();
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
      InjectionManager.inject(ResetData).onSuccess(() => {
        this.emit(BaseEvents.dataReady);
      })
    );
    resetSceneSequence.addAction(
      InjectionManager.inject(BuildScene).onSuccess(() => {
        this.emit(BaseEvents.sceneRebuildEnded);
      })
    );

    resetSceneSequence.start();
  }
}
