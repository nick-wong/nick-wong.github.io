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

    console.log("scenes", this.scene);

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
  }

  allowShooting() {
    this.canShoot = true;
  }
  update() {}
}
