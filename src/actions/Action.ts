import { GameObject } from "../objects/GameObject";
import { World } from "../world";

export type TCanPerformResult =
  | {
      value: true;
    }
  | {
      value: false;
      reason: string;
    };

/**
 * Base actions class
 */
export class Action<Source extends GameObject = GameObject> {
  name = "Base Action";
  protected source: Source;

  constructor(source: Source) {
    this.source = source;
  }

  /**
   * Performs the action
   */
  async perform(_world: World): Promise<void> {
    // Do nothing
  }

  /**
   * Returns true/false if the action can be performed
   */
  async canPerform(_world: World): Promise<TCanPerformResult> {
    return {
      value: true,
    };
  }
}
