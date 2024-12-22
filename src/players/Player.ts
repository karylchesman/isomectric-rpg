import { Camera, CapsuleGeometry, MeshStandardMaterial, Vector3 } from "three";
import { World } from "../world";
import { GameObject } from "../objects/GameObject";
import type { Action } from "../actions/Action";
import { MovementAction, WaitAction } from "../actions";

const PLAYER_GEOMETRY = new CapsuleGeometry(0.25, 0.5);

/**
 * Base player class that human and computer players derive from
 */
export class Player extends GameObject {
  override name: string = "Player";
  protected _camera: Camera;
  protected _world: World;

  constructor(coords: Vector3, camera: Camera, world: World) {
    // The player's material is created of each instance because if they
    // share the same material, when we change the color of one, all other ones will as well
    const material = new MeshStandardMaterial({ color: 0x4040c0 });
    super(coords, PLAYER_GEOMETRY, material);
    this.moveTo(coords);
    this._camera = camera;
    this._world = world;
  }

  getActions(): Action[] {
    return [new MovementAction(this, this._world), new WaitAction(this)];
  }

  /**
   * Wait for the player to choose a target square
   */
  async getTargetSquare(): Promise<Vector3 | null> {
    return null;
  }

  /**
   * Wait for the player to choose a target GameObject
   */
  async getTargetObject(): Promise<GameObject | null> {
    return null;
  }

  /**
   * Wait for the player to select an action to perform
   */
  async requestAction(): Promise<Action | null> {
    return null;
  }
}
