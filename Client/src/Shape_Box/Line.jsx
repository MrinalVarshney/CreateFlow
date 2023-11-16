import React from 'react'
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import "./Styles.css"
import { useDrawingTools } from '../Context/DrawingToolsContext';
import { useUserAndChats } from '../Context/userAndChatsProvider';

const Line = () => {
  const {setSelectedTool} = useDrawingTools()
  const { Socket, roomDetails,playingGameRef } = useUserAndChats();
  const socket = Socket.current;

  const handleClick = (e) =>{
    e.stopPropagation();
    e.preventDefault();
    setSelectedTool("Line")
    if(!playingGameRef.current) return
    const roomCode = roomDetails.roomCode;
    const data = {
      roomCode,
      tool: "Line",
    };
    socket?.emit("tool-change", data);
    
  }
  return (
    <div className="shapes">
      <ShowChartRoundedIcon onClick={handleClick}/>
    </div>
  )
}

export default Line
