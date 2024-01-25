import Phaser from "phaser";

export class TVScene extends Phaser.Scene {
  constructor() {
    super("TVScene");
    this.canShoot = false;
  }
  preload() {
    this.load.spritesheet("tv", "assets/tv.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    console.log("preload tv scene");
  }

  create() {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Create back button
    this.backButton = this.add
      .text(10, 10, "back", {
        fontFamily: "Manaspace",
        fontSize: "48px",
        align: "center",
        resolution: 10,
      })
      .setName("backButton")
      .setInteractive({
        useHandCursor: true,
      });

    // Back button Events
    this.backButton.on("pointerup", () => {
      this.scene.sleep("TVSceneGun");
      this.scene.get("BaseScene").reset();

      this.setCanShoot(false);
      this.scene.sleep();
    });

    this.screen = this.add
      .rectangle(center.x, center.y - 175, 600, 475, 0x87ceeb)
      .setName("sky")
      .setInteractive();

    // WIP
    this.words = ["work", "in", "progress"];

    /* TODO: Fix pointer
    this.screen.on("pointerover", () => {
      this.input.setDefaultCursor("url(assets/crosshair.png) 10 10, pointer");
    });
    this.screen.on("pointerout", () => {
      this.input.setDefaultCursor("unset");
    });
    */

    this.input.on("pointerdown", (pointer, gameObjects) => {
      if (this.canShoot && gameObjects.length) {
        if (gameObjects[0].name === "sky") {
          this.add
            .text(
              pointer.position.x,
              pointer.position.y,
              this.words.length ? this.words.shift() : "x",
              {
                fontFamily: "Manaspace",
                fontSize: "24px",
                align: "center",
                resolution: 3,
              }
            )
            .setOrigin(0.5);
        }
      }
    });

    console.log("create tv scene");

    this.scale.on("resize", this.resize, this);
  }

  setCanShoot(canShoot) {
    this.canShoot = canShoot;
  }
  update() {}

  resize(gameSize, baseSize, displaySize, resolution) {
    this.screen.setPosition(
      window.innerWidth / 2,
      window.innerHeight / 2 - 175
    );
  }
}
