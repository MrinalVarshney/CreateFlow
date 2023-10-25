import { Paper } from "@mui/material";
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { useDrawingTools } from "../Context/DrawingToolsContext";

function ColorSelector() {
  const { selectedColor, setSelectedColor } = useDrawingTools();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorChange = (newColor) => {
    setSelectedColor(newColor.hex);
    setShowColorPicker(!showColorPicker);
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
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
        <SketchPicker color={selectedColor} onChange={handleColorChange} />
      )}
    </div>
  );
}

export default ColorSelector;
