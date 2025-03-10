import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";
import { Player } from "../players/Player";
import { Action, TCanPerformResult } from "./Action";
import { search } from "../path-finding";
import { World } from "../world";
import { updateStatus } from "../utils";

const breadcrumb = new Mesh(new SphereGeometry(0.1), new MeshBasicMaterial());

export class MovementAction extends Action<Player> {
  override name: string = "Move";
  private _path: Vector3[] | null = null;
  private _path_index = 0;
  private _path_updater: number | null = null;

  constructor(source: Player) {
    super(source);
  }

  override async perform(world: World): Promise<void> {
    return new Promise((resolve) => {
      const updateSourcePosition = () => {
        // If we reached thee end of the path, then stop
        // the movement update interval, clear the path
        // breadcrumbs and resolve this action to unblock
        // the combat manager
        if (this._path_index === this._path?.length || !this._path) {
          clearInterval(this._path_updater ?? undefined);
          world.path.clear();
          resolve();
          return;
        }
        // Otherwise, move source object to the next path node
        const current_square = this._path[this._path_index++];
        this.source.moveTo(current_square);
      };
      // Clear the existing path update interval
      clearInterval(this._path_updater ?? undefined);
      updateStatus("Moving...");
      // Add the breadcrumbs to the world
      this._path?.forEach((coords) => {
        const node = breadcrumb.clone();
        node.position.set(coords.x + 0.5, 0, coords.z + 0.5);
        world.path.add(node);
      });

      // Trigger interval function to update player's position
      this._path_index = 0;
      this._path_updater = setInterval(updateSourcePosition.bind(this), 300);
    });
  }

  override async canPerform(world: World): Promise<TCanPerformResult> {
    const selected_coords = await this.source.getTargetSquare();
    if (!selected_coords)
      return {
        value: false,
        reason: "",
      };
    // Find path from player's current position to the selected square
    this._path = search(this.source.coords, selected_coords, world);

    if (!this._path)
      return {
        value: false,
        reason: "Could not find path to target square",
      };

    if (this._path.length <= 0)
      return {
        value: false,
        reason: "Pick square other than starting square",
      };

    return {
      value: true,
    };
  }
}
