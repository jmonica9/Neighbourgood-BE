const BaseController = require("./baseController");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const passportLocal = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
require("../config/passportConfig")(passport);

//JWT token
const maxAge = 3 * 24 * 60 * 60;
//3 days
const createToken = (id) => {
  //inbuilt methods inside
  return jwt.sign({ id }, "secretcode", {
    expiresIn: maxAge,
  });
};

class AuthController extends BaseController {
  constructor(model, locationModel) {
    super(model);
    this.locationModel = locationModel;
  }

  register = async (req, res, next) => {
    console.log("register route!", req.body);
    // const location = await this.locationModel.create({
    //   location: req.body.location,
    // });
    // console.log("location created?:", location);
    this.model.findOne({ username: req.body.username }, async (err, doc) => {
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
        // const newUser = new this.model({
        //   name: req.body.username,
        //   password: hashedPassword,
        // });
        // await newUser.save();

        //mongoose docs official
        const user = await this.model.findOneAndUpdate(
          {
            username: req.body.username,
            email: req.body.email,
            location: req.body.location,
          },
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
  };

  login = async (req, res, next) => {
    console.log("login req body", req.body);
    console.log("login route!");
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json;
      }
      if (!user) {
        return res.send("No User Exists");
      } else if (user) {
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
          return res.send(req.user);
        });
      }
    })(req, res, next);
  };

  logout = async (req, res) => {
    console.log("logout route!");
    req.logout(function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.clearCookie("jwt").clearCookie("connect.sid");
      req.session.destroy(function (err) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        console.log("logout!");
        return res.json("cookies cleared and log out!");
      });
    });
  };

  //test JWT token from cookie
  getJwtUser = async (req, res, next) => {
    // console.log("jwt route protected", req.user);
    // passport.authenticate("jwt", { session: false }, (req, res, next) => {
    //   console.log(req.user, "hi");
    //   return res.json(req.user);
    // });
    //another method
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json;
      }
      if (!user) {
        return res.send("No User Exists");
      }
      if (user) {
        console.log(req);
        console.log(req.cookies);
        console.log("jwt route protected");
        res.json(req.user);
      }
    })(req, res, next);
  };
}

module.exports = AuthController;

// app.post("/login", (req, res, next) => {
//   console.log("login req body", req.body);
//   console.log("login route!");
//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json;
//     }
//     if (!user) {
//       return res.send("No User Exists");
//     } else if (user) {
//       console.log("authenticated");
//       req.logIn(user, (err) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).json;
//         }
//         // Successfully Authenticated
//         // create token for the logged in user
//         const token = createToken(req.user._id);
//         //send cookie to client browser
//         res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
//         console.log(req.user, "req user");

//         console.log(
//           {
//             success: true,
//             token: "JWT " + token,
//             user: req.user,
//           },
//           "response data"
//         );
//         return res.send(req.user.username);
//         /*other way to create token & send status*/
//         //   // const token = jwt.sign({ id: userInfo.id }, jwtSecret.secret, {
//         //   //   expiresIn: 60 * 24,
//         //   // });
//         // res.status(200).json({ user: user._id, status: true });
//         //     return res
//         //       .status(200)
//         //       .send({ auth: true, token, message: "User found and logged in" });
//       });
//     }
//   })(req, res, next);
// });

// app.post("/register", (req, res) => {
//   console.log("register route!", req.body);
//   this.model.findOne({ username: req.body.username }, async (err, doc) => {
//     if (err) {
//       console.log(err);
//       res.sendStatus(500);
//       return;
//     }
//     if (doc) {
//       console.log(doc);
//       return res.send("User Already Exists");
//     }
//     if (!doc) {
//       console.log("doc dont exist");
//       const hashedPassword = await bcrypt.hash(req.body.password, 10);
//       //youtube way that doesn't work
//       // const newUser = new this.model({
//       //   name: req.body.username,
//       //   password: hashedPassword,
//       // });
//       // await newUser.save();

//       //mongoose docs official
//       const user = await this.model.findOneAndUpdate(
//         { username: req.body.username },
//         { $setOnInsert: { password: hashedPassword } },
//         { upsert: true, new: true }
//       );
//       // //create token for the logged in user
//       // const token = createToken(user._id);
//       // //send cookie
//       // res.cookie("jwt", token, {
//       //   withCredentials: true,
//       //   httpOnly: false,
//       //   maxAge: maxAge * 1000,
//       // });
//       // console.log("made cookie");
//       return res.json(user);
//       // res.send("User Created");
//     }
//   });
// });

// app.get("/myUser", (req, res) => {
//   //req.user only exist when u activate a passport
//   console.log(req.user, "req user");
//   res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
// });

// //test JWT token from cookie
// app.get(
//   "/jwtUser",
//   // (req, res) => {
//   //   console.log("jwt route protected", req.user);
//   //   passport.authenticate("jwt", { session: false }, (req, res, next) => {
//   //     console.log(req.user, "hi");
//   //     return res.json(req.user);
//   //   });
//   // }
//   //no req.user
//   passport.authenticate("jwt", { session: false }),
//   (req, res, next) => {
//     console.log(req);
//     console.log(req.cookies);
//     console.log("jwt route protected");
//     res.json(req.user);
//   }

//   //handle error gracefully if the token is expired
// );

// app.get("/logout", function (req, res) {
//   req.logout(function (err) {
//     if (err) {
//       console.log(err);
//       res.sendStatus(500);
//       return;
//     }
//     res.clearCookie("jwt").clearCookie("connect.sid");
//     req.session.destroy(function (err) {
//       res.json("cookies cleared and log out!");
//       console.log("logout!");
//     });
//   });
// });
