import Phaser from "phaser";
import { FontSizes, getFontSize, getZoom } from "../util/Resize";

import crosshair from "../assets/crosshair.png";

const GAME_STATES = {
  NOT_STARTED: 0,
  STARTED: 1,
};

// notes: a lot of the math here depends on the "sky", which is measured off the scenery pixels
export class TVScene extends Phaser.Scene {
  constructor() {
    super("TVScene");
    this.playableSceneryRatio = 0.7;
    this.canShoot = false;
    this.gameState = {
      state: GAME_STATES.NOT_STARTED,
      target: {},
      targetTracker: [],
      floatingTexts: [],
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
        114 * this.scenery.scale,
        87 * this.scenery.scale,
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
            this.input.setDefaultCursor(`url(${crosshair}) 10 10, pointer`);
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
      this.sky.y -
        this.sky.height / 2 +
        this.sky.height * this.playableSceneryRatio,
      this.sky.width,
      5
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
      this.sky.height * this.playableSceneryRatio
    );

    this.screenBoundRight = this.physics.add.staticBody(
      this.sky.x + this.sky.width / 2,
      this.sky.y - this.sky.height / 2,
      5,
      this.sky.height * this.playableSceneryRatio
    );

    this.physics.add.collider(this.ground);

    this.anims.create({
      key: "chase",
      frames: this.anims.generateFrameNumbers("akisquirrel", {
        frames: [0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8],
      }),
      frameRate: 8,
      repeat: -1,
      repeatDelay: this.generateRandomChaseDelay(),
    });

    // create start screen
    this.startScreenGroup = this.add.group();
    this.startScreenBackground = this.add
      .rectangle(
        this.sky.x,
        this.sky.y,
        this.sky.width,
        this.sky.height,
        0x000000,
        0.75
      )
      .setDepth(100);
    this.startScreenGroup.add(this.startScreenBackground);
    this.startScreenText1 = this.add
      .text(this.sky.x, this.sky.y - this.sky.height / 10, "skills", {
        fontFamily: "Manaspace",
        fontSize: getFontSize(FontSizes.MEDIUM),
        align: "center",
        resolution: 3,
      })
      .setDepth(100)
      .setOrigin(1);
    this.startScreenGroup.add(this.startScreenText1);
    this.startScreenText2 = this.add
      .text(this.sky.x, this.sky.y - this.sky.height / 10, "hunt", {
        fontFamily: "Manaspace",
        fontSize: getFontSize(FontSizes.MEDIUM),
        align: "center",
        resolution: 3,
        color: "rgb(255, 102, 0)",
      })
      .setDepth(100)
      .setOrigin(0);
    this.startScreenGroup.add(this.startScreenText2);
    this.anims.create({
      key: "grabzapper",
      frames: this.anims.generateFrameNumbers("startzapper", {
        frames: [0, 1],
      }),
      frameRate: 1,
      repeat: -1,
    });
    this.startZapper = this.add
      .sprite(
        this.sky.x - this.sky.width / 20,
        this.sky.y + this.sky.height / 4,
        "startzapper"
      )
      .setOrigin(1, 0.5)
      .setDepth(100)
      .play("grabzapper");
    this.startZapper.setScale(this.scenery.scale);
    this.startScreenGroup.add(this.startZapper);
    this.startScreenTextZapper = this.add
      .text(this.sky.x, this.sky.y + this.sky.height / 4, "to start", {
        fontFamily: "Manaspace",
        fontSize: getFontSize(FontSizes.SMALL),
        align: "center",
        resolution: 3,
      })
      .setDepth(100)
      .setOrigin(0, 0.5);
    this.startScreenGroup.add(this.startScreenTextZapper);

    // resize events
    this.scale.on("resize", this.resize, this);
  }

  update() {}

  setCanShoot(canShoot) {
    this.canShoot = canShoot;
    this.startScreenGroup.destroy(true, true);
    this.startScreenGroup.setActive(false);
    if (this.gameState.state === GAME_STATES.NOT_STARTED) {
      this.startGame();
    }
  }

  startGame() {
    this.gameState.state = GAME_STATES.STARTED;
    this.spawnTarget();

    // chase animation
    this.chase = this.add
      .sprite(
        this.sky.x + this.sky.width / 5,
        this.sky.y -
          this.sky.height / 2 +
          this.sky.height * this.playableSceneryRatio -
          (20 * this.scenery.scale) / 2,
        "akisquirrel"
      )
      .setScale(this.scenery.scale / 2)
      .setDepth(10)
      .play("chase");
    this.chase.on("animationrepeat", () => {
      // randomize direction and repeat delay
      const randomDirection = Math.floor(Math.random() * 2);

      this.chase.setFlipX(randomDirection === 0);
      this.chase.anims.repeatDelay = this.generateRandomChaseDelay();
    });

    // add tracking targets
    this.words.forEach((_, index) => {
      const newTargetTracker = this.add
        .sprite(
          this.sky.x + this.sky.width * 0.35,
          this.sky.y + this.sky.height * 0.35,
          "target"
        )
        .setScale(this.scenery.scale / 2)
        .setDepth(99);

      newTargetTracker.x -=
        index * newTargetTracker.width * newTargetTracker.scale * 1.2;
      this.gameState.targetTracker.push(newTargetTracker);
    });
  }

  spawnTarget() {
    // Spawn a target in lower area
    const sizeOfTarget = 11 * this.scenery.scale;
    const randomLocation = {
      x: Math.random() * (this.sky.width - sizeOfTarget * 2) + sizeOfTarget,
      y: this.sky.height * this.playableSceneryRatio - sizeOfTarget,
    };
    this.gameState.target = this.physics.add
      .sprite(
        this.sky.x - this.sky.width / 2 + randomLocation.x,
        this.sky.y - this.sky.height / 2 + randomLocation.y,
        "target"
      )
      .setImmovable(false)
      .setBounce(1, 1)
      .setInteractive({ pixelPerfect: true })
      .setScale(this.scenery.scale);
    this.gameState.target.body.allowGravity = false;
    this.physics.add.collider(this.gameState.target, this.ground);
    this.physics.add.collider(this.gameState.target, this.screenBoundTop);
    this.physics.add.collider(this.gameState.target, this.screenBoundLeft);
    this.physics.add.collider(this.gameState.target, this.screenBoundRight);

    this.gameState.target.on("pointerdown", (pointer) => {
      // remove from the tracker
      const removedTarget = this.gameState.targetTracker.pop();
      removedTarget.destroy();

      // do logic
      this.gameState.floatingTexts.push(
        this.add
          .text(pointer.position.x, pointer.position.y, this.words.shift(), {
            fontFamily: "Manaspace",
            fontSize: getFontSize(FontSizes.SMALL),
            align: "center",
            resolution: 3,
          })
          .setOrigin(0.5)
      );
      this.gameState.target.destroy();

      if (this.words.length) {
        this.spawnTarget();
      }
    });
    this.gameState.target.on("pointerover", () => {
      if (this.canShoot) {
        this.input.setDefaultCursor(`url(${crosshair}) 10 10, pointer`);
      }
    });

    // Set random velocity
    this.gameState.target.setVelocity(
      Math.floor(Math.random() * 2) === 0
        ? Math.random() * 50 + 50
        : Math.random() * 50 - 100,
      Math.floor(Math.random() * 2) === 0
        ? Math.random() * 50 + 50
        : Math.random() * 50 - 100
    );
  }

  generateRandomChaseDelay() {
    return Math.random() * 5000 + 3000; // every 3-8 seconds
  }

  resize(gameSize, baseSize, displaySize, resolution) {
    if (window.innerWidth > 240 && window.innerHeight > 240) {
      // update scenery
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

      // update sky
      this.sky.setPosition(
        window.innerWidth / 2,
        window.innerHeight / 2 +
          43 * this.scenery.scale -
          80 * this.scenery.scale
      );
      this.sky.setSize(114 * this.scenery.scale, 87 * this.scenery.scale);
      this.backButton.setFontSize(getFontSize(FontSizes.LARGE));

      // update bounds
      this.ground.position = {
        x: this.sky.x - this.sky.width / 2,
        y:
          this.sky.y -
          this.sky.height / 2 +
          this.sky.height * this.playableSceneryRatio,
      };
      this.ground.setSize(this.sky.width, 5);

      this.screenBoundTop.position = {
        x: this.sky.x - this.sky.width / 2,
        y: this.sky.y - this.sky.height / 2 - 5,
      };

      this.screenBoundTop.setSize(this.sky.width, 5);

      this.screenBoundLeft.position = {
        x: this.sky.x - this.sky.width / 2 - 5,
        y: this.sky.y - this.sky.height / 2,
      };
      this.screenBoundLeft.setSize(
        5,
        this.sky.height * this.playableSceneryRatio
      );

      this.screenBoundRight.position = {
        x: this.sky.x + this.sky.width / 2,
        y: this.sky.y - this.sky.height / 2,
      };
      this.screenBoundRight.setSize(
        5,
        this.sky.height * this.playableSceneryRatio
      );

      if (this.chase) {
        // move chase animation
        this.chase.setScale(this.scenery.scale / 2);
        this.chase.setPosition(
          this.sky.x + this.sky.width / 5,
          this.sky.y -
            this.sky.height / 2 +
            this.sky.height * this.playableSceneryRatio -
            (20 * this.scenery.scale) / 2 // only half cause it's centered
        );
      }

      // scale and move flying object within bounds
      if (this.gameState.target.active) {
        this.gameState.target.setScale(this.scenery.scale);
        const skyCenter = this.sky.getCenter();
        this.gameState.target.x = skyCenter.x;
        this.gameState.target.y = skyCenter.y;
      }

      // clear out text
      this.gameState.floatingTexts.forEach((text) => {
        text.destroy();
      });

      // move target tracker
      this.gameState.targetTracker.forEach((target, index) => {
        target.setPosition(
          this.sky.x + this.sky.width * 0.35,
          this.sky.y + this.sky.height * 0.35
        );
        target.setScale(this.scenery.scale / 2);
      });

      // start screen
      if (this.startScreenGroup?.active) {
        this.startScreenBackground.setPosition(this.sky.x, this.sky.y);
        this.startScreenBackground.setSize(this.sky.width, this.sky.height);
        this.startScreenText1.setPosition(
          this.sky.x,
          this.sky.y - this.sky.height / 10
        );
        this.startScreenText1.setFontSize(getFontSize(FontSizes.MEDIUM));
        this.startScreenText2.setPosition(
          this.sky.x,
          this.sky.y - this.sky.height / 10
        );
        this.startScreenText2.setFontSize(getFontSize(FontSizes.MEDIUM));
        this.startZapper.setPosition(
          this.sky.x - this.sky.width / 20,
          this.sky.y + this.sky.height / 4
        );
        this.startZapper.setScale(this.scenery.scale);
        this.startScreenTextZapper.setPosition(
          this.sky.x,
          this.sky.y + this.sky.height / 4
        );
        this.startScreenTextZapper.setFontSize(getFontSize(FontSizes.SMALL));
      }
    }
  }
}
