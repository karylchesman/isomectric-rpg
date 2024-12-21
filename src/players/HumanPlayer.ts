import { Raycaster, Vector2, Vector3 } from "three";
import { Action } from "../actions/Action";
import { Player } from "./Player";
import { MovementAction } from "../actions/MovementAction";

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
          window.removeEventListener("mousedown", onMouseDownBound);
          resolve(selected_coords);
        }
      };

      // Need to assign the bound function to a variable so we can remove the event listener later
      // bind() results in a different function reference each time it's called
      const onMouseDownBound = onMouseDown.bind(this);
      window.addEventListener("mousedown", onMouseDownBound);
      console.log("Waiting for player to selected a target square");
    });
  }

  override async requestAction(): Promise<Action | null> {
    console.log(`Requesting action...`);
    const selected_action = new MovementAction(this, this._world);
    console.log(`Player ${this.name} selected action ${selected_action.name}`);
    return selected_action;
  }
}
