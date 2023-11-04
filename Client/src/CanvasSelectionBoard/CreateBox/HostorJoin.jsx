import React, { useState } from "react";
import { Paper, Button, Modal, Input, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { createNewRoom } from "../../RealTimeCommunication/socketConnection";
import { useNavigate } from "react-router-dom";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [usersJoined, setUsersJoined] = useState([
    { id: "1234", name: "user1" },
    { id: "1235", name: "user2" },
    { id: "1236", name: "user3" },
  ]);

  const navigate = useNavigate();
  let roomId = "1234";
  const openModal = () => {
    setIsModalOpen(true);
    setModalContent("play");
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const playRandom = () => {};
  const join = () => {
    setModalContent("join");
  };

  const host = () => {
    setModalContent("host");
    console.log("hosting");
  };

  const start = () => {
    setIsModalOpen(false);

    navigate("/skribble");
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
                  <Button onClick={join}>Join</Button>
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
                <h1>Host</h1>
                <h3>roomId : {roomId}</h3>
                <h3>Users Joined : {usersJoined.length}</h3>
                <div
                  style={{
                    backgroundColor: "white",
                    border: "2px solid black",
                    padding: "10px",
                    width: "50%",
                  }}
                >
                  {usersJoined.map((user) => (
                    <h4
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      key={user.id}
                    >
                      {" "}
                      {user.name}{" "}
                    </h4>
                  ))}
                </div>

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
                <h1>Join</h1>
                <Input placeholder="Enter Room Id" />
                <Button>Join</Button>
              </div>
            )}
          </>
        </Modal>
      )}
    </div>
  );
}

export default PlayOnline;
