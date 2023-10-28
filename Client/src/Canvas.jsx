import React, { useState, useEffect, useRef } from "react";
import { useDrawingTools } from "./Context/DrawingToolsContext";
import { useHistory } from "./Context/History";
import ColorPalette from "./ToolBar/ColorPalette";
import Tools from "./ToolBar/Tools";
import UndoRedo from "./utils/UndoRedo";
import ShapesMenu from "./ToolBar/ShapesMenu";
import { Box } from "@mui/system";
import FloodFill from "q-floodfill";
import { useStyles } from "./Assets/CursorStyles";

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const {
    selectedTool,
    setSelectedTool,
    selectedColor,
    lineWidth,
    eraserWidth,
  } = useDrawingTools();
  const { addToHistory } = useHistory();
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    saveCanvasState();
  }, []);

  useEffect(() => {
    if (
      selectedTool === "Pencil" ||
      selectedTool === "Eraser" ||
      selectedTool === "Brush" ||
      selectedTool === "Pen" ||
      selectedTool === "PaintBucket"
    ) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (selectedTool === "Eraser") {
        ctx.strokeStyle = "white";
        ctx.lineWidth = eraserWidth;
      } else {
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = lineWidth;
      }
      setContext(ctx);
    }
  }, [selectedColor, lineWidth, selectedTool, eraserWidth]);

  const handleMouseDown = (e) => {
    console.log(selectedTool);
    if (selectedTool === "PaintBucket") {
      const imgData = context.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const floodFill = new FloodFill(imgData);
      floodFill.fill(context.strokeStyle, e.clientX, e.clientY, 0);
      context.putImageData(floodFill.imageData, 0, 0);
    } else if (
      selectedTool === "Pencil" ||
      selectedTool === "Eraser" ||
      selectedTool === "Brush" ||
      selectedTool === "Pen"
    ) {
      setDrawing(true);
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    } else {
      setDrawing(true);
      setStartX(e.nativeEvent.offsetX);
      setStartY(e.nativeEvent.offsetY);
    }
  };

  const handleMouseMove = (e) => {
    if (
      selectedTool === "Pencil" ||
      selectedTool === "Eraser" ||
      selectedTool === "Brush" ||
      selectedTool === "Pen"
    ) {
      if (!drawing) return;
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
    } else {
      if (!drawing) return;
      const endX = e.nativeEvent.offsetX;
      const endY = e.nativeEvent.offsetY;
      const width = endX - startX;
      const height = endY - startY;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.fillRect(startX, startY, width, height);
    }
  };

  const handleMouseUp = (e) => {
    if (selectedTool === "PaintBucket") {
      saveCanvasState();
    } else if (
      selectedTool === "Pencil" ||
      selectedTool === "Eraser" ||
      selectedTool === "Brush" ||
      selectedTool === "Pen"
    ) {
      setDrawing(false);
      context.closePath();
      saveCanvasState();
    } else {
      setDrawing(false);
      const endX = e.nativeEvent.offsetX;
      const endY = e.nativeEvent.offsetY;
      const width = endX - startX;
      const height = endY - startY;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.fillRect(startX, startY, width, height);
      saveCanvasState();
    }
    saveCanvasState();
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const snapShot = canvas.toDataURL();
    console.log("State saved");
    addToHistory(snapShot);
  };

  const redrawCanvas = (imageData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageData;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();

  //  <------ File selection functionality ------>

  const selectFile = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    console.log("ongoing");
    if (file) {
      const reader = new FileReader();
      console.log("infile");
      reader.onload = function (e) {
        const image = new Image();
        image.src = e.target.result;

        image.onload = function () {
          ctx.drawImage(
            image,
            150,
            150,
            canvas.width - 300,
            canvas.height - 300
          );
        };
      };
      await reader.readAsDataURL(file);
      setSelectedTool("Pencil");
      saveCanvasState();
      console.log("completed");
    }
  };

  return (
    <div>
      <Box sx={{ position: "absolute", display: "flex", flexDirection: "row" }}>
        <Tools setIsOpen={setIsOpen} selectFile={() => selectFile()} />
        <ShapesMenu canvasRef={canvasRef} saveCanvasState={saveCanvasState} />
        <ColorPalette />
      </Box>
      <UndoRedo isOpen={isOpen} redrawCanvas={redrawCanvas} />

      <canvas
        className={classes[selectedTool]}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
    </div>
  );
}

export default DrawingCanvas;
