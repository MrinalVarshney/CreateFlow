import Crop75SharpIcon from "@mui/icons-material/Crop75Sharp";
import "./Styles.css";
import { useDrawingTools } from "../Context/DrawingToolsContext";
import { useUserAndChats } from "../Context/userAndChatsProvider";

const Rectangle = () => {
  const { setSelectedTool } = useDrawingTools();
  const { Socket, roomDetails, playingGameRef } = useUserAndChats();
  const socket = Socket.current;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTool("Rectangle");
    if (!playingGameRef.current) return;
    const roomCode = roomDetails.roomCode;
    const data = {
      roomCode,
      tool: "Rectangle",
    };
    socket?.emit("tool-change", data);
    
  };

  return (
    <div className="shapes">
      <Crop75SharpIcon onClick={handleClick} />
    </div>
  );
};

export default Rectangle;
