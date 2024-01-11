import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDrawingTools } from "./Context/DrawingToolsContext";
import { useHistory } from "./Context/History";
import ColorPalette from "./ToolBar/ColorPalette";
import Tools from "./ToolBar/Tools";
import UndoRedo from "./utils/UndoRedo";
import ShapesMenu from "./ToolBar/ShapesMenu";
import { Box } from "@mui/system";
import CustomBackdrop from "./shared/Components/CustomBackDrop.js";
import FloodFill from "q-floodfill";
import { useStyles } from "./Assets/CursorStyles";
import "./api.jsx";
import SuccessToast from "./shared/Components/successToast.js";
import "./Canvas.css";
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
import SavingAndSocialMenu from "./ToolBar/SavingAndSocialMenu";
import ErrorToast from "./shared/Components/ErrorToast.js";
import { useUserAndChats } from "./Context/userAndChatsProvider.jsx";
import * as api from "./api";
import CanvasNameModal from "./ToolBar/Components/CanvasNameModal.js";
import { useNavigate } from "react-router-dom";
import userObject from "./shared/Components/usersObjects.js";

function DrawingCanvas() {
  const canvasRef = useRef(null);
  const offCanvasRef = useRef(null);
  const {
    setCanvasDetails,
    connectWithSocketServer,
    Socket,
    collabUsers,
    setRoomDetails,
    roomDetails,
    user,
    setCollabUsers,
    isCollaborating,
  } = useUserAndChats();
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
  const [uploadFile, setUploadFile] = useState(null);
  const [progress, setProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const isCustomizable = useRef(false);
  const StartRef = useRef({ startX: 0, startY: 0 });
  const CurrentRef = useRef({ x: -1, y: -1 });
  const ExtremumRef = useRef({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const EndRef = useRef({ endX: 0, endY: 0 });
  const pointRef = useRef({ pt3X: -1 });
  const isResizing = useRef(false);
  const stillResizing = useRef(false);
  const classes = useStyles();
  const [success, setSuccess] = useState(null);
  const navigateToGallery = useRef(false);
  const navigate = useNavigate();

  /***********************************Function for handling modal   for saving canvas name ***********************/
  const socket = Socket?.current;
  useEffect(() => {
    connectWithSocketServer();
    const socket = Socket?.current;
    if (isCollaborating.current) return;
    const roomCode = localStorage.getItem("roomCode");
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User", user);
    if (socket && roomCode) {
      console.log("sending request");
      const userId = user._id;
      const userName = user.username;
      const data = {
        userId: userId,
        userName: userName,
        roomCode: roomCode,
      };
      socket.emit("collab-room-create", data);
    }
  }, []);

  const handleOpenModal = (data) => {
    // opening canvas save modal
    setIsModalOpen(true);
  };

  const handleCloseModal = (data) => {
    /// For saving canvas Name
    setIsModalOpen(false);
    if (data) {
      saveCanvas(data);
    }
  };

  /**************************************Utilities ****************************************************/

  /*Function to save the current canvas at server-side */

  const saveCanvas = async (data) => {
    console.log("Data to save ", data);
    setProgress(true);
    const response = await api.saveCanvas(data);
    setProgress(false);
    if (response.error) {
      setError(response.errorMessage);
    } else {
      setCanvasDetails(response.data);
      setSuccess("Canvas successfully saved");
    }
    if (navigateToGallery.current) {
      navigate("/drawingGallery");
    }
  };
  const reSaveCanvas = async () => {
    setProgress(true);
    const details = JSON.parse(localStorage.getItem("canvasDetails"));
    const canvasData = localStorage.getItem("snapShot");
    const updates = {
      canvasId: details._id,
      canvasData: canvasData,
    };
    setProgress(true);
    const response = await api.updateCanvas(updates);
    setProgress(false);
    if (response.error) {
      setError(response.errorMessage);
    } else {
      setSuccess("Canvas re-saved successfully");
    }
    redrawCanvas(canvasData);
  };

  const downloadCanvasImage = (dataUrl) => {
    var downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = "canvasImage.png";
    downloadLink.click();
  };

  /*********************Loading most recent canvas state on reconnection the page *******************/

  const [points, setPoints] = useState([]);
  const [brushStyle, setBrushStyle] = useState([]);
  const density = 50;
  useEffect(() => {
    const savedDrawing = localStorage.getItem("snapShot");
    const canvasDetails = localStorage.getItem("canvasDetails");
    if (canvasDetails) {
      setCanvasDetails();
    }
    if (!savedDrawing) {
      console.log(
        "Dimensions",
        canvasRef.current.width,
        canvasRef.current.height
      );
      const context = canvasRef.current.getContext("2d");
      context.moveTo(0, 0);
      context.lineTo(0, 0);
      const imgData = context?.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const floodFill = new FloodFill(imgData);
      floodFill.fill("rgb(255,255,255)", 20, 20, 0);
      context.putImageData(floodFill.imageData, 0, 0);
      saveCanvasState();
    } else {
      redrawCanvas(savedDrawing);
    }
  }, []);

  /*********************Functionality to toggle between main and virtual canvas*****************************/

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
    if (selectedTool === "Line")
      drawLineDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
    else if (selectedTool !== "UploadFiles")
      drawDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
  };

  const isUnderCustomization = (x, y) => {
    const { e1X, e1Y, e2X, e2Y } = ExtremumRef.current;
    if (x >= e1X && x <= e2X && y >= e1Y && y <= e2Y) {
      return true;
    } else if (x <= e1X && x >= e2X && y >= e1Y && y <= e2Y) return true;
    else return false;
  };
  console.log("selected", selectedTool);
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
  /************************ Making resizable shapes functionality ************************************/

  const MakeResizable = (currX, currY) => {
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
    console.log("Start ", startX, startY);
    EndRef.current = { endX: x, endY: y };
    console.log(x, y);
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
  };

  /************************* Customising Events ****************************/

  const chooseAndRunCustomizingEvent = (endX, endY) => {
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
    if (selectedTool === "UploadFiles") {
      renderImage(uploadFile, virtualCtx);
    } else {
      chooseAndDrawShape(endX + offsetX, endY + offsetY, virtualCtx);
    }

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
    localStorage.setItem("snapShot", snapShot);
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
  const drawOnMainCanvas = async (endX, endY) => {
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
      ctx.strokeStyle = selectedColor;
      chooseAndDrawShape(endX, endY, ctx);
      saveCanvasState();
    }

    pointRef.current = { pt3X: -1 };
    CurrentRef.current = { x: -1, y: -1 };
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
        console.log("eraser in useEffect ", eraserWidth, ctx.lineWidth);
      } else {
        ctx.strokeStyle = selectedColor;

        if (selectedTool === "Brush") {
          if (brushStyle === 1) {
            ctx.lineWidth = lineWidth;
            ctx.lineJoin = ctx.lineCap = "round";
            ctx.shadowBlur = lineWidth;
            ctx.shadowColor = selectedColor;
          } else {
            if (brushStyle === 4) ctx.lineWidth = 5;
            else ctx.lineWidth = 1;
            ctx.lineJoin = ctx.lineCap = null;
            ctx.shadowBlur = null;
            ctx.shadowColor = null;
          }
        }
      }
      setContext(ctx);
    } else SwitchToVirtual();
  }, [selectedColor, lineWidth, selectedTool, brushStyle, eraserWidth]);

  /************************** Main Canvas Events *****************************/

  const midPointBtw = (p1, p2) => ({
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  });

  const offsetPoints = (val) => {
    return points.map((point) => ({
      x: point.x + val,
      y: point.y + val,
    }));
  };
  const stroke = (points) => {
    const ctx = canvasRef.current.getContext("2d");
    let p1 = points[0];
    let p2 = points[1];

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);

    for (let i = 1, len = points.length; i < len; i++) {
      const midPoint = midPointBtw(p1, p2);
      ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      p1 = points[i];
      p2 = points[i + 1];
    }

    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  };

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const drawPixels = (ctx, x, y) => {
    for (let i = -10; i < 10; i += 4) {
      for (let j = -10; j < 10; j += 4) {
        if (Math.random() > 0.5) {
          ctx.fillStyle = [
            "red",
            "orange",
            "yellow",
            "green",
            "light-blue",
            "blue",
            "purple",
          ][getRandomInt(0, 6)];
          ctx.fillRect(x + i, y + j, 4, 4);
        }
      }
    }
  };

  const handleMouseDown = (e) => {
    const data = {
      userId: user._id,
      roomCode: roomDetails?.roomCode,
      x: e.clientX,
      y: e.clientY,
      selectedTool: selectedTool,
      selectedColor: selectedColor,
      brushStyle: brushStyle,
      lineWidth: lineWidth,
      eraserWidth: eraserWidth,
      shadowBlur: context.shadowBlur,
      lineJoin: context.lineJoin,
      lineCap: context.lineCap,
    };
    console.log("Data mouse down", roomDetails);
    socket?.emit("collab-mouse-down", data);
    // context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
    } else if (selectedTool === "Brush") {
      setDrawing(true);
      if (brushStyle === 1 || brushStyle === 3) {
        context.beginPath();
        context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      } else if (brushStyle === 2) {
        setPoints([{ x: e.clientX, y: e.clientY }]);
      } else {
        const ctx = canvasRef.current.getContext("2d");
        ctx.fillStyle = selectedColor;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = ctx.lineCap = "round";
        ctx.moveTo(e.clientX, e.clientY);
      }
    } else {
      setDrawing(true);
      console.log("eraser", eraserWidth, context.lineWidth);
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };
  const handleMouseMove = (e) => {
    const data = {
      userId: user._id,
      roomCode: roomDetails?.roomCode,
      x: e.clientX,
      y: e.clientY,
    };
    socket?.emit("collab-mouse-move", data);
    if (!drawing) return;
    if (selectedTool === "Brush") {
      if (brushStyle === 1) {
        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.stroke();
      } else if (brushStyle === 2) {
        setPoints([...points, { x: e.clientX, y: e.clientY }]);
        stroke(offsetPoints(-6));
        stroke(offsetPoints(-4));
        stroke(offsetPoints(-2));
        stroke(points);
        stroke(offsetPoints(2));
        stroke(offsetPoints(4));
        stroke(offsetPoints(6));
      } else if (brushStyle === 3) {
        const ctx = canvasRef.current.getContext("2d");
        drawPixels(ctx, e.clientX, e.clientY);
      } else {
        console.log("brush", context.lineWidth);

        const ctx = canvasRef.current.getContext("2d");
        for (let i = density; i--; ) {
          const radius = 20;
          const offsetX = getRandomInt(-radius, radius);
          const offsetY = getRandomInt(-radius, radius);
          ctx.fillRect(e.clientX + offsetX, e.clientY + offsetY, 1, 1);
        }
      }
    } else {
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
    }
  };

  const handleMouseUp = (e) => {
    const data = { userId: user._id, roomCode: roomDetails?.roomCode };
    socket?.emit("collab-mouse-up", data);
    setDrawing(false);
    context.closePath();
    saveCanvasState();
    if (selectedTool === "Brush") {
      if (brushStyle === 2) {
        setPoints([]);
      }
    }
  };

  /************************** Virtual Canvas Events *****************************/

  const handleVirtualMouseDown = (e) => {
    console.log("vmD");
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
    if (selectedTool !== "UploadFiles") {
      setDrawing(true);
      StartRef.current = { startX: x, startY: y };
    }
  };

  const handleVirtualMouseMove = (e) => {
    console.log("vmM");
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
    console.log("vmU");
    setDrawing(false);
    console.log("Drawing ", drawing);
    console.log("Mouse Up", isCustomizable.current);
    const offCanvas = offCanvasRef.current;
    const virtualCtx = offCanvas.getContext("2d");
    const { e1X, e1Y, e2X, e2Y } = ExtremumRef.current;
    if (isResizing.current) {
      CurrentRef.current = { x: -1, y: -1 };
      isResizing.current = false;
      stillResizing.current = false;
      if (selectedTool === "Line")
        drawLineDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
      else if (selectedTool !== "UploadFiles")
        drawDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
    }
    if (isDragging) {
      setIsDragging(false);
      CurrentRef.current = { x: -1, y: -1 };
      if (selectedTool === "Line")
        drawLineDashedRectangle(e1X, e1Y, e2X, e2Y, virtualCtx);
      else if (selectedTool !== "UploadFiles")
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
      EndRef.current = { endX: 150 + 800, endY: 150 + 400 };
      SwitchToVirtual();
      const offCanvas = offCanvasRef.current;
      const virtualCtx = offCanvas.getContext("2d");
      renderImage(file, virtualCtx);
      addCustomizability(virtualCtx);
    } else {
      switchToMainCanvas();
    }
  };

  const renderImage = async (file, ctx) => {
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
  };

  const renderImageOnMainCanvas = async (file, ctx) => {
    if (file) {
      clearVirtualCanvas();

      const reader = new FileReader();
      const { startX, startY } = StartRef.current;

      await new Promise((resolve, reject) => {
        reader.onload = function (e) {
          const image = new Image();
          image.src = e.target.result;

          image.onload = function () {
            ctx.drawImage(image, startX, startY, 800, 400);
            resolve(); // Resolve the Promise when the image has loaded
          };
        };

        reader.readAsDataURL(file);
      });

      // After the image has been loaded and drawn, you can save the canvas state
      saveCanvasState();
    }
  };

  /**********************************Collab logics ***************************************/
  const updateRoomDetails = useCallback(
    (userDetails) => {
      if (user._id !== userDetails.userId) {
        setCollabUsers((prevCollabUsers) =>
          new Map(prevCollabUsers).set(
            userDetails.userId,
            userDetails.drawingSettings
          )
        );
      }
    },
    [collabUsers, roomDetails, user, setCollabUsers]
  );

  /********************************Collaborators incoming event handlers ************* */
  const sharedMouseDown = useCallback(
    (data) => {
      var {
        userId,
        x,
        y,
        selectedTool,
        lineWidth,
        eraserWidth,
        selectedColor,
        brushStyle,
        lineJoin,
        lineCap,
        shadowBlur,
      } = data;
      if (userId === user._id) return;
      if (selectedTool === "Eraser") {
        selectedColor = "white";
        lineWidth = eraserWidth;
      }
      console.log("Data mouse down", data);
      const object = {
        ...userObject,
        userId: userId,
        selectedTool: selectedTool,
        selectedColor: selectedColor,
        brushStyle: brushStyle,
        lineJoin: lineJoin,
        lineCap: lineCap,
        shadowBlur: shadowBlur,
        lineWidth: lineWidth,
        eraserWidth: eraserWidth,
        // drawing: true,
        // startX: x,
        // startY: y,
      };

      collabUsers.set(userId, object);
      console.log(
        "for objecting ",
        userObject,
        object,
        collabUsers.get(userId)
      );
      // console.log("collabUsers", collabUsers);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      console.log("Mouse Down selectedTool", selectedTool);
      if (selectedTool === "PaintBucket") {
        const imgData = context.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const floodFill = new FloodFill(imgData);
        floodFill.fill(selectedColor, x, y, 0);
        context.putImageData(floodFill.imageData, 0, 0);
      } else {
        var coluser = collabUsers.get(userId);
        coluser = { ...coluser, drawing: true };
        collabUsers.set(userId, coluser);
        context.beginPath();
        context.moveTo(x, y);
        context.lineWidth = lineWidth;
      }
    },
    [collabUsers]
  );

  const sharedMouseMove = useCallback(
    (data) => {
      const { userId, x, y } = data;
      if (userId === user._id) return;
      const coluser = collabUsers.get(userId);
      // console.log("User", user, userId);
      // console.log("collab", collabUsers);
      const drawing = coluser.drawing;
      // if (drawing) console.log("drawing");
      if (drawing === false) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      // console.log("moving");
      context.strokeStyle = coluser.selectedColor;
      context.lineTo(x, y);
      context.stroke();
    },
    [collabUsers]
  );

  const sharedMouseUp = useCallback(
    (data) => {
      const { userId } = data;
      const canvas = canvasRef.current;
      console.log("Mousee up event");
      var drawingSettings = collabUsers.get(userId);
      console.log("drawingSettings in mouse up", drawingSettings);
      drawingSettings = { ...drawingSettings, drawing: false };
      setCollabUsers((prevCollabUsers) =>
        new Map(prevCollabUsers).set(userId, drawingSettings)
      );
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.closePath();
      console.log("Mouse up");
      saveCanvasState();
      console.log("Saved canvas state");
    },
    [collabUsers, saveCanvasState]
  );

  console.log("Mouse-up", collabUsers);

  useEffect(() => {
    socket?.on("collab-mouse-down", (data) => {
      console.log("collab mouse down");
      sharedMouseDown(data);
    });
    socket?.on("collab-mouse-move", (data) => {
      sharedMouseMove(data);
    });
    socket?.on("collab-mouse-up", (data) => {
      sharedMouseUp(data);
    });
    socket?.on("collab-user-joined", (userDetails) => {
      updateRoomDetails(userDetails);
    });
    socket?.on("collab-room-created", (room) => {
      console.log("User details room creating", room);
      setRoomDetails(room);
      setCollabUsers((prevCollabUsers) =>
        new Map(prevCollabUsers).set(
          user._id,
          room.collaborators[0].drawingSettings
        )
      );
    });
    socket?.on("collab-room-leave", (data) => {
      const updatedCollaborators = roomDetails.collaborators.filter(
        (collaborator) => collaborator.userId !== data.userId
      );
      setRoomDetails([{ ...roomDetails, collaborators: updatedCollaborators }]);
    });
    return () => {
      socket?.off("collab-mouse-down");
      socket?.off("collab-mouse-move");
      socket?.off("collab-mouse-up");
      socket?.off("collab-room-leave");
    };
  }, [
    socket,
    sharedMouseDown,
    sharedMouseMove,
    sharedMouseUp,
    setRoomDetails,
    roomDetails,
    setCollabUsers,
    updateRoomDetails,
    user,
  ]);

  return progress ? (
    <CustomBackdrop showProgress={progress} />
  ) : (
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
        <Tools
          setIsOpen={setIsOpen}
          selectFile={selectFile}
          setBrushStyle={setBrushStyle}
        />
        <ShapesMenu SwitchToVirtual={SwitchToVirtual} />
        <ColorPalette />

        <UndoRedo isOpen={isOpen} redrawCanvas={redrawCanvas} />
      </Box>
      <SavingAndSocialMenu
        handleOpenModal={handleOpenModal}
        downloadCanvasImage={downloadCanvasImage}
        reSaveCanvas={reSaveCanvas}
        navigateToGallery={navigateToGallery}
      />
      <CanvasNameModal open={isModalOpen} onClose={handleCloseModal} />
      <canvas
        className={classes[selectedTool]}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ overflow: "hidden", margin: 0 }}
      />
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
      <div style={{ overflow: "hidden" }}>
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
            overflowY: "hidden",
            margin: 0,
          }}
          onMouseDown={handleVirtualMouseDown}
          onMouseMove={handleVirtualMouseMove}
          onMouseUp={handleVirtualMouseUp}
        />
      </div>
      {error && <ErrorToast message={error} setError={setError} />}
      {success && <SuccessToast message={success} setSuccess={setSuccess} />}
    </div>
  );
}

export default DrawingCanvas;
