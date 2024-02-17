import Phaser from "phaser";

export class TVSceneGun extends Phaser.Scene {
  constructor() {
    super("TVSceneGun");
  }
  preload() {}

  create() {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("duckhuntgun", { frames: [0] }),
      frameRate: 1,
    });

    this.anims.create({
      key: "center",
      frames: this.anims.generateFrameNumbers("duckhuntgun", { frames: [1] }),
      frameRate: 1,
    });

    // Create TV
    this.duckhuntgun = this.add
      .sprite(center.x, center.y, "duckhuntgun")
      .setName("duckhuntgun")
      .setInteractive(this.input.makePixelPerfect())
      .setScale(4)
      .play("center");

    console.log("create tv gun scene");
  }

  update() {
    // Get position of input relative to widow and place gun accordingly
    if (this.input.x < (window.innerWidth * 2) / 5) {
      // To the left
      this.duckhuntgun.play("left");
      this.duckhuntgun.resetFlip();
    } else if (this.input.x > (window.innerWidth * 3) / 5) {
      // To the right
      this.duckhuntgun.play("left");
      this.duckhuntgun.setFlipX(true);
    } else {
      // Center
      this.duckhuntgun.play("center");
    }

    // Scale x
    const inputXRatioFromCenter =
      (this.input.x - window.innerWidth / 2) / (window.innerWidth / 2);

    // Scale y
    const inputYRatio = this.input.y / window.innerHeight;
    const quarterHeight = window.innerHeight / 4;
    this.duckhuntgun.setPosition(
      this.input.x + (inputXRatioFromCenter * window.innerWidth) / 4,
      (window.innerHeight * 3) / 4 + inputYRatio * quarterHeight
    );
  }
}
