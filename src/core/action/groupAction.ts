import { Action } from "./action";

export class GroupAction extends Action {
  protected _actions: Action[] = [];

  protected onExecute(): void {
    if (this._actions.length !== 0) {
      const firstAction = this._actions[0];
      const lastAction = this._actions[this._actions.length - 1];

      lastAction.onSuccess(this.resolve.bind(this));
      firstAction.start();
    }
  }

  public addAction(action: Action): void {
    if (this._actions.length !== 0) {
      const lastAction = this._actions[this._actions.length - 1];

      lastAction.onSuccess(() => {
        action.start();
      });
    }
    this._actions.push(action);
  }
}
