import Phaser from "phaser";

import {
  createBackButton,
  resizeBackButton,
  spaceBackButton,
} from "../util/Helpers";
import { FontSizes, backgroundCover, getFontSize } from "../util/Resize";

const STAR_SPACING = 20;

// x, y distance from center
// 480 x 360 = 960 x 720
// first info acts as position (in purple)
const WORLDS = [
  {
    key: "unknown",
    frames: [0],
  },
  {
    key: "unknownhighlighted",
    frames: [1],
  },
  {
    key: "badg",
    frames: [2],
    position: {
      xOffset: -200,
      yOffset: -140,
    },
    world: {
      stars: [1],
      title: ["ucsd health sciences", "[business app dev grp]"],
      info: ["programming assistant", "server testing", "db scripts"],
    },
  },
  {
    key: "amazonfresh",
    frames: [3],
    position: {
      xOffset: 100,
      yOffset: -195,
    },
    world: {
      stars: [1],
      title: ["amazon", "[storm]"],
      info: ["sde intern", "fresh order mods"],
    },
  },
  {
    key: "amazonprimenow",
    frames: [4],
    position: {
      xOffset: 400,
      yOffset: -55,
    },
    world: {
      stars: [1, 2],
      title: ["amazon", "[darth]"],
      info: [
        "full-stack sde",
        "primenow cart/checkout",
        "recipes",
        "spike management",
      ],
    },
  },
  {
    key: "twitch",
    frames: [5],
    position: {
      xOffset: 50,
      yOffset: 40,
    },
    world: {
      stars: [2],
      title: ["twitch", "[builder products/bat]"],
      info: ["full-stack sde", "internal tools"],
    },
  },
];

export class SpaceScene extends Phaser.Scene {
  constructor() {
    super("SpaceScene");
  }

  create() {
    this.cameras.main.flash(500);

    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    createBackButton(
      this,
      spaceBackButton,
      { fullBackgroundClickable: false },
      false
    );
    this.backButton.setPosition(10, window.innerHeight / 20);
    this.backButton.setOrigin(0, 0.5);

    this.worldBackground = this.add
      .image(center.x, center.y, "worldbackground")
      .setScrollFactor(0, 0);
    this.worldBackground.setScale(
      backgroundCover(this.worldBackground.width, this.worldBackground.height)
    );
    const cmx = this.worldBackground.preFX.addColorMatrix();
    const tween = this.tweens.addCounter({
      from: 0,
      to: 30,
      duration: 3000,
      yoyo: true,
      loop: -1,
      onUpdate: () => {
        cmx.hue(tween.getValue());
      },
    });

    // stars
    this.add
      .particles(0, 0, "starparticle", {
        gravityX: 10,
        gravityY: -5,
        speed: 3,
        maxAliveParticles: 30,
        alpha: { start: 0.8, end: 0.3 },
        scale: { min: 0.7, max: 1 },
        lifespan: { min: 3000, max: 5000 },
      })
      .addEmitZone({
        type: "random",
        source: new Phaser.Geom.Circle(
          window.innerWidth / 2,
          window.innerHeight / 2,
          window.innerWidth > window.innerHeight
            ? window.innerWidth
            : window.innerHeight
        ),
      });

    // add path
    this.path = this.add
      .image(center.x, center.y, "worldpath")
      .setScale(2)
      .setAlpha(0.5);

    // add worlds
    this.worldGroup = this.add.group(); // to check against for scrolling
    this.mapGroup = this.add.group(); // to shift all when scrolling
    // move worlds up/down slowly
    const worldsTween = this.tweens.addCounter({
      from: -3,
      to: 3,
      duration: 2000,
      yoyo: true,
      loop: -1,
      onUpdate: () => {
        this.worldGroup.getChildren().forEach((world) => {
          if (world.anims.currentAnim.key === world.name) {
            world.y = world.getData("y") + Math.round(worldsTween.getValue());
          }
        });
      },
    });

    WORLDS.forEach((world) => {
      this.anims.create({
        key: world.key,
        frames: this.anims.generateFrameNumbers("worlds", {
          frames: world.frames,
        }),
        frameRate: 1,
      });

      if (!world.key.startsWith("unknown")) {
        const worldPosition = {
          x: center.x + world.position.xOffset,
          y: center.y + world.position.yOffset,
        };
        const newWorld = this.add
          .sprite(worldPosition.x, worldPosition.y, "worlds")
          .setName(world.key)
          .setData({
            ...worldPosition,
            ...world.position,
            ...world.world,
            type: "world",
          })
          .setScale(2)
          .play("unknown");
        const worldHitArea = new Phaser.Geom.Circle(
          newWorld.displayWidth / 4,
          newWorld.displayHeight / 4,
          20
        );
        newWorld.setInteractive({
          hitArea: worldHitArea,
          hitAreaCallback: this.circleHitArea,
        });
        newWorld
          .on("pointerover", () => {
            if (newWorld.anims.currentAnim.key === "unknown") {
              newWorld.play("unknownhighlighted");
            }
          })
          .on("pointerout", () => {
            if (newWorld.anims.currentAnim.key === "unknownhighlighted") {
              newWorld.play("unknown");
            }
          })
          .on("pointerup", () => {
            if (newWorld.anims.currentAnim.key !== newWorld.name) {
              newWorld.play(newWorld.name);
              const revealFx = newWorld.preFX.addReveal(0.25, 0, 0);

              this.tweens.add({
                targets: revealFx,
                progress: 1,
                duration: 500,
                onComplete: () => {
                  if (!this.worldDataGroup?.children) {
                    this.showWorldData(newWorld);
                  }
                },
              });
            }
          });

        this.mapGroup.add(newWorld);
        this.worldGroup.add(newWorld);
      }
    });

    this.anims.create({
      key: "base",
      frames: this.anims.generateFrameNumbers("worldselector", { frames: [0] }),
      frameRate: 1,
    });
    this.anims.create({
      key: "focus",
      frames: this.anims.generateFrameNumbers("worldselector", { frames: [1] }),
      frameRate: 1,
    });
    this.worldSelector = this.add
      .sprite(
        this.input.x === 0 ? window.innerWidth / 2 : this.input.x,
        this.input.y === 0 ? window.innerHeight / 2 : this.input.y,
        "worldselector"
      )
      .setScale(2)
      .setAlpha(0.8)
      .setDepth(99)
      .play("base");

    this.mapGroup.add(this.path);
    // start with first world centered if doesn't fit

    const shouldCenterOnFirstWorld =
      this.path.displayWidth > window.innerWidth ||
      this.path.displayHeight > window.innerHeight * 0.9; // account for borders
    this.mapGroup.getChildren().forEach((mapItem) => {
      mapItem.x -= shouldCenterOnFirstWorld ? WORLDS[2].position.xOffset : 0;
      mapItem.y -= shouldCenterOnFirstWorld ? WORLDS[2].position.yOffset : 0;
      if (mapItem.getData("type") === "world") {
        mapItem.setData("x", mapItem.x);
        mapItem.setData("y", mapItem.y);
      }
    });

    this.input.on("pointermove", (pointer) => {
      this.worldSelector.x = pointer.x;
      this.worldSelector.y = pointer.y;
      this.worldSelector.play("base");
      this.worldSelector.setData("focused", undefined);
      if (!this.checkForCloseWorldAndShowData()) {
        this.worldDataGroup?.destroy(true, true);

        // move objects if within bounds
        if (
          pointer.x < window.innerWidth * 0.15 ||
          pointer.x > window.innerWidth * 0.85 ||
          pointer.y < window.innerHeight * 0.15 ||
          pointer.y > window.innerHeight * 0.85
        ) {
          if (!this.scrollInterval?.callback) {
            this.scrollInterval = this.time.addEvent({
              delay: 10,
              callback: () => {
                // check if near a world
                this.checkForCloseWorldAndShowData();

                // get vector to current mouse
                const centerVector = new Phaser.Math.Vector2(
                  window.innerWidth / 2,
                  window.innerHeight / 2
                );
                const pointerVector = new Phaser.Math.Vector2(
                  this.input.x,
                  this.input.y
                );
                const xMultiplier =
                  pointerVector.x < window.innerWidth * 0.1 ||
                  pointerVector.x > window.innerWidth * 0.9
                    ? 3
                    : 2;
                const yMultiplier =
                  pointerVector.y < window.innerHeight * 0.1 ||
                  pointerVector.y > window.innerHeight * 0.9
                    ? 3
                    : 2;

                const normalizedDiff = centerVector
                  .subtract(pointerVector)
                  .normalize()
                  .multiply(new Phaser.Math.Vector2(xMultiplier, yMultiplier));
                normalizedDiff.x = Phaser.Math.RoundTo(normalizedDiff.x, 0);
                normalizedDiff.y = Phaser.Math.RoundTo(normalizedDiff.y, 0);

                const canScroll = this.canScroll();
                this.mapGroup.getChildren().forEach((mapItem) => {
                  if (
                    (canScroll.left && normalizedDiff.x > 0) ||
                    (canScroll.right && normalizedDiff.x < 0)
                  ) {
                    mapItem.x += normalizedDiff.x;

                    if (mapItem.getData("type") === "world") {
                      mapItem.setData("x", mapItem.x);
                    }
                  }
                  if (
                    (canScroll.up && normalizedDiff.y > 0) ||
                    (canScroll.down && normalizedDiff.y < 0)
                  ) {
                    mapItem.y += normalizedDiff.y;

                    if (mapItem.getData("type") === "world") {
                      mapItem.y = mapItem.getData("y") + normalizedDiff.y;
                      mapItem.setData("y", mapItem.y);
                    }
                  }
                });
              },
              loop: true,
            });
          }
        } else {
          this.scrollInterval?.destroy();
        }
      }
    });

    // top/bottom bars
    this.topBorder = this.add
      .rectangle(
        window.innerWidth * 0.5,
        window.innerHeight * 0.05,
        window.innerWidth,
        window.innerHeight * 0.1,
        0x000000,
        0.5
      )
      //.setInteractive({ cursor: "unset" })
      .setScrollFactor(0, 0);
    this.topBorderLine = this.add
      .line(
        window.innerWidth * 0.5,
        window.innerHeight * 0.1,
        0,
        0,
        window.innerWidth,
        0,
        0x97c461
      )
      .setLineWidth(3)
      .setScrollFactor(0, 0);
    this.bottomBorder = this.add
      .rectangle(
        window.innerWidth * 0.5,
        window.innerHeight * 0.95,
        window.innerWidth,
        window.innerHeight * 0.1,
        0x000000,
        0.5
      )
      //.setInteractive({ cursor: "unset" })
      .setScrollFactor(0, 0);
    this.bottomBorderLine = this.add
      .line(
        window.innerWidth * 0.5,
        window.innerHeight * 0.9,
        0,
        0,
        window.innerWidth,
        0,
        0x97c461
      )
      .setLineWidth(3)
      .setScrollFactor(0, 0);

    const lgFontSize = getFontSize(FontSizes.LARGE);
    const chevronHeight = Number(
      lgFontSize.substring(0, lgFontSize.indexOf("px"))
    );
    this.topBorderRightChevrons = this.add
      .image(window.innerWidth - 10, window.innerHeight * 0.95, "worldchevron")
      .setFlipX(true)
      .setOrigin(1, 0.5);
    this.topBorderRightChevrons.setDisplaySize(
      (this.topBorderRightChevrons.width / this.topBorderRightChevrons.height) *
        chevronHeight,
      chevronHeight
    );
    this.topBorderText = this.add
      .text(
        window.innerWidth - 10 - this.topBorderRightChevrons.displayWidth,
        window.innerHeight * 0.95,
        " select exp ",
        {
          fontFamily: "Manaspace",
          fontSize: getFontSize(FontSizes.LARGE),
          align: "left",
          resolution: 20,
        }
      )
      .setOrigin(1, 0.5);
    this.topBorderLeftChevrons = this.add
      .image(
        window.innerWidth -
          10 -
          this.topBorderRightChevrons.displayWidth -
          this.topBorderText.displayWidth,
        window.innerHeight * 0.95,
        "worldchevron"
      )
      .setOrigin(1, 0.5);
    this.topBorderLeftChevrons.setDisplaySize(
      (this.topBorderLeftChevrons.width / this.topBorderLeftChevrons.height) *
        chevronHeight,
      chevronHeight
    );

    // resize events
    this.scale.on("resize", this.resize, this);

    this.events.on("wake", () => {
      this.cameras.main.flash();
      this.useWorldSelectorCursor();
      this.worldSelector.setPosition(
        this.input.x === 0 ? window.innerWidth / 2 : this.input.x,
        this.input.y === 0 ? window.innerHeight / 2 : this.input.y
      );
    });

    this.useWorldSelectorCursor();
  }

  update() {}

  checkForCloseWorldAndShowData() {
    // snap to world if close
    this.worldGroup.getChildren().forEach((world) => {
      if (Phaser.Math.Distance.BetweenPoints(world, this.input) < 40) {
        this.worldSelector.x = world.getData("x");
        this.worldSelector.y = world.getData("y");
        this.worldSelector.play("focus");
        this.worldSelector.setData("focused", world);
        this.scrollInterval?.remove();
      }
    });

    const focusedWorld = this.worldSelector.getData("focused");
    if (focusedWorld) {
      if (
        !focusedWorld.anims.currentAnim.key.startsWith("unknown") &&
        !this.worldDataGroup?.children
      ) {
        this.showWorldData(this.worldSelector.getData("focused"));
      }

      return true;
    }

    return false;
  }

  showWorldData(world) {
    this.worldDataGroup = this.add.group();

    // title
    const worldTitle = this.add
      .image(world.x - 20, world.y - 50, "worldtitle")
      .setScale(2)
      .setOrigin(1, 1);
    // title text
    const worldTitleText = this.add
      .text(
        worldTitle.x - worldTitle.displayWidth / 2 - 20,
        worldTitle.y - worldTitle.displayHeight / 3,
        world.getData("title"),
        {
          fontFamily: "Manaspace",
          fontSize: "12px",
          align: "left",
          resolution: 20,
        }
      )
      .setOrigin(0.5, 0.75);
    const infoDistance = (worldTitle.displayHeight * 2) / 3;

    // info boxes
    world.getData("info").forEach((info, i) => {
      this.worldDataGroup.add(
        this.add
          .image(
            worldTitle.x - worldTitle.width - 23,
            worldTitle.y + 20 + infoDistance * i,
            i === 0 ? "worldinfoboxspecial" : "worldinfobox"
          )
          .setScale(2.25, 2)
      );
      this.worldDataGroup.add(
        this.add
          .text(
            worldTitle.x - worldTitle.width - 23,
            worldTitle.y + 20 + infoDistance * i,
            info,
            {
              fontFamily: "Manaspace",
              fontSize: "12px",
              align: "center",
              resolution: 20,
            }
          )
          .setOrigin(0.5, 0.35)
      );
    });

    // stars
    let starsGroup;
    const stars = world.getData("stars");
    if (stars.length > 1) {
      starsGroup = this.addStars(
        stars[0],
        worldTitle.x - worldTitle.displayWidth + 52,
        worldTitle.y - worldTitle.displayHeight + 8
      );

      // find rightmost star
      let furthestStar;
      starsGroup.getChildren().forEach((star) => {
        if (!furthestStar || star.x > furthestStar.x) {
          furthestStar = star;
        }
      });
      const starDashText = this.add
        .text(
          furthestStar.x + STAR_SPACING,
          worldTitle.y - worldTitle.displayHeight + 8,
          "-",
          {
            fontFamily: "Manaspace",
            fontSize: getFontSize(FontSizes.XSMALL),
            align: "center",
            resolution: 20,
          }
        )
        .setOrigin(0.5, 0.35);
      this.worldDataGroup.add(starDashText);
      starsGroup.addMultiple(
        this.addStars(
          stars[1],
          starDashText.x + STAR_SPACING,
          worldTitle.y - worldTitle.displayHeight + 8
        ).getChildren()
      );
    } else {
      starsGroup = this.addStars(
        stars,
        worldTitle.x - worldTitle.displayWidth + 52,
        worldTitle.y - worldTitle.displayHeight + 8
      );
    }

    this.worldDataGroup.addMultiple([
      worldTitle,
      worldTitleText,
      ...starsGroup.getChildren(),
    ]);
  }

  useWorldSelectorCursor() {
    this.input.setDefaultCursor("none");
  }

  addStars(numStars, x, y) {
    const starsGroup = this.add.group();
    for (let i = 0; i < numStars; i++) {
      const star = this.add.image(x + i * STAR_SPACING, y, "worldlevelstar");
      starsGroup.add(star);
    }
    return starsGroup;
  }

  canScroll() {
    let canScroll = { up: false, down: false, left: false, right: false };
    let furthestItemUp = null;
    let furthestItemDown = null;
    let furthestItemLeft = null;
    let furthestItemRight = null;
    // check if further object is past center
    this.mapGroup.getChildren().forEach((mapItem) => {
      if (
        furthestItemUp === null ||
        mapItem.y - mapItem.displayHeight / 2 < furthestItemUp.y
      ) {
        furthestItemUp = mapItem;
      }
      if (
        furthestItemDown === null ||
        mapItem.y + mapItem.displayHeight / 2 > furthestItemDown.y
      ) {
        furthestItemDown = mapItem;
      }
      if (
        furthestItemLeft === null ||
        mapItem.x - mapItem.displayWidth / 2 < furthestItemLeft.x
      ) {
        furthestItemLeft = mapItem;
      }
      if (
        furthestItemRight === null ||
        mapItem.x + mapItem.displayWidth / 2 > furthestItemRight.x
      ) {
        furthestItemRight = mapItem;
      }
    });

    if (
      furthestItemUp.y - furthestItemUp.displayHeight / 2 <
      window.innerHeight * 0.15
    ) {
      canScroll.up = true;
    }
    if (
      furthestItemDown.y + furthestItemDown.displayHeight / 2 >
      window.innerHeight * 0.85
    ) {
      canScroll.down = true;
    }
    if (
      furthestItemLeft.x - furthestItemLeft.displayWidth / 2 <
      window.innerWidth * 0.15
    ) {
      canScroll.left = true;
    }
    if (
      furthestItemRight.x + furthestItemRight.displayWidth / 2 >
      window.innerWidth * 0.85
    ) {
      canScroll.right = true;
    }

    return canScroll;
  }

  circleHitArea(shape, x, y, gameObject) {
    if (
      shape.radius > 0 &&
      x >= shape.left &&
      x <= shape.right &&
      y >= shape.top &&
      y <= shape.bottom
    ) {
      const dx = (shape.x - x) * (shape.x - x);
      const dy = (shape.y - y) * (shape.y - y);

      return dx + dy <= shape.radius * shape.radius;
    } else {
      return false;
    }
  }

  resize(gameSize, baseSize, displaySize, resolution) {
    if (window.innerWidth > 240 && window.innerHeight > 240) {
      // back button
      resizeBackButton(this);
      this.backButton.setPosition(10, window.innerHeight / 20);
      this.backButton.setOrigin(0, 0.5);

      // background
      this.worldBackground.setScale(
        backgroundCover(this.worldBackground.width, this.worldBackground.height)
      );
      this.worldBackground.setPosition(
        window.innerWidth / 2,
        window.innerHeight / 2
      );

      // wip: center world
      /*
      this.path.setPosition(window.innerWidth / 2, window.innerHeight / 2);
      this.scrollInterval?.remove();
      this.worldGroup.getChildren().forEach((world) => {
        world.setPosition(
          this.path.x + world.getData("xOffset"),
          this.path.y + world.getData("yOffset")
        );
      });
      */

      // borders
      this.topBorder.setPosition(
        window.innerWidth * 0.5,
        window.innerHeight * 0.05
      );
      this.topBorder.setSize(window.innerWidth, window.innerHeight * 0.1);
      this.topBorderLine.setDisplaySize(window.innerWidth, 1);
      this.topBorderLine.setPosition(
        window.innerWidth * 0.5,
        window.innerHeight * 0.1
      );
      this.bottomBorder.setPosition(
        window.innerWidth * 0.5,
        window.innerHeight * 0.95
      );
      this.bottomBorder.setSize(window.innerWidth, window.innerHeight * 0.1);
      this.bottomBorderLine.setDisplaySize(window.innerWidth, 1);
      this.bottomBorderLine.setPosition(
        window.innerWidth * 0.5,
        window.innerHeight * 0.9
      );

      this.topBorderText.setPosition(
        window.innerWidth - 10 - this.topBorderRightChevrons.displayWidth,
        window.innerHeight * 0.95
      );
      this.topBorderText.setFontSize(getFontSize(FontSizes.LARGE));

      const chevronHeight = this.topBorderText.height;
      this.topBorderRightChevrons.setPosition(
        window.innerWidth - 10,
        window.innerHeight * 0.95
      );
      this.topBorderRightChevrons.setDisplaySize(
        (this.topBorderRightChevrons.width /
          this.topBorderRightChevrons.height) *
          chevronHeight,
        chevronHeight
      );
      this.topBorderLeftChevrons.setPosition(
        window.innerWidth -
          10 -
          this.topBorderRightChevrons.displayWidth -
          this.topBorderText.displayWidth,
        window.innerHeight * 0.95
      );
      this.topBorderLeftChevrons.setDisplaySize(
        (this.topBorderLeftChevrons.width / this.topBorderLeftChevrons.height) *
          chevronHeight,
        chevronHeight
      );
    }
  }
}
