import { joinRoom } from "./socketConnection";

export const onHostingRoom = (
  room,
  setHostRoomCode,
  setRoomDetails,
  navigate,
  roomDetails,
  setIsUserJoined
) => {
  setRoomDetails(room);
  const { roomCode, roomCreator } = room;
  //   console.log("Hosting room with roomCode: " + roomCode, roomCreator);
  setHostRoomCode({ host: roomCreator.userName, roomCode: roomCode });
  // joinRoom(roomCode,roomCreator,setIsUserJoined,setRoomDetails,roomDetails,navigate)
  return roomCode;
};

export const onJoiningRoom = (userData, roomDetails, setRoomDetails) => {
  console.log("injoinroomhandle", userData);
  console.log(roomDetails);
  if (roomDetails) {
    const participants = roomDetails.participants.push(userData);
    const updatedRoom = { ...roomDetails, participants };
    console.log(updatedRoom);
    setRoomDetails(updatedRoom);
  }
};
