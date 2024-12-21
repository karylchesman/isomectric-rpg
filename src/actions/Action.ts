import { GameObject } from "../objects/GameObject";

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
  async perform(): Promise<void> {
    // Do nothing
  }

  /**
   * Returns true/false if the action can be performed
   */
  async canPerform(): Promise<boolean> {
    return true;
  }
}
