import * as React from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import GestureIcon from "@mui/icons-material/Gesture";
import { Popover, Slider, Typography } from "@mui/material";
import { useState } from "react";
import { useDrawingTools } from "../Context/DrawingToolsContext";
import toolsList from "../Assets/ToolsItemList";
import { useCallback } from "react";


export default function Tools() {

  const { lineWidth, setLineWidth, selectedTool,setSelectedTool} = useDrawingTools();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [min, setMin] = useState(1);
  const [max,setMax] = useState(10);

  const handleOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };
  
  const handleSelection = useCallback((e,tool) =>{
    e.preventDefault();
    if(tool==="Pen" || tool==="Brush"){
        setMin(5);
        if(selectedTool!==tool)
            setLineWidth(5)
        setMax(20);
    }
    else{
        setMin(1);
        if(selectedTool!==tool)
            setLineWidth(1)
        setMax(10);
    }
    setSelectedTool(tool);
  },[setLineWidth,selectedTool,setSelectedTool])

  return (
    <div>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", paddingTop: 0.5, paddingLeft: 0.5 }}
        icon={<GestureIcon />}
        direction="down"
      >
        {toolsList.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.name==="Thickness" ? handleOpen :(e) => handleSelection(e,action.name)}
            sx={{ backgroundColor: selectedTool === action.name ? 'gray' : 'transparent' }}
          >
          </SpeedDialAction>
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
