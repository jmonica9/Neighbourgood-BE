const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    userPic: { type: String },
    postTitle: { type: String, required: true },
    cloudimg: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    postCategories: { type: Array },
    postDescription: { type: String, required: true },
    postUsersLiked: { type: Array },
    postUserComments: { type: Array },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
