const authSocket = require("./middlewares/authSocket");
const roomCreateHandler = require("./socketHandlers/PrivateGameSpecificEvents/roomCreateHandler");
const roomJoinHandler = require("./socketHandlers/PrivateGameSpecificEvents/roomJoinHandler");
const startGameHandler = require("./socketHandlers/CommonEvents/startGameHandler");
const endGameHandler = require("./socketHandlers/CommonEvents/endGameHandler");
const roomLeaveHandler = require("./socketHandlers/CommonEvents/roomLeaveHandler");
const serverStore = require("./serverStore");
const newConnectionHandler = require("./socketHandlers/CommonEvents/newConnectionHandler");
const handlePlayRandom = require("./socketHandlers/RandomRoomSpecificEvents/handlePlayRandom");
const matchCancelHandler = require("./socketHandlers/PrivateGameSpecificEvents/matchCancelHandler");
const { v4: uuidv4 } = require("uuid");
const handleCollabMouseDown = require("./socketHandlers/CollaborationEvents/handleCollabMouseDown");
const handleCollabMouseMove = require("./socketHandlers/CollaborationEvents/handleCollabMouseMove");
const handleCollabMouseUp = require("./socketHandlers/CollaborationEvents/handleCollabMouseUp");
const handleCollabRoomCreate = require("./socketHandlers/CollaborationEvents/handleCollabRoomCreate");
const handleCollabRoomDelete = require("./socketHandlers/CollaborationEvents/handleCollabRoomDelete");
const handleCollabRoomJoin = require("./socketHandlers/CollaborationEvents/handleCollabRoomJoin");
const handleCollabRoomLeave = require("./socketHandlers/CollaborationEvents/handleCollabRoomLeave");

const registerSocketServer = (server) => {
  server.listen(5002, () => {
    console.log("Socket server is listening on port 5002");
  });

  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.use((socket, next) => {
    authSocket(socket, next);
  });

  serverStore.setSocketServerInstance(io);

  io.on("connection", (socket) => {
    console.log("new user connected with id: ", socket.id);

    socket.on("connect-user", (userId, callback) => {
      console.log("request cams")
      newConnectionHandler(socket, userId, callback);
    });

    socket.on("play-random", (data) => {
      console.log("play-random request");
      handlePlayRandom(socket, data);
    });

    socket.on("room-create", (data) => {
      const roomCode = uuidv4();
      socket.join(roomCode);
      roomCreateHandler(socket, data, roomCode);
    });
    socket.on("join-room", (roomCode, data) => {
      roomJoinHandler(socket, roomCode, data);
      socket.join(roomCode);
    });

    socket.on("leave-room", (data) => {
      console.log("User leaving", data);
      roomLeaveHandler(data);
    });

    socket.on("start-game", (data) => {
      console.log("game-started");
      startGameHandler(socket, data);
    });
    socket.on("end-game", (roomCode) => {
      endGameHandler(roomCode);
    });

    socket.on("send-message", (data, roomCode) => {
      io.to(roomCode).emit("new-message", data);
    });

    socket.on("match-cancelled",(roomCode)=>{
      matchCancelHandler(socket,roomCode);
    })

    socket.on("mouse-down", (data) => {
      console.log("mouse-down socket", data);
      io.to(data?.roomCode).emit("mouse-down", data);
    });
    socket.on("mouse-move", (data) => {
      console.log("mouse-move socket", data);
      io.to(data?.roomCode).emit("mouse-move", data);
    });
    socket.on("mouse-up", (roomCode) => {
      console.log("mouse-up");
      io.to(roomCode).emit("mouse-up");
    });
    socket.on("virtual-mouse-down", (data) => {
      console.log("virtual-mouse-down socket");
      io.to(data?.roomCode).emit("virtual-mouse-down", data);
    });
    socket.on("virtual-mouse-move", (data) => {
      // console.log("virtual-mouse-move socket", data);
      io.to(data?.roomCode).emit("virtual-mouse-move", data);
    });
    socket.on("virtual-mouse-up", (data) => {
      io.to(data?.roomCode).emit("virtual-mouse-up", data);
    });
    socket.on("undo", (roomCode) => {
      // console.log("Undo event ");
      io.to(roomCode).emit("undo");
    });
    socket.on("redo", (roomCode) => {
      io.to(roomCode).emit("redo");
    });
    socket.on("color-change", (data) => {
      // console.log(data);
      io.to(data.roomCode).emit("color-change", data.color);
    });
    socket.on("tool-change", (data) => {
      // console.log("Selected tool event");
      io.to(data.roomCode).emit("selected-tool", {
        tool: data.tool,
        width: data.width,
      });
    });
    socket.on("onToolsClick", (data) => {
      io.to(data.roomCode).emit("onToolsClick", data);
    });
    socket.on("wordSelected", (data) => {
      // const usersInRoom = io.sockets.adapter.rooms.get(data.roomCode);
      // console.log("usersInRoom forword ", usersInRoom, data);
      io.to(data.roomCode).emit("word-Selected", data);
    });
    socket.on("reload", (data) => {
      // console.log("rmC", data.roomCode);
      io.to(data.roomCode).emit("reload", data);
    });
    socket.on("setTimer", (data) => {
      io.to(data.roomCode).emit("set-Timer", data);
    });

    socket.on("collaboration-invite",(data)=>{
      handleCollaborationInvite(socket,data);

    })
    socket.on("timer", (roomCode) => {
      io.to(roomCode).emit("timer");
    });
    socket.on("showLeaderBoard", (roomCode) => {
      io.to(roomCode).emit("showLeaderBoard");
    });
    socket.on("guessed", (data) => {
      // console.log("guessed", data);
      io.to(data.roomCode).emit("guessed", data);
    });
    socket.on("restrict-User", (data) => {
      console.log("restrict", data);
      io.to(data.roomCode).emit("restrict", data);
    });
    socket.on("kick", (data) => {
      io.to(data.roomCode).emit("kicked", data);
    });
    socket.on("warn", (data) => {
      io.to(data.roomCode).emit("warn", data);
    });
    socket.on("collab-mouse-down", (data) => {
      console.log("mouse down event")
      handleCollabMouseDown(data);
    });
    socket.on("collab-mouse-move", (data) => {
      // console.log("mouse move event")
      handleCollabMouseMove(data);
    });
    socket.on("collab-mouse-up", (data) => {
      // console.log("mouse up event")
      handleCollabMouseUp(data);
    });
    socket.on("collab-room-create", (data) => {
      console.log("room creation request",data)
      handleCollabRoomCreate(socket, data);
    });
    socket.on("collab-room-join", (data) => {
      handleCollabRoomJoin(socket, data);
    });
    socket.on("collab-room-leave", (data) => {
      handleCollabRoomLeave(data);
    });
  });
};

module.exports = { registerSocketServer };
