import { Paper } from "@mui/material";
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { useDrawingTools } from "../Context/DrawingToolsContext";
import { useUserAndChats } from "../Context/userAndChatsProvider";

function ColorSelector() {
  const { selectedColor, setSelectedColor } = useDrawingTools();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const { playingGameRef, Socket, roomDetails } = useUserAndChats();
  const socket = Socket.current;
  const handleColorChange = (newColor) => {
    const color = newColor.hex;
    setSelectedColor(color);
    if (playingGameRef.current) {
      const roomCode = roomDetails.roomCode;
      const data = { roomCode, color };
      socket?.emit("color-change", data);
    }
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const openColorPicker = () => {
    setShowColorPicker(true);
  };

  const closeColorPicker = () => {
    setShowColorPicker(false);
  };

  const multicolor =
    "linear-gradient(to bottom, red, orange, yellow, green, blue, indigo, violet)";

  return (
    <div style={{ position: "relative" }}>
      <Paper
        elevation={3}
        style={{
          background: multicolor,
          width: "30px",
          height: "30px",
          cursor: "pointer",
          marginLeft: "7px",
          marginTop: "7px",
          border: "2px solid red",
        }}
        onClick={toggleColorPicker}
      />

      {showColorPicker && (
        <div onMouseEnter={openColorPicker} onMouseLeave={closeColorPicker}>
          <SketchPicker color={selectedColor} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
}

export default ColorSelector;
