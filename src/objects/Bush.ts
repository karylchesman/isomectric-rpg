import { MeshStandardMaterial, SphereGeometry, Vector3 } from "three";
import { GameObject } from "./GameObject";

const BUSH_MATERIAL = new MeshStandardMaterial({
  color: 0x80a040,
  flatShading: true,
});
const BUSH_GEOMETRY = new SphereGeometry(1, 8, 8);

export class Bush extends GameObject {
  min_bush_radius = 0.1;
  max_bush_radius = 0.3;

  constructor(coords: Vector3) {
    super(coords, BUSH_GEOMETRY, BUSH_MATERIAL);
    this.name = `Bush-(${coords.x},${coords.z})`;
    const radius =
      this.min_bush_radius +
      Math.random() * (this.max_bush_radius - this.min_bush_radius);
    this.scale.set(radius, radius, radius);
    this.position.set(coords.x + 0.5, coords.y + radius, coords.z + 0.5);
  }
}
