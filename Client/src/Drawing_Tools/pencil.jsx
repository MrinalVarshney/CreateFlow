import React from "react";
import { useDrawingTools } from "../Context/DrawingToolsContext";

const Pencil = () => {
  const { setSelectedTool } = useDrawingTools();
  function handlePencil() {
    setSelectedTool("pencil");
  }
  return (
    <div>
      <button onClick={handlePencil}>Pencil</button>
    </div>
  );
};

export default Pencil;
