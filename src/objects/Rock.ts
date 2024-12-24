import { Mesh, MeshStandardMaterial, SphereGeometry, Vector3 } from "three";
import { GameObject } from "./GameObject";

const ROCK_GEOMETRY = new SphereGeometry(1, 6, 5);

const ROCK_MATERIAL = new MeshStandardMaterial({
  color: 0xb0b0b0,
  flatShading: true,
});

export class Rock extends GameObject {
  constructor(coords: Vector3) {
    const min_radius = 0.2;
    const max_radius = 0.4;
    const min_height = 0.1;
    const max_height = 0.3;

    const radius = min_radius + Math.random() * (max_radius - min_radius);
    const height = min_height + Math.random() * (max_height - min_height);

    const rock_mesh = new Mesh(ROCK_GEOMETRY, ROCK_MATERIAL);
    rock_mesh.scale.set(radius, height, radius);
    rock_mesh.position.set(0.5, height / 4, 0.5);

    super(coords, rock_mesh);

    this.name = `Rock-(${coords.x},${coords.z})`;
  }
}
