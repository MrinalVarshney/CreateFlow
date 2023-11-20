import React, { useState, useEffect } from "react";
import StartTimer from "./Components/StartTimer";
import Skribble from "./Components/skribble";
const { useUserAndChats } = require("../Context/userAndChatsProvider");

const SkribblePage = () => {
  const [onStartGame, setOnStartGame] = useState(false);
  const {showTimer} = useUserAndChats();
  console.log("show timer", showTimer)
  return (
    <>
      {
        (showTimer ? (
          !onStartGame ? (
            <StartTimer onStartGame={() => setOnStartGame(true)} />
          ) : (
            <Skribble />
          )
        ) : (
          <Skribble />
        ))
      }
    </>
  );
};

export default SkribblePage;
