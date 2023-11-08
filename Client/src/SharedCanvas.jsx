import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDrawingTools } from "./Context/DrawingToolsContext";
import { useHistory } from "./Context/History";
import ColorPalette from "./ToolBar/ColorPalette";
import Tools from "./ToolBar/Tools";
import UndoRedo from "./utils/UndoRedo";
import ShapesMenu from "./ToolBar/ShapesMenu";
import { Box } from "@mui/system";
import FloodFill from "q-floodfill";
import { useUserAndChats } from "./Context/userAndChatsProvider";

import { useStyles } from "./Assets/CursorStyles";
import {
  drawRectangle,
  drawCircle,
  drawLine,
  drawTriangle,
  drawEllipse,
  drawNSidePolygon,
  drawDashedRectangle,
  drawLineDashedRectangle,
} from "./utils/ShapesLogic.jsx";

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const offCanvasRef = useRef(null);
  const {
    selectedTool,
    selectedColor,
    setSelectedColor,
    setSelectedTool,
    lineWidth,
    eraserWidth,
  } = useDrawingTools();
  const { addToHistory } = useHistory();
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const isCustomizable = useRef(false);
  const StartRef = useRef({ startX: 0, startY: 0 });
  const CurrentRef = useRef({ x: -1, y: -1 });
  const ExtremumRef = useRef({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const EndRef = useRef({ endX: 0, endY: 0 });
  const pointRef = useRef({ pt3X: -1 });
  const isResizing = useRef(false);
  const stillResizing = useRef(false);
  const classes = useStyles();

  const { Socket } = useUserAndChats();
  const socket = Socket.current;
  useEffect(() => {
    saveCanvasState();
  }, []);

  /*********************Functionality to toggle between main and virtual canvas*****************************/

  const SwitchToVirtual = () => {
    offCanvasRef.current.style.zIndex = "1";
  };

  const switchToMainCanvas = () => {
    offCanvasRef.current.style.zIndex = "-1";
  };

  /*******************Functions for Adding Customizability and Checking if user Customizing*****************/

  const addCustomizability = useCallback(
    (virtualCtx) => {
      const { e1X, e1Y, e2X, e2Y } = ExtremumRef.current;
      isCustomizable.current = true;
      virtualCtx.strokeStyle = selectedColor;
      if (selectedTool === "Line")
        drawLineDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
      else drawDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
    },
    [selectedColor, selectedTool]
  );

  const isUnderCustomization = (x, y) => {
    const { e1X, e1Y, e2X, e2Y } = ExtremumRef.current;
    if (x >= e1X && x <= e2X && y >= e1Y && y <= e2Y) {
      return true;
    } else if (x <= e1X && x >= e2X && y >= e1Y && y <= e2Y) return true;
    else return false;
  };

  const isUserDragging = (endX, endY) => {
    console.log(endX, endY);
    const { e1X, e1Y, e2X, e2Y } = ExtremumRef.current;
    const dx = 10,
      dy = 10;
    const p1 = { x: e1X, y: e1Y };
    const p2 = { x: e2X, y: e1Y };
    const p3 = { x: e2X, y: e2Y };
    const p4 = { x: e1X, y: e2Y };
    const points = [p1, p2, p3, p4];

    for (let i = 0; i < 4; i++) {
      if (
        endX <= points[i].x + dx &&
        endX >= points[i].x - dx &&
        endY <= points[i].y + dy &&
        endY >= points[i].y - dy
      ) {
        return false;
      }
    }
    return true;
  };

  /************************ Mini features *************************/
  const DoCursorStyling = useCallback((x, y) => {
    if (isUnderCustomization(x, y)) {
      offCanvasRef.current.style.cursor = "move";
    } else offCanvasRef.current.style.cursor = "crosshair";
  }, []);

  const clearVirtualCanvas = useCallback(() => {
    const offCanvas = offCanvasRef.current;
    const virtualCtx = offCanvas.getContext("2d");
    virtualCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
  }, []);

  const saveCanvasState = useCallback(() => {
    const canvas = canvasRef.current;
    const snapShot = canvas.toDataURL();
    console.log("State saved");
    addToHistory(snapShot);
  }, [addToHistory]);

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

  /************************ Feature: Drawing  shape on chosen canvas **************************************/

  const chooseAndDrawShape = useCallback(
    (endX, endY, ctx) => {
      ctx.beginPath();
      const { startX, startY } = StartRef.current;
      // console.log("EndXY startXY", endX, endY, startX, startY);
      // console.log(selectedTool);
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
        const { e1X, e1Y, e2X, e2Y } = drawLine(
          startX,
          startY,
          endX,
          endY,
          ctx
        );
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
    },
    [selectedTool]
  );
  /******************* UseEffect : For deciding current working canvas and some canvas styling setup *****************/
  useEffect(() => {
    if (
      selectedTool === "Pencil" ||
      selectedTool === "Eraser" ||
      selectedTool === "Brush" ||
      selectedTool === "Pen" ||
      selectedTool === "PaintBucket"
    ) {
      // console.log("UseEffect ", selectedTool);
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
  const handleMouseDown = useCallback(() => {
    const { startX, startY } = StartRef.current;
    // console.log("Mouse down tool", selectedTool);
    setDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(startX, startY);
  }, [selectedTool]);

  const handleMouseMove = useCallback(() => {
    const { startX, startY } = StartRef.current;
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // console.log("Mouse moving");
    // console.log(startX, startY);
    ctx.lineTo(startX, startY);
    ctx.stroke();
  }, [drawing]);

  const handleMouseUp = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setDrawing(false);
    ctx.closePath();
    saveCanvasState();
  }, [saveCanvasState]);

  const fillTheShape = (selectedColor, ctx) => {
    const imgData = ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
      // window.innerWidth,
      // window.innerHeight
    );
    const floodFill = new FloodFill(imgData);
    floodFill.fill(
      selectedColor,
      StartRef.current.startX,
      StartRef.current.startY,
      0
    );
    ctx.putImageData(floodFill.imageData, 0, 0);
    setContext(ctx);
  };

  //  <------ File selection functionality ------>
  const selectFile = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
    fileInput.value = null;
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    console.log("selected file ", file);
    if (file) {
      setUploadFile(file);
      ExtremumRef.current = {
        e1X: 150,
        e1Y: 150,
        e2X: 150 + 200,
        e2Y: 150 + 200,
      };
      StartRef.current = { startX: 150, startY: 150 };
      EndRef.current = { endX: 150 + 200, endY: 150 + 200 };
      SwitchToVirtual();
      const offCanvas = offCanvasRef.current;
      const virtualCtx = offCanvas.getContext("2d");
      renderImage(file, virtualCtx);
      addCustomizability(virtualCtx);
    } else {
      switchToMainCanvas();
    }
  };

  const renderImage = useCallback(
    async (file, ctx) => {
      if (file) {
        clearVirtualCanvas();
        const reader = new FileReader();
        const { startX, startY } = StartRef.current;
        const { endX, endY } = EndRef.current;
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        reader.onload = function (e) {
          const image = new Image();
          image.src = e.target.result;
          image.onload = function () {
            ctx.drawImage(image, startX, startY, width, height);
          };
        };
        ctx.stroke();
        await reader.readAsDataURL(file);
      }
    },
    [clearVirtualCanvas]
  );

  const renderImageOnMainCanvas = useCallback(
    async (file, ctx) => {
      if (file) {
        clearVirtualCanvas();

        const reader = new FileReader();
        const { startX, startY } = StartRef.current;

        await new Promise((resolve, reject) => {
          reader.onload = function (e) {
            const image = new Image();
            image.src = e.target.result;

            image.onload = function () {
              ctx.drawImage(image, startX, startY, 200, 200);
              resolve(); // Resolve the Promise when the image has loaded
            };
          };

          reader.readAsDataURL(file);
        });

        // After the image has been loaded and drawn, you can save the canvas state
        saveCanvasState();
      }
    },
    [clearVirtualCanvas, saveCanvasState]
  );

  /************************ Making resizable shapes functionality ************************************/

  const MakeResizable = useCallback(
    (currX, currY) => {
      console.log("Resizing shape");
      const { x, y } = CurrentRef.current;
      let { e1X, e1Y, e2X, e2Y } = ExtremumRef.current;
      const dx = 10,
        dy = 10;
      if (e1X > e2X) {
        let t = e1X;
        e1X = e2X;
        e2X = t;
      }
      if (e1Y > e2Y) {
        let t = e1Y;
        e1Y = e2Y;
        e2Y = t;
      }
      const p1 = { x: e1X, y: e1Y };
      const p2 = { x: e2X, y: e1Y };
      const p3 = { x: e2X, y: e2Y };
      const p4 = { x: e1X, y: e2Y };

      const points = [p1, p2, p3, p4];
      if (isResizing.current === false) {
        for (let i = 0; i < 4; i++) {
          if (
            currX <= points[i].x + dx &&
            currX >= points[i].x - dx &&
            currY <= points[i].y + dy &&
            currY >= points[i].y - dy
          ) {
            isResizing.current = true;

            if (i === 0) StartRef.current = { startX: e2X, startY: e2Y };
            else if (i === 1) StartRef.current = { startX: e1X, startY: e2Y };
            else if (i === 2) StartRef.current = { startX: e1X, startY: e1Y };
            else StartRef.current = { startX: e2X, startY: e1Y };
          }
        }
      }
      clearVirtualCanvas();
      const { startX, startY } = StartRef.current;
      // console.log("Start ", startX, startY);
      EndRef.current = { endX: x, endY: y };
      // console.log(x, y);
      ExtremumRef.current = {
        e1X: startX,
        e1Y: x,
        e2X: startY,
        e2Y: y,
      };

      const virtualCtx = offCanvasRef.current.getContext("2d");
      if (selectedTool === "UploadFiles") {
        renderImage(uploadFile, virtualCtx);
      } else {
        chooseAndDrawShape(x, y, virtualCtx);
        CurrentRef.current = { x: currX, y: currY };
      }
    },
    [
      chooseAndDrawShape,
      selectedTool,
      uploadFile,
      clearVirtualCanvas,
      offCanvasRef,
      renderImage,
    ]
  );

  // socket events handling

  /********************* Drawing on Main Canvas *************************/
  const drawOnMainCanvas = useCallback(
    async (endX, endY) => {
      clearVirtualCanvas();
      EndRef.current = { endX: -1, endY: -1 };
      isCustomizable.current = false;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (selectedTool === "UploadFiles") {
        console.log("Drawing on main canvas");
        await renderImageOnMainCanvas(uploadFile, ctx);
        switchToMainCanvas();
        setSelectedTool("Pencil");
      } else {
        // ctx.strokeStyle = selectedColor;
        console.log("inside drawonMainCanvas");
        chooseAndDrawShape(endX, endY, ctx);
        saveCanvasState();
      }

      pointRef.current = { pt3X: -1 };
      CurrentRef.current = { x: -1, y: -1 };
    },
    [
      chooseAndDrawShape,
      saveCanvasState,
      selectedColor,
      selectedTool,
      uploadFile,
      renderImageOnMainCanvas,
      setSelectedTool,
      clearVirtualCanvas,
    ]
  );

  // mini feature

  const checkAndDrawOnMainCanvas = useCallback(() => {
    if (isCustomizable.current) {
      const { endX, endY } = EndRef.current;
      drawOnMainCanvas(endX, endY);
    }
  }, [drawOnMainCanvas]);

  /*********************  Dragging Feature *************************/

  const MakeDraggable = useCallback(
    (currX, currY) => {
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
      if (selectedTool === "UploadFiles") {
        renderImage(uploadFile, virtualCtx);
      } else {
        chooseAndDrawShape(endX + offsetX, endY + offsetY, virtualCtx);
      }

      CurrentRef.current = { x: currX, y: currY };
    },
    [
      chooseAndDrawShape,
      selectedTool,
      uploadFile,
      renderImage,
      clearVirtualCanvas,
    ]
  );

  /************************* Customising Events ****************************/

  const chooseAndRunCustomizingEvent = useCallback(
    (endX, endY) => {
      console.log("choosing event");
      if (!stillResizing.current && isUserDragging(endX, endY)) {
        setIsDragging(true);
        MakeDraggable(endX, endY);
        DoCursorStyling();
        console.log("Drag");
      } else {
        console.log("NO drag");
        stillResizing.current = true;
        MakeResizable(endX, endY);
      }
    },
    [DoCursorStyling, MakeDraggable, MakeResizable]
  );

  /************************** Virtual Canvas Events *****************************/

  const handleVirtualMouseDown = useCallback(
    (x, y) => {
      // console.log("XY", x, y);
      if (isCustomizable.current) {
        const { endX, endY } = EndRef.current;
        // console.log("Customizing", endX, endY);
        if (isUnderCustomization(x, y)) {
          DoCursorStyling(x, y);
          CurrentRef.current = { x, y };
          return;
        } else {
          console.log("Drawing on main Canvas", endX, endY);

          drawOnMainCanvas(endX, endY);
        }
      }
      if (selectedTool !== "UploadFiles") {
        setDrawing(true);
        StartRef.current = { startX: x, startY: y };
      }
    },
    [DoCursorStyling, drawOnMainCanvas, selectedTool]
  );

  const handleVirtualMouseMove = useCallback(
    (endX, endY) => {
      const offCanvas = offCanvasRef.current;
      const ctx = offCanvas.getContext("2d");
      if (isCustomizable.current) {
        if (CurrentRef.current.x !== -1) {
          chooseAndRunCustomizingEvent(endX, endY);
          return;
        }
      }
      // console.log("endXY", endX, endY);
      if (!drawing || isCustomizable.current) return;
      ctx.clearRect(0, 0, offCanvas.width, offCanvas.height);
      chooseAndDrawShape(endX, endY, ctx);
    },
    [chooseAndDrawShape, chooseAndRunCustomizingEvent, drawing]
  );

  const handleVirtualMouseUp = useCallback(
    (endX, endY) => {
      setDrawing(false);
      const offCanvas = offCanvasRef.current;
      const virtualCtx = offCanvas.getContext("2d");
      const { e1X, e1Y, e2X, e2Y } = ExtremumRef.current;
      if (isResizing.current) {
        CurrentRef.current = { x: -1, y: -1 };
        isResizing.current = false;
        stillResizing.current = false;
        if (selectedTool === "Line")
          drawLineDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
        else drawDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
      }
      if (isDragging) {
        setIsDragging(false);
        CurrentRef.current = { x: -1, y: -1 };
        if (selectedTool === "Line")
          drawLineDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
        else drawDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
      }
      if (isCustomizable.current) return;
      else if (drawing) {
        // console.log("Endref mouse move", endX, endY);
        EndRef.current = { endX, endY };
        // console.log("Endref.current", EndRef.current);
        chooseAndDrawShape(endX, endY, virtualCtx);
        addCustomizability(virtualCtx);
        // console.log("Upp drawing false");
      }
    },
    [addCustomizability, chooseAndDrawShape, drawing, isDragging, selectedTool]
  );

  useEffect(() => {
    socket.on("mouse-down", (data) => {
      setSelectedTool(data.selectedTool);
      setSelectedColor(data.selectedColor);

      // console.log(
      //   "mouse-down",
      //   data.selectedColor,
      //   data.selectedTool,
      //   data.startX,
      //   data.startY
      // );

      StartRef.current = { startX: data.startX, startY: data.startY };
      EndRef.current = data.EndRef;
      ExtremumRef.current = data.ExtremumRef;
      pointRef.current = data.pointRef;
      isResizing.current = data.isResizing;
      stillResizing.current = data.stillResizing;
      CurrentRef.current = data.CurrentRef;
      isCustomizable.current = data.isCustomizable;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (data.selectedTool === "PaintBucket") {
        fillTheShape(data.selectedColor, ctx);
      } else {
        handleMouseDown();
      }
    });
    socket.on("mouse-move", (data) => {
      //   console.log("mouse-move", data);
      StartRef.current = data.StartRef;
      EndRef.current = { endX: data.endX, endY: data.endY };
      ExtremumRef.current = data.ExtremumRef;
      pointRef.current = data.pointRef;
      isResizing.current = data.isResizing;
      stillResizing.current = data.stillResizing;
      CurrentRef.current = data.CurrentRef;
      isCustomizable.current = data.isCustomizable;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      setContext(ctx);
      handleMouseMove();
    });
    socket.on("mouse-up", () => {
      handleMouseUp();
    });
    // virtual mouse events handling

    // console.log(selectedTool);
    socket.on("virtual-mouse-down", (data) => {
      console.log("virtual-mouse-down");
      setSelectedTool(data.selectedTool);
      setSelectedColor(data.selectedColor);
      isCustomizable.current = data.isCustomizable;
      const x = data.x;
      const y = data.y;
      const offCanvas = offCanvasRef.current;
      const ctx = offCanvas.getContext("2d");
      setContext(ctx);
      handleVirtualMouseDown(x, y);
    });
    socket.on("virtual-mouse-move", (data) => {
      // console.log("virtual-mouse-move", data);
      isCustomizable.current = data.isCustomizable;
      const endX = data.endX;
      const endY = data.endY;
      const offCanvas = offCanvasRef.current;
      const ctx = offCanvas.getContext("2d");
      setContext(ctx);
      handleVirtualMouseMove(endX, endY);
    });
    socket.on("virtual-mouse-up", (data) => {
      console.log("virtual-mouse-up");
      const endX = data.endX;
      const endY = data.endY;

      const offCanvas = offCanvasRef.current;
      const ctx = offCanvas.getContext("2d");
      setContext(ctx);
      handleVirtualMouseUp(endX, endY);
    });

    return () => {
      socket?.off("virtual-mouse-down");
      socket?.off("virtual-mouse-up");
      socket?.off("virtual-mouse-move");
    };
  }, [
    socket,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setSelectedTool,
    setSelectedColor,
    handleVirtualMouseDown,
    handleVirtualMouseMove,
    handleVirtualMouseUp,
  ]);

  return (
    <div>
      <canvas
        ref={canvasRef}
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
          cursor: "arrow",
          backgroundColor: "transparent",
          position: "absolute",
          top: 0,
          zIndex: -1,
        }}
      />
    </div>
  );
}

export default DrawingCanvas;
