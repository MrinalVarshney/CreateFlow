import React, { useState } from "react";
import { Popover, Grid } from "@mui/material";
import InterestsIcon from "@mui/icons-material/Interests";
import "./Styles.css";
import Circle from "../Shape_Box/Circle";
import Rectangle from "../Shape_Box/Recatangle";
import Triangle from "../Shape_Box/Triangle";
import Line from "../Shape_Box/Line";

const ShapesMenu = ({canvasRef,saveCanvasState}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <div>
      <div className="circular-icon-container" onClick={handleClick}>
        <InterestsIcon className="circular-icon" />
      </div>
      <Popover
        open={Boolean(anchorEl)}
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
        sx={{justifyContent:"center",padding:"2px"}}
      >
        <Grid container spacing={1} >
          <Grid item xs={4}>
            <Circle />
          </Grid>
          <Grid item xs={4}>
            <Rectangle canvasRef={canvasRef} saveCanvasState={saveCanvasState}/>
          </Grid>
          <Grid item xs={4}>
            <Triangle />
          </Grid>
          <Grid item xs={4}>
            <Line />
          </Grid>
        </Grid>
      </Popover>
    </div>
  );
};

export default ShapesMenu;
