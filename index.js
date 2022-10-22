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
const PaymentRouter = require("./routers/paymentRouter");
const PostsRouter = require("./routers/postRouter");

//import controllers
const UserController = require("./controllers/userController");
const ListingController = require("./controllers/listingController");
const AuthController = require("./controllers/authController");
const ChatController = require("./controllers/chatController");
const PaymentController = require("./controllers/paymentController");

//import models here
const userModel = require("./models/userModel");
const listingModel = require("./models/listingModel");
const chatModel = require("./models/chatModel");
const paymentModel = require("./models/paymentModel");
const postModel = require("./models/postModel");
const PostController = require("./controllers/postController");
const PostRouter = require("./routers/postRouter");

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
const authController = new AuthController(userModel);
const chatController = new ChatController(chatModel, listingModel);
const paymentController = new PaymentController(paymentModel, listingModel);
const postController = new PostController(postModel);

//initialise routers here - insert JWT here if need later
const userRouter = new UserRouter(userController).routes();
const listingRouter = new ListingRouter(listingController).routes();
const authRouter = new AuthRouter(authController).routes();
const chatRouter = new ChatRouter(chatController).routes();
const paymentRouter = new PaymentRouter(paymentController).routes();
const postRouter = new PostRouter(postController).routes();

// app.use(cors("*"));

//initialise routes here
app.use("/users", userRouter);
app.use("/listing", listingRouter);
app.use("/auth", authRouter);
app.use("/chatroom", chatRouter);
app.use("/payment", paymentRouter);
app.use("/post", postRouter);

//----------------------------------------- END OF ROUTES---------------------------------------------------

const socketIO = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
  },
});

require("./sockets")(socketIO);

//----------------------------------------- END OF SOCKET---------------------------------------------------

httpServer.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
