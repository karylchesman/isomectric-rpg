import { MeshStandardMaterial, SphereGeometry, Vector3 } from "three";
import { GameObject } from "./GameObject";

const ROCK_GEOMETRY = new SphereGeometry(1, 6, 5);

const ROCK_MATERIAL = new MeshStandardMaterial({
  color: 0xb0b0b0,
  flatShading: true,
});

export class Rock extends GameObject {
  min_radius = 0.2;
  max_radius = 0.4;
  min_height = 0.1;
  max_height = 0.3;

  constructor(coords: Vector3) {
    super(coords, ROCK_GEOMETRY, ROCK_MATERIAL);

    this.name = `Rock-(${coords.x},${coords.z})`;

    const radius =
      this.min_radius + Math.random() * (this.max_radius - this.min_radius);
    const height =
      this.min_height + Math.random() * (this.max_height - this.min_height);

    this.scale.set(radius, height, radius);
    this.position.set(coords.x + 0.5, coords.y + height / 4, coords.z + 0.5);
  }
}
