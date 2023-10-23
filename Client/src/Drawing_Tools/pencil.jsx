import React from "react";
import { useDrawingTools } from "../Context/DrawingToolsContext";
import CreateIcon from "@mui/icons-material/Create";

const Pencil = () => {
  const { setSelectedTool } = useDrawingTools();
  function handlePencil() {
    setSelectedTool("pencil");
  }
  return (
    <div style={{display:"grid", justifyContent:"center"}}>
      <CreateIcon onClick={handlePencil} />
    </div>
  );
};

export default Pencil;
