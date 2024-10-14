import {
  Camera,
  CapsuleGeometry,
  Mesh,
  MeshStandardMaterial,
  Raycaster,
  Vector2,
} from "three";
import { World } from "./world";
import { search } from "./path-finding";

export class Player extends Mesh {
  private _raycaster = new Raycaster();
  private _camera: Camera;
  private _world: World;

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
      const player_coords = new Vector2(
        Math.floor(this.position.x),
        Math.floor(this.position.z)
      );

      const selected_coords = new Vector2(
        Math.floor(intersections[0].point.x),
        Math.floor(intersections[0].point.z)
      );

      const path = search(player_coords, selected_coords, this._world);
      console.log(path);
    }
  }
}
