import {
  Camera,
  CapsuleGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Raycaster,
  SphereGeometry,
  Vector2,
  Vector3,
} from "three";
import { World } from "./world";
import { search } from "./path-finding";

export class Player extends Mesh {
  private _raycaster = new Raycaster();
  private _camera: Camera;
  private _world: World;
  private _path: Vector3[] = [];
  private _path_index = 0;
  private _path_updater: number | null = null;

  constructor(camera: Camera, world: World) {
    super();
    this._camera = camera;
    this._world = world;
    this.geometry = new CapsuleGeometry(0.25, 0.5);
    this.material = new MeshStandardMaterial({ color: 0x4040c0 });
    this.position.set(1.5, 0.5, 5.5);
    window.addEventListener("mousedown", this.onMouseDown.bind(this));
  }

  onMouseDown(event: MouseEvent) {
    const coords = new Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    this._raycaster.setFromCamera(coords, this._camera);

    const intersections = this._raycaster.intersectObject(this._world.terrain);

    if (intersections.length > 0) {
      const player_coords = new Vector3(
        Math.floor(this.position.x),
        Math.floor(this.position.y),
        Math.floor(this.position.z)
      );

      const selected_coords = new Vector3(
        Math.floor(intersections[0].point.x),
        0,
        Math.floor(intersections[0].point.z)
      );

      clearInterval(this._path_updater ?? undefined);

      // Find path from player's current position to the selected square
      this._path = search(player_coords, selected_coords, this._world) ?? [];

      // If no path found, return early
      if (!this._path.length) return;

      // DEBUG: Show the path as breadcrumbs
      this._world.path.clear();
      this._path.forEach((coords) => {
        const node = new Mesh(new SphereGeometry(0.1), new MeshBasicMaterial());
        node.position.set(coords.x + 0.5, 0, coords.z + 0.5);
        this._world.path.add(node);
      });

      // Trigger interval function to update player's position
      this._path_index = 0;
      this._path_updater = setInterval(this.updatePosition.bind(this), 500);
    }
  }

  updatePosition() {
    if (this._path_index === this._path?.length) {
      clearInterval(this._path_updater ?? undefined);
      return;
    }

    const current_square = this._path[this._path_index++];
    this.position.set(current_square.x + 0.5, 0.5, current_square.z + 0.5);
  }
}
