import React, { useState } from "react";
import { Slider, Typography } from "@mui/material";
import { useDrawingTools } from "../Context/DrawingToolsContext";
import { Icon } from "@iconify/react";
import Popover from "@mui/material/Popover";

const Eraser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { eraserWidth, setEraserWidth } = useDrawingTools();
  const min = 1;
  const max = 100;
  const handleClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };
  const handleLineWidthChange = (e, newValue) => {
    setEraserWidth(newValue);
  };
  const handleIconClick = (e) => {
    setAnchorEl(e.currentTarget);
    setIsOpen(true);
  };

  return (
    <div>
      <Icon
        icon="mdi-eraser"
        width="30"
        height="30"
        onClick={handleIconClick}
      />
      <Popover
        open={isOpen}
        anchorEl={anchorEl} // You can adjust this anchor as needed
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Slider
          value={eraserWidth}
          onChange={handleLineWidthChange}
          min={min}
          max={max}
        />
        <Typography variant="body2" sx={{ textAlign: "center", padding: 2 }}>
          EraserSize: {eraserWidth}
        </Typography>
      </Popover>
    </div>
  );
};

export default Eraser;
