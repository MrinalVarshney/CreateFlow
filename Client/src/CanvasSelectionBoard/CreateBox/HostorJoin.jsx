import React, { useCallback, useEffect, useState } from "react";
import { Paper, Button, Modal, Input } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { useUserAndChats } from "../../Context/userAndChatsProvider";
import Table from "../../shared/Components/Table";

const useStyles = makeStyles({
  boxContainer: {
    width: 200,
    height: 200,
    marginTop: 10,
    position: "absolute",
    marginLeft: 250,
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
  modal: {
    width: "auto",
    height: "auto",
    maxWidth: "40%",
    minHeight: "300px",
    margin: "7% 30%",
  },
  insideModal: {
    width: 150,
    height: 150,
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
  const { user, Socket, roomDetails, setRoomDetails, playingGameRef } =
    useUserAndChats();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [HostroomCode, setHostRoomCode] = useState({ host: "", roomCode: "" });
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [isUserJoined, setIsUserJoined] = useState(false);
  const socket = Socket?.current;

  const navigate = useNavigate();
  const openModal = () => {
    setIsModalOpen(true);
    setModalContent("play");
  };
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
      // joinRoom(room.roomCode)
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
  }, [socket, handleUserJoined, navigate]);

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
    <div>
      <Paper className={classes.boxContainer}>
        <Button onClick={openModal}>Play Online</Button>
      </Paper>
      {isModalOpen && (
        <Modal
          className={classes.modal}
          open={isModalOpen}
          onClose={(event, reason) => {
            if (modalContent === "play") {
              closeModal();
            } else if (reason !== "backdropClick") {
              closeModal();
            }
          }}
        >
          <>
            {modalContent === "play" && (
              <div
                style={{
                  backgroundColor: "pink",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignContent: "center",
                  flexDirection: "row",
                  flexWrap: "wrap",
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
            )}
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
    </div>
  );
}

export default PlayOnline;
