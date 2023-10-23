import React, { useState, useEffect, useRef } from "react";
import { useDrawingTools } from "./Context/DrawingToolsContext";
import "./Cursors.css";
import ColorPalette from "./ToolBar/ColorPalette";
import Tools from "./ToolBar/Tools";

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const { selectedTool, selectedColor, lineWidth, eraserWidth } = useDrawingTools();
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (selectedTool === "Eraser") {
      ctx.strokeStyle = "white";
      ctx.lineWidth = eraserWidth;
    }
    else{
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = lineWidth;
    }
    
    setContext(ctx);
  }, [selectedColor, lineWidth, selectedTool,eraserWidth]);

  const handleMouseDown = (e) => {
    setDrawing(true);
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const handleMouseUp = () => {
    setDrawing(false);
    context.closePath();
  };

  return (
    <>
      <Tools />
      <ColorPalette />

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={1200}
        height={800}
      />
    </>
  );
}

export default DrawingCanvas;
