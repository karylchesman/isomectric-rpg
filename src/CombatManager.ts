import { Color, MeshStandardMaterial } from "three";
import { Player } from "./players/Player";
import { World } from "./world";
import { updateStatus } from "./utils";

export class CombatManager {
  /**
   * Main combat loop
   */
  async takeTurns(world: World) {
    while (true) {
      for (const player of world.players.children as Player[]) {
        if (player.is_dead) continue;
        let action_performed = false;
        // This was added because typescript cannot ensure the type of material applied to the object
        // in order to access the property `color`
        if (player.mesh.material instanceof MeshStandardMaterial) {
          player.mesh.material.color = new Color(0xffff00);
        }
        updateStatus(`Waiting for ${player.name} to select an action`);
        do {
          const action = await player.requestAction();
          if (!action) continue;

          const result = await action.canPerform(world);
          if (result.value === true) {
            // Wait for the player to finish performing their action
            await action.perform(world);
            action_performed = true;
          } else {
            updateStatus(result.reason);
          }
        } while (!action_performed);
        if (player.mesh.material instanceof MeshStandardMaterial) {
          player.mesh.material.color = new Color(0x4040c0);
        }
      }
    }
  }
}
