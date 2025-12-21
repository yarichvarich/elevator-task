import { BaseEffectData } from "../../core/data/baseEffectData";
import type { Callback } from "../../core/type/callback";

export class MoveToFloorAnimationData extends BaseEffectData {
  public previousFloor: number;
  public nextFloor: number;

  constructor(
    previousFloor: number,
    nextFloor: number,
    callback?: Callback<void>
  ) {
    super(callback);

    this.previousFloor = previousFloor;
    this.nextFloor = nextFloor;
  }
}
