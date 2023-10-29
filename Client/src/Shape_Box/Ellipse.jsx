import React from "react";
import { Icon } from "@iconify/react";
import "./Styles.css";
import { useDrawingTools } from "../Context/DrawingToolsContext";

const Ellipse = () => {
  const { setSelectedTool } = useDrawingTools();
    const handleClick = () => {
        setSelectedTool("Ellipse");
    };
  return (
    <div className="shapes" >
      <Icon icon="mdi:ellipse-outline" width="25" height="25" onClick={handleClick}/>
    </div>
  );
};

export default Ellipse;
