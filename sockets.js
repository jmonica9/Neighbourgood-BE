module.exports = (socketIO) => {
  socketIO.on("connection", (socket) => {
    console.log("connected");

    socket.on("disconnect", () => {
      console.log("🔥: A user disconnected");
    });

    socket.on("user", (data) => {
      console.log("user log in BE received,emitting data to FE ", data);
      socket.emit("user", data);
    });
  });
};
