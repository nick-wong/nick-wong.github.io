import Phaser from "phaser";

export class BackgroundScene extends Phaser.Scene {
  constructor() {
    super("BackgroundScene");
  }
  preload() {}

  create() {
    this.cameras.main.setBackgroundColor(0x292929);
  }

  update() {}
}
