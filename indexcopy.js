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
const jwt = require("jsonwebtoken");
// const util = require("util");
// const jwtVerifyAsync = util.promisify(jwt.verify);

//import routers
const UserRouter = require("./routers/userRouter");
//import controllers
const UserController = require("./controllers/userController");
//import models here
const userModel = require("./models/userModel");
const { create } = require("./models/userModel");

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
// app.use(async (req, res, next) => {
//   const token = getToken(req);
//   try {
//     req.auth = await jwtVerifyAsync(token, req.app.get("secretcode"));
//   } catch (err) {
//     throw new Error(err);
//   }
//   next();
// });

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

//initialise controllers here
const userController = new UserController(userModel);
//initialise routers here - insert JWT here if need later
const userRouter = new UserRouter(userController).routes();

app.use(express.json());
// app.use(cors("*"));

//initialise routes here
app.use("/users", userRouter);

//JWT token
const maxAge = 1 * 60;
//3 days
const createToken = (id) => {
  return jwt.sign({ id }, "secretcode", {
    expiresIn: "5s",
  });
};

// Routes
app.post("/login", (req, res, next) => {
  console.log("login req body", req.body);
  console.log("login route!");
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json;
    } else if (!user) return res.send("No User Exists");
    else {
      console.log("authenticated");
      req.logIn(user, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json;
        }
        // Successfully Authenticated
        // create token for the logged in user
        const token = createToken(req.user._id);
        //send cookie to client browser
        res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
        console.log(req.user, "req user");

        console.log(
          {
            success: true,
            token: "JWT " + token,
            user: req.user,
          },
          "response data"
        );
        res.send(req.user.username);
        /*other way to create token & send status*/
        //   // const token = jwt.sign({ id: userInfo.id }, jwtSecret.secret, {
        //   //   expiresIn: 60 * 24,
        //   // });
        // res.status(200).json({ user: user._id, status: true });
        //     return res
        //       .status(200)
        //       .send({ auth: true, token, message: "User found and logged in" });
      });
    }
  })(req, res, next);
});

app.post("/register", (req, res) => {
  console.log("register route!", req.body);
  userModel.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    if (doc) {
      console.log(doc);
      return res.send("User Already Exists");
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
      // //create token for the logged in user
      // const token = createToken(user._id);
      // //send cookie
      // res.cookie("jwt", token, {
      //   withCredentials: true,
      //   httpOnly: false,
      //   maxAge: maxAge * 1000,
      // });
      // console.log("made cookie");
      return res.json(user);
      // res.send("User Created");
    }
  });
});

app.get("/myUser", (req, res) => {
  //req.user only exist when u activate a passport
  console.log(req.user, "req user");
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});

//test JWT token from cookie
// app.get(
//   "/protectedbyjwt",
//   // (req, res) => {
//   //   console.log("jwt route protected", req.user);
//   //   passport.authenticate("jwt", { session: false }, (req, res, next) => {
//   //     console.log(req.user, "hi");
//   //     return res.json(req.user);
//   //   });
//   // }

//   passport.authenticate("jwt", { session: false }, (err, user, info) => {
//     if (err) {
//       return res.send({ success: false, message: "authentication failed" });
//     }
//     console.log(req);
//     console.log(req.cookies);
//     console.log("jwt route protected");
//     res.json(req.user);
//   })
// );

//test JWT token from cookie
app.get(
  "/protectedbyjwt",
  // (req, res) => {
  //   console.log("jwt route protected", req.user);
  //   passport.authenticate("jwt", { session: false }, (req, res, next) => {
  //     console.log(req.user, "hi");
  //     return res.json(req.user);
  //   });
  // }
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    console.log("jwt route protected");
    res.json(req.user);
  }
);

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    res.clearCookie("jwt").clearCookie("connect.sid");
    req.session.destroy(function (err) {
      res.json("cookies cleared and log out!");
      console.log("logout!");
    });
  });
});

//----------------------------------------- END OF ROUTES---------------------------------------------------

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
