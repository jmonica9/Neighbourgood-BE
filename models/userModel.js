const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    accountsFollowing: { type: Array },
    listingsUser: { type: Array },
    listingsOngoing: { type: Array },
    listingsWatchlist: { type: Array },
    reviews: { type: Array },
    appointments: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);