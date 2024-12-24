import { Mesh, MeshStandardMaterial, SphereGeometry, Vector3 } from "three";
import { GameObject } from "./GameObject";

const BUSH_MATERIAL = new MeshStandardMaterial({
  color: 0x80a040,
  flatShading: true,
});
const BUSH_GEOMETRY = new SphereGeometry(1, 8, 8);

export class Bush extends GameObject {
  constructor(coords: Vector3) {
    const min_bush_radius = 0.1;
    const max_bush_radius = 0.3;
    const radius =
      min_bush_radius + Math.random() * (max_bush_radius - min_bush_radius);

    const bush_mesh = new Mesh(BUSH_GEOMETRY, BUSH_MATERIAL);
    bush_mesh.scale.set(radius, radius, radius);
    bush_mesh.position.set(0.5, radius, 0.5);

    super(coords, bush_mesh);

    this.name = `Bush-(${coords.x},${coords.z})`;
  }
}
