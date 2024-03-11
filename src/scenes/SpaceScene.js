import Phaser from "phaser";

import { createBackButton, spaceBackButton } from "../util/Helpers";

export class SpaceScene extends Phaser.Scene {
  constructor() {
    super("SpaceScene");
  }

  create() {
    this.cameras.main.flash();

    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    createBackButton(this, spaceBackButton);
    // background, todo: use actual one
    this.worldBackground = this.add.rectangle(
      center.x,
      center.y,
      window.innerWidth,
      window.innerHeight,
      0x000000
    );

    // add worlds
    this.world = this.add.image(center.x, center.y, "unknownworld");
    this.worldSelector = this.add
      .image(center.x, center.y, "worldselector")
      .setAlpha(0.9);

    // resize events
    this.scale.on("resize", this.resize, this);

    this.events.on("wake", () => {
      this.cameras.main.flash();
    });
  }

  update() {}

  resize(gameSize, baseSize, displaySize, resolution) {
    if (window.innerWidth > 240 && window.innerHeight > 240) {
    }
  }
}
