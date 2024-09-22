import {
  Camera,
  CapsuleGeometry,
  Mesh,
  MeshStandardMaterial,
  Raycaster,
  Vector2,
} from "three";
import { TTerrain } from "./world";

export class Player extends Mesh {
  private _raycaster = new Raycaster();
  private _camera: Camera;
  private _terrain: TTerrain;

  constructor(camera: Camera, terrain: TTerrain) {
    super();
    this._camera = camera;
    this._terrain = terrain;
    this.geometry = new CapsuleGeometry(0.25, 0.5);
    this.material = new MeshStandardMaterial({ color: 0x4040c0 });
    this.position.set(5.5, 0.5, 5.5);
    window.addEventListener("mousedown", this.onMouseDown.bind(this));
  }

  onMouseDown(event: MouseEvent) {
    const coords = new Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    this._raycaster.setFromCamera(coords, this._camera);

    const intersections = this._raycaster.intersectObjects([this._terrain]);

    if (intersections.length > 0) {
      this.position.set(
        Math.floor(intersections[0].point.x) + 0.5,
        0.5,
        Math.floor(intersections[0].point.z) + 0.5
      );
    }
  }
}
