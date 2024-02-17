import Phaser from "phaser";
import { FontSizes, getFontSize, getZoom } from "../util/Resize";

export class TVScene extends Phaser.Scene {
  constructor() {
    super("TVScene");
    this.canShoot = false;
    this.gameState = {
      flyingObject: {},
    };
  }
  preload() {}

  create() {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Create back button
    this.backButton = this.add
      .text(10, 10, "back", {
        fontFamily: "Manaspace",
        fontSize: getFontSize(FontSizes.LARGE),
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

    /*
      calculate center
      37, 46    150, 46
      37,132    150, 132

      mid is 126
    */

    this.scenery = this.add
      .image(center.x, center.y, "background")
      .setName("scenery")
      .setOrigin(0.5)
      .setDepth(99)
      .setInteractive({ pixelPerfect: true });

    this.scenery.setScale(
      getZoom(
        this.scenery.displayOriginX / this.scenery.originX,
        (this.scenery.displayOriginY / this.scenery.originY) * 0.8
      )
    );

    this.sky = this.add
      .rectangle(
        center.x,
        center.y + 43 * this.scenery.scale - 80 * this.scenery.scale,
        113 * this.scenery.scale,
        86 * this.scenery.scale,
        0x87ceeb
      )
      .setName("sky")
      .setInteractive();

    // WIP
    this.words = ["work", "in", "progress"];

    this.sceneObjects = this.add.group([this.sky, this.scenery]);
    this.sceneObjects.getChildren().forEach((object) => {
      object
        .on("pointermove", () => {
          if (this.canShoot) {
            this.input.setDefaultCursor(
              "url(assets/crosshair.png) 10 10, pointer"
            );
          }
        })
        .on("pointerout", () => {
          this.input.setDefaultCursor("unset");
        });
    });

    this.input.on("pointerdown", (pointer, gameObjects) => {
      if (this.canShoot && gameObjects.length) {
        if (gameObjects[0].name === "sky") {
          const missedShot = this.add
            .text(pointer.position.x, pointer.position.y, "x", {
              fontFamily: "Manaspace",
              fontSize: getFontSize(FontSizes.SMALL),
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
      this.gameState.flyingObject.on("pointerover", () => {
        if (this.canShoot) {
          this.input.setDefaultCursor(
            "url(assets/crosshair.png) 10 10, pointer"
          );
        }
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
    this.scenery.setPosition(window.innerWidth / 2, window.innerHeight / 2);
    this.scenery.setScale(
      getZoom(
        (this.scenery.displayOriginX / this.scenery.originX) *
          this.scenery.scale,
        (this.scenery.displayOriginY / this.scenery.originY) *
          this.scenery.scale *
          0.8
      ) * this.scenery.scale
    );

    this.sky.setPosition(
      window.innerWidth / 2,
      window.innerHeight / 2 + 43 * this.scenery.scale - 80 * this.scenery.scale
    );
    this.sky.setSize(113 * this.scenery.scale, 86 * this.scenery.scale);
    this.backButton.setFontSize(getFontSize(FontSizes.LARGE));
  }
}
