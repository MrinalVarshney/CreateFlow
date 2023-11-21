import React, { useState, useEffect } from "react";
import getRandomWord from "./randomWordPicker";
import { Button, Modal, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useUserAndChats } from "../../Context/userAndChatsProvider";

const useStyles = makeStyles({
  modal: {
    width: "auto",
    height: "auto",
    maxWidth: "40%",
    minHeight: "300px",
    margin: "7% 30%",
  },
  insideModal: {
    width: 100,
    height: 100,
    margin: "30px 50px",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s",
    border: "2px solid #black",
    borderRadius: "20px",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0px 0px 10px 3px #888",
    },
  },
});

const RandomWordModal = ({ show, closeRandomWordModal }) => {
  const { Socket, roomDetails, rounds, time, difficulty } = useUserAndChats();
  console.log("time in random", time);
  const socket = Socket.current;
  const classes = useStyles();
  const [randomWords, setRandomWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState("");
  useEffect(() => {
    console.log("happening");
    setRandomWords([]);
    setRandomWords((prevWords) => {
      const newWords = [];
      let difficultyFactor =
        difficulty === "Easy" ? 3 : difficulty === "Medium" ? 2 : 1;
      for (let i = 0; i < difficultyFactor; i++) {
        const word = getRandomWord(difficultyFactor);
        newWords.push(word);
      }
      return [...prevWords, ...newWords];
    });
  }, [show, difficulty]);

  console.log("Show value---->", show);

  const randomPlayer = () => {
    const rand = Math.floor(Math.random() * roomDetails?.participants.length);
    console.log("rand", rand);
    return roomDetails?.participants[rand];
  };

  const handleclose = (word) => {
    console.log("close clicked");
    setSelectedWord(word);
    const data = {
      word: word,
      roomCode: roomDetails?.roomCode,
    };
    console.log("present1");
    socket?.emit("wordSelected", data);
    closeRandomWordModal();

    let interval = setInterval(() => {
      socket?.emit("timer", roomDetails?.roomCode);
    }, 1000);
    console.log("present2");

    setTimeout(() => {
      // it is delay so that leaderBoard can be showed
      console.log("leader");

      socket?.emit("showLeaderBoard", roomDetails?.roomCode);
      clearInterval(interval);
      setTimeout(() => {
        const player = randomPlayer();
        console.log("player random", player, time);

        let roundsPlayed =
          parseInt(localStorage.getItem("roundsPlayed"), 10) || 1;
        clearInterval(interval);
        if (roundsPlayed > parseInt(rounds)) {
          console.log("game finished", roundsPlayed);
          return;
        }

        const data = {
          roomCode: roomDetails?.roomCode,
          player: player,
        };
        socket?.emit("reload", data);
      }, 5000);
    }, (time + 1) * 1000);
    console.log("after");
    setRandomWords([]);
  };
  console.log(selectedWord);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Modal
        className={classes.modal}
        open={show}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleclose();
          }
        }}
      >
        <div
          style={{
            backgroundColor: "pink",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          {randomWords.map((word) => (
            <Paper key={word} className={classes.insideModal}>
              <Button onClick={() => handleclose(word)}>{word}</Button>
            </Paper>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default RandomWordModal;
