import { Vector3 } from "three";
import { getObjectMapKey } from "./utils";
import { World } from "./world";

type CostMap = Map<string, number>;

/**
 * Finds the path between the start and end point (if one exists)
 * @returns an array of coordinates that make up the path
 */
export function search(
  start: Vector3,
  end: Vector3,
  world: World
): Vector3[] | null {
  // If the end is equal to the start, skip searching
  if (start.equals(end)) return [];

  console.log(
    `Searching for path from (${start.x}, ${start.z}) to (${end.x}, ${end.z})`
  );

  let path_found = false;
  const max_search_distance = 20;

  const came_from = new Map();
  const cost: CostMap = new Map();
  const frontier = [start];
  cost.set(getObjectMapKey(start), 0);

  let counter = 0;

  while (frontier.length > 0) {
    // Get the square with the shortest distance metric
    // Dijkstra - distance to origin
    // A* - distance to origin  + estimated distance to destination
    frontier.sort((v1, v2) => {
      // Dijkstra Approach
      // const d1 = start.manhattanDistanceTo(v1);
      // const d2 = start.manhattanDistanceTo(v2);
      // return d1 - d2;

      // A* Approach
      const g1 = start.manhattanDistanceTo(v1);
      const g2 = start.manhattanDistanceTo(v2);
      const h1 = v1.manhattanDistanceTo(end);
      const h2 = v2.manhattanDistanceTo(end);
      const f1 = g1 + h1;
      const f2 = g2 + h2;
      return f1 - f2;
    });

    const candidate = frontier.shift();
    if (!candidate) break;
    counter++;

    // Did we find the end goal?
    if (candidate.equals(end)) {
      console.log(`Path found (visited ${counter} candidates)`);
      path_found = true;
      break;
    }

    if (candidate.manhattanDistanceTo(start) > max_search_distance) {
      continue;
    }

    // Search the neighbors of the square
    const neighbors = getNeighbors(candidate, world, cost);
    frontier.push(...neighbors);

    // Mark which square each neighbor came from
    neighbors.forEach((neighbor) => {
      came_from.set(getObjectMapKey(neighbor), candidate);
    });
  }

  if (!path_found) return null;

  // Reconstruct the path
  let current_node = end;
  const path = [current_node];

  while (getObjectMapKey(current_node) !== getObjectMapKey(start)) {
    const prev = came_from.get(getObjectMapKey(current_node));
    if (!prev) continue;
    path.push(prev);
    current_node = prev;
  }

  path.reverse();
  path.shift();
  return path;
}

function getNeighbors(coords: Vector3, world: World, cost: CostMap) {
  const neighbors: Vector3[] = [];

  // Left
  if (coords.x > 0) {
    neighbors.push(new Vector3(coords.x - 1, 0, coords.z));
  }
  // Right
  if (coords.x < world.width - 1) {
    neighbors.push(new Vector3(coords.x + 1, 0, coords.z));
  }
  // Top
  if (coords.z > 0) {
    neighbors.push(new Vector3(coords.x, 0, coords.z - 1));
  }
  // Bottom
  if (coords.z < world.height - 1) {
    neighbors.push(new Vector3(coords.x, 0, coords.z + 1));
  }

  // Cost to get to neighbor square is the current square cost + 1
  const new_cost = (cost.get(getObjectMapKey(coords)) || 0) + 1;

  // Exclude any squares that are already visited, as well
  // as any squares that are occupied
  return neighbors
    .filter((coords_item) => {
      // If neighboring square has not yet been visited, or this
      // is a cheaper path cost, then include it in the search
      const coords_cost = cost.get(getObjectMapKey(coords_item));
      if (!coords_cost || new_cost < coords_cost) {
        cost.set(getObjectMapKey(coords_item), new_cost);
        return true;
      }

      return false;
    })
    .filter((coords_item) => !world.getObject(coords_item));
}
