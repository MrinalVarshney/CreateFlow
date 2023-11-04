import React, { useState } from "react";
import { Grid, Box, Paper, Input, Button } from "@mui/material";
import { useUserAndChats } from "./Context/userAndChatsProvider";

function Skribble() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    console.log(message);
  };
  return (
    <Box ml={5} mr={5} mt={5} height="94vh">
      <Grid>
        <Paper style={{ height: "7vh", marginBottom: "20px" }}>
          <Box>
            <h2>tool Box</h2>
          </Box>
        </Paper>
      </Grid>
      <Grid container spacing={3}>
        {/* First Part */}
        <Grid item xs={2}>
          <Paper style={{ height: "83vh" }}>
            <Box p={2}>
              <h2>First Part</h2>
            </Box>
          </Paper>
        </Grid>

        {/* Second Part */}
        <Grid item xs={6.5}>
          <Paper style={{ height: "83vh" }}>
            <Box p={2}>
              <h2>Second Part</h2>
            </Box>
          </Paper>
        </Grid>

        {/* Third Part */}
        <Grid item xs={3.5}>
          <Paper style={{ height: "83vh" }}>
            <Box p={2}>
              <Paper style={{ height: "71vh" }}></Paper>
            </Box>
            <Box p={1}>
              <Input
                style={{ width: "75%" }}
                placeholder="Enter your message"
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button style={{ width: "20%" }} onClick={handleSend}>
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
