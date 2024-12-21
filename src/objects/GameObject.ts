import { BufferGeometry, Material, Mesh, Vector3 } from "three";

export class GameObject extends Mesh {
  coords: Vector3;

  constructor(coords: Vector3, geometry: BufferGeometry, material: Material) {
    super(geometry, material);
    this.coords = coords;
  }

  moveTo(coords: Vector3) {
    this.coords = coords;
    this.position.set(
      this.coords.x + 0.5,
      this.coords.y + 0.5,
      this.coords.z + 0.5
    );
  }
}
