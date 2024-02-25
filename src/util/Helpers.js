import { FontSizes, getFontSize } from "./Resize";

// create a back button with optional background
export const createBackButton = (
  scene,
  onBackButtonClick,
  fullBackgroundClickable = false
) => {
  const backButtonTintColor = 0xfcc200;

  // create back button
  scene.backButton = scene.add
    .text(10, 10, "back", {
      fontFamily: "Manaspace",
      fontSize: getFontSize(FontSizes.LARGE),
      align: "center",
      resolution: 5,
    })
    .setName("backButton")
    .setDepth(100)
    .setInteractive({
      useHandCursor: true,
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

  scene.backButtonFullBackground = scene.add.rectangle(
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerWidth,
    window.innerHeight
  );
  if (fullBackgroundClickable) {
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

export const resizeBackButton = () => {
  // back button
  if (this.backButton) {
    this.backButton.setFontSize(getFontSize(FontSizes.LARGE));
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
  scene.backButton.destroy();
  scene.backButtonFullBackground.destroy();
};
