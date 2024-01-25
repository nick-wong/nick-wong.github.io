import Phaser from "phaser";

export class BackgroundScene extends Phaser.Scene {
  constructor() {
    super("BackgroundScene");
  }
  preload() {}

  create() {
    this.cameras.main.setBackgroundColor("0x2f2f2f");
  }

  update() {}
}
