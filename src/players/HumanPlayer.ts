import { Raycaster, Vector3 } from "three";
import { Action } from "../actions";
import { inputManager } from "../InputManager";
import { GameObject } from "../objects/GameObject";
import { World } from "../world";
import { Player } from "./Player";

export class HumanPlayer extends Player {
  override name: string = "HumanPlayer";
  private _ray_caster = new Raycaster();

  constructor(coords: Vector3, world: World) {
    super(coords, world);
    this._ray_caster.layers.disable(1);
  }

  override async getTargetSquare(): Promise<Vector3 | null> {
    return inputManager.getTargetSquare();
  }

  override async getTargetObject(): Promise<GameObject | null> {
    return inputManager.getTargetObject();
  }

  override async requestAction(): Promise<Action | null> {
    const actions_container = document.getElementById("actions");
    if (!actions_container) return null;

    actions_container.innerHTML = "";

    const actions = this.getActions();

    return new Promise((resolve) => {
      actions.forEach((action) => {
        const button = document.createElement("button");
        button.innerText = action.name;
        button.onclick = () => resolve(action);
        actions_container.append(button);
      });
    });
  }
}
