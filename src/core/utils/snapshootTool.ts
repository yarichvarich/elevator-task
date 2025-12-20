import { Container, RenderTexture, Sprite, type Renderer } from "pixi.js";

export const snapshotContainer = (
  container: Container,
  sprite: Sprite,
  renderer: Renderer
): Sprite => {
  const bounds = container.getBounds(true);

  const renderTexture = RenderTexture.create({
    width: bounds.width,
    height: bounds.height,
    resolution: renderer.resolution,
  });

  renderer.render({
    container,
    target: renderTexture,
    clear: true,
  });

  sprite.texture = renderTexture;

  const localPos = container.toLocal(bounds);

  sprite.position.set(localPos.x, localPos.y);

  return sprite;
};
