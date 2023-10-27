import React from "react";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import RedoRoundedIcon from "@mui/icons-material/RedoRounded";
import { useHistory } from "../Context/History";
import { Box } from "@mui/material";
import "./undoRedoStyles.css";

const UndoRedo = ({ redrawCanvas, isOpen }) => {
  const { undo, redo } = useHistory();
  const handleUndo = () => {
    const data = undo();
    if (data) {
      redrawCanvas(data);
    }
  };
  const handleRedo = () => {
    const data = redo();
    if (data) {
      redrawCanvas(data);
    }
  };

  return (
    <Box className={`undo-redo-container ${isOpen ? "toolOpen" : ""}`}>
      <UndoRoundedIcon
        onClick={handleUndo}
        className="undo-redo-button"
        style={{ height: "50", width: "50" }}
      />
      <RedoRoundedIcon
        onClick={handleRedo}
        className="undo-redo-button"
        style={{ height: "50", width: "50" }}
      />
    </Box>
  );
};

export default UndoRedo;
