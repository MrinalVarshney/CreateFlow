import React from "react";
import { Icon } from "@iconify/react";
import "./Styles.css";
import { useDrawingTools } from "../Context/DrawingToolsContext";

import { useUserAndChats } from "../Context/userAndChatsProvider";

const Ellipse = () => {
  const { setSelectedTool } = useDrawingTools();
  const { Socket, roomDetails, playingGameRef} = useUserAndChats();

  const socket = Socket.current;
  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedTool("Ellipse");
    if(!playingGameRef.current)return;
    const roomCode = roomDetails.roomCode;
    const data = {
      roomCode,
      tool: "Ellipse",
    };
    socket?.emit("tool-change", data);
  };
  return (
    <div className="shapes">
      <Icon
        icon="mdi:ellipse-outline"
        width="25"
        height="25"
        onClick={handleClick}
      />
    </div>
  );
};

export default Ellipse;
