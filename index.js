require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const app = express();
const connectDB = require("./config/database");
connectDB();
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");

//import routers
const UserRouter = require("./routers/userRouter");
//import controllers
const UserController = require("./controllers/userController");
//import models here
const userModel = require("./models/userModel");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
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
//initialise routers here - insert JWT here if need later
const userRouter = new UserRouter(userController).routes();

app.use(express.json());
// app.use(cors("*"));

//initialise routes here
app.use("/users", userRouter);

// Routes
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send(req.user);
        console.log(req.user);
      });
    }
  })(req, res, next);
});

app.post("/register", (req, res) => {
  console.log("register route!", req.body);
  userModel.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) {
      console.log(doc);
      res.send("User Already Exists");
    }
    if (!doc) {
      console.log("doc dont exist");
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      //youtube way that doesn't work
      // const newUser = new userModel({
      //   name: req.body.username,
      //   password: hashedPassword,
      // });
      // await newUser.save();

      //mongoose docs official
      const user = await userModel.findOneAndUpdate(
        { username: req.body.username },
        { $setOnInsert: { password: hashedPassword } },
        { upsert: true, new: true }
      );
      return res.json(user);
      // res.send("User Created");
    }
  });
});

//----------------------------------------- END OF ROUTES---------------------------------------------------

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
