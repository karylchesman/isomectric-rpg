import { Vector2 } from "three";
import { World } from "./world";

function getKey(coords: Vector2) {
  return `${coords.x}-${coords.y}`;
}

/**
 * Finds the path between the start and end point (if one exists)
 * @returns an array of coordinates that make up the path
 */
export function search(start: Vector2, end: Vector2, world: World) {
  // If the end is equal to the start, skip searching
  if (start.x === end.x && start.y === end.y) return [];

  const max_search_distance = 20;
  const visited = new Set<string>();
  const frontier = [start];

  while (frontier.length > 0) {
    // Get the square with the shortest distance metric
    // Dijkstra - distance to origin
    // A* - distance to origin  + estimated distance to destination
    frontier.sort((v1, v2) => {
      const d1 = start.manhattanDistanceTo(v1);
      const d2 = start.manhattanDistanceTo(v2);
      return d1 - d2;
    });

    const candidate = frontier.shift();
    if (!candidate) break;
    console.log(candidate);

    // Did we find the end goal?
    if (candidate.x === end.x && candidate.y === end.y) {
      console.log("Found the end!");
      break;
    }

    // Mark this square as visited
    visited.add(getKey(candidate));

    if (candidate.manhattanDistanceTo(start) > max_search_distance) {
      continue;
    }

    // Search the neighbors of the square
    const neighbors = getNeighbors(candidate, world, visited);
    frontier.push(...neighbors);
  }
}

function getNeighbors(coords: Vector2, world: World, visited: Set<string>) {
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

  // Exclude any squares that are already visited and returns the others
  return neighbors.filter((coords) => !visited.has(getKey(coords)));
}