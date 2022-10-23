require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const app = express();
const httpServer = createServer(app);
const http = require("http").Server(app);
const connectDB = require("./config/database");
connectDB();
//passport auth
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");

//import routers
const UserRouter = require("./routers/userRouter");
const ListingRouter = require("./routers/listingRouter");
const AuthRouter = require("./routers/authRouter");
const ChatRouter = require("./routers/chatRouter");
const LocationRouter = require("./routers/locationRouter");
const ReviewRouter = require("./routers/reviewRouter");
//import controllers
const UserController = require("./controllers/userController");
const ListingController = require("./controllers/listingController");
const AuthController = require("./controllers/authController");
const ChatController = require("./controllers/chatController");
const LocationController = require("./controllers/locationController");
const ReviewController = require("./controllers/reviewController");
//import models here
const userModel = require("./models/userModel");
const listingModel = require("./models/listingModel");
const chatModel = require("./models/chatModel");
const locationModel = require("./models/locationModel");
const reviewModel = require("./models/reviewModel");
const { create } = require("./models/userModel");

// Middleware
// app.use(express.json());
// Make sure you add these two lines below
app.use(bodyParser.json({ limit: 52428800, extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
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
const userController = new UserController(userModel, listingModel);
const listingController = new ListingController(listingModel, userModel);
const authController = new AuthController(userModel, locationModel);
const chatController = new ChatController(chatModel, listingModel);
const locationController = new LocationController(locationModel);
const reviewController = new ReviewController(
  reviewModel,
  listingModel,
  userModel
);
//initialise routers here - insert JWT here if need later
const userRouter = new UserRouter(userController).routes();
const listingRouter = new ListingRouter(listingController).routes();
const authRouter = new AuthRouter(authController).routes();
const chatRouter = new ChatRouter(chatController).routes();
const locationRouter = new LocationRouter(locationController).routes();
const reviewRouter = new ReviewRouter(reviewController).routes();

// app.use(cors("*"));

//initialise routes here
app.use("/users", userRouter);
app.use("/listing", listingRouter);
app.use("/auth", authRouter);
app.use("/chatroom", chatRouter);
app.use("/location", locationRouter);
app.use("/review", reviewRouter);

//----------------------------------------- END OF ROUTES---------------------------------------------------

const socketIO = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
  },
});

require("./sockets")(socketIO);

//----------------------------------------- END OF ROUTES---------------------------------------------------

httpServer.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
