import Phaser from "phaser";
import { BaseScene } from "./scenes/BaseScene";
import { TVScene } from "./scenes/TVScene";
import { TVSceneGun } from "./scenes/TVSceneGun";

export const config = {
  type: Phaser.AUTO,
  //parent: "phaser-container",
  scale: {
    parent: "phaser-container",
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: "100%",
    height: "100%",
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 10 },
    },
  },
  scene: [BaseScene, TVScene, TVSceneGun],
  pixelArt: true,
};
