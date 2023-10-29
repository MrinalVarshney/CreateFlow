import React from "react";
import { Icon } from "@iconify/react";
import "./Styles.css";
import { useDrawingTools } from "../Context/DrawingToolsContext";

const Pentagon = () => {
  const { setSelectedTool } = useDrawingTools();
    const handleClick = () => {
        setSelectedTool("Pentagon");
    };
  return (
    <div className="shapes" >
      <Icon icon="material-symbols:pentagon-outline" width="25" height="25" onClick={handleClick}/>
    </div>
  );
};

export default Pentagon;
