import Crop75SharpIcon from "@mui/icons-material/Crop75Sharp";
import "./Styles.css";
import { useDrawingTools } from "../Context/DrawingToolsContext";
import { useState } from "react";

const Rectangle = ({ canvasRef, saveCanvasState }) => {
  const { setSelectedTool } = useDrawingTools();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTool("Rectangle");
  };

  return (
    <div className="shapes">
      <Crop75SharpIcon onClick={handleClick} />
    </div>
  );
};

export default Rectangle;
