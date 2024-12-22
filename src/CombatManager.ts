import { Color, Material, MeshStandardMaterial } from "three";
import { Player } from "./players/Player";

export class CombatManager {
  players: Player[] = [];

  constructor() {}

  /**
   * Get player's initiative and add them to the
   * array of players
   */
  addPlayer(player: Player) {
    this.players.push(player);
  }

  /**
   * Main combat loop
   */
  async takeTurns() {
    while (true) {
      for (const player of this.players) {
        let action_performed = false;
        // This was added because typescript cannot ensure the type of material applied to the object
        // in order to access the property `color`
        if (player.material instanceof MeshStandardMaterial) {
          player.material.color = new Color(0xffff00);
        }
        do {
          const action = await player.requestAction();
          if (await action?.canPerform()) {
            // Wait for the player to finish performing their action
            await action?.perform();
            action_performed = true;
          } else {
            alert("Cannot perform action, pick another action");
          }
        } while (!action_performed);
        if (player.material instanceof MeshStandardMaterial) {
          player.material.color = new Color(0x4040c0);
        }
      }
    }
  }
}
