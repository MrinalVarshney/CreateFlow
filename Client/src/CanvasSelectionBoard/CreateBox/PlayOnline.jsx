import backgroundImage from "../../Assets/Images/playonline1.jpg";
import React, { useCallback, useEffect, useState } from "react";
import { Paper, Button, Modal, Input } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { useUserAndChats } from "../../Context/userAndChatsProvider";
import Table from "../../shared/Components/Table";
import Carousel from "../../shared/Components/Carousel";
import HostInput from "../../shared/Components/HostInput";

const useStyles = makeStyles({
  modal: {
    width: "auto",
    height: "auto",
    maxWidth: "40%",
    minHeight: "300px",
    margin: "7% 30%",
  },
  insideModal: {
    width: 180,
    height: 180,
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

function PlayOnline() {
  const classes = useStyles();
  const {
    user,
    Socket,
    roomDetails,
    setRoomDetails,
    playingGameRef,
    connectWithSocketServer,
    setRounds,
    setPlayers,
    setTime,
  } = useUserAndChats();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [HostroomCode, setHostRoomCode] = useState({ host: "", roomCode: "" });
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [isUserJoined, setIsUserJoined] = useState(false);

  const timeSlots = ["30", "60", "90", "120"];
  const roundSlots = ["1", "2", "3", "4", "5", "6"];
  const playerSlots = ["2", "3", "4", "5", "6"];
  useEffect(() => {
    connectWithSocketServer();
  }, []);
  const socket = Socket?.current;

  const navigate = useNavigate();
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseHostModal = () => {
    setIsModalOpen(false);
  };

  const playRandom = () => {};
  const join = () => {
    console.log("joining", joinRoomCode);
    joinRoom(joinRoomCode);
  };

  const data = { userId: user?._id, userName: user?.username };

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
      playingGameRef.current = true;
      navigate("/skribble");
    });

    return () => {
      socket?.off("user-joined", handleUserJoined);
      socket?.off("game-started");
    };
  }, [socket, handleUserJoined, navigate, playingGameRef]);

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
    socket?.emit("start-game", user._id);
  };

  const hostUser = {
    userId: roomDetails?.roomCreator.userId,
    userName: roomDetails?.roomCreator.userName,
  };

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
        <h1
          style={{
            backgroundColor: "white",
            height: "5%",
            width: "auto",
            display: "flex",
            justifyContent: "center",
            border: "3px solid black",
            borderRadius: "10px",
          }}
        >
          PlayOnline
        </h1>

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
          <Paper className={classes.insideModal}>
            <Button onClick={host}>Host</Button>
          </Paper>
          <Paper className={classes.insideModal}>
            <Button onClick={Openjoin}>Join</Button>
          </Paper>
          <Paper className={classes.insideModal}>
            <Button onClick={playRandom}>Play Random</Button>
          </Paper>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          className={classes.modal}
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
                  backgroundColor: "lightyellow",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <h1>Host: {HostroomCode.host}</h1>
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
                    <h4>players:</h4>
                    <HostInput slots={playerSlots} setValue={setPlayers} />
                  </div>
                </div>
                <h3>Users Joined : {roomDetails?.participants.length}</h3>
                <Table
                  participants={roomDetails?.participants}
                  user={hostUser}
                />
                <div>
                  <Button
                    style={{ marginTop: "10px", backgroundColor: "lightBlue" }}
                    onClick={() => {
                      start();
                    }}
                  >
                    Start
                  </Button>
                  <Button
                    style={{
                      marginLeft: "10px",
                      marginTop: "10px",
                      backgroundColor: "lightBlue",
                    }}
                    onClick={handleCloseHostModal}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
            {modalContent === "join" && (
              <div
                style={{
                  backgroundColor: "lightyellow",
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
                    <h1>Join</h1>
                    <Input
                      placeholder="Enter Room Id"
                      onChange={(e) => setJoinRoomCode(e.target.value)}
                    />
                    <div>
                      <Button onClick={join}>Join</Button>
                      <Button onClick={handleCloseHostModal}>Close</Button>
                    </div>
                  </>
                )}
                {isUserJoined && (
                  <>
                    <h1>Joined</h1>
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
        <h1
          style={{
            backgroundColor: "white",
            height: "5%",
            width: "auto",
            display: "flex",
            justifyContent: "center",
            border: "3px solid black",
            borderRadius: "10px",
          }}
        >
          How to Play
        </h1>
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
    </div>
  );
}

export default PlayOnline;
