import React from "react";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import RedoRoundedIcon from "@mui/icons-material/RedoRounded";
import { useHistory } from "../Context/History";
import { Box } from "@mui/material";
import "./undoRedoStyles.css";
import { useUserAndChats } from "../Context/userAndChatsProvider";

const UndoRedo = ({ redrawCanvas, isOpen }) => {
  const { Socket, roomDetails, playingGameRef } = useUserAndChats();
  const socket = Socket.current;
  const { undo, redo } = useHistory();
  const handleUndo = () => {
    const data = undo();
    if (data) {
      console.log("undoing");
      redrawCanvas(data);
      if(playingGameRef.current)
      socket?.emit("undo", roomDetails.roomCode);
    }
  };

  const handleRedo = () => {
    console.log("redoing");
    const data = redo();
    if (data) {
      if(playingGameRef.current)
      socket?.emit("redo", roomDetails.roomCode);
      redrawCanvas(data);
    }
  };

  return (
    <Box className={`undo-redo-container ${isOpen ? "toolOpen" : ""}`}>
      <UndoRoundedIcon
        onClick={handleUndo}
        className="undo-redo-button"
        style={{ height: "50", width: "50" }}
      />
      <RedoRoundedIcon
        onClick={handleRedo}
        className="undo-redo-button"
        style={{ height: "50", width: "50" }}
      />
    </Box>
  );
};

export default UndoRedo;
