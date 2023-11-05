import { joinRoom } from "./socketConnection";

const onHostingRoom = (
  room,
  setHostRoomCode,
  setRoomDetails,
  setIsUserJoined,
  roomDetails,
  navigate
) => {
  setRoomDetails(room);
  const { roomCode, roomCreator } = room;
  //   console.log("Hosting room with roomCode: " + roomCode, roomCreator);
  setHostRoomCode({ host: roomCreator.userName, roomCode: roomCode });
  joinRoom(
    roomCode,
    room.Creater,
    setIsUserJoined,
    setRoomDetails,
    roomDetails,
    navigate
  );
};

const onJoiningRoom = (userData, roomDetails, setRoomDetails) => {
  console.log("injoinroomhandle", roomDetails);

  setRoomDetails({
    ...roomDetails,
    participants: [...roomDetails.participants, userData],
  });
};

const sendRoomMessage = (message, chats, setChats) => {
  setChats([...chats, message]);
};

module.exports = { onHostingRoom, onJoiningRoom, sendRoomMessage };
