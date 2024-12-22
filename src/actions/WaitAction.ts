import { Action } from "./Action";

/**
 * This is an action where the player skips their turn
 */
export class WaitAction extends Action {
  override name = "Wait";
}
