import { GroupAction } from "../core/action/groupAction";
import { InjectionManager } from "../core/injection/injectionManager";
import { HideOverlay } from "./action/hideOverlay";
import { InitApplication } from "./action/initApplication";
import { ApplicationData } from "./model/applicationData";
import { ElevatorConfig } from "./model/config/elevatorConfig";
import { FloorConfig } from "./model/config/floorConfig";

export class Boot {
  public start() {
    this.initInjections();
    this.executeBootSequence();
  }

  private initInjections() {
    //data
    InjectionManager.bind(ElevatorConfig);
    InjectionManager.bind(FloorConfig);
    InjectionManager.bind(ApplicationData);
    //actions
    InjectionManager.bind(InitApplication);
    InjectionManager.bind(HideOverlay);
  }

  private onSuccess(): void {
    console.log("Boot sequence completed");
  }

  private onFailure(): void {
    console.log("Boot sequence failed");
  }

  private executeBootSequence(): void {
    const bootSequenceAction = new GroupAction();

    bootSequenceAction.addAction(InjectionManager.inject(InitApplication));
    bootSequenceAction.addAction(InjectionManager.inject(HideOverlay));
    bootSequenceAction
      .onSuccess(this.onSuccess.bind(this))
      .onFailure(this.onFailure.bind(this));

    bootSequenceAction.start();
  }
}
