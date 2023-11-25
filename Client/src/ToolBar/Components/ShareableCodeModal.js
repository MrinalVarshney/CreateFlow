import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CollaboratorsSearch from "../../shared/Components/Friends_Collaborator_Search";

const ShareableCodeModal = ({ open, onClose }) => {
  const generateRandomCode = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const [roomCode, setRoomCode] = useState();

  useEffect(()=>{
    var roomCode = localStorage.getItem("roomCode");
    if(!roomCode){
        roomCode = generateRandomCode();
        localStorage.setItem("roomCode", roomCode);
        setRoomCode(roomCode);
    }
    else{
        setRoomCode(roomCode)
    }

  },[])

  

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode)
    console.log("copied")
  };


  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "16px" }}>
          Share this code for joining collaborators
        </h2>
        <TextField
          value={roomCode}
          fullWidth
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
          style={{ marginBottom: "16px" }}
        />
        <Button onClick={handleCopy} style={{ marginRight: "8px" }}>
          <FileCopyIcon />
        </Button>
        <CollaboratorsSearch roomCode={roomCode}/>
      </div>
    </Modal>
  );
};

export default ShareableCodeModal;
