import type { Constructor } from "../type/constructor";

export class InjectionManager {
  static #instance: InjectionManager;

  private _mappings: Map<Constructor<any>, any> = new Map();

  private constructor() {}

  public static get instance(): InjectionManager {
    if (!InjectionManager.#instance) {
      InjectionManager.#instance = new InjectionManager();
    }
    return InjectionManager.#instance;
  }

  public static bind(c: Constructor<any>): void {
    const mappingQuery = InjectionManager.instance._mappings.get(c);

    if (!mappingQuery) {
      InjectionManager.instance._mappings.set(c, new c());
    }
  }

  public static inject(c: Constructor<any>): any {
    const mappingQuery = InjectionManager.instance._mappings.get(c);

    if (!mappingQuery) {
      throw new Error("instance was not binded");
    }

    return mappingQuery;
  }
}
