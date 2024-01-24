import "./App.css";
import Phaser from "phaser";
import React, { useEffect, useState } from "react";
import { config } from "./config";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    const game = new Phaser.Game(config);
    setReady(true);

    return () => {
      game.destroy(true);
      setReady(false);
    };
  }, []);
  return <div id="phaser-container" />;
}

export default App;
