import { BaseEffectData } from "../../core/data/baseEffectData";
import type { Callback } from "../../core/type/callback";

export class LoadPassengerAnimationData extends BaseEffectData {
  public destination: number = 0;

  constructor(destination: number, callback: Callback<void>) {
    super(callback);
    this.destination = destination;
  }
}
