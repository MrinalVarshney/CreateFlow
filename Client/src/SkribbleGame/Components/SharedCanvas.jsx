import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "../../Context/History";
import FloodFill from "q-floodfill";
import { useUserAndChats } from "../../Context/userAndChatsProvider";

import {
  drawRectangle,
  drawCircle,
  drawLine,
  drawTriangle,
  drawEllipse,
  drawNSidePolygon,
  drawDashedRectangle,
  drawLineDashedRectangle,
} from "../../utils/ShapesLogic.jsx";


function DrawingCanvas({randomDrawer}) {
  const canvasRef = useRef(null);
  const offCanvasRef = useRef(null);

  const { addToHistory, undo, redo } = useHistory();
  const [drawing, setDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const cursorCanvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const isCustomizable = useRef(false);
  const StartRef = useRef({ startX: 0, startY: 0 });
  const CurrentRef = useRef({ x: -1, y: -1 });
  const ExtremumRef = useRef({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const EndRef = useRef({ endX: 0, endY: 0 });
  const pointRef = useRef({ pt3X: -1 });
  const isResizing = useRef(false);
  const stillResizing = useRef(false);
  const selectedTool = useRef("Pencil");
  const selectedColor = useRef("black");
  const lineWidth = useRef(1);
  const eraserWidth = useRef(5);
  const cursorRef = useRef({ x: 0, y: 0 });
  const showNameRef = useRef(true)



  const { Socket, showCursorWithName } = useUserAndChats();
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
  console.log("Cursor changed",showCursorWithName)

  useEffect(()=>{
    const x = cursorRef.current.x;
    const y = cursorRef.current.y;
    showNameRef.current = showCursorWithName;
    setPositionOfCursor({x,y})
    
  },[showCursorWithName])

  const setPositionOfCursor = (coordinates) => {
      const { x, y } = coordinates;
      if (cursorCanvasRef.current) {
        cursorCanvasRef.current.style.left = x + "px";
        cursorCanvasRef.current.style.top = y + "px";

        const cursorCanvas = cursorCanvasRef.current;
        const context = cursorCanvas.getContext("2d");
        context.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        const showName = showNameRef.current;
        console.log("ShowCursorWithName", showCursorWithName)
        if (showName) {
          // Draw the text
          const fontSize = 35;
          context.font = fontSize + "px Arial";
          context.fillStyle = "black";
          const text = randomDrawer?.userName;
          context.fillText(text, 30, fontSize + 15);
        }

        // Draw the glowing pointer
        context.beginPath();
        context.arc(20, 15, 10, 0, 2 * Math.PI);
        context.fillStyle = "blue"; // Red with 50% opacity
        context.shadowBlur = 20;
        context.shadowColor = "blue";
        context.fill();
      }
  };

  /*******************Functions for Adding Customizability and Checking if user Customizing*****************/

  const addCustomizability = useCallback(
    (virtualCtx) => {
      const { e1X, e1Y, e2X, e2Y } = ExtremumRef.current;
      isCustomizable.current = true;
      virtualCtx.strokeStyle = selectedColor.current;
      if (selectedTool.current === "Line")
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

  const clearVirtualCanvas = useCallback(() => {
    const offCanvas = offCanvasRef.current;
    if (!offCanvas) return;
    const virtualCtx = offCanvas.getContext("2d");
    virtualCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
  }, []);

  const saveCanvasState = useCallback(() => {
    const canvas = canvasRef.current;
    const snapShot = canvas.toDataURL();
    console.log("State saved");
    addToHistory(snapShot);
  }, []);

  const redrawCanvas = useCallback((imageData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageData;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }, []);

  /************************ Feature: Drawing  shape on chosen canvas **************************************/

  const chooseAndDrawShape = useCallback(
    (endX, endY, ctx) => {
      ctx.beginPath();
      const { startX, startY } = StartRef.current;
      // console.log("EndXY startXY", endX, endY, startX, startY);
      // console.log(selectedTool);
      if (selectedTool.current === "Rectangle") {
        const { e1X, e1Y, e2X, e2Y } = drawRectangle(
          startX,
          startY,
          endX,
          endY,
          ctx
        );
        ExtremumRef.current = { e1X, e1Y, e2X, e2Y };
      } else if (selectedTool.current === "Circle") {
        const { e1X, e2X, e1Y, e2Y } = drawCircle(
          startX,
          startY,
          endX,
          endY,
          ctx
        );
        ExtremumRef.current = { e1X, e1Y, e2X, e2Y };
      } else if (selectedTool.current === "Line") {
        const { e1X, e1Y, e2X, e2Y } = drawLine(
          startX,
          startY,
          endX,
          endY,
          ctx
        );
        ExtremumRef.current = { e1X, e1Y, e2X, e2Y };
      } else if (selectedTool.current === "Triangle") {
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
      } else if (selectedTool.current === "Ellipse") {
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
      selectedTool.current === "Pencil" ||
      selectedTool.current === "Eraser" ||
      selectedTool.current === "Brush" ||
      selectedTool.current === "Pen" ||
      selectedTool.current === "PaintBucket"
    ) {
      // console.log("UseEffect ", selectedTool);
      switchToMainCanvas();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      if (selectedTool.current === "Eraser") {
        ctx.strokeStyle = "white";
        ctx.lineWidth = eraserWidth.current;
      } else {
        console.log("Selected color is", selectedColor.current);
        ctx.strokeStyle = selectedColor.current;
        ctx.lineWidth = lineWidth.current;
      }
      setContext(ctx);
    } else SwitchToVirtual();
  }, [selectedColor, lineWidth, selectedTool, eraserWidth]);

  // console.log("Selected color",selectedColor)
  // console.log("Selected tool",selectedTool.current)
  /************************** Main Canvas Events *****************************/
  const handleMouseDown = useCallback(
    (x, y) => {
      cursorRef.current = { x: x, y: y };
      setPositionOfCursor(cursorRef.current);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      console.log("Mouse Down selectedTool", selectedTool.current);
      if (selectedTool.current === "PaintBucket") {
        const imgData = context.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const floodFill = new FloodFill(imgData);
        floodFill.fill(context.strokeStyle, x, y, 0);
        context.putImageData(floodFill.imageData, 0, 0);
      } else {
        setDrawing(true);
        context.beginPath();
        context.moveTo(x, y);
      }
    },
    [selectedTool]
  );

  const handleMouseMove = useCallback(
    (x, y) => {
      cursorRef.current = { x: x, y: y };
      setPositionOfCursor(cursorRef.current);
      if (!drawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      console.log("moving");
      context.lineTo(x, y);
      context.stroke();
    },
    [drawing]
  );

  const handleMouseUp = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    setDrawing(false);
    ctx.closePath();
    console.log("Mouse up");
    saveCanvasState();
    console.log("Saved canvas state");
  }, [saveCanvasState]);

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
      chooseAndDrawShape(x, y, virtualCtx);
      CurrentRef.current = { x: currX, y: currY };
    },
    [chooseAndDrawShape, clearVirtualCanvas, offCanvasRef]
  );

  // socket events handling

  /********************* Drawing on Main Canvas *************************/
  const drawOnMainCanvas = useCallback(
    async (endX, endY) => {
      clearVirtualCanvas();
      EndRef.current = { endX: -1, endY: -1 };
      isCustomizable.current = false;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      // ctx.strokeStyle = selectedColor;
      console.log("inside drawonMainCanvas");
      chooseAndDrawShape(endX, endY, ctx);
      saveCanvasState();

      pointRef.current = { pt3X: -1 };
      CurrentRef.current = { x: -1, y: -1 };
    },
    [chooseAndDrawShape, saveCanvasState, clearVirtualCanvas]
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
      if (!offCanvasRef.current) return;
      const virtualCtx = offCanvasRef.current.getContext("2d");
      chooseAndDrawShape(endX + offsetX, endY + offsetY, virtualCtx);

      CurrentRef.current = { x: currX, y: currY };
    },
    [chooseAndDrawShape, clearVirtualCanvas]
  );

  /************************* Customising Events ****************************/

  const chooseAndRunCustomizingEvent = useCallback(
    (endX, endY) => {
      console.log("choosing event");
      if (!stillResizing.current && isUserDragging(endX, endY)) {
        setIsDragging(true);
        MakeDraggable(endX, endY);
        console.log("Drag");
      } else {
        console.log("NO drag");
        stillResizing.current = true;
        MakeResizable(endX, endY);
      }
    },
    [MakeDraggable, MakeResizable]
  );

  /************************** Virtual Canvas Events *****************************/

  const handleVirtualMouseDown = useCallback(
    (x, y) => {
      console.log("XY", selectedColor.current);
      cursorRef.current = { x: x, y: y };
      setPositionOfCursor(cursorRef.current);
      if (isCustomizable.current) {
        const { endX, endY } = EndRef.current;
        // console.log("Customizing", endX, endY);
        if (isUnderCustomization(x, y)) {
          CurrentRef.current = { x, y };
          return;
        } else {
          console.log("Drawing on main Canvas", endX, endY);

          drawOnMainCanvas(endX, endY);
        }
      }
      if (selectedTool.current !== "UploadFiles") {
        setDrawing(true);
        StartRef.current = { startX: x, startY: y };
      }
    },
    [drawOnMainCanvas, selectedTool]
  );

  const handleVirtualMouseMove = useCallback(
    (endX, endY) => {
      cursorRef.current = { x: endX, y: endY };
      setPositionOfCursor(cursorRef.current);
      const offCanvas = offCanvasRef.current;
      if (!offCanvas) return;
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
      cursorRef.current = { x: endX, y: endY };
      setPositionOfCursor(cursorRef.current);
      setDrawing(false);
      const offCanvas = offCanvasRef.current;
      if (!offCanvas) return;
      const virtualCtx = offCanvas.getContext("2d");
      const { e1X, e1Y, e2X, e2Y } = ExtremumRef.current;
      if (isResizing.current) {
        CurrentRef.current = { x: -1, y: -1 };
        isResizing.current = false;
        stillResizing.current = false;
        if (selectedTool.current === "Line")
          drawLineDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
        else drawDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
      }
      if (isDragging) {
        setIsDragging(false);
        CurrentRef.current = { x: -1, y: -1 };
        if (selectedTool.current === "Line")
          drawLineDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
        else drawDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
      }
      if (isCustomizable.current) return;
      else if (drawing) {
        EndRef.current = { endX, endY };

        chooseAndDrawShape(endX, endY, virtualCtx);
        addCustomizability(virtualCtx);
      }
    },
    [addCustomizability, chooseAndDrawShape, drawing, isDragging, selectedTool]
  );

  const handlesharedUndo = useCallback(() => {
    console.log(" shared undoing");
    const data = undo();
    if (data) {
      redrawCanvas(data);
    }
  }, [undo, redrawCanvas]);

  const handlesharedRedo = useCallback(() => {
    console.log("shared redoing");
    const data = redo();
    if (data) {
      redrawCanvas(data);
    }
  }, [redo, redrawCanvas]);

  const changeSelectedColor = useCallback(
    (color) => {
      selectedColor.current = color;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = color;
    },
    [selectedColor]
  );

  const selectTool = useCallback(
    (data) => {
      const { tool, width } = data;
      selectedTool.current = tool;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      console.log(width, "width");
      if (tool === "Eraser") {
        ctx.strokeStyle = "white";
        ctx.lineWidth = width;
      } else {
        console.log("Selected color is", selectedColor.current);
        ctx.strokeStyle = selectedColor.current;
        ctx.lineWidth = width;
      }
    },
    [selectedTool]
  );

  useEffect(() => {
    // shape and color change handling
    socket?.on("color-change", (color) => {
      console.log("Color-Changed to", color);
      changeSelectedColor(color);
    });
    socket?.on("selected-tool", (data) => {
      console.log("Changing selected tool to", data);
      selectTool(data);
    });

    return () => {
      socket?.off("color-change");
      socket?.off("shapeChange");
      // socket?.off("selected-tool");
    };
  }, [socket, drawOnMainCanvas, changeSelectedColor, selectTool]);

  useEffect(() => {
    socket?.on("mouse-down", (data) => {
      const x = data.x;
      const y = data.y;
      handleMouseDown(x, y);
    });
    socket?.on("mouse-move", (data) => {
      //   console.log("mouse-move", data);
      const x = data.x;
      const y = data.y;
      handleMouseMove(x, y);
    });
    socket?.on("mouse-up", () => {
      handleMouseUp();
    });

    // virtual mouse events handling

    socket?.on("virtual-mouse-down", (data) => {
      isCustomizable.current = data.isCustomizable;
      const x = data.x;
      const y = data.y;
      const offCanvas = offCanvasRef.current;
      if (!offCanvas) return;
      const ctx = offCanvas.getContext("2d");
      setContext(ctx);
      handleVirtualMouseDown(x, y);
    });
    socket?.on("virtual-mouse-move", (data) => {
      // console.log("virtual-mouse-move", data);
      isCustomizable.current = data.isCustomizable;
      const endX = data.endX;
      const endY = data.endY;
      const offCanvas = offCanvasRef.current;
      if (!offCanvas) return;
      const ctx = offCanvas.getContext("2d");
      setContext(ctx);
      handleVirtualMouseMove(endX, endY);
    });
    socket?.on("virtual-mouse-up", (data) => {
      console.log("virtual-mouse-up");
      const endX = data.endX;
      const endY = data.endY;
      const offCanvas = offCanvasRef.current;
      if (!offCanvas) return;
      const ctx = offCanvas.getContext("2d");
      setContext(ctx);
      handleVirtualMouseUp(endX, endY);
    });

    // undo-redo handling
    socket?.on("undo", () => {
      console.log("undoing");
      handlesharedUndo();
    });
    socket?.on("redo", () => {
      console.log("redoing");
      handlesharedRedo();
    });
    socket?.on("onToolsClick", (data) => {
      console.log("hhhh", data);
      changeSelectedColor(data.selectedColor);
      selectedTool.current = data.selectedTool;
      checkAndDrawOnMainCanvas();
    });

    return () => {
      socket?.off("mouse-up");
      socket?.off("mouse-down", handleMouseDown);
      socket?.off("mouse-move");
      socket?.off("virtual-mouse-down");
      socket?.off("virtual-mouse-up");
      socket?.off("virtual-mouse-move");
      socket?.off("undo");
      socket?.off("redo");
      socket?.off("onToolsClick");
    };
  }, [
    socket,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleVirtualMouseDown,
    handleVirtualMouseMove,
    handleVirtualMouseUp,
    handlesharedUndo,
    handlesharedRedo,
    selectedColor,
    selectTool,
    checkAndDrawOnMainCanvas,
    changeSelectedColor,
  ]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <div style={{ overflow: "hidden" }}>
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
      <canvas
        ref={cursorCanvasRef}
        style={{
          height: "100px",
          width: "100px",
          backgroundColor: "transparent",
          position: "absolute",
          zIndex: 2,
        }}
      />
    </div>
  );
}

export default DrawingCanvas;
