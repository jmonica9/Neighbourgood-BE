require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const app = express();
const httpServer = createServer(app);
const connectDB = require("./config/database");
connectDB();
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

//import routers
const UserRouter = require("./routers/userRouter");
const ListingRouter = require("./routers/listingRouter");
const AuthRouter = require("./routers/authRouter");
//import controllers
const UserController = require("./controllers/userController");
const ListingController = require("./controllers/listingController");
const AuthController = require("./controllers/authController");
//import models here
const userModel = require("./models/userModel");
const { create } = require("./models/userModel");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3001", // <-- location of the react app were connecting to
    credentials: true,
  })
);

app.use(
  session({
    //take cookie/session unreadable
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passportConfig")(passport);

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

//initialise controllers here
const userController = new UserController(userModel);
const listingController = new ListingController(listingModel, userModel);
const authController = new AuthController(userModel);
//initialise routers here - insert JWT here if need later
const userRouter = new UserRouter(userController).routes();
const listingRouter = new ListingRouter(listingController).routes();
const authRouter = new AuthRouter(authController).routes();
app.use(express.json());
// app.use(cors("*"));

//initialise routes here
app.use("/users", userRouter);
app.use("/listing", listingRouter);
app.use("/auth", authRouter);

//----------------------------------------- END OF ROUTES---------------------------------------------------

const socketIO = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
  },
});

socketIO.on("connection", (socket) => {
  console.log("connected");
  //once backend receives a "join_room" message, then join (data.room), i.e. lobbyId
  socket.on("testing", (data) => {
    socket.emit("testing_received", data);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Http listening on ${PORT}`);
});
