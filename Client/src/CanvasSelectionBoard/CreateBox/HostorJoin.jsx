import React, { useState } from "react";
import { Paper, Button, Modal, Input } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  createNewRoom,
  joinRoom,
  startGame,
} from "../../RealTimeCommunication/socketConnection";
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
    modalContent: {
      backgroundColor: "lightyellow",
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
  },
});

function PlayOnline() {
  const classes = useStyles();
  const { user, roomDetails, setRoomDetails } = useUserAndChats();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [HostroomCode, setHostRoomCode] = useState({ host: "", roomCode: "" });
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [isUserJoined, setIsUserJoined] = useState(false);

  const [usersJoined, setUsersJoined] = useState([
    { _id: "1", userName: "user1" },
    { _id: "2", userName: "user2" },
    { _id: "3", userName: "user3" },
    { _id: "4", userName: "user4" },
    { _id: "5", userName: "user5" },
    { _id: "6", userName: "user6" },
    { _id: "7", userName: "user7" },
  ]);

  const navigate = useNavigate();
  const openModal = () => {
    setIsModalOpen(true);
    setModalContent("play");
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const playRandom = () => {};
  const join = () => {
    console.log("joining", joinRoomCode);
    const data = { userId: user._id, userName: user.username };
    joinRoom(
      joinRoomCode,
      data,
      setIsUserJoined,
      setRoomDetails,
      roomDetails,
      navigate
    );
  };

  const Openjoin = () => {
    setModalContent("join");
  };

  const host = () => {
    setModalContent("host");
    const data = { userId: user._id, userName: user.username };

    createNewRoom(data, setHostRoomCode, setRoomDetails,navigate,roomDetails,setIsUserJoined);
    console.log("hosting", data);
  };

  const start = () => {
    setIsModalOpen(false);
    startGame(navigate);
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
          onClose={closeModal}
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
                <h3>Users Joined : {usersJoined.length}</h3>
                <Table usersJoined={usersJoined} user={user} />

                <Button
                  style={{ marginTop: "10px", backgroundColor: "lightBlue" }}
                  onClick={start}
                >
                  Start
                </Button>
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
                    <Button onClick={join}>Join</Button>
                  </>
                )}
                {isUserJoined && (
                  <>
                    <h1>Joined</h1>
                    <Table usersJoined={usersJoined} user={user} />
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
