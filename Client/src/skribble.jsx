import React, { useState } from "react";
import { Grid, Box, Paper, Input, Button } from "@mui/material";
import { useUserAndChats } from "./Context/userAndChatsProvider";
import SendIcon from "@mui/icons-material/Send";

function Skribble() {
  const [message, setMessage] = useState("");
  const { user, chats, setChats, roomDetails } = useUserAndChats();
  const handleSend = () => {
    console.log(message, user);
    setChats([...chats, { user: user.username, message: message }]);
    console.log(chats);
    setMessage("");
  };
  console.log("rmD", roomDetails);
  return (
    <Box ml={5} mr={5} mt={5} height="94vh">
      <Grid>
        <Paper style={{ height: "7vh", marginBottom: "20px" }}>
          <Box>
            <h2>
              tool Box
              <Button variant="outlined" color="error">
                Leave
              </Button>
              <Button variant="contained" color="success">
                End
              </Button>
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
                            participants.userName === "shivansh"
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
