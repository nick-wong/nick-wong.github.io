import Phaser from "phaser";
import { BaseScene } from "./scenes/BaseScene";
import { TVScene } from "./scenes/TVScene";
import { TVSceneGun } from "./scenes/TVSceneGun";
import { BackgroundScene } from "./scenes/BackgroundScene";

export const config = {
  type: Phaser.AUTO,
  //parent: "phaser-container",
  scale: {
    parent: "phaser-container",
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: "100%",
    height: "100%",
    min: {
      width: 240,
      height: 240,
    },
    // Alternative to scaling
    // mode: Phaser.Scale.ScaleModes.FIT,
    // autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 10 },
      // debug: true,
    },
  },
  scene: [BaseScene, BackgroundScene, TVScene, TVSceneGun],
  pixelArt: true,
};
