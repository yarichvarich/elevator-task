import { BaseEffectData } from "../../core/data/baseEffectData";
import type { Callback } from "../../core/type/callback";
import type { Passenger } from "../../core/type/floorQueue";

export class SpawnData extends BaseEffectData {
  public passenger: Passenger;

  constructor(passenger: Passenger, callback?: Callback<void>) {
    super(callback);

    this.passenger = passenger;
  }
}
