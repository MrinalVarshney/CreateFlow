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

const RandomWordModal = ({ show, setShow, closeRandomWordModal }) => {
  const { Socket, roomDetails, rounds, time } = useUserAndChats();
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
      for (let i = 0; i < 3; i++) {
        const word = getRandomWord();
        newWords.push(word);
      }
      return [...prevWords, ...newWords];
    });
  }, [show]);

  console.log("Show value---->", show);

  const randomPlayer = () => {
    const rand = Math.floor(Math.random() * roomDetails?.participants.length);
    console.log("rand", rand);
    return roomDetails?.participants[rand];
  };

  const handleclose = (word) => {
    setSelectedWord(word);
    const data = {
      word: word,
      roomCode: roomDetails?.roomCode,
    };

    socket?.emit("wordSelected", data);
    closeRandomWordModal();

    setTimeout(() => {
      const player = randomPlayer();
      console.log("player random", player, time);

      let roundsPlayed =
        parseInt(localStorage.getItem("roundsPlayed"), 10) || 1;

      console.log("roundsPlayed", roundsPlayed);
      localStorage.setItem("roundsPlayed", roundsPlayed + 1);
      if (roundsPlayed >= parseInt(rounds)) {
        console.log("game finished");
        localStorage.removeItem("roundsPlayed");
        return;
      }

      const data = {
        roomCode: roomDetails?.roomCode,
        player: player,
      };
      socket?.emit("reload", data);
    }, time * 1000);
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
