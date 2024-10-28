import { Vector3 } from "three";

/**
 * Returns the key for the object map given a set of coordinates
 */
export function getObjectMapKey(coords: Vector3) {
  return `${coords.x}-${coords.y}-${coords.z}`;
}
