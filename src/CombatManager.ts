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
      }
    }
  }
}
