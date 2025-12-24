import { Action } from "../../core/action/action";
import { InjectionManager } from "../../core/injection/injectionManager";
import { ElevatorConfig } from "../../model/config/elevatorConfig";
import { ElevatorData } from "../../model/elevatorData";
import { LoadPassengerAnimationData } from "../data/loadPassengerAnimationData";

export class SortAdditionalPassengers extends Action {
  protected _elevatorData: ElevatorData = InjectionManager.inject(ElevatorData);
  protected _elevatorConfig: ElevatorConfig =
    InjectionManager.inject(ElevatorConfig);

  protected guard(): boolean {
    return super.guard() && this._elevatorData.needSorting;
  }

  onExecute(): void {
    const viewList = this._elevatorData.additionalPassengers
      .map((p) => p.view)
      .filter((v) => !!v);

    const maxCapacity = this._elevatorConfig.capacity;
    const elevatorWidth = this._elevatorConfig.elevatorWidth;

    if (viewList.length === 0) {
      this.resolve();
      return;
    }

    viewList.forEach((v, idx) => {
      const passengerDestination = +(idx / maxCapacity) * elevatorWidth + v.x;

      v?.playLoadAnimation(
        new LoadPassengerAnimationData(passengerDestination, () => {
          if (idx === viewList.length - 1) {
            this._elevatorData.needSorting = false;
            this.resolve();
          }
        })
      );
    });
  }
}
