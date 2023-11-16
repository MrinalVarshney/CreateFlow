import * as React from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import GestureIcon from "@mui/icons-material/Gesture";
import { Popover, Slider, Typography } from "@mui/material";
import { useState } from "react";
import { useDrawingTools } from "../Context/DrawingToolsContext";
import toolsList from "../Assets/ToolsItemList";
import { useUserAndChats } from "../Context/userAndChatsProvider";

export default function Tools({ setIsOpen, selectFile }) {
  const {Socket, roomDetails,playingGameRef} = useUserAndChats()
  const { lineWidth, setLineWidth, selectedTool, setSelectedTool,eraserWidth } =
    useDrawingTools();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(10);

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

  const handleSelection = (e, tool) => {
      e.preventDefault();
      var width=0;
      if (tool === "UploadFiles") {
        selectFile();
      }
     
      else if (tool === "Pen" || tool === "Brush") {
        setMin(5);
        if (selectedTool !== tool){
          width=5;
          setLineWidth(5);
        } 
        setMax(20);
      } else {
        setMin(1);
        if (selectedTool !== tool){
          width=1;
          setLineWidth(1);
        } 
        setMax(10);
      }

      setSelectedTool(tool);
      if(playingGameRef.current){
        if(tool === "Eraser") width = eraserWidth;
        else if(!width) width = lineWidth;
        const roomCode = roomDetails.roomCode
        const data = {roomCode,tool,width}
        socket?.emit("tool-change", data)
      }
  }

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
        {toolsList.map((action) => (
          action.name === "UploadFiles" && playingGameRef.current ? null :
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={
              action.name === "Thickness"
                ? handleOpen
                : (e) => handleSelection(e, action.name)
            }
            sx={{
              backgroundColor:
                selectedTool === action.name ? "gray" : "transparent",
            }}
          ></SpeedDialAction>
        ))}
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
    </div>
  );
}
