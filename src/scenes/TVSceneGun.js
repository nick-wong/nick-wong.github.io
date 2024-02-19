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
    this.zapper = this.add
      .sprite(center.x, center.y, "duckhuntgun")
      .setName("zapper")
      .setInteractive(this.input.makePixelPerfect())
      .play("center");
    this.zapper.setScale(window.innerHeight / 2 / this.zapper.height);

    this.scale.on("resize", this.resize, this);
  }

  update() {
    // Get position of input relative to widow and place gun accordingly
    if (this.input.x < (window.innerWidth * 2) / 5) {
      // To the left
      this.zapper.play("left");
      this.zapper.resetFlip();
    } else if (this.input.x > (window.innerWidth * 3) / 5) {
      // To the right
      this.zapper.play("left");
      this.zapper.setFlipX(true);
    } else {
      // Center
      this.zapper.play("center");
    }

    // Scale x
    const inputXRatioFromCenter =
      (this.input.x - window.innerWidth / 2) / (window.innerWidth / 2);

    // Scale y
    const inputYRatio = this.input.y / window.innerHeight;
    const quarterHeight = window.innerHeight / 4;
    this.zapper.setPosition(
      this.input.x + (inputXRatioFromCenter * window.innerWidth) / 4,
      (window.innerHeight * 3) / 4 + inputYRatio * quarterHeight
    );
  }

  resize(gameSize, baseSize, displaySize, resolution) {
    // set scale based on height, roughly half
    this.zapper.setScale(window.innerHeight / 2 / this.zapper.height);
  }
}
