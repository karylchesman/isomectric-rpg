import { CanvasTexture, SpriteMaterial, Vector3 } from "three";

/**
 * Returns the key for the object map given a set of coordinates
 */
export function getObjectMapKey(coords: Vector3) {
  return `${coords.x}-${coords.y}-${coords.z}`;
}

/**
 * @param text the text that we want to render
 */
export function createTextMaterial(text: string): SpriteMaterial {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to access canvas context");
  context.font = "100px Arial";
  context.textBaseline = "middle";
  context.textAlign = "center";

  context.strokeStyle = "black";
  context.lineWidth = 4; // 4 pixels;
  context.fillStyle = "white";

  context.strokeText(text, size / 2, size / 2);
  context.fillText(text, size / 2, size / 2);

  return new SpriteMaterial({
    map: new CanvasTexture(canvas),
  });
}

export function updateStatus(text: string) {
  const el = document.getElementById("status-text");
  if (!el) return;
  el.innerText = text;
}

/**
 * Returns the path to the model given the model name
 * @param model_name the name of the model without the extension
 */
export function getModelPath(model_name: string): string {
  return new URL(`./assets/models/${model_name}.glb`, import.meta.url).href;
}
