import React from 'react'
import Brightness1OutlinedIcon from '@mui/icons-material/Brightness1Outlined';
import "./Styles.css"
import { useDrawingTools } from '../Context/DrawingToolsContext';
import { useUserAndChats } from '../Context/userAndChatsProvider';

const Circle = () => {
  const {Socket,roomDetails,playingGameRef} = useUserAndChats()
  const socket = Socket.current;  
  const {setSelectedTool} = useDrawingTools()
  const handleClick = (e) =>{
    setSelectedTool("Circle")
    if(!playingGameRef.current)return;
    const roomCode = roomDetails.roomCode;
    const data = {
      roomCode, tool:"Circle",
    }
    socket?.emit("tool-change",data);
  }
  return (
    <div className='shapes'>
      <Brightness1OutlinedIcon onClick={handleClick}/>
    </div>
  )
}

export default Circle
