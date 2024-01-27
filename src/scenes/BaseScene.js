import Phaser from "phaser";
import WebFontFile from "../loaders/WebFontFile";

export class BaseScene extends Phaser.Scene {
  constructor() {
    super("BaseScene");
  }

  preload() {
    this.load.spritesheet("tv", "assets/tv.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.addFile(new WebFontFile(this.load, ["Manaspace"], "custom"));
  }

  create() {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    this.scene.launch("BackgroundScene");
    this.scene.sendToBack("BackgroundScene");

    this.title = this.add
      .text(center.x, window.innerHeight / 5, "nick wong", {
        fontFamily: "Manaspace",
        fontSize: "36px",
        align: "center",
        resolution: 3,
      })
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
      .play("flicker");

    let currentObject;
    this.input.on("gameobjectover", (_, gameObject) => {
      const cam = this.cameras.main;
      // Selectively glow
      if (gameObject.name === "tv") {
        if (cam.zoom === 1) {
          gameObject.postFX.addGlow(0xffffff, 3, 0, false, 0.4, 5);
        }
      }
      currentObject = gameObject;
    });
    this.input.on("gameobjectout", (_, gameObject) => {
      // Selectively glow
      if (gameObject.name === "tv") {
        gameObject.postFX.clear();
        this.input.setDefaultCursor("unset");
      }
      currentObject = null;
    });
    this.input.on("pointerup", (pointer) => {
      // TODO: zoom to hardcoded object positions
      const cam = this.cameras.main;
      if (currentObject?.name === "tv") {
        // Remove glow
        this.tv.postFX.clear();

        if (cam.zoom === 1) {
          //cam.pan(pointer.position.x, pointer.position.y, 1000);
          this.tweens.add({
            targets: this.tv,
            scale: 4,
            ease: "Sine.easeInOut",
            duration: 750,
          });
          cam.zoomTo(5, 750, "Linear", false, (camera, progress) => {
            if (progress === 1) {
              // Launch TV scene in back and gun in front
              this.scene.isSleeping("TVScene")
                ? this.scene.wake("TVScene")
                : this.scene.launch("TVScene");

              this.scene.moveBelow("BaseScene", "TVScene");
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
              this.tv.play("playing");
              this.tv.input.cursor = "default";
            }
          });
        }
      }
    });
    this.scale.on("resize", this.resize, this);
  }

  // TODO: reposition objects on window resize
  resize(gameSize, baseSize, displaySize, resolution) {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.tv.setPosition(center.x, center.y);
    this.title.setPosition(window.innerWidth / 2, window.innerHeight / 5);

    if (this.closeUpGun) {
      this.closeUpGun.setPosition(this.tv.x, this.tv.y);
    }
  }

  reset() {
    if (this.closeUpGun) {
      this.closeUpGun.destroy();
    }

    // Reset cursor
    this.input.setDefaultCursor("unset");

    this.tv.play("flicker");
    this.tv.input.cursor = "pointer";

    // Reset camera zoom
    this.cameras.main.pan(window.innerWidth / 2, window.innerHeight / 2, 1000);
    this.cameras.main.zoomTo(1, 750);

    // Reduce size back
    this.tweens.add({
      targets: this.tv,
      scale: 2,
      ease: "Sine.easeInOut",
      duration: 750,
    });
  }
}
