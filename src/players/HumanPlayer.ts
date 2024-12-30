import { Camera, Raycaster, Vector2, Vector3 } from "three";
import { Action } from "../actions";
import { Player } from "./Player";
import { GameObject } from "../objects/GameObject";
import { World } from "../world";
import { updateStatus } from "../utils";

export class HumanPlayer extends Player {
  override name: string = "HumanPlayer";
  private _ray_caster = new Raycaster();

  constructor(coords: Vector3, camera: Camera, world: World) {
    super(coords, camera, world);
    this._ray_caster.layers.disable(1);
  }

  override async getTargetSquare(): Promise<Vector3 | null> {
    updateStatus("Select a target square");
    return new Promise((resolve) => {
      const onMouseDown = (event: MouseEvent) => {
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
          window.removeEventListener("mousedown", onMouseDown);
          resolve(selected_coords);
        }
      };

      window.addEventListener("mousedown", onMouseDown);
    });
  }

  override async getTargetObject(): Promise<GameObject | null> {
    updateStatus("Select a target object");
    return new Promise((resolve) => {
      const onMouseDown = (event: MouseEvent) => {
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
          if (!selected_object) return resolve(null);
          window.removeEventListener("mousedown", onMouseDown);
          resolve(selected_object as GameObject);
        }
      };

      window.addEventListener("mousedown", onMouseDown);
    });
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
