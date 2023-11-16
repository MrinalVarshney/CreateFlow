import React, { useState } from "react";
import StartTimer from "./Components/StartTimer";
import Skribble from "./Components/skribble";

const SkribblePage = () => {
  const [onStartGame, setOnStartGame] = useState(false);

  return (
    <>
      {!onStartGame ? (
        <StartTimer onStartGame={() => setOnStartGame(true)} />
      ) : (
        <Skribble />
      )}
    </>
  );
};

export default SkribblePage;
