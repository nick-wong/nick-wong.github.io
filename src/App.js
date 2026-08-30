import "./App.css";
import Phaser from "phaser";
import React, { useEffect, useState } from "react";
import { config } from "./config";

const supportsWebGL = () => {
  if (!window.WebGLRenderingContext) return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
};

function App() {
  // eslint-disable-next-line no-unused-vars
  const [isReady, setReady] = useState(false);
  const [webGLSupported] = useState(supportsWebGL);

  useEffect(() => {
    if (!webGLSupported) return;

    const game = new Phaser.Game(config);
    setReady(true);

    return () => {
      game.destroy(true);
      setReady(false);
    };
  }, [webGLSupported]);

  if (!webGLSupported) {
    return (
      <div id="webgl-warning">
        <h1>webgl unavailable :(</h1>
        <p>this site needs webgl to render - please enable hardware acceleration and reload!</p>
        <p>or just go straight to my linkedin: <a href="https://www.linkedin.com/in/nicholas-k-wong/">https://www.linkedin.com/in/nicholas-k-wong/</a></p>
      </div>
    );
  }
  return <div id="phaser-container" />;
}

export default App;