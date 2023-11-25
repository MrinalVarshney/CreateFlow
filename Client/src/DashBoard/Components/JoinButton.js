import React, { useState,useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Container,
} from '@mui/material'
import './JoinRoomComponent.css';
import { useUserAndChats } from '../../Context/userAndChatsProvider';
import {useNavigate} from "react-router-dom"

const JoinRoomComponent = () => {
  const [roomCode, setRoomCode] = useState(''); 
  const {Socket,user, setRoomDetails,isCollaborating,collabUsers,setCollabUsers} = useUserAndChats();

  const navigate = useNavigate();

  const socket = Socket.current;
  const handleJoinRoom = () => {
    // Handle join room logic here
    console.log('Joining room with code:', roomCode);
    const data= {
        userId: user._id,
        userName: user.username,
        roomCode: roomCode
    }
    socket?.emit("collab-room-join",data)
    setRoomCode('')
  };

  useEffect(()=>{
    socket?.on("collab-room-join-details",(room)=>{
        setRoomDetails(room)
        setCollabUsers(new Map(room.collaborators.map((user)=>[user.userId,user.drawingSettings])))
        isCollaborating.current = true;
        navigate("/canvas")
    })
  },[socket])


  return (
    <Container className="join-room-container">
      <Typography variant="h5" className="join-room-title">
        Join Collaboration Room
      </Typography>
      <TextField
        label="Room Code"
        variant="outlined"
        className="join-room-input"
        sx={{border:"2px solid white",color:'white',backgroundColor:'whitesmoke',marginBottom:"10px"}}
        fullWidth
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <Button
        variant="contained"
        className="join-room-button"
        onClick={handleJoinRoom}
      >
        Join
      </Button>
    </Container>
  );
};

export default JoinRoomComponent;
