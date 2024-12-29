import { Raycaster, Vector2, Vector3 } from "three";
import { Action } from "../actions";
import { Player } from "./Player";
import { GameObject } from "../objects/GameObject";

export class HumanPlayer extends Player {
  override name: string = "HumanPlayer";
  private _ray_caster = new Raycaster();

  override async getTargetSquare(): Promise<Vector3 | null> {
    return new Promise((resolve) => {
      const onMouseDown = (event: MouseEvent) => {
        console.log("Mouse event", event);
        const coords = new Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
        );

        this._ray_caster.setFromCamera(coords, this._camera);
        const intersections = this._ray_caster.intersectObject(
          this._world.terrain
        );

        if (intersections.length > 0) {
          const selected_coords = new Vector3(
            Math.floor(intersections[0].point.x),
            0,
            Math.floor(intersections[0].point.z)
          );
          console.log("Selected coordinates", selected_coords);
          window.removeEventListener("mousedown", onMouseDown);
          resolve(selected_coords);
        }
      };

      window.addEventListener("mousedown", onMouseDown);
      console.log("Waiting for player to selected a target square");
    });
  }

  override async getTargetObject(): Promise<GameObject | null> {
    return new Promise((resolve) => {
      const onMouseDown = (event: MouseEvent) => {
        console.log("Mouse event", event);
        const coords = new Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
        );

        this._ray_caster.setFromCamera(coords, this._camera);
        const intersections = this._ray_caster.intersectObject(
          this._world.objects,
          // This parameter makes the method search through whole object hierarchy
          true
        );

        if (intersections.length > 0) {
          // Intersection is occurring with the mesh
          // The parent of the mesh is the GameObject
          const selected_object = intersections[0].object.parent;
          console.log("Selected target", selected_object);
          if (!selected_object) return resolve(null);
          window.removeEventListener("mousedown", onMouseDown);
          resolve(selected_object as GameObject);
        }
      };

      window.addEventListener("mousedown", onMouseDown);
      console.log("Waiting for player to selected a target object");
    });
  }

  override async requestAction(): Promise<Action | null> {
    const status_text = document.getElementById("status-text");
    const actions_container = document.getElementById("actions");
    if (!status_text || !actions_container) return null;

    actions_container.innerHTML = "";

    const actions = this.getActions();

    status_text.innerText = `Waiting for ${this.name} to select an action`;

    return new Promise((resolve) => {
      actions.forEach((action) => {
        const button = document.createElement("button");
        button.innerText = action.name;
        button.onclick = () => {
          console.log("Selected action", action.name);
          resolve(action);
        };
        actions_container.append(button);
      });
    });
  }
}
