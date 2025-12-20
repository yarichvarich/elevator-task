import { Container, RenderTexture, Sprite, type Renderer } from "pixi.js";

export const snapshotContainer = (
  container: Container,
  sprite: Sprite,
  renderer: Renderer
): Sprite => {
  const bounds = container.getLocalBounds();
  const renderTexture = RenderTexture.create({
    width: Math.ceil(bounds.width),
    height: Math.ceil(bounds.height),
  });

  renderer.render({ container, target: renderTexture });

  sprite.texture = renderTexture;

  sprite.x = bounds.x;
  sprite.y = bounds.y;

  return sprite;
};
