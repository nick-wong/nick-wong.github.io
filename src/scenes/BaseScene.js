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

    this.scale.on("resize", this.resize, this);

    this.add
      .text(center.x, window.innerHeight / 5, "nick wong", {
        fontFamily: "Manaspace",
        fontSize: "36px",
        align: "center",
        resolution: 3,
      })
      .setOrigin(0.5); // position is center

    // Create back button
    const backButton = this.add
      .text(20, 20, "back", {
        fontFamily: "Manaspace",
        fontSize: "12px",
        align: "center",
        resolution: 10,
      })
      .setName("backButton")
      .setInteractive()
      .setVisible(false);

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

    // Create TV
    const tv = this.add
      .sprite(center.x, center.y, "tv")
      .setName("tv")
      .setInteractive(this.input.makePixelPerfect())
      .setScale(2)
      .play("flicker");

    // Events
    backButton.on("pointerup", () => {
      const cam = this.cameras.main;

      if (this.scene.isActive("TVScene")) {
        this.scene.sleep("TVScene");
        this.scene.sleep("TVSceneGun");
      }

      tv.play("flicker");

      // Reset camera zoom
      cam.pan(window.innerWidth / 2, window.innerHeight / 2, 1000);
      cam.zoomTo(1, 750);

      // Hide back out button
      backButton.setVisible(false);

      this.tweens.add({
        targets: tv,
        scale: 2,
        ease: "Sine.easeInOut",
        duration: 750,
      });
    });
    let currentObject;
    this.input.on("gameobjectover", (_, gameObject) => {
      const cam = this.cameras.main;
      // Selectively glow
      if (gameObject.name === "tv" && cam.zoom === 1) {
        gameObject.postFX.addGlow(0xffffff, 3, 0, false, 0.4, 5);
      }
      // Tints
      else if (gameObject.name === "backButton") {
        gameObject.setTint(0xfcc200);
      }
      currentObject = gameObject;
    });
    this.input.on("gameobjectout", (_, gameObject) => {
      // Selectively glow
      if (gameObject.name === "tv") {
        gameObject.postFX.clear();
      }
      // Tints
      else if (gameObject.name === "backButton") {
        gameObject.clearTint();
      }
      currentObject = null;
    });
    this.input.on("pointerup", (pointer) => {
      // TODO: zoom to hardcoded object positions
      const cam = this.cameras.main;
      if (currentObject?.name === "tv") {
        // Remove glow
        tv.postFX.clear();

        if (cam.zoom === 1) {
          //cam.pan(pointer.position.x, pointer.position.y, 1000);
          this.tweens.add({
            targets: tv,
            scale: 4,
            ease: "Sine.easeInOut",
            duration: 750,
          });
          cam.zoomTo(5, 750, "Linear", false, (camera, progress) => {
            if (progress === 1) {
              // Show back button
              backButton.setVisible(true);
              backButton.setPosition(
                cam.worldView.x + 10,
                cam.worldView.y + 10
              );

              // Launch TV scene in back and gun in front
              this.scene.launch("TVScene");
              this.scene.sendToBack("TVScene");
              this.scene.launch("TVSceneGun");
              tv.play("playing");
            }
          });
        }
      }
    });
  }

  // TODO: reposition objects on window resize
  resize(gameSize, baseSize, displaySize, resolution) {}
}
