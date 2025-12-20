import type { Callback } from "../type/callback";
import { BaseEffectData } from "./baseEffectData";

export class TransitionEffectData extends BaseEffectData {
  public duration: number;

  constructor(duration: number, callback?: Callback<void>) {
    super(callback);

    this.duration = duration;
  }
}
