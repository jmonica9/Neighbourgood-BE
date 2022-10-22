module.exports = (socketIO) => {
  socketIO.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("disconnect", () => {
      console.log("🔥: A user disconnected");
    });

    socket.on("user", (data) => {
      console.log("user log in BE received,emitting data to FE ", data);
      socket.emit("user", data);
    });

    socket.on("user updated", () => {
      console.log("userinfo recieved");
      socket.emit("updating user info");
    });

    /* chatroom sockets stuff */
    // join a room
    socket.on("join_room", (data) => {
      socket.join(data.room);
      console.log(socket.rooms);
    });

    socket.on("chatroom_updated", (data) => {
      console.log("frontend sent");
      console.log(data.room);
      socketIO.in(data.room).emit("refresh_chatroom", data);
    });

    socket.on("listing updated", () => {
      console.log("listinginfo recieved");
      socket.emit("updating listing info");
    });
  });
};
