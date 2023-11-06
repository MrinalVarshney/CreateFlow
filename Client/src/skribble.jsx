import React, { useEffect, useState, useCallback } from "react";
import { Grid, Box, Paper, Input, Button } from "@mui/material";
import { useUserAndChats } from "./Context/userAndChatsProvider";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";

function Skribble() {
  const [message, setMessage] = useState("");
  const { user, chats, socket, setChats, roomDetails, setRoomDetails } =
    useUserAndChats();
  const handleSend = () => {
    console.log(message, user);
    const data = {
      userId: user?._id,
      userName: user?.username,
      message: message,
    };
    sendRoomMessage(data, roomDetails.roomCode);
    setMessage("");
  };
  const sendRoomMessage = useCallback((data, roomCode) => {
    console.log("send mesage", data, "hiiiiiiii");
    socket.emit("send-message", data, roomCode);
  }, []);
  const navigate = useNavigate();
  const handleLeave = () => {
    console.log("leaving");
    const data = {
      userName: user?.username,
      userId: user?._id,
      roomCode: roomDetails?.roomCode,
    };
    setChats([]);
    socket?.emit("leave-room", data);
    navigate("/selectionBoard");
  };
  const handleEnd = () => {};
  const handleFilterParticpiants = useCallback((userId) => {
    const filtedParticipants = roomDetails?.participants.filter(
      (participants) => participants.userId !== userId
    );
    setRoomDetails({ roomDetails, participants: filtedParticipants });
  }, []);

  useEffect(() => {
    socket?.on("new-message", (data) => {
      const newChat = { user: data.userName, message: data.message };
      setChats([...chats, newChat]);
    });
    socket?.on("user-left", (userData) => {
      console.log("work leave", userData);
      const message = `${userData?.userName} has left the room.`;
      const data = {
        message: message,
        userName: userData?.userName,
        userId: userData?.userId,
      };
      // handleFilterParticpiants(data.userId);
      sendRoomMessage(data, roomDetails.roomCode);
    });
    return () => {
      socket?.off("new-message");
      socket?.off("user-left");
    };
  }, [
    socket,
    chats,
    setChats,
    navigate,
    roomDetails?.roomCode,
    sendRoomMessage,
    // handleFilterParticpiants,
  ]);
  console.log("rmD", roomDetails);
  return (
    <Box ml={5} mr={5} mt={5} height="94vh">
      <Grid>
        <Paper style={{ height: "7vh", marginBottom: "20px" }}>
          <Box>
            <h2 style={{ display: "flex" }}>
              tool Box
              <div style={{ width: "auto", marginLeft: "70%" }}>
                <Button variant="outlined" color="error" onClick={handleLeave}>
                  Leave
                </Button>
                {user?._id === roomDetails?.roomCreator.userId && (
                  <Button
                    style={{ marginLeft: "10px" }}
                    variant="contained"
                    color="success"
                    onClick={handleEnd}
                  >
                    End
                  </Button>
                )}
              </div>
            </h2>
          </Box>
        </Paper>
      </Grid>
      <Grid container spacing={3}>
        {/* First Part */}
        <Grid item xs={2}>
          <Paper style={{ height: "83vh" }}>
            <Box p={2}>
              <h3>joined users</h3>
              <hr />
              {
                roomDetails && roomDetails.participants
                  ? roomDetails.participants.map((participants) => (
                      <div
                        style={{
                          backgroundColor:
                            participants?.userId ===
                            roomDetails?.roomCreator.userId
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
        </Grid>

        {/* Second Part */}
        <Grid item xs={6.5}>
          <Paper style={{ height: "83vh" }}>
            <Box p={2}>
              <h2>Canvas Area</h2>
            </Box>
          </Paper>
        </Grid>

        {/* Third Part */}
        <Grid item xs={3.5}>
          <Paper style={{ height: "83vh" }}>
            <Box p={2}>
              <Paper style={{ height: "71vh" }}>
                {chats &&
                  chats.map((m) => (
                    <p
                      key={m.message}
                      style={{
                        borderBottom: "0.5px solid #b8bcbd",
                        display: "flex",
                        margin: "1px",
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
        </Grid>
      </Grid>
    </Box>
  );
}

export default Skribble;
