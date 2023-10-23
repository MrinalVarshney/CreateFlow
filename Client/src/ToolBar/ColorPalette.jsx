import React from "react";
import { Box, Paper, Grid } from "@mui/material";
import { useDrawingTools } from "../Context/DrawingToolsContext";

const colors = [
  "#E57373",
  "#81C784",
  "#64B5F6",
  "#FFD54F",
  "#F06292",
  "#4DB6AC",
  "#9575CD",
  "#FF8A65",
  "black"
];

function ColorPalette() {
  const { selectedColor,setSelectedColor } = useDrawingTools();

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "3px",
        left: "50px",
      }}
      p={2}
    >
      <Grid container spacing={1}>
        {colors.map((color) => (
          <Grid item key={color}>
            <Paper
              elevation={3}
              style={{
                backgroundColor: color,
                width: "30px",
                height: "30px",
                cursor: "pointer",
                border: selectedColor === color ? "2px solid #000" : "none",
              }}
              onClick={() => handleColorClick(color)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ColorPalette;
