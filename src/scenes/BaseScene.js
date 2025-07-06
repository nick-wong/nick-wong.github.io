import Phaser from "phaser";
import WebFontFile from "../loaders/WebFontFile";
import {
  FontSizes,
  getFontSize,
  getWidthOffset,
  getZoom,
} from "../util/Resize";

// duck hunt
import akisquirrel from "../assets/skillhunt/akisquirrel.png";
import startzapper from "../assets/skillhunt/startgun.png";
import target from "../assets/skillhunt/target.png";
import background from "../assets/skillhunt/duckhuntbg.png";
import duckhuntgun from "../assets/skillhunt/duckhuntgun.png";
import resetbutton from "../assets/skillhunt/resetbutton.png";
import roundsign from "../assets/skillhunt/roundsign.png";
// main room
import tv from "../assets/tv.png";
import diplomasmall from "../assets/diploma_small.png";
import roomwindow from "../assets/window.png";
import shelfsmall from "../assets/shelf_small.png";
// edu
import diploma from "../assets/education/diploma.png";
// icons
import githubicon from "../assets/icons/github.png";
import linkedinicon from "../assets/icons/linkedin.png";
import itchicon from "../assets/icons/itch.png";
// exp
import unknownworld from "../assets/experience/unknownworld.png";
import worldselector from "../assets/experience/worldselector.png";
import starparticle from "../assets/experience/starparticle.png";
import worldbackground from "../assets/experience/worldbackground.png";
import worldpath from "../assets/experience/worldpath.png";
import worlds from "../assets/experience/worlds.png";
import worldtitle from "../assets/experience/worldtitle.png";
import worldinfobox from "../assets/experience/worldinfobox.png";
import worldinfoboxspecial from "../assets/experience/worldinfoboxspecial.png";
import worldlevelstar from "../assets/experience/worldlevelstar.png";
import worldchevron from "../assets/experience/worldchevron.png";
// projects
import balloonatics from "../assets/projects/balloonatics.png";
import bspokr from "../assets/projects/bspokr.png";
import wistaria from "../assets/projects/wistaria.png";
import starship from "../assets/projects/starship.png";

import { PIPELINE_GRAYSCALE } from "../util/Pipelines";
import {
  carouselBackButton,
  createBackButton,
  createCarousel,
  diplomaBackButton,
  getCarouselDisplaySize,
  resetCursor,
  resizeBackButton,
} from "../util/Helpers";

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
    this.load.image("shelfsmall", shelfsmall);

    // duck hunt
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
    this.load.spritesheet("duckhuntgun", duckhuntgun, {
      frameWidth: 75,
      frameHeight: 120,
    });
    this.load.image("resetbutton", resetbutton);
    this.load.image("roundsign", roundsign);

    // icons
    this.load.image("githubicon", githubicon);
    this.load.image("linkedinicon", linkedinicon);
    this.load.image("itchicon", itchicon);

    // exp
    this.load.image("unknownworld", unknownworld);
    this.load.image("starparticle", starparticle);
    this.load.image("worldbackground", worldbackground);
    this.load.image("worldpath", worldpath);
    this.load.image("worldtitle", worldtitle);
    this.load.image("worldinfobox", worldinfobox);
    this.load.image("worldinfoboxspecial", worldinfoboxspecial);
    this.load.image("worldlevelstar", worldlevelstar);
    this.load.image("worldchevron", worldchevron);
    this.load.spritesheet("worldselector", worldselector, {
      frameWidth: 80,
      frameHeight: 80,
    });
    this.load.spritesheet("worlds", worlds, {
      frameWidth: 64,
      frameHeight: 64,
    });

    // projects
    this.load.spritesheet("balloonatics", balloonatics, {
      frameWidth: 60,
      frameHeight: 110,
    });
    this.load.spritesheet("bspokr", bspokr, {
      frameWidth: 90,
      frameHeight: 70,
    });
    this.load.spritesheet("wistaria", wistaria, {
      frameWidth: 108,
      frameHeight: 108,
    });
    this.load.spritesheet("starship", starship, {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    // TODO check if canvas
    // this.game.renderer.type === Phaser.CANVAS;
    this.grayscalePipeline = this.renderer.pipelines.get(PIPELINE_GRAYSCALE);

    this.baseObjectGroup = this.add.group();

    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    this.scene.launch("BackgroundScene");
    this.scene.sendToBack("BackgroundScene");

    this.title = this.add
      .text(
        center.x,
        window.innerHeight > 400
          ? window.innerHeight / 5
          : window.innerHeight / 10,
        "nick wong",
        {
          fontFamily: "Manaspace",
          fontSize: getFontSize(FontSizes.MEDIUM),
          align: "center",
          resolution: 20,
        }
      )
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
      .setPipeline(this.grayscalePipeline)
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
            ? window.innerWidth * 0.4
            : this.tv.width + window.innerWidth / 7),
        center.y - window.innerHeight / 10,
        "diplomasmall"
      )
      .setName("diplomasmall")
      .setScale(this.tv.scale)
      .setPipeline(this.grayscalePipeline)
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
        pixelPerfect: true,
      });
    this.diplomaSmall.postFX.addShine(0.25, 0.25, 5);

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
      .setPipeline(this.grayscalePipeline)
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

    // projects
    this.anims.create({
      key: "balloonatics",
      frames: this.anims.generateFrameNumbers("balloonatics", {
        frames: [0, 1],
      }),
      frameRate: 1.5,
      repeat: -1,
    });
    this.anims.create({
      key: "bspokr",
      frames: this.anims.generateFrameNumbers("bspokr", {
        frames: [0, 1],
      }),
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: "wistaria",
      frames: this.anims.generateFrameNumbers("wistaria", {
        frames: [0, 1],
      }),
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: "starship",
      frames: this.anims.generateFrameNumbers("starship", {
        frames: [0, 1],
      }),
      frameRate: 1.5,
      repeat: -1,
    });

    this.shelfSmall = this.add
      .image(
        center.x -
          (window.innerWidth < 480
            ? window.innerWidth * 0.15
            : this.tv.width + window.innerWidth / 30),
        center.y - window.innerHeight / 7,
        "shelfsmall"
      )
      .setName("shelfsmall")
      .setScale(this.tv.scale)
      .setPipeline(this.grayscalePipeline)
      .setOrigin(0.5)
      .setInteractive({
        useHandCursor: true,
      });

    this.shelfText = this.add
      .text(
        this.shelfSmall.x,
        this.shelfSmall.y +
          (this.shelfSmall.height * this.shelfSmall.scale) / 2 +
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
        center.x,
        window.innerHeight > 400
          ? window.innerHeight * 0.8
          : window.innerHeight * 0.9,
        "githubicon"
      )
      .setName("githubicon")
      .setScale(this.tv.scale)
      .setTint(0xaaaaaa)
      .setInteractive({ useHandCursor: true, pixelPerfect: true })
      .setOrigin(1, 0.5);
    this.github.x = center.x - this.github.width/2 - getWidthOffset();
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
      .sprite(
        center.x,
        window.innerHeight > 400
          ? window.innerHeight * 0.8
          : window.innerHeight * 0.9,
        "linkedinicon"
      )
      .setName("linkedinicon")
      .setScale(this.tv.scale)
      .setPipeline(this.grayscalePipeline)
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true, pixelPerfect: true });
    this.linkedin.x = center.x - getWidthOffset()/2;
    this.linkedin
      .on("pointerover", () => {
        this.linkedin.resetPipeline();
      })
      .on("pointerout", () => {
        this.linkedin.setPipeline(this.grayscalePipeline);
      })
      .on("pointerup", () => {
        window.open("https://www.linkedin.com/in/nicholas-k-wong/", "_blank");
      });

    this.itch = this.add
      .sprite(
        center.x,
        window.innerHeight > 400
          ? window.innerHeight * 0.8
          : window.innerHeight * 0.9,
        "itchicon"
      )
      .setName("itchicon")
      .setScale(this.tv.scale)
      .setPipeline(this.grayscalePipeline)
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true, pixelPerfect: true });
    this.itch.x = center.x + this.itch.width * 1.5 + getWidthOffset();
    this.itch
      .on("pointerover", () => {
        this.itch.resetPipeline();
      })
      .on("pointerout", () => {
        this.itch.setPipeline(this.grayscalePipeline);
      })
      .on("pointerup", () => {
        window.open("https://lopsoplo.itch.io/", "_blank");
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
    this.shelfSmall.on("pointerover", () => {
      this.addGlowToObject(this.shelfSmall);
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
        cam.shake(500, 0.01);
        cam.pan(this.roomWindow.x, this.roomWindow.y, 500);
        cam.zoomTo(2, 500);
        const warpTween = this.tweens.add({
          targets: cam,
          rotation: 9,
          ease: Phaser.Math.Easing.Quadratic.InOut,
          duration: 750,
        });
        warpTween.on("complete", () => {
          resetCursor(this);

          setTimeout(() => {
            // launch exp stuff
            this.scene.isSleeping("SpaceScene")
              ? this.scene.wake("SpaceScene")
              : this.scene.launch("SpaceScene");

            // reset camera
            cam.setZoom(1);
            cam.setRotation(0);
            cam.setScroll(0);

            this.scene.sleep();
          }, 250);

          // remove grayscale and show text
          this.roomWindow.resetPipeline();
          this.roomWindow.clearFX();
          this.windowText.setText("experience");
        });
      });

    this.input.on("gameobjectout", (_, gameObject) => {
      // remove glow
      if (
        gameObject.name === "tv" ||
        gameObject.name === "diplomasmall" ||
        gameObject.name === "roomWindow" ||
        gameObject.name === "shelfsmall"
      ) {
        gameObject.postFX.clear();

        // keep shine
        if (gameObject.name === "diplomasmall") {
          this.diplomaSmall.postFX.addShine(0.25, 0.25, 5);
        }
        resetCursor(this);
      }
    });
    this.tv.on("pointerup", (pointer) => {
      const cam = this.cameras.main;
      // Remove glow
      this.tv.postFX.clear();
      this.tv.setDepth(99);

      if (cam.zoom === 1) {
        this.tweens.add({
          targets: this.tv,
          scale: 4,
          ease: "Sine.easeInOut",
          duration: 750,
        });

        // zoom
        cam.zoomTo(
          getZoom(this.tv.width * 4, this.tv.height * 4 * 0.8, 1.2),
          750,
          "Linear",
          false,
          (_, progress) => {
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
      // remove grayscale and show text
      this.diplomaSmall.resetPipeline();
      this.diplomaText.setText("education");

      // create and launch interactive diploma
      createBackButton(this, diplomaBackButton, {
        fullBackgroundClickable: true,
      });
      this.diploma = this.add
        .plane(window.innerWidth / 2, window.innerHeight / 2, "diploma")
        .setInteractive();
      this.diploma.setScale(
        getZoom(
          this.diploma.displayWidth * 1.1,
          this.diploma.displayHeight * 1.1
        )
      );
      this.diploma.lastClicked = 0;
      this.diploma.previousScale = this.diploma.scale;

      this.diploma
        .on("pointermove", (_, localX, localY) => {
          const maxRotation = 1;

          // inverted based on 3d
          this.diploma.modelRotation.x =
            maxRotation * (localY / this.diploma.displayWidth / 2);
          this.diploma.modelRotation.y =
            maxRotation * (localX / this.diploma.displayHeight / 2);
        })
        .on("pointerup", () => {
          // toggle zoom on double click
          const clickDelay = this.time.now - this.diploma.lastClicked;
          this.diploma.lastClicked = this.time.now;
          if (clickDelay < 300) {
            if (this.diploma.scale !== this.diploma.previousScale) {
              this.diploma.setScale(this.diploma.previousScale);
            } else {
              this.diploma.setScale(this.diploma.scale * 1.25);
            }
          }
        });
    });

    this.shelfSmall.on("pointerup", () => {
      // remove grayscale and show text
      this.shelfSmall.resetPipeline();
      this.shelfText.setText("projects");

      createBackButton(this, carouselBackButton, {
        fullBackgroundClickable: true,
        color: 0x1c2833,
        alpha: 0.98,
      });

      if (!this.projectCarouselCreated) {
        // spawn project carousel
        const balloonatics = this.add
          .sprite(center.x, window.innerHeight * 0.45, "balloonatics")
          .setName("balloonatics")
          .setInteractive({
            useHandCursor: true,
          })
          .setData("link", "https://cse125.ucsd.edu/2018/cse125g4/index.html")
          .play("balloonatics");

        const bspokr = this.add
          .sprite(center.x, window.innerHeight * 0.45, "bspokr")
          .setName("bspokr")
          .setInteractive({
            useHandCursor: true,
          })
          .setData("link", "https://bspokr.onrender.com/")
          .play("bspokr");
        const wistaria = this.add
          .sprite(center.x, window.innerHeight * 0.45, "wistaria")
          .setName("wistaria")
          .setInteractive({
            useHandCursor: true,
          })
          .setData("link", "https://wistaria.ink/")
          .play("wistaria");
        const starship = this.add
          .sprite(center.x, window.innerHeight * 0.45, "starship")
          .setName("vr starship (pw: email)")
          .setInteractive({
            useHandCursor: true,
          })
          .setData("link", "https://lopsoplo.itch.io/startup-starship")
          .play("starship");

        this.projectCarouselGroup = this.add.group([
          starship,
          bspokr,
          balloonatics,
          wistaria,
        ]);

        createCarousel(this, this.projectCarouselGroup);
        this.projectCarouselCreated = true;
      } else {
        this.projectCarouselGroup.getChildren().forEach((carouselItem) => {
          carouselItem.setVisible(true).setDepth(99);
        });
        this.carouselText.setVisible(true).setDepth(99);
      }
    });

    this.baseObjectGroup.addMultiple([
      this.title,
      this.tv,
      this.tvText,
      this.diplomaSmall,
      this.diplomaText,
      this.roomWindow,
      this.windowText,
      this.shelfSmall,
      this.shelfText,
      this.github,
      this.linkedin,
      this.itch
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
      this.title.setPosition(
        window.innerWidth / 2,
        window.innerHeight > 400
          ? window.innerHeight / 5
          : window.innerHeight / 10
      );
      this.title.setFontSize(getFontSize(FontSizes.MEDIUM));

      if (this.closeUpGun) {
        this.closeUpGun.setPosition(this.tv.x, this.tv.y);
      }

      // diploma
      resizeBackButton(this);
      this.diplomaSmall.setPosition(
        center.x -
          (window.innerWidth < 480
            ? window.innerWidth * 0.4
            : this.tv.width + window.innerWidth / 7),
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
        this.diploma.previousScale = this.diploma.scale;
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
      this.windowText.setFontSize(getFontSize(FontSizes.XSMALL));

      // shelf
      this.shelfSmall.setPosition(
        center.x -
          (window.innerWidth < 480
            ? window.innerWidth * 0.15
            : this.tv.width + window.innerWidth / 30),
        center.y - window.innerHeight / 7
      );
      this.shelfText.setPosition(
        this.shelfSmall.x,
        this.shelfSmall.y +
          (this.shelfSmall.height * this.shelfSmall.scale) / 2 +
          window.innerHeight / 50
      );
      this.shelfText.setFontSize(getFontSize(FontSizes.XSMALL));

      if (this.projectCarouselGroup?.active) {
        this.projectCarouselGroup.getChildren().forEach((carouselItem) => {
          carouselItem.y = window.innerHeight * 0.45;
          const targetX = carouselItem.getData("targetX");
          carouselItem.x =
            targetX === -1
              ? 0 - carouselItem.displayWidth
              : targetX === 1
              ? window.innerWidth + carouselItem.displayWidth
              : window.innerWidth * targetX;

          const displaySize = getCarouselDisplaySize(
            targetX === 0.5,
            carouselItem
          );
          carouselItem.setDisplaySize(displaySize.width, displaySize.height);
        });

        this.carouselText.x = window.innerWidth * 0.5;
        this.carouselText.y = window.innerHeight * 0.9;
        this.carouselText.setFontSize(getFontSize(FontSizes.MEDIUM));
      }

      if (this.backButtonFullBackground?.active) {
        this.backButtonFullBackground.width = window.innerWidth;
        this.backButtonFullBackground.height = window.innerHeight;
      }

      // icons
      this.github.setPosition(
        center.x - this.github.width/2 - getWidthOffset(),
        window.innerHeight > 400
          ? window.innerHeight * 0.8
          : window.innerHeight * 0.9
      );
      this.linkedin.setPosition(
        center.x - this.linkedin.width/2,
        window.innerHeight > 400
          ? window.innerHeight * 0.8
          : window.innerHeight * 0.9
      );
      this.itch.setPosition(
        center.x + this.itch.width * 1.5 + getWidthOffset(),
        window.innerHeight > 400
          ? window.innerHeight * 0.8
          : window.innerHeight * 0.9
      );

      // fix scrolling while zooming in/out
      this.cameras.main.setScroll(0, 0);

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
    resetCursor(this);

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

  resetCamera() {
    // reset cameraa
    this.cameras.main.setZoom(1);
    this.cameras.main.setRotation(0);
    this.cameras.main.setScroll(0);
    resetCursor(this);
  }
}
