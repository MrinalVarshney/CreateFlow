import { joinRoom } from "./socketConnection";

export const onHostingRoom = ( room, setHostRoomCode, setRoomDetails,navigate,roomDetails,setIsUserJoined) => {
  setRoomDetails(room);
  const { roomCode, roomCreator } = room;
  //   console.log("Hosting room with roomCode: " + roomCode, roomCreator);
  setHostRoomCode({ host: roomCreator.userName, roomCode: roomCode });
  joinRoom(roomCode,roomCreator,setIsUserJoined,setRoomDetails,roomDetails,navigate)
};

export const onJoiningRoom = (userData, roomDetails, setRoomDetails) => {
  console.log("injoinroomhandle", userData);
  console.log(roomDetails)
  if(roomDetails){
    const updatedRoom = roomDetails.participants.push(userData)
    console.log(updatedRoom)
    setRoomDetails(updatedRoom)
  }

};

export const sendRoomMessage = (message, chats, setChats) => {
  setChats([...chats, message]);
};


