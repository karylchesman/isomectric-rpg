import { CapsuleGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { GameObject } from "../objects/GameObject";
import type { Action } from "../actions/Action";
import {
  MovementAction,
  WaitAction,
  MeleeAttackAction,
  RangedAttackAction,
} from "../actions";

const PLAYER_GEOMETRY = new CapsuleGeometry(0.25, 0.5);

/**
 * Base player class that human and computer players derive from
 */
export class Player extends GameObject {
  override name: string = "Player";

  constructor(coords: Vector3) {
    // The player's material is created of each instance because if they
    // share the same material, when we change the color of one, all other ones will as well
    const player_mesh = new Mesh(
      PLAYER_GEOMETRY,
      new MeshStandardMaterial({ color: 0x4040c0 })
    );
    player_mesh.position.set(0.5, 0.5, 0.5);
    super(coords, player_mesh);
    this._health_overlay.visible = true;
    this.moveTo(coords);
  }

  getActions(): Action[] {
    return [
      new MovementAction(this),
      new MeleeAttackAction(this),
      new RangedAttackAction(this),
      new WaitAction(this),
    ];
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
