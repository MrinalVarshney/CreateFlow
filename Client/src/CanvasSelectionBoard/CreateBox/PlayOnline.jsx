import backgroundImage from "../../Assets/Images/playonlinebackground.jpg";
import React, { useCallback, useEffect, useState } from "react";
import { Paper, Button, Modal, Input } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { useUserAndChats } from "../../Context/userAndChatsProvider";
import Table from "../../shared/Components/Table";
import Carousel from "../../shared/Components/Carousel";
import HostInput from "../../shared/Components/HostInput";
import ErrorToast from "../../shared/Components/ErrorToast";
import InfoToast from "../../shared/Components/InfoToast";

import "../../Canvas.css";
import "./playOnline.css";
import PlayOnline4 from "../../Assets/Images/playonline4.jpg";
const useStyles = makeStyles({
  // modal: {
  //   width: "auto",
  //   height: "auto",
  //   maxWidth: "40%",
  //   minHeight: "300px",
  //   margin: "7% 30%",
  // },
  // insideModal: {
  //   width: 180,
  //   height: 180,
  //   margin: "30px 50px",
  //   backgroundColor: "transparent",
  //   display: "flex",
  //   flexDirection: "column",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   transition: "transform 0.2s",
  //   border: "2px solid #black",
  //   borderRadius: "20px",
  //   "&:hover": {
  //     transform: "scale(1.05)",
  //     boxShadow: "0px 0px 10px 3px #888",
  //   },
  // },
});

function PlayOnline() {
  const classes = useStyles();
  const {
    user,
    Socket,
    roomDetails,
    setRoomDetails,
    playingGameRef,
    connectWithSocketServer,
    setShowTimer,
    setRounds,
    setDifficulty,
    setTime,
  } = useUserAndChats();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [HostroomCode, setHostRoomCode] = useState({ host: "", roomCode: "" });
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [isUserJoined, setIsUserJoined] = useState(false);
  const [error, setError] = useState(null)
  const [infoError,setInfoError] = useState(null)
  const navigate = useNavigate();

  const timeSlots = [30, 60, 90, 120, 200];
  const roundSlots = [1, 2, 3, 4, 5, 6];
  const difficultySlots = ["Easy", "Medium", "Hard"];

  useEffect(() => {
    connectWithSocketServer();
  }, []);
  const socket = Socket?.current;

  const createNewRandomRoom = useCallback(
    (room) => {
      console.log("random-room-created", room);
      if (room.roomCreator.userId === user._id) {
        setHostRoomCode({
          host: room.roomCreator.userName,
          roomCode: room.roomCode,
        });
      }
      console.log("Room", room);
      setRoomDetails(room);
      navigate("/skribble");
    },
    [navigate, setRoomDetails, user]
  );

  const addInRandomRoom = (player) => {
    if (player.userId === user._id) return;
    console.log("random-user-join", player);
    const roomDetails = JSON.parse(localStorage.getItem("roomDetails"));
    console.log(roomDetails?.participants);

    const participants = [...roomDetails.participants, player];
    const updatedRoom = { ...roomDetails, participants };
    console.log(updatedRoom);
    setRoomDetails(updatedRoom);
  };

  useEffect(() => {
    socket?.on("random-room-created", (room) => {
      createNewRandomRoom(room);
    });
    socket?.on("random-room-joined", (room) => {
      createNewRandomRoom(room);
    });
    return () => {
      socket?.off("random-room-created");
      socket?.off("random-room-joined");
    };
  }, [socket, createNewRandomRoom]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseHostModal = () => {
    setIsModalOpen(false);
    const roomCode = HostroomCode.roomCode;
    socket?.emit("match-cancelled",roomCode);
  };

  const playRandom = () => {
    console.log("play-random", data);
    socket?.emit("play-random", data);
    socket?.on("random-user-join", (player) => {
      console.log("random-user-join", player);
      addInRandomRoom(player);
    });
    return () => {
      socket?.off("random-user-join");
    };
  };

  const join = () => {
    console.log("joining", joinRoomCode);
    joinRoom(joinRoomCode);
  };

  const data = { userId: user?._id, userName: user?.username, pic: user?.pic };

  const Openjoin = () => {
    setIsModalOpen(true);
    setModalContent("join");
  };

  const createNewRoom = () => {
    console.log("Creating new room with name: " + data);

    if (socket?.current) console.log("socket is there");
    socket?.emit("room-create", data);
    socket?.on("room-created", (room) => {
      console.log("room created", room);
      setHostRoomCode({
        host: room.roomCreator.userName,
        roomCode: room.roomCode,
      });
      setRoomDetails(room);
    });
  };
  const startGame = useCallback(() => {
    setShowTimer(true);
    playingGameRef.current = true;
    navigate("/skribble");
  }, [setShowTimer, navigate, playingGameRef]);

  const handleUserJoined = useCallback(
    (userData) => {
      console.log("in-join-room-handle", userData);
      if (roomDetails) {
        const participants = [...roomDetails.participants, userData];
        console.log(participants);
        const updatedRoom = { ...roomDetails, participants };
        setRoomDetails(updatedRoom);
      }
    },
    [roomDetails, setRoomDetails]
  );

  useEffect(() => {
    socket?.on("user-joined", (userData) => {
      handleUserJoined(userData);
    });
    socket?.on("game-started", () => {
      console.log("Starting game");
      startGame();
    });

    socket?.on("match-cancelled",()=>{
      if(user.userId === roomDetails?.roomCreator.userId) {
        setInfoError("You cancelled the match")
      }
      else{
        setInfoError("Match cancelled by host")
        setIsModalOpen(false)
      }
      setRoomDetails(null)
    })


    return () => {
      socket?.off("user-joined", handleUserJoined);
      socket?.off("game-started", startGame);
      socket?.off("game-cancelled")
    };
  }, [socket, handleUserJoined, navigate, playingGameRef, startGame,setInfoError,roomDetails,user,setRoomDetails]);

  const joinRoom = (roomCode) => {
    console.log("joined the room");
    socket?.emit("join-room", roomCode, data);
    console.log("roomDetails", roomDetails);

    socket?.on("room-joined", (room) => {
      console.log("join-room", room);
      setRoomDetails(room);
      setIsUserJoined(true);
    });
  };

  const host = () => {
    setIsModalOpen(true);
    setModalContent("host");
    createNewRoom();
    console.log("hosting", data);
  };

  const start = () => {
    setIsModalOpen(false);
    if(roomDetails.participants.length < 2){
      setError("Minimum 2 players required to start the game")
      return;
    }
    const data = {
      roomCode: roomDetails.roomCode,
      player: roomDetails.roomCreator,
    };
    const start_data = {
      roomCode: roomDetails.roomCode,
      roomType: roomDetails.roomType,
    };

    console.log("from pl", data);
    socket?.emit("reload", data);
    socket?.emit("start-game", start_data);
  };

  const hostUser = {
    userId: roomDetails?.roomCreator.userId,
    userName: roomDetails?.roomCreator.userName,
  };
  console.log("Room details", roomDetails);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        width: "100%",
        height: "100vh",
        display: "flex",
      }}
    >
      <div style={{ width: "50%", position: "relative", top: "5%" }}>
        <div className="PlayText">PlayOnline</div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignContent: "center",
            flexDirection: "row",
            flexWrap: "wrap",
            position: "relative",
            top: "2%",
            width: "100%",
          }}
        >
          <div className="playInsideModal">
            <Button onClick={host}>
              <div className="playModalText">Host</div>
            </Button>
          </div>
          <div className="playInsideModal">
            <Button onClick={Openjoin}>
              <div className="playModalText">Join</div>
            </Button>
          </div>
          <div className="playInsideModal">
            <Button onClick={playRandom}>
              <div className="playModalText">Play Random</div>
            </Button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          className="playModal"
          open={isModalOpen}
          onClose={(event, reason) => {
            if (reason !== "backdropClick") {
              closeModal();
            }
          }}
        >
          <>
            {modalContent === "host" && (
              <div
                style={{
                  backgroundImage: `url(${PlayOnline4})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <div className="playHostText">Host: {HostroomCode.host}</div>
                <h3>roomId : {HostroomCode.roomCode}</h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "70%",
                    gap: "2%",
                  }}
                >
                  <div style={{ display: "flex", width: "33%" }}>
                    <h4>rounds:</h4>
                    <HostInput slots={roundSlots} setValue={setRounds} />
                  </div>
                  <div style={{ display: "flex", width: "33%" }}>
                    <h4>time:</h4>
                    <HostInput slots={timeSlots} setValue={setTime} />
                  </div>
                  <div style={{ display: "flex", width: "33%" }}>
                    <h4>Difficulty:</h4>
                    <HostInput
                      slots={difficultySlots}
                      setValue={setDifficulty}
                    />
                  </div>
                </div>
                <h3>Users Joined : {roomDetails?.participants.length}</h3>
                <Table
                  participants={roomDetails?.participants}
                  user={hostUser}
                />
                <div>
                  <Button
                    style={{
                      marginTop: "10px",
                      backgroundColor: "rgb(66 157 196)",
                    }}
                    onClick={() => {
                      start();
                    }}
                  >
                    <p style={{ color: "white", padding: 0, margin: 0 }}>
                      Start
                    </p>
                  </Button>
                  <Button
                    style={{
                      marginLeft: "10px",
                      marginTop: "10px",
                      backgroundColor: "rgb(66 157 196)",
                    }}
                    onClick={handleCloseHostModal}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            {modalContent === "join" && (
              <div
                style={{
                  backgroundImage: `url(${PlayOnline4})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                {!isUserJoined && (
                  <>
                    <div
                      className="playHostText"
                      style={{ marginBottom: "3%" }}
                    >
                      Join
                    </div>
                    <Input
                      placeholder="Enter Room Id"
                      onChange={(e) => setJoinRoomCode(e.target.value)}
                    />
                    <div>
                      <Button onClick={join}>
                        <p style={{ margin: 0, padding: 0, color: "blue" }}>
                          Join
                        </p>
                      </Button>
                      <Button onClick={handleCloseHostModal}>
                        <p style={{ margin: 0, padding: 0, color: "blue" }}>
                          Close
                        </p>
                      </Button>
                    </div>
                  </>
                )}
                {isUserJoined && (
                  <>
                    <div className="playHostText" style={{ margin: "3%" }}>
                      Joined
                    </div>
                    <Table
                      participants={roomDetails?.participants}
                      user={hostUser}
                    />
                  </>
                )}
              </div>
            )}
          </>
        </Modal>
      )}

      <div
        style={{
          width: "50%",
          position: "relative",
          top: "5%",
        }}
      >
        <div className="PlayText" style={{ marginBottom: "5%" }}>
          How to Play
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Carousel />
        </div>
      </div>
      {error && <ErrorToast message={error} setError={setError}/>}
      {infoError && <InfoToast message={infoError} setError={setInfoError}/>}
    </div>
  );
}

export default PlayOnline;
