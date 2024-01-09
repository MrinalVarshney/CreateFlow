import * as React from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import GestureIcon from "@mui/icons-material/Gesture";
import { Menu, MenuItem, Popover, Slider, Typography } from "@mui/material";
import { useState } from "react";
import { useDrawingTools } from "../Context/DrawingToolsContext";
import toolsList from "../Assets/ToolsItemList";
import { useUserAndChats } from "../Context/userAndChatsProvider";
import { useRef } from "react";
export default function Tools({ setIsOpen, selectFile, setBrushStyle }) {
  const { Socket, roomDetails, playingGameRef } = useUserAndChats();
  const {
    lineWidth,
    setLineWidth,
    selectedTool,
    setSelectedTool,
    eraserWidth,
  } = useDrawingTools();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(10);
  const [brushMenuAnchor, setBrushMenuAnchor] = useState(null);
  const socket = Socket.current;

  const handleOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleBrushOpen = (event) => {
    setBrushMenuAnchor(event.currentTarget);
  };

  const handleBrushClose = () => {
    setBrushMenuAnchor(null);
  };

  const handleBrushSelection = (e, brushNumber) => {
    e.preventDefault();
    if (selectedTool !== "Brush") {
      setLineWidth(5);
    }
    setBrushStyle(brushNumber);
    setMax(20);
    setSelectedTool("Brush");
    handleBrushClose();

    if (playingGameRef.current) {
      const roomCode = roomDetails.roomCode;
      const data = { roomCode, tool: "Brush", width: 5 };
      socket?.emit("tool-change", data);
    }
  };

  const handleSelection = (e, tool) => {
    e.preventDefault();
    var width = 0;
    if (tool === "UploadFiles") {
      selectFile();
    } else if (tool === "Pen") {
      setMin(5);
      if (selectedTool !== tool) {
        width = 5;
        setLineWidth(5);
      }
      setMax(20);
    } else if (tool === "Brush") {
      setMin(10);
      if (selectedTool !== tool) {
        width = 10;
        setLineWidth(10);
      }
      setMax(20);
    } else {
      setMin(1);
      if (selectedTool !== tool) {
        width = 1;
        setLineWidth(1);
        console.log("lineWidth changed to 1");
      }
      setMax(10);
    }

    setSelectedTool(tool);
    if (playingGameRef.current) {
      if (tool === "Eraser") width = eraserWidth;
      else if (!width) width = lineWidth;
      const roomCode = roomDetails.roomCode;
      const data = { roomCode, tool, width };
      socket?.emit("tool-change", data);
    }
  };
  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{
          position: "absolute",
          paddingTop: 0.5,
          paddingLeft: 0.5,
          display: "inline-block",
        }}
        icon={<GestureIcon />}
        direction="down"
      >
        {toolsList.map((action) =>
          action.name === "UploadFiles" && playingGameRef.current ? null : (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={
                action.name === "Thickness"
                  ? handleOpen
                  : action.name === "Brush"
                  ? handleBrushOpen
                  : (e) => handleSelection(e, action.name)
              }
              sx={{
                backgroundColor:
                  selectedTool === action.name ? "gray" : "transparent",
              }}
            ></SpeedDialAction>
          )
        )}
      </SpeedDial>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        p={2}
      >
        <Slider
          value={lineWidth}
          onChange={(e, newValue) => setLineWidth(newValue)}
          min={min}
          max={max}
        />
        <Typography variant="body2" sx={{ textAlign: "center", padding: 2 }}>
          Thickness: {lineWidth}
        </Typography>
      </Popover>
      <Menu
        anchorEl={brushMenuAnchor}
        open={Boolean(brushMenuAnchor)}
        onClose={handleBrushClose}
      >
        {[1, 2, 3, 4].map((brushNumber) => (
          <MenuItem
            key={brushNumber}
            onClick={(e) => handleBrushSelection(e, brushNumber)}
          >
            {brushNumber === 1 ? (
              <img
                src="http://perfectionkills.com/images/drawing_techniques/point_based_with_shadow.png"
                width={70}
                height={50}
                alt="Brush"
              />
            ) : brushNumber === 2 ? (
              <img
                src="http://perfectionkills.com/images/drawing_techniques/multiple_lines.png"
                width={70}
                height={50}
                alt="Brush"
              />
            ) : brushNumber === 3 ? (
              <img
                src="http://perfectionkills.com/images/drawing_techniques/colored_pixels.png"
                width={70}
                height={50}
                alt="Brush"
              />
            ) : (
              <img
                src="http://perfectionkills.com/images/drawing_techniques/spray.png"
                width={70}
                height={50}
                alt="Brush"
              />
            )}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
