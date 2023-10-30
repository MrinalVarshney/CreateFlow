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
import {
  drawRectangle,
  drawCircle,
  drawLine,
  drawTriangle,
  drawEllipse,
  drawNSidePolygon,
  drawDashedRectangle,
} from "./utils/ShapesLogic.jsx";

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const offCanvasRef = useRef(null);
  const {
    selectedTool,
    selectedColor,
    setSelectedTool,
    lineWidth,
    eraserWidth,
  } = useDrawingTools();
  const { addToHistory } = useHistory();
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isCustomizable = useRef(false);
  const StartRef = useRef({ startX: 0, startY: 0 });
  const CurrentRef = useRef({ x: -1, y: -1 });
  const ExtremumRef = useRef({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const EndRef = useRef({ endX: 0, endY: 0 });
  const pointRef = useRef({ pt3X: -1 });
  const classes = useStyles();

  useEffect(() => {
    saveCanvasState();
  }, []);

  const SwitchToVirtual = () => {
    offCanvasRef.current.style.zIndex = "1";
  };

  const switchToMainCanvas = () => {
    offCanvasRef.current.style.zIndex = "-1";
  };

  /*******************Functions for Adding Customizability and Checking if user Customizing*****************/

  const addCustomizability = (virtualCtx) => {
    const { e1X, e1Y, e2X, e2Y } = ExtremumRef.current;
    isCustomizable.current = true;
    virtualCtx.strokeStyle = selectedColor;
    drawDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
  };

  const isUnderCustomization = (x, y) => {
    const { e1X, e1Y, e2X, e2Y } = ExtremumRef.current;
    if (x >= e1X && x <= e2X && y >= e1Y && y <= e2Y) {
      return true;
    } else if (x <= e1X && x >= e2X && y >= e1Y && y <= e2Y) return true;
    else return false;
  };

  const isUserDragging = (endX, endY) => {
    const { e1X, e1Y, e2X, e2Y } = ExtremumRef.current;
    const dx=5, dy=5;
    const p1 = { x: e1X, y: e1Y };
    const p2 = { x: e2X, y: e1Y };
    const p3 = { x: e2X, y: e2Y };
    const p4 = { x: e1X, y: e2Y };
    const points = { p1, p2, p3, p4 };
   
    for (let i = 0; i < 4; i++){
      if ((endX <= points[i].x + dx || endX>= points[i]-dx) && (endY <= points[i].y+dy && endY>= points[i]-dy)) {
        return true;
      }
    }
    return false;
  };

  const MakeResizable = (endX, endY) => {};

  const chooseAndRunCustomizingEvent = (endX, endY) => {
    if (isUserDragging) {
      setIsDragging(true);
      MakeDraggable(endX, endY);
      DoCursorStyling();
    } else{
      console.log("NO drag")
      MakeResizable(endX, endY);
    } 
  };

  /*********************  Dragging Feature *************************/

  const MakeDraggable = (currX, currY) => {
    clearVirtualCanvas();
    const { x, y } = CurrentRef.current;
    const offsetX = currX - x;
    const offsetY = currY - y;
    const { startX, startY } = StartRef.current;
    StartRef.current = { startX: startX + offsetX, startY: startY + offsetY };
    const { endX, endY } = EndRef.current;
    EndRef.current = { endX: endX + offsetX, endY: endY + offsetY };
    const { e1X, e1Y, e2X, e2Y } = ExtremumRef.current;
    ExtremumRef.current = {
      e1X: e1X + offsetX,
      e1Y: e1Y + offsetY,
      e2X: e2X + offsetX,
      e2Y: e2Y + offsetY,
    };
    pointRef.current = { pt3X: pointRef.current.pt3X + offsetX };
    const virtualCtx = offCanvasRef.current.getContext("2d");
    chooseAndDrawShape(endX + offsetX, endY + offsetY, virtualCtx);
    CurrentRef.current = { x: currX, y: currY };
  };

  /************************ Mini features *************************/
  const DoCursorStyling = (x, y) => {
    if (isUnderCustomization(x, y)) {
      offCanvasRef.current.style.cursor = "move";
    } else offCanvasRef.current.style.cursor = "crosshair";
  };

  const clearVirtualCanvas = () => {
    const offCanvas = offCanvasRef.current;
    const virtualCtx = offCanvas.getContext("2d");
    virtualCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
  };

  const checkAndDrawOnMainCanvas = () => {
    if (isCustomizable.current) {
      const { endX, endY } = EndRef.current;
      drawOnMainCanvas(endX, endY);
    }
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

  /********************* Drawing on Main Canvas *************************/
  const drawOnMainCanvas = (endX, endY) => {
    clearVirtualCanvas();
    EndRef.current = { endX: -1, endY: -1 };
    isCustomizable.current = false;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = selectedColor;
    chooseAndDrawShape(endX, endY, ctx);
    pointRef.current = { pt3X: -1 };
    CurrentRef.current = { x: -1, y: -1 };
    saveCanvasState();
  };
  /************************ Feature: Drawing  shape on chosen canvas **************************************/
  const chooseAndDrawShape = (endX, endY, ctx) => {
    ctx.beginPath();
    const { startX, startY } = StartRef.current;
    if (selectedTool === "Rectangle") {
      const { e1X, e1Y, e2X, e2Y } = drawRectangle(
        startX,
        startY,
        endX,
        endY,
        ctx
      );
      ExtremumRef.current = { e1X, e1Y, e2X, e2Y };
    } else if (selectedTool === "Circle") {
      const { e1X, e2X, e1Y, e2Y } = drawCircle(
        startX,
        startY,
        endX,
        endY,
        ctx
      );
      ExtremumRef.current = { e1X, e1Y, e2X, e2Y };
    } else if (selectedTool === "Line") {
      const { e1X, e1Y, e2X, e2Y } = drawLine(startX, startY, endX, endY, ctx);
      ExtremumRef.current = { e1X, e1Y, e2X, e2Y };
    } else if (selectedTool === "Triangle") {
      const { pt3X } = pointRef.current;
      if (pt3X === -1) pointRef.current = { pt3X: startX - (endX - startX) };
      else {
        const { e1X, e1Y, e2X, e2Y } = drawTriangle(
          startX,
          startY,
          endX,
          endY,
          ctx,
          pt3X
        );
        ExtremumRef.current = { e1X, e1Y, e2X, e2Y };
        console.log(ExtremumRef.current);
      }
    } else if (selectedTool === "Ellipse") {
      const { e1X, e1Y, e2X, e2Y } = drawEllipse(
        startX,
        startY,
        endX,
        endY,
        ctx
      );
      ExtremumRef.current = { e1X, e1Y, e2X, e2Y };
    } else if (selectedTool === "Pentagon") {
      const { e1X, e1Y, e2X, e2Y } = drawNSidePolygon(
        startX,
        endX,
        startY,
        endY,
        5,
        ctx
      );
      ExtremumRef.current = { e1X, e1Y, e2X, e2Y };
    }
  };
  /******************* UseEffect : For deciding current working canvas and some canvas styling setup *****************/
  useEffect(() => {
    if (
      selectedTool === "Pencil" ||
      selectedTool === "Eraser" ||
      selectedTool === "Brush" ||
      selectedTool === "Pen" ||
      selectedTool === "PaintBucket"
    ) {
      switchToMainCanvas();
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
    } else SwitchToVirtual();
  }, [selectedColor, lineWidth, selectedTool, eraserWidth]);

  /************************** Main Canvas Events *****************************/
  const handleMouseDown = (e) => {
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
    } else {
      setDrawing(true);
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const handleMouseUp = (e) => {
    setDrawing(false);
    context.closePath();
    saveCanvasState();
  };

  /************************** Virtual Canvas Events *****************************/

  const handleVirtualMouseDown = (e) => {
    console.log(isCustomizable.current);
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    if (isCustomizable.current) {
      const { endX, endY } = EndRef.current;
      console.log("Customizing");
      if (isUnderCustomization(x, y)) {
        DoCursorStyling(x, y);
        CurrentRef.current = { x, y };
        return;
      } else {
        console.log("Drawing on main Canvas");
        drawOnMainCanvas(endX, endY);
      }
    }
    setDrawing(true);
    StartRef.current = { startX: x, startY: y };
  };

  const handleVirtualMouseMove = (e) => {
    const offCanvas = offCanvasRef.current;
    const ctx = offCanvas.getContext("2d");
    ctx.strokeStyle = selectedColor;
    const endX = e.nativeEvent.offsetX;
    const endY = e.nativeEvent.offsetY;
    if (isCustomizable.current) {
      DoCursorStyling(endX, endY);
      if (CurrentRef.current.x !== -1) {
        chooseAndRunCustomizingEvent(endX, endY);
        return;
      }
    }
    if (!drawing || isCustomizable.current) return;
    ctx.clearRect(0, 0, offCanvas.width, offCanvas.height);
    chooseAndDrawShape(endX, endY, ctx);
  };

  const handleVirtualMouseUp = (e) => {
    setDrawing(false);
    console.log("Drawing ", drawing);
    console.log("Mouse Up", isCustomizable.current);
    const offCanvas = offCanvasRef.current;
    const virtualCtx = offCanvas.getContext("2d");
    if (isDragging) {
      setIsDragging(false);
      CurrentRef.current = { x: -1, y: -1 };
      const { e1X, e1Y, e2X, e2Y } = ExtremumRef.current;
      drawDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
    }
    if (isCustomizable.current) return;
    else if (drawing) {
      const endX = e.nativeEvent.offsetX;
      const endY = e.nativeEvent.offsetY;
      EndRef.current = { endX, endY };
      chooseAndDrawShape(endX, endY, virtualCtx);
      addCustomizability(virtualCtx);
    }
  };

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
    <div style={{ cursor: "./Assets/cursor/eraser.jpg" }}>
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          zIndex: 3,
        }}
        onClick={() => {
          checkAndDrawOnMainCanvas();
        }}
      >
        <Tools setIsOpen={setIsOpen} selectFile={selectFile} />
        <ShapesMenu SwitchToVirtual={SwitchToVirtual} />
        <ColorPalette />
        <UndoRedo isOpen={isOpen} redrawCanvas={redrawCanvas} />
      </Box>

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
      <canvas
        ref={offCanvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        id="offCanvas"
        style={{
          cursor: "crosshair",
          backgroundColor: "transparent",
          position: "absolute",
          top: 0,
          zIndex: -1,
        }}
        onMouseDown={handleVirtualMouseDown}
        onMouseMove={handleVirtualMouseMove}
        onMouseUp={handleVirtualMouseUp}
      />
    </div>
  );
}

export default DrawingCanvas;
