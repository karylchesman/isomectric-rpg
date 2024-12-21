import { Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from "three";
import { Player } from "../players/Player";
import { Action } from "./Action";
import { search } from "../path-finding";
import { World } from "../world";

const breadcrumb = new Mesh(new SphereGeometry(0.1), new MeshBasicMaterial());

export class MovementAction extends Action<Player> {
  override name: string = "MovementAction";
  private _path: Vector3[] = [];
  private _path_index = 0;
  private _path_updater: number | null = null;
  private _world: World;

  constructor(source: Player, world: World) {
    super(source);
    this._world = world;
  }

  override async perform(): Promise<void> {
    return new Promise((resolve) => {
      const updateSourcePosition = () => {
        // If we reached thee end of the path, then stop
        // the movement update interval, clear the path
        // breadcrumbs and resolve this action to unblock
        // the combat manager
        if (this._path_index === this._path?.length) {
          clearInterval(this._path_updater ?? undefined);
          this._world.path.clear();
          resolve();
          return;
        }
        // Otherwise, move source object to the next path node
        const current_square = this._path[this._path_index++];
        this.source.moveTo(current_square);
      };
      // Clear the existing path update interval
      clearInterval(this._path_updater ?? undefined);

      // Add the breadcrumbs to the world
      this._path.forEach((coords) => {
        const node = breadcrumb.clone();
        node.position.set(coords.x + 0.5, 0, coords.z + 0.5);
        this._world.path.add(node);
      });

      // Trigger interval function to update player's position
      this._path_index = 0;
      this._path_updater = setInterval(updateSourcePosition.bind(this), 300);
    });
  }

  override async canPerform(): Promise<boolean> {
    const selected_coords = await this.source.getTargetSquare();
    console.log("canPerform", selected_coords);
    if (!selected_coords) return false;
    // Find path from player's current position to the selected square
    this._path = search(this.source.coords, selected_coords, this._world) ?? [];
    // If no path found, return early
    return !!this._path.length;
  }
}
