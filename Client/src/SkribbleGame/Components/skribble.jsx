import React, { useEffect, useState, useCallback, useRef } from "react";
import { Grid, Box, Paper, Input, Button, Modal } from "@mui/material";
import { useUserAndChats } from "../../Context/userAndChatsProvider";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import SkribbleCanvas from "./skribbleCanvas";
import SharedCanvas from "./SharedCanvas";
import CountdownTimer from "../../shared/Components/CountDownTimer";
import LeaderBoard from "../../shared/Components/LeaderBoard";

function Skribble() {
  const {
    user,
    chats,
    Socket,
    setChats,
    roomDetails,
    setRoomDetails,
    connectWithSocketServer,
    playingGameRef,
    setShowTimer,
    time,
    setTime,
    rounds,
    setRounds,
    difficulty,
    setDifficulty,
  } = useUserAndChats();

  const [selectedWord, setSelectedWord] = useState("");
  const [randomDrawer, setRandomDrawer] = useState(null);
  const [show, setShow] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [message, setMessage] = useState("");
  const [showLeaderBoard, setShowLeaderBoard] = useState(false);
  const scoreCard = useRef(null);
  const messageContainerRef = useRef(null);

  console.log(randomDrawer);
  const socket = Socket.current;
  if (socket) {
    console.log("socket reloaded", socket?.id);
  }
  console.log("Reloading");

  function closeRandomWordModal() {
    setShow(false);
  }
  function calculateSimilarity(str1, str2) {
    const len = Math.max(str1.length, str2.length);
    let similarity = 0;

    for (let i = 0; i < len; i++) {
      if (str1[i] && str2[i] && str1[i] === str2[i]) {
        similarity++;
      }
    }

    return similarity / len;
  }
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [chats]);

  useEffect(() => {
    const players = [];
    roomDetails?.participants.map((participant) => {
      const data = {
        userName: participant.userName,
        userId: participant.userId,
        scores: 0,
      };
      players.push(data);
    });
    // console.log("player for scoreCard", players);
    scoreCard.current = players;
  }, []);
  // console.log("scoreCard", scoreCard.current);

  useEffect(() => {
    if (!socket) {
      connectWithSocketServer();
    }
    const roomDetails = JSON.parse(localStorage.getItem("roomDetails"));
    const chats = JSON.parse(localStorage.getItem("chats"));
    playingGameRef.current = true;
    setRoomDetails(roomDetails);
    setChats(chats);
    if (!randomDrawer) {
      setShow(true);
      const data = {
        roomCode: roomDetails?.roomCode,
        time: time,
        rounds: rounds,
        difficulty: difficulty,
      };
      if (user?._id === roomDetails?.roomCreator.userId) {
        console.log("emitted timer");
        socket?.emit("setTimer", data);
      }
    }

    localStorage.removeItem("roundsPlayed");
    setRandomDrawer(roomDetails?.roomCreator);
  }, []);

  const handleSend = () => {
    console.log(message, user);

    const data = {
      userId: user?._id,
      userName: user?.username,
      message:
        message === selectedWord ? `${user?.username} has guessed!` : message,
    };
    if (message !== data.message) {
      const data = {
        userId: user?._id,
        userName: user?.username,
        roomCode: roomDetails?.roomCode,
      };
      socket?.emit("guessed", data);
    }
    sendRoomMessage(data, roomDetails.roomCode);
    setMessage("");
  };
  const sendRoomMessage = useCallback(
    (data, roomCode) => {
      // if(user._id === roomDetails.roomCreator.userId){
      console.log("send mesage", data, "hiiiiiiii");
      socket?.emit("send-message", data, roomCode);
      console.log("message sent");
      // }
    },
    [socket]
  );
  const navigate = useNavigate();
  const handleLeave = () => {
    console.log("leaving");
    const data = {
      userName: user?.username,
      userId: user?._id,
      roomCode: roomDetails?.roomCode,
      roomType: roomDetails?.roomType,
    };
    setShowTimer(false);
    localStorage.removeItem("roomDetails");
    setRoomDetails(null);
    localStorage.removeItem("chats");
    setChats([]);
    socket?.emit("leave-room", data);
    navigate("/playOnline");
  };
  const handleEnd = useCallback(() => {
    console.log("Game ended");
    socket?.emit("end-game", user._id);
    localStorage.removeItem("roomDetails");
    localStorage.removeItem("chats");
  }, [socket]);

  const handleFilterParticipants = useCallback(
    (userId) => {
      if (roomDetails) {
        console.log("room detailssss", roomDetails);
        const filteredParticipants = roomDetails?.participants.filter(
          (participants) => participants.userId !== userId
        );
        setRoomDetails({ ...roomDetails, participants: filteredParticipants });
        console.log("roomDetails", roomDetails);
      }
    },
    [roomDetails, setRoomDetails]
  );

  const startGame = () => {
    if (roomDetails.participants.length === 1) {
      alert("Atleast 2 players are required for starting the game");
      return;
    } else if (roomDetails.isGameStarted) {
      alert("Game already started");
      return;
    }
    const roomType = roomDetails.roomType;
    const roomCode = roomDetails.roomCode;
    const data = { roomType, roomCode };
    socket?.emit("start-game", data);
  };

  const startRandomGame = useCallback(() => {
    console.log("Starting random game");
    setShowTimer(true);
    setRoomDetails({ ...roomDetails, isGameStarted: true });
  }, [roomDetails, setShowTimer, setRoomDetails]);

  useEffect(() => {
    socket?.on("new-message", (data) => {
      console.log("new-message", data);
      const guess_message = user.username + " has guessed!";
      var message = data.message;
      if (data.userId === user._id) {
        if (message === guess_message) message = "Great! You guessed it right!";
        else if (calculateSimilarity(message, selectedWord) > 0.5) {
          message = "You are close! try again";
        }
      }
      const newChat = { user: data.userName, message: message };
      if (chats) {
        setChats([...chats, newChat]);
      } else {
        setChats([newChat]);
      }
    });
    socket?.on("user-left", (userData) => {
      console.log("work leave", userData);
      console.log("user-leffffffft", userData);
      const userName = userData?.userName;
      const userId = userData?.userId;
      const message = `${userName} has left the room.`;
      const data = {
        message: message,
        user: userName,
      };
      console.log(data);
      handleFilterParticipants(userId);
      setChats([...chats, data]);
    });
    socket?.on("game-ended", () => {
      localStorage.removeItem("roomDetails");
      localStorage.removeItem("chats");
      navigate("/playOnline");
    });
    socket?.on("join-room-error", (message) => {
      console.log(message);
      navigate("/selectionBoard");
    });
    socket?.on("word-Selected", (word) => {
      console.log("wordSelected", word);
      setStartTimer(true);
      setSelectedWord(word);
    });
    socket?.on("reload", (data) => {
      console.log("recieved", data);
      setShowLeaderBoard(false);
      setShow(true);
      if (data.player.userId === randomDrawer.userId) return;
      setRandomDrawer(data.player);
    });
    socket?.on("game-started", () => {
      // For starting random game
      startRandomGame();
    });
    socket?.on("set-Timer", (data) => {
      console.log("set-Timer", data);
      setTime(data.time);
      setRounds(data.rounds);
      setDifficulty(data.difficulty);
      localStorage.removeItem("roundsPlayed");
    });
    socket?.on("showLeaderBoard", () => {
      console.log("showLeaderBoard");
      setShowLeaderBoard(true);
    });
    return () => {
      socket?.off("new-message");
      socket?.off("user-left");
      socket?.off("ended-game");
      socket?.off("join-room-error");
      socket?.off("word-Selected");
      socket?.off("reload");
      socket?.off("game-started");
      socket?.off("set-Timer");
      socket?.off("showLeaderBoard");
    };
  }, [
    handleFilterParticipants,
    startRandomGame,
    setShowTimer,
    roomDetails,
    setDifficulty,
    selectedWord,
    setRounds,
    socket,
    chats,
    setChats,
    navigate,
    roomDetails?.roomCode,
    sendRoomMessage,
    handleEnd,
    randomDrawer,
    user,
    time,
    setTime,
    // handleFilterParticpiants,
  ]);

  console.log("selectedWord", selectedWord);
  console.log("roomDetails", roomDetails);
  console.log("rounds ", rounds);
  return (
    <div style={{ height: "100vh", marginBottom: "0px" }}>
      {roomDetails &&
      roomDetails.roomType === "random" &&
      roomDetails.isGameStarted === false ? (
        <SharedCanvas />
      ) : randomDrawer?.userId === user?._id ? (
        <>
          <SkribbleCanvas
            setWord={setSelectedWord}
            show={show}
            setShow={setShow}
            closeRandomWordModal={closeRandomWordModal}
          />
        </>
      ) : (
        <SharedCanvas />
      )}
      <Modal open={showLeaderBoard} style={{ top: "50px" }}>
        <LeaderBoard scoreCard={scoreCard} />
      </Modal>
      <Paper
        style={{
          height: "9vh",
          marginBottom: "20px",
          top: 0,
          width: "100%",
          position: "absolute",
          backgroundColor: "yellow",
          zIndex: 2,
        }}
      >
        <Box>
          <div style={{ display: "flex" }}>
            <CountdownTimer startTimer={startTimer} scoreCard={scoreCard} />
            <div style={{ width: "auto", marginLeft: "70%" }}>
              <Button variant="outlined" color="error" onClick={handleLeave}>
                Leave
              </Button>
              {roomDetails &&
                user?._id === roomDetails?.roomCreator?.userId &&
                (roomDetails.roomType === "private" ? (
                  <Button
                    style={{ marginLeft: "10px" }}
                    variant="contained"
                    color="success"
                    onClick={handleEnd}
                  >
                    End
                  </Button>
                ) : (
                  <Button
                    style={{ marginLeft: "10px" }}
                    variant="contained"
                    color="success"
                    onClick={startGame}
                  >
                    Start Game
                  </Button>
                ))}
            </div>
          </div>
        </Box>
      </Paper>
      {/* First Part */}
      <Paper
        style={{
          height: "91vh",
          width: "16%",
          position: "absolute",
          top: 66,
          zIndex: 2,
        }}
      >
        <Box p={2}>
          <h3>joined users</h3>
          <hr />
          {
            roomDetails && roomDetails.participants
              ? roomDetails.participants.map((participants) => (
                  <div
                    style={{
                      backgroundColor:
                        participants?.userId === roomDetails?.roomCreator.userId
                          ? "lightgreen"
                          : "white",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "17px",
                        marginLeft: "10px",
                      }}
                    >
                      {participants.userName}
                    </p>
                  </div>
                ))
              : null // or another fallback if needed
          }
        </Box>
      </Paper>

      {/* Third Part */}
      <Paper
        style={{
          height: "91vh",
          width: "25%",
          right: 0,
          top: 66,
          position: "absolute",
          zIndex: 2,
        }}
      >
        <Box p={2}>
          <Paper style={{ height: "77vh" }}>
            <div
              ref={messageContainerRef}
              style={{
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                marginBottom: "5px",
              }}
            >
              {chats &&
                chats.map((m) => (
                  <p
                    key={m.message}
                    style={{
                      borderBottom: "0.5px solid #b8bcbd",
                      display: "flex",
                      margin: "1px",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    <h5
                      style={{
                        margin: "0px",
                        paddingTop: "12px",
                        width: "auto",
                      }}
                    >
                      {m.user}:
                    </h5>
                    <p
                      style={{
                        width: "auto",
                        margin: "5px 0px",
                        padding: "2px",
                      }}
                    >
                      {m.message}
                    </p>
                  </p>
                ))}
            </div>
          </Paper>
        </Box>
        <Box p={1}>
          <Input
            value={message}
            style={{ width: "75%" }}
            placeholder="Enter your message"
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            style={{
              width: "22%",
              height: "30px",
              fontSize: "12px",
            }}
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSend}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </div>
  );
}

export default Skribble;
