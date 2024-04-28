import { FontSizes, fitIntoRectangle, getFontSize } from "./Resize";

export const CAROUSEL_RIGHT_POSITION = 0.85;
export const CAROUSEL_LEFT_POSITION = 0.15;

export const resetCursor = (scene) => {
  scene.input.setDefaultCursor("unset");
};

// create a back button with optional background
export const createBackButton = (
  scene,
  onBackButtonClick,
  backButtonBackground = {
    fullBackgroundClickable: false,
    color: null,
    alpha: 1,
  },
  useHandCursor = true
) => {
  const backButtonTintColor = 0xfcc200;

  // create back button
  scene.backButton = scene.add
    .text(10, 10, "back", {
      fontFamily: "Manaspace",
      fontSize: getFontSize(FontSizes.LARGE),
      align: "center",
      resolution: 20,
    })
    .setName("backButton")
    .setDepth(100)
    .setInteractive({
      useHandCursor: useHandCursor,
    });

  // Back button Events
  scene.backButton
    .on("pointerup", () => {
      onBackButtonClick(scene);
    })
    .on("pointerover", () => {
      scene.backButton.setTint(backButtonTintColor);
    })
    .on("pointerout", () => {
      scene.backButton.clearTint();
    });

  if (backButtonBackground.fullBackgroundClickable) {
    scene.backButtonFullBackground = scene.add.rectangle(
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerWidth,
      window.innerHeight,
      backButtonBackground.color,
      backButtonBackground.alpha
    );
    scene.backButtonFullBackground
      .setInteractive()
      .on("pointerup", () => {
        onBackButtonClick(scene);
      })
      .on("pointerover", () => {
        scene.backButton.setTint(backButtonTintColor);
      })
      .on("pointerout", () => {
        scene.backButton.clearTint();
      });
  }
};

export const resizeBackButton = (scene) => {
  // back button
  if (scene.backButton?.active) {
    scene.backButton.setFontSize(getFontSize(FontSizes.LARGE));
  }
};

// tv back button
export const tvBackButton = (scene) => {
  if (scene.scene.isActive("TVSceneGun")) {
    scene.scene.sleep("TVSceneGun");
  }
  scene.scene.get("BaseScene").reset();

  scene.scene.get("TVScene").setCanShoot(false);
  scene.scene.sleep("TVScene");
  scene.backButton.clearTint();
};

export const diplomaBackButton = (scene) => {
  scene.diploma.setVisible(false);
  removeBackAssets(scene);
};

export const spaceBackButton = (scene) => {
  scene.scene.sleep("SpaceScene");
  scene.scene.wake("BaseScene");
  scene.scene.get("BaseScene").resetCamera();
};

export const carouselBackButton = (scene) => {
  scene.projectCarouselGroup.getChildren().forEach((carouselItem) => {
    carouselItem.setVisible(false);
  });
  scene.carouselText.setVisible(false);
  removeBackAssets(scene);
};

export const removeBackAssets = (scene) => {
  scene.backButton.destroy();
  scene.backButtonFullBackground?.destroy();
};

// can probably move to its own class
export const createCarousel = (scene, objs) => {
  const children = objs.getChildren();
  let currentObj = 0;

  // move out of screen and set events
  children.forEach((obj) => {
    obj.setInteractive({ useHandCursor: true }); //, pixelPerfect: true });
    obj.x = window.innerWidth + obj.displayWidth;
    obj
      .on("pointerover", () => {
        if (obj.name === children[currentObj].name) {
          scene.carouselText.setTint(0xfcc200);
        }
      })
      .on("pointerout", () => {
        scene.carouselText.clearTint();
      })
      .on("pointerup", () => {
        const objIndex = children.indexOf(obj);
        if (objIndex === currentObj) {
          // go to project
          window.open(obj.getData("link"), "_blank");
        } else {
          // move to center and resize
          const newCenterObj = children[objIndex];
          const displaySize = getCarouselDisplaySize(true, newCenterObj);
          scene.tweens.add({
            targets: newCenterObj,
            displayWidth: displaySize.width,
            displayHeight: displaySize.height,
            alpha: 1,
            x: window.innerWidth * 0.5,
            duration: 200,
          });
          newCenterObj.setData("targetX", 0.5);
          scene.carouselText.setText(newCenterObj.name);

          const prevCenterObj = children[currentObj];
          // shift left
          if (objIndex > currentObj) {
            const displaySize = getCarouselDisplaySize(false, prevCenterObj);
            scene.tweens.add({
              targets: prevCenterObj,
              displayWidth: displaySize.width,
              displayHeight: displaySize.height,
              alpha: 0.5,
              x: window.innerWidth * CAROUSEL_LEFT_POSITION,
              duration: 200,
            });
            prevCenterObj.setData("targetX", CAROUSEL_LEFT_POSITION);

            // bring in from right
            if (objIndex + 1 < children.length) {
              const outsideRight = children[objIndex + 1];
              const displaySize = getCarouselDisplaySize(false, outsideRight);
              scene.tweens.add({
                targets: outsideRight,
                displayWidth: displaySize.width,
                displayHeight: displaySize.height,
                alpha: 0.5,
                x: window.innerWidth * CAROUSEL_RIGHT_POSITION,
                duration: 200,
              });
              outsideRight.setData("targetX", CAROUSEL_RIGHT_POSITION);
            }
            // move out from left
            if (currentObj - 1 >= 0) {
              const leftOut = children[currentObj - 1];
              const displaySize = getCarouselDisplaySize(false, leftOut);
              scene.tweens.add({
                targets: leftOut,
                displayWidth: displaySize.width,
                displayHeight: displaySize.height,
                alpha: 0.5,
                x: 0 - leftOut.displayWidth,
                duration: 200,
              });
              leftOut.setData("targetX", -1);
            }
          }
          // shift right
          else {
            const displaySize = getCarouselDisplaySize(false, prevCenterObj);
            scene.tweens.add({
              targets: prevCenterObj,
              displayWidth: displaySize.width,
              displayHeight: displaySize.height,
              alpha: 0.5,
              x: window.innerWidth * CAROUSEL_RIGHT_POSITION,
              duration: 200,
            });
            prevCenterObj.setData("targetX", CAROUSEL_RIGHT_POSITION);

            // bring in from left
            if (objIndex - 1 >= 0) {
              const outsideLeft = children[objIndex - 1];
              const displaySize = getCarouselDisplaySize(false, outsideLeft);
              scene.tweens.add({
                targets: outsideLeft,
                displayWidth: displaySize.width,
                displayHeight: displaySize.height,
                alpha: 0.5,
                x: window.innerWidth * CAROUSEL_LEFT_POSITION,
                duration: 200,
              });
              outsideLeft.setData("targetX", CAROUSEL_LEFT_POSITION);
            }
            // move out from right
            if (currentObj + 1 < children.length) {
              const rightOut = children[currentObj + 1];
              const displaySize = getCarouselDisplaySize(false, rightOut);
              scene.tweens.add({
                targets: rightOut,
                displayWidth: displaySize.width,
                displayHeight: displaySize.height,
                alpha: 0.5,
                x: window.innerWidth + rightOut.displayWidth,
                duration: 200,
              });
              rightOut.setData("targetX", 1);
            }
          }
        }
        currentObj = objIndex;
      });
  });

  // setup
  const currentItem = children[currentObj];
  currentItem.x = window.innerWidth * 0.5;
  currentItem.setData("targetX", 0.5);
  const displaySize = getCarouselDisplaySize(true, currentItem);
  currentItem.setDisplaySize(displaySize.width, displaySize.height);

  // check right
  if (currentObj < children.length) {
    const rightItem = children[currentObj + 1];
    rightItem.x = window.innerWidth * CAROUSEL_RIGHT_POSITION;
    const displaySize = getCarouselDisplaySize(false, rightItem);
    rightItem.setDisplaySize(displaySize.width, displaySize.height);
    rightItem.setAlpha(0.5);
    rightItem.setData("targetX", CAROUSEL_RIGHT_POSITION);
  }

  scene.carouselText = scene.add
    .text(window.innerWidth * 0.5, window.innerHeight * 0.9, currentItem.name, {
      fontFamily: "Manaspace",
      fontSize: getFontSize(FontSizes.MEDIUM),
      align: "center",
      resolution: 20,
    })
    .setOrigin(0.5, 0);
};

export const getCarouselDisplaySize = (isCenter, obj) => {
  return fitIntoRectangle(
    window.innerWidth * (isCenter ? 0.4 : 0.2),
    window.innerHeight * (isCenter ? 0.8 : 0.4),
    obj.width,
    obj.height
  );
};
