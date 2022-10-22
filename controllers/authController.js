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
  constructor(model) {
    super(model);
  }

  register = async (req, res, next) => {
    // console.log("register route!", req.body);
    this.model.findOne({ username: req.body.username }, async (err, doc) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      if (doc) {
        // console.log(doc);
        return res.send("User Already Exists");
      }
      if (!doc) {
        // console.log("doc dont exist");
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        //mongoose docs official
        const user = await this.model.findOneAndUpdate(
          { username: req.body.username, email: req.body.email },
          { $setOnInsert: { password: hashedPassword } },
          { upsert: true, new: true }
        );

        return res.json(user);
        // res.send("User Created");
      }
    });
  };

  login = async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        // console.log(err);
        return res.status(500).json;
      }
      if (!user) {
        return res.send("No User Exists");
      } else if (user) {
        // console.log("authenticated");
        req.logIn(user, (err) => {
          if (err) {
            // console.log(err);
            return res.status(500).json;
          }
          // Successfully Authenticated
          // create token for the logged in user
          const token = createToken(req.user._id);
          //send cookie to client browser
          res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });

          // console.log(
          //   {
          //     success: true,
          //     token: "JWT " + token,
          //     user: req.user,
          //   },
          //   "response data"
          // );
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
        // console.log(req);
        // console.log(req.cookies);
        // console.log("jwt route protected");
        res.json(req.user);
      }
    })(req, res, next);
  };
}

module.exports = AuthController;
