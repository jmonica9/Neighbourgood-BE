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
//import controllers
const UserController = require("./controllers/userController");
const ListingController = require("./controllers/listingController");
const AuthController = require("./controllers/authController");
//import models here
const userModel = require("./models/userModel");
const listingModel = require("./models/listingModel");
const { create } = require("./models/userModel");

// Middleware
app.use(express.json());
// Make sure you add these two lines below
app.use(bodyParser.json({ limit: "16mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "16mb", extended: true }));
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
const authController = new AuthController(userModel);
//initialise routers here - insert JWT here if need later
const userRouter = new UserRouter(userController).routes();
const listingRouter = new ListingRouter(listingController).routes();
const authRouter = new AuthRouter(authController).routes();
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

require("./sockets")(socketIO);

//----------------------------------------- END OF ROUTES---------------------------------------------------

httpServer.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
