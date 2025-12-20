import gsap from "gsap";

import { Action } from "../../core/action/action";

export class HideOverlay extends Action {
  protected onExecute(): void {
    const overlay = document.getElementById("boot-overlay");

    if (overlay) {
      overlay.classList.add("hidden");
      gsap.delayedCall(1, () => {
        overlay.remove();
        this.resolve();
      });
    }
  }
}
