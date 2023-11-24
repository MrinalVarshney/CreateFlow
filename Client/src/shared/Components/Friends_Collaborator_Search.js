import React, { useState } from "react";
import { Typography, TextField, Button, Box, Skeleton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as api from "../../api";
import { useUserAndChats } from "../../Context/userAndChatsProvider";

const CollaboratorsSearch = ({roomCode}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [userName, setUserName] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const { Socket ,user} = useUserAndChats();

  const socket = Socket.current;

  const handleSearch = async () => {
    if (userName === "") return setSearchResults([]);
    setShowProgress(true);
    setSearchResults([]);
    const response = await api.getUsers(userName);
    setShowProgress(false);
    setSearchResults(response.data.searchResults);
  };

  const handleShare = (details)=>{
    console.log("Sharing",details)
    const senderId = user?._id;
    const recieverId = details._id;
    const data = {
      roomCode : roomCode,
      senderId: senderId,
      recieverId: recieverId
    }
    if(socket) console.log("Socket is not null")
    socket?.emit("collaboration-invite", (data));
  }

  return (
    <div
      style={{
        width: "300px",
        padding: "20px",
        borderRadius: "8px",
        margin: "auto",
      }}
    >
      <Typography
        variant="h5"
        style={{ marginBottom: "20px", fontWeight: "semi-bold" }}
      >
        Add Collaborators
      </Typography>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <TextField
          fullWidth
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          label="Search by Username"
          variant="outlined"
          size="small"
          style={{ marginRight: "10px" }}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "rgb(203, 170, 3)" }}
          onClick={handleSearch}
        >
          <SearchIcon />
        </Button>
      </div>
      {showProgress ? (
        <UserNameSkeleton loading={showProgress} />
      ) : searchResults.length === 0 ? (
        <Box textAlign="center" color="#888" fontStyle="italic">
          No data found
        </Box>
      ) : (
        searchResults.map((result) => (
          <div
            key={result.username}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              margin: "5px",
            }}
          >
            <Typography variant="body1">{result.username}</Typography>
            <Button
              variant="outlined"
              style={{ borderColor: "white", color: "rgb(203, 170, 3)" }}
              onClick = {()=>handleShare(result)}
            >
              Share
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

// For showing user  skeleton while data is loading
const UserNameSkeleton = ({ loading }) => {
  return (
    <>
      <Typography variant="h1">{loading ? <Skeleton /> : "h1"}</Typography>
      <Typography variant="h1">{loading ? <Skeleton /> : "h1"}</Typography>
    </>
  );
};

export default CollaboratorsSearch;
