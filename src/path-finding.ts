import { Vector2 } from "three";
import { World } from "./world";

type CostMap = Map<string, number>;

function getKey(coords: Vector2) {
  return `${coords.x}-${coords.y}`;
}

/**
 * Finds the path between the start and end point (if one exists)
 * @returns an array of coordinates that make up the path
 */
export function search(
  start: Vector2,
  end: Vector2,
  world: World
): Vector2[] | null {
  // If the end is equal to the start, skip searching
  if (start.x === end.x && start.y === end.y) return [];

  let path_found = false;
  const max_search_distance = 20;

  const came_from = new Map();
  const cost: CostMap = new Map();
  const frontier = [start];
  cost.set(getKey(start), 0);

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
    if (candidate.x === end.x && candidate.y === end.y) {
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
      came_from.set(getKey(neighbor), candidate);
    });
  }

  if (!path_found) return null;

  // Reconstruct the path
  let current_node = end;
  const path = [current_node];

  while (getKey(current_node) !== getKey(start)) {
    const prev = came_from.get(getKey(current_node));
    if (!prev) continue;
    path.push(prev);
    current_node = prev;
  }

  path.reverse();
  path.shift();
  return path;
}

function getNeighbors(coords: Vector2, world: World, cost: CostMap) {
  const neighbors: Vector2[] = [];

  // Left
  if (coords.x > 0) {
    neighbors.push(new Vector2(coords.x - 1, coords.y));
  }
  // Right
  if (coords.x < world.width - 1) {
    neighbors.push(new Vector2(coords.x + 1, coords.y));
  }
  // Top
  if (coords.y > 0) {
    neighbors.push(new Vector2(coords.x, coords.y - 1));
  }
  // Bottom
  if (coords.y < world.height - 1) {
    neighbors.push(new Vector2(coords.x, coords.y + 1));
  }

  // Cost to get to neighbor square is the current square cost + 1
  const new_cost = (cost.get(getKey(coords)) || 0) + 1;

  // Exclude any squares that are already visited, as well
  // as any squares that are occupied
  return neighbors
    .filter((coords_item) => {
      // If neighboring square has not yet been visited, or this
      // is a cheaper path cost, then include it in the search
      const coords_cost = cost.get(getKey(coords_item));
      if (!coords_cost || new_cost < coords_cost) {
        cost.set(getKey(coords_item), new_cost);
        return true;
      }

      return false;
    })
    .filter((coords_item) => !world.getObject(coords_item));
}
