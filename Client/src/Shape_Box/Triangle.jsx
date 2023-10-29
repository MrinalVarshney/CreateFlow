import React from "react";
import ChangeHistoryRoundedIcon from "@mui/icons-material/ChangeHistoryRounded";
import "./Styles.css"
import { useDrawingTools } from "../Context/DrawingToolsContext";

const Triangle = () => {
  const { setSelectedTool } = useDrawingTools();
  const handleClick = () => {
    setSelectedTool("Triangle");
  };
  return (
    <div className="shapes">
      <ChangeHistoryRoundedIcon onClick={handleClick} />
    </div>
  );
};

export default Triangle;
