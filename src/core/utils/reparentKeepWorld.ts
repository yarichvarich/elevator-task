import { Container } from "pixi.js";

export function reparentKeepWorldPosition(child: any, newParent: Container) {
  const global = child.getGlobalPosition();
  newParent.addChild(child);
  child.position.copyFrom(newParent.toLocal(global));
}
