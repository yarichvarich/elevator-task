import gsap from "gsap";

import { EventBus } from "../eventBus/eventBus";
import { ActionStates, type ActionState } from "../type/actionState";
import type { Callback } from "../type/callback";

export abstract class Action {
  protected _onSuccess: Callback<void>[] = [];
  protected _onFailure: Callback<void>[] = [];
  protected _call: ReturnType<typeof gsap.delayedCall> | undefined;
  public state: ActionState = ActionStates.pending;

  public start(...args: any[]): void {
    this.state = ActionStates.started;

    if (!this.guard()) {
      this.resolve();
      return;
    }

    this._call = gsap.delayedCall(0, () => {
      try {
        this.onExecute(args);
      } catch (error) {
        this.state = ActionStates.failed;

        this.invokeOnFailure(error as Error);

        throw error;
      }
    });
  }

  protected guard(): boolean {
    return true;
  }

  public stop(): void {
    this._call?.kill();
  }

  public resolve() {
    this.state = ActionStates.pending;

    if (this._onSuccess) {
      this.invokeOnSuccess();
    }
  }

  protected invokeOnSuccess(): void {
    this._onSuccess.forEach((cb) => {
      cb();
    });

    this._onSuccess = [];
  }

  protected invokeOnFailure(...args: any[]): void {
    this._onFailure.forEach((cb) => {
      cb(args);
    });

    this._onFailure = [];
  }

  public onSuccess(cb: Callback<void>): Action {
    this._onSuccess.push(cb);
    return this;
  }

  public onFailure(cb: Callback<void>): Action {
    this._onFailure.push(cb);
    return this;
  }

  public removeOnSuccess(cb: Callback<void>): Action {
    this._onSuccess = this._onSuccess.filter((_cb) => _cb !== cb);
    return this;
  }

  public removeOnFailure(cb: Callback<void>): Action {
    this._onFailure = this._onFailure.filter((_cb) => _cb !== cb);
    return this;
  }

  public removeAllOnSuccess(): Action {
    this._onSuccess = [];
    return this;
  }

  public removeAllOnFailure(): Action {
    this._onFailure = [];
    return this;
  }

  protected emit(message: string, data?: any) {
    EventBus.emit(message, data);
  }

  protected abstract onExecute(...args: any[]): void;
}
