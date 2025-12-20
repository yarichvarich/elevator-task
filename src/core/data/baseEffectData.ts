import { EventEmitter } from "pixi.js";

import type { Callback } from "../type/callback";

export class BaseEffectData extends EventEmitter {
  public callback?: Callback<void>;

  constructor(callback?: Callback<void>) {
    super();
    this.callback = callback;
  }
}
