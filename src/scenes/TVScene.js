import Phaser from "phaser";

export class TVScene extends Phaser.Scene {
  constructor() {
    super("TVScene");
    this.canShoot = false;
    this.gameState = {
      flyingObject: {},
    };
  }
  preload() {
    this.load.spritesheet("target", "assets/target.png", {
      frameWidth: 11,
      frameHeight: 11,
    });
    this.load.image("background", "assets/duckhuntbg.png");
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
        resolution: 5,
      })
      .setName("backButton")
      .setInteractive({
        useHandCursor: true,
      });

    // Back button Events
    this.backButton
      .on("pointerup", () => {
        if (this.scene.isActive("TVSceneGun")) {
          this.scene.sleep("TVSceneGun");
        }
        this.scene.get("BaseScene").reset();

        this.setCanShoot(false);
        this.scene.sleep();
        this.backButton.clearTint();
      })
      .on("pointerover", () => {
        this.backButton.setTint(0xfcc200);
      })
      .on("pointerout", () => {
        this.backButton.clearTint();
      });

    this.sky = this.add
      .rectangle(center.x, center.y - 175, 600, 480, 0x87ceeb)
      .setName("sky")
      .setInteractive();

    this.scenery = this.add
      .image(center.x, center.y - 175, "background")
      .setName("scenery")
      .setScale(4)
      .setOrigin(0.5)
      .setInteractive({ pixelPerfect: true });

    // WIP
    this.words = ["work", "in", "progress"];

    // TODO: Fix crosshair pointer
    /*
    this.sky.on("pointerover", (pointer, gameObject) => {
      this.input.setDefaultCursor("url(assets/crosshair.png) 10 10, pointer");
    });
    this.sky.on("pointerout", () => {
      this.input.setDefaultCursor("unset");
    });
    */

    this.input.on("pointerdown", (pointer, gameObjects) => {
      if (this.canShoot && gameObjects.length) {
        if (gameObjects[0].name === "sky") {
          const missedShot = this.add
            .text(pointer.position.x, pointer.position.y, "x", {
              fontFamily: "Manaspace",
              fontSize: "24px",
              align: "center",
              resolution: 3,
            })
            .setOrigin(0.5);

          setTimeout(() => {
            missedShot.destroy();
          }, 500);
        }
      }
    });

    this.ground = this.physics.add.staticBody(
      this.sky.x - this.sky.width / 2,
      this.sky.y - this.sky.height / 2 + (this.sky.height * 4) / 5,
      this.sky.width,
      this.sky.height / 5
    );

    // Create bounds
    this.screenBoundTop = this.physics.add.staticBody(
      this.sky.x - this.sky.width / 2,
      this.sky.y - this.sky.height / 2 - 5,
      this.sky.width,
      5
    );

    this.screenBoundLeft = this.physics.add.staticBody(
      this.sky.x - this.sky.width / 2 - 5,
      this.sky.y - this.sky.height / 2,
      5,
      this.sky.height
    );

    this.screenBoundRight = this.physics.add.staticBody(
      this.sky.x + this.sky.width / 2,
      this.sky.y - this.sky.height / 2,
      5,
      this.sky.height
    );

    this.physics.add.collider(this.ground);

    console.log("create tv scene");

    this.scale.on("resize", this.resize, this);
  }

  setCanShoot(canShoot) {
    this.canShoot = canShoot;
  }
  update() {
    if (
      !this.gameState.flyingObject.active &&
      this.words.length &&
      this.canShoot
    ) {
      // Spawn a flying object in grass area
      // TODO: use size of duck
      const randomLocation = {
        x: Math.random() * (this.sky.width - 120) + 60,
        y: 300,
      };
      this.gameState.flyingObject = this.physics.add
        .sprite(
          this.sky.x - this.sky.width / 2 + randomLocation.x,
          this.sky.y - this.sky.height / 2 + randomLocation.y,
          "target"
        )
        .setImmovable(false)
        .setBounce(1, 1)
        .setInteractive({ pixelPerfect: true })
        .setScale(4);
      this.gameState.flyingObject.body.allowGravity = false;
      this.physics.add.collider(this.gameState.flyingObject, this.ground);
      this.physics.add.collider(
        this.gameState.flyingObject,
        this.screenBoundTop
      );
      this.physics.add.collider(
        this.gameState.flyingObject,
        this.screenBoundLeft
      );
      this.physics.add.collider(
        this.gameState.flyingObject,
        this.screenBoundRight
      );

      this.gameState.flyingObject.on("pointerdown", (pointer) => {
        this.gameState.flyingObject.destroy();
        this.add
          .text(pointer.position.x, pointer.position.y, this.words.shift(), {
            fontFamily: "Manaspace",
            fontSize: "24px",
            align: "center",
            resolution: 3,
          })
          .setOrigin(0.5);
      });
      this.scenery.setDepth(99);
      // Set random velocity
      this.gameState.flyingObject.setVelocity(
        Math.floor(Math.random() * 2) === 0
          ? Math.random() * 50 + 50
          : Math.random() * 50 - 100,
        Math.floor(Math.random() * 2) === 0
          ? Math.random() * 50 + 50
          : Math.random() * 50 - 100
      );
    }
  }

  generateRandomVelocity(min, max) {}

  resize(gameSize, baseSize, displaySize, resolution) {
    this.sky.setPosition(window.innerWidth / 2, window.innerHeight / 2 - 175);
    this.scenery.setPosition(
      window.innerWidth / 2,
      window.innerHeight / 2 - 175
    );
  }
}
