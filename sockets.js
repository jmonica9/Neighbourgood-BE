module.exports = (socketIO) => {
  socketIO.on("connection", (socket) => {
    console.log("connected");
    //once backend receives a "join_room" message, then join (data.room), i.e. lobbyId
    socket.on("testing", (data) => {
      socket.emit("testing_received", data);
    });

    socket.on("disconnect", () => {
      console.log("🔥: A user disconnected");
    });

    socket.on("user", (data) => {
      console.log("user log in BE received,emitting data to FE ", data);
      socket.emit("user", data);
    });
  });
};
