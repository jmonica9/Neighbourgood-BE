const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const secret = "secretcode";
const passport = require("passport");

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) return err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) return err;
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );

  //check for session
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        username: user.username,
      };
      cb(err, userInformation);
    });
  });
};
const cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};
//check JWT token here instead
//from front-end you send the JWT token in the request header
// jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: secret,
  passReqToCallback: true, //<= Important, so that the verify function can accept the req param ie verify(req,payload,done)
  //so that ur req.user can be accurately recorded bc using cookies will not be using passport sessions
};

passport.use(
  "jwt",
  new JWTStrategy(options, async (req, jwt_payload, done) => {
    try {
      console.log(jwt_payload);
      let user = await User.findOne({
        _id: jwt_payload.id,
        // where: {
        //   _id: jwt_payload.id,
        // },
      });

      if (user) {
        req.user = user; //<= so that any route that has the passport.authenticate("jwt", {session: false}) middleware will receive req.user upon successful authentication
        console.log("User found in DB", user);
        return done(null, user);
      } else {
        console.log("User not in db");
        return done(null, false);
      }
    } catch (err) {
      return done(err);
    }
  })
);
