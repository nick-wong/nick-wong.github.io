import Phaser from "phaser";
import WebFontFile from "../loaders/WebFontFile";
import {
  FontSizes,
  getFontSize,
  getWidthOffset,
  getZoom,
} from "../util/Resize";

import tv from "../assets/tv.png";
import akisquirrel from "../assets/akisquirrel.png";
import startzapper from "../assets/startgun.png";
import target from "../assets/target.png";
import background from "../assets/duckhuntbg.png";
import duckhuntgun from "../assets/duckhuntgun.png";
import resetbutton from "../assets/resetbutton.png";
import roundsign from "../assets/roundsign.png";
import diplomasmall from "../assets/diploma_small.png";
import diploma from "../assets/diploma.png";
import roomwindow from "../assets/window.png";
import githubicon from "../assets/icons/github.png";
import linkedinicon from "../assets/icons/linkedin.png";

import { GrayscalePipeline, PIPELINE_GRAYSCALE } from "../util/Pipelines";
import { createBackButton, diplomaBackButton } from "../util/Helpers";

export class BaseScene extends Phaser.Scene {
  constructor() {
    super("BaseScene");
  }

  preload() {
    // TODO: if needed, add preloader

    this.load.addFile(new WebFontFile(this.load, ["Manaspace"], "custom"));

    // bitmap fonts
    // this.load.bitmapFont("Manaspace", manaspc_png, manaspc_xml);

    // base assets
    this.load.spritesheet("tv", tv, {
      frameWidth: 47,
      frameHeight: 63,
    });
    this.load.image("diplomasmall", diplomasmall);
    this.load.image("diploma", diploma);

    this.load.spritesheet("roomWindow", roomwindow, {
      frameWidth: 53,
      frameHeight: 53,
    });

    // tv
    this.load.spritesheet("startzapper", startzapper, {
      frameWidth: 30,
      frameHeight: 15,
    });
    this.load.spritesheet("target", target, {
      frameWidth: 11,
      frameHeight: 11,
    });
    this.load.spritesheet("akisquirrel", akisquirrel, {
      frameWidth: 100,
      frameHeight: 20,
    });
    this.load.image("background", background);

    // zapper
    this.load.spritesheet("duckhuntgun", duckhuntgun, {
      frameWidth: 75,
      frameHeight: 120,
    });

    this.load.image("resetbutton", resetbutton);
    this.load.image("roundsign", roundsign);

    // icons
    this.load.image("githubicon", githubicon);
    this.load.image("linkedinicon", linkedinicon);
  }

  create() {
    // TODO check if canvas
    // this.game.renderer.type === Phaser.CANVAS;

    this.game.renderer.pipelines.add(
      PIPELINE_GRAYSCALE,
      new GrayscalePipeline(this.game)
    );

    this.baseObjectGroup = this.add.group();

    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    this.scene.launch("BackgroundScene");
    this.scene.sendToBack("BackgroundScene");

    this.title = this.add
      .text(center.x, window.innerHeight / 5, "nick wong", {
        fontFamily: "Manaspace",
        fontSize: getFontSize(FontSizes.MEDIUM),
        align: "center",
        resolution: 20,
      })
      .setName("title")
      .setOrigin(0.5); // position is center

    // TV animation
    this.anims.create({
      key: "flicker",
      frames: this.anims.generateFrameNumbers("tv", { frames: [0, 1] }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "playing",
      frames: this.anims.generateFrameNumbers("tv", { frames: [2] }),
      frameRate: 1,
    });

    this.anims.create({
      key: "gunReady",
      frames: this.anims.generateFrameNumbers("tv", { frames: [3] }),
      frameRate: 1,
    });

    // Create TV
    this.tv = this.add
      .sprite(center.x, center.y, "tv")
      .setName("tv")
      .setInteractive({
        useHandCursor: true,
        pixelPerfect: true,
      })
      .setScale(2)
      .setPipeline(PIPELINE_GRAYSCALE)
      .play("flicker");

    this.tvText = this.add
      .text(
        this.tv.x,
        this.tv.y +
          (this.tv.height * this.tv.scale) / 2 +
          window.innerHeight / 50,
        "???",
        {
          fontFamily: "Manaspace",
          fontSize: getFontSize(FontSizes.XSMALL),
          align: "center",
          resolution: 20,
        }
      )
      .setOrigin(0.5, 0);

    // diploma
    this.diplomaSmall = this.add
      .image(
        center.x -
          (window.innerWidth < 480
            ? window.innerWidth / 3
            : this.tv.width + window.innerWidth / 10),
        center.y - window.innerHeight / 10,
        "diplomasmall"
      )
      .setName("diplomasmall")
      .setScale(this.tv.scale)
      .setPipeline(PIPELINE_GRAYSCALE)
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
        pixelPerfect: true,
      });

    this.diplomaText = this.add
      .text(
        this.diplomaSmall.x,
        this.diplomaSmall.y +
          (this.diplomaSmall.height * this.diplomaSmall.scale) / 2 +
          window.innerHeight / 50,
        "???",
        {
          fontFamily: "Manaspace",
          fontSize: getFontSize(FontSizes.XSMALL),
          align: "center",
          resolution: 20,
        }
      )
      .setOrigin(0.5, 0);

    // window
    this.anims.create({
      key: "nightsky",
      frames: this.anims.generateFrameNumbers("roomWindow", {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 0.5,
      repeat: -1,
    });
    this.roomWindow = this.add
      .sprite(
        center.x +
          (window.innerWidth < 480
            ? window.innerWidth / 3
            : this.tv.width + window.innerWidth / 7.5),
        center.y - window.innerHeight / 8,
        "roomWindow"
      )
      .setName("roomWindow")
      .setScale(this.tv.scale)
      .setPipeline(PIPELINE_GRAYSCALE)
      .setOrigin(0.5)
      .play("nightsky")
      .setInteractive({
        useHandCursor: true,
        pixelPerfect: true,
      });
    this.windowText = this.add
      .text(
        this.roomWindow.x,
        this.roomWindow.y +
          (this.roomWindow.height * this.roomWindow.scale) / 2 +
          window.innerHeight / 50,
        "???",
        {
          fontFamily: "Manaspace",
          fontSize: getFontSize(FontSizes.XSMALL),
          align: "center",
          resolution: 20,
        }
      )
      .setOrigin(0.5, 0);

    // icons
    this.github = this.add
      .image(
        center.x - getWidthOffset(),
        window.innerHeight * 0.8,
        "githubicon"
      )
      .setScale(2)
      .setTint(0xaaaaaa)
      .setInteractive({ useHandCursor: true, pixelPerfect: true })
      .setOrigin(1, 0.5);
    this.github
      .on("pointerover", () => {
        this.github.clearTint();
      })
      .on("pointerout", () => {
        this.github.setTint(0xaaaaaa);
      })
      .on("pointerup", () => {
        window.open("https://github.com/nick-wong", "_blank");
      });

    this.linkedin = this.add
      .image(
        center.x + getWidthOffset(),
        window.innerHeight * 0.8,
        "linkedinicon"
      )
      .setScale(2)
      .setPipeline(PIPELINE_GRAYSCALE)
      .setInteractive({ useHandCursor: true, pixelPerfect: true })
      .setOrigin(0, 0.5);
    this.linkedin
      .on("pointerover", () => {
        this.linkedin.resetPipeline();
      })
      .on("pointerout", () => {
        this.linkedin.setPipeline(PIPELINE_GRAYSCALE);
      })
      .on("pointerup", () => {
        window.open("https://www.linkedin.com/in/nicholas-k-wong/", "_blank");
      });

    // events
    this.tv.on("pointerover", () => {
      const cam = this.cameras.main;
      if (cam.zoom === 1) {
        this.addGlowToObject(this.tv);
      }
    });
    this.diplomaSmall.on("pointerover", () => {
      this.addGlowToObject(this.diplomaSmall);
    });
    this.roomWindow
      .on("pointerover", () => {
        this.addGlowToObject(this.roomWindow);
        // run for a long period/while hovering
      })
      .on("pointerout", () => {
        this.cameras.main.resetFX();
      })
      .on("pointerup", () => {
        const cam = this.cameras.main;

        // warp by shake + pan + rotate
        cam.shake(750, 0.01);
        cam.pan(this.roomWindow.x, this.roomWindow.y, 750);
        cam.zoomTo(2, 750);
        const warpTween = this.tweens.add({
          targets: cam,
          rotation: 9,
          ease: Phaser.Math.Easing.Quadratic.InOut,
          duration: 750,
        });
        warpTween.on("complete", () => {
          cam.flash();

          // todo: launch exp stuff

          // reset camera
          cam.setZoom(1);
          cam.setRotation(0);
          cam.setScroll(0);

          // remove grayscale and show text
          this.roomWindow.resetPipeline();
          this.windowText.setText(["experience", "(wip)"]);
        });
      });

    this.input.on("gameobjectout", (_, gameObject) => {
      // remove glow
      if (
        gameObject.name === "tv" ||
        gameObject.name === "diplomasmall" ||
        gameObject.name === "roomWindow"
      ) {
        gameObject.postFX.clear();
        this.input.setDefaultCursor("unset");
      }
    });
    this.tv.on("pointerup", (pointer) => {
      // TODO: zoom to object center positions when applicable
      const cam = this.cameras.main;
      // Remove glow
      this.tv.postFX.clear();
      this.tv.setDepth(99);

      if (cam.zoom === 1) {
        //cam.pan(pointer.position.x, pointer.position.y, 1000);

        this.tweens.add({
          targets: this.tv,
          scale: 4,
          ease: "Sine.easeInOut",
          duration: 750,
        });
        cam.zoomTo(
          getZoom(this.tv.width * 4, this.tv.height * 4 * 0.8, 1.2),
          750,
          "Linear",
          false,
          (camera, progress) => {
            this.moveTvText();
            if (progress === 1) {
              // remove grayscale and show text
              this.tv.resetPipeline();
              this.tvText.setText("skills");

              // hide all other objects
              this.hideAllObjectsExcept("tv");

              // launch TV scene in back and gun in front
              this.scene.isSleeping("TVScene")
                ? this.scene.wake("TVScene")
                : this.scene.launch("TVScene");

              this.scene.moveBelow("BaseScene", "TVScene");

              this.tv.play("playing");
              this.closeUpGun = this.add
                .sprite(window.innerWidth / 2, window.innerHeight / 2, "tv")
                .setName("closeUpGun")
                .setInteractive({
                  useHandCursor: true,
                  pixelPerfect: true,
                })
                .setScale(4)
                .play("gunReady");
              const gunGlow = this.closeUpGun.postFX.addGlow(
                0xffffff,
                2,
                0,
                false,
                0.4,
                10
              );
              const closeUpGunTween = this.tweens.add({
                targets: gunGlow,
                outerStrength: 6,
                yoyo: true,
                loop: -1,
                ease: "Sine.easeInOut",
              });
              this.closeUpGun.on("pointerup", () => {
                this.closeUpGun.destroy();
                this.scene.get("TVScene").setCanShoot(true);
                this.scene.isSleeping("TVSceneGun")
                  ? this.scene.wake("TVSceneGun")
                  : this.scene.launch("TVSceneGun");
              });
              this.closeUpGun.on("pointerover", () => {
                gunGlow.outerStrength = 6;
                closeUpGunTween.pause();
              });
              this.closeUpGun.on("pointerout", () => {
                gunGlow.outerStrength = 2;
                closeUpGunTween.resume();
              });
              this.tv.input.cursor = "default";
            }
          }
        );
      }
    });
    this.diplomaSmall.on("pointerup", () => {
      this.diplomaSmall.postFX.clear();

      // remove grayscale and show text
      this.diplomaSmall.resetPipeline();
      this.diplomaText.setText("education");

      createBackButton(this, diplomaBackButton, true);
      this.diploma = this.add
        .plane(window.innerWidth / 2, window.innerHeight / 2, "diploma")
        .setInteractive();
      this.diploma.setScale(
        getZoom(
          this.diploma.displayWidth * 1.1,
          this.diploma.displayHeight * 1.1
        )
      );

      this.diploma.on("pointermove", (_, localX, localY) => {
        const maxRotation = 1;

        // inverted based on 3d
        this.diploma.modelRotation.x =
          maxRotation * (localY / this.diploma.displayWidth / 2);
        this.diploma.modelRotation.y =
          maxRotation * (localX / this.diploma.displayHeight / 2);
      });
    });

    this.baseObjectGroup.addMultiple([
      this.title,
      this.tv,
      this.tvText,
      this.diplomaSmall,
      this.diplomaText,
      this.roomWindow,
      this.windowText,
    ]);
    this.scale.on("resize", this.resize, this);
  }

  addGlowToObject(obj) {
    obj.postFX.addGlow(0xffffff, 3, 0, false, 0.4, 5);
  }

  showAllObjects() {
    this.baseObjectGroup.getChildren().forEach((obj) => {
      obj.setVisible(true);
    });
  }

  hideAllObjectsExcept(name) {
    this.baseObjectGroup.getChildren().forEach((obj) => {
      if (obj.name !== name) {
        obj.setVisible(false);
      }
    });
  }

  // TODO: reposition objects on window resize
  resize(gameSize, baseSize, displaySize, resolution) {
    if (window.innerWidth > 240 && window.innerHeight > 240) {
      const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      this.tv.setPosition(center.x, center.y);
      this.moveTvText();
      this.tvText.setFontSize(getFontSize(FontSizes.XSMALL));
      if (this.cameras.main.zoom !== 1) {
        this.cameras.main.setZoom(
          getZoom(
            this.tv.width * this.tv.scale,
            this.tv.height * this.tv.scale * 0.8,
            1.2
          )
        );
      }
      this.title.setPosition(window.innerWidth / 2, window.innerHeight / 5);
      this.title.setFontSize(getFontSize(FontSizes.MEDIUM));

      if (this.closeUpGun) {
        this.closeUpGun.setPosition(this.tv.x, this.tv.y);
      }

      // diploma
      this.diplomaSmall.setPosition(
        center.x -
          (window.innerWidth < 480
            ? window.innerWidth / 3
            : this.tv.width + window.innerWidth / 10),
        center.y - window.innerHeight / 10
      );
      this.diplomaText.setPosition(
        this.diplomaSmall.x,
        this.diplomaSmall.y +
          (this.diplomaSmall.height * this.diplomaSmall.scale) / 2 +
          window.innerHeight / 50
      );
      this.diplomaText.setFontSize(getFontSize(FontSizes.XSMALL));
      if (this.diploma) {
        this.diploma.setScale(
          getZoom(
            this.diploma.displayWidth * 1.1,
            this.diploma.displayHeight * 1.1
          ) * this.diploma.scale
        );
        this.diploma.setPosition(center.x, center.y);
      }

      this.roomWindow.setPosition(
        center.x +
          (window.innerWidth < 480
            ? window.innerWidth / 3
            : this.tv.width + window.innerWidth / 7.5),
        center.y - window.innerHeight / 8
      );
      this.windowText.setPosition(
        this.roomWindow.x,
        this.roomWindow.y +
          (this.roomWindow.height * this.roomWindow.scale) / 2 +
          window.innerHeight / 50
      );

      // icons
      this.github.setPosition(
        center.x - getWidthOffset(),
        window.innerHeight * 0.8
      );
      this.linkedin.setPosition(
        center.x + getWidthOffset(),
        window.innerHeight * 0.8
      );

      /* Last resort nuke it
      for (const scene of this.scene.manager.getScenes(false)) {
        scene.scene.stop();
      }

      // Restart first scene
      this.scene.start("BaseScene");
      */
    }
  }

  moveTvText() {
    this.tvText.setPosition(
      this.tv.x,
      this.tv.y + (this.tv.height * this.tv.scale) / 2 + window.innerHeight / 50
    );
  }

  reset() {
    if (this.closeUpGun) {
      this.closeUpGun.destroy();
    }

    // Reset cursor
    this.input.setDefaultCursor("unset");

    this.tv.play("flicker");
    this.tv.input.cursor = "pointer";
    this.tv.setDepth(0);
    this.showAllObjects();

    // Reset camera zoom
    this.cameras.main.pan(window.innerWidth / 2, window.innerHeight / 2, 1000);
    this.cameras.main.zoomTo(1, 750, "Linear", false, () => {
      this.moveTvText();
    });

    // Reduce size back
    this.tweens.add({
      targets: this.tv,
      scale: 2,
      ease: "Sine.easeInOut",
      duration: 750,
    });
  }
}
