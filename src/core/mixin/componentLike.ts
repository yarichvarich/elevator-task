type Constructor<T> = new (...args: any[]) => T;

export function ComponentLike<TBase extends Constructor<any>>(Base: TBase) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);

      this.on("added", this._handleAdded);
    }

    private _handleAdded() {
      this.onAddedToStage();
    }

    protected onAddedToStage(): void {}
  };
}
