import React, { useState, useEffect, useRef } from "react";
import { useDrawingTools } from "./Context/DrawingToolsContext";
import { useHistory } from "./Context/History";
import "./Cursors.css";
import ColorPalette from "./ToolBar/ColorPalette";
import Tools from "./ToolBar/Tools";
import UndoRedo from "./utils/UndoRedo";

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const { selectedTool, selectedColor, lineWidth, eraserWidth } = useDrawingTools();
  const { addToHistory } = useHistory();
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    saveCanvasState()
  },[])

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
    saveCanvasState();
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const snapShot = canvas.toDataURL();
    console.log("State saved")
    addToHistory(snapShot)
  }

  const redrawCanvas = (imageData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageData
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }

  return (
    <>
      <Tools />
      <ColorPalette />
      <UndoRedo redrawCanvas= {redrawCanvas}/>
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
