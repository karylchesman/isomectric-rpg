import { Vector2 } from "three";
import { World } from "./world";

export function search(start: Vector2, end: Vector2, world: World) {
  const o = world.getObject(start);
  console.log(o);
}
