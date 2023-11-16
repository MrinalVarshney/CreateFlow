import React from "react";
import ChangeHistoryRoundedIcon from "@mui/icons-material/ChangeHistoryRounded";
import "./Styles.css";
import { useDrawingTools } from "../Context/DrawingToolsContext";
import { useUserAndChats } from "../Context/userAndChatsProvider";

const Triangle = () => {
  const { setSelectedTool } = useDrawingTools();
  const { Socket, roomDetails, playingGameRef } = useUserAndChats();
  const socket = Socket.current;
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTool("Triangle");
    if (!playingGameRef.current) return;
    const roomCode = roomDetails.roomCode;
    const data = {
      roomCode,
      tool: "Triangle",
    };
    socket?.emit("tool-change", data);
  };
  return (
    <div className="shapes">
      <ChangeHistoryRoundedIcon onClick={handleClick} />
    </div>
  );
};

export default Triangle;
