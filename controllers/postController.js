const cloudinary = require("../config/cloudinaryConfig");
const { json } = require("body-parser");
const BaseController = require("./baseController");

class PostController extends BaseController {
  constructor(model) {
    //base model
    super(model);
  }

  getOne = async (req, res) => {
    const { postId } = req.params;
    try {
      const post = await this.model.findById({
        _id: postId,
      });
      return res.json(post);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  insertOne = async (req, res) => {
    const { title, image, categories, description, userId } = req.body;
    try {
      const uploadImg = await cloudinary.uploader.upload(image, {
        folder: "communityposts",
      });
      const communityPost = await this.model.create({
        userId: userId,
        postTitle: title,
        cloudimg: {
          public_id: uploadImg.public_id,
          url: uploadImg.secure_url,
        },
        postCategories: categories,
        postDescription: description,
        // username: username,
        // userPic: userPic,
      });
      // console.log(communityPost)
      return res.json(communityPost);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  updateOne = async (req, res) => {
    const { postId } = req.params;
    const { title, categories, image, description } = req.body;
    if (image) {
      const uploadImg = await cloudinary.uploader.upload(image, {
        folder: "communityposts",
      });
      await this.model.findOneAndUpdate(
        { _id: postId },
        {
          cloudimg: {
            public_id: uploadImg.public_id,
            url: uploadImg.secure_url,
          },
        }
      );
    }
    try {
      const editedPost = await this.model.findOneAndUpdate(
        { _id: postId },
        {
          postTitle: title,
          postCategories: categories,
          postDescription: description,
        }
      );
      return res.json(editedPost);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  addLike = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;
    try {
      const post = await this.model.findOneAndUpdate(
        {
          _id: postId,
        },
        { $push: { postUsersLiked: userId } }
      );
      return res.json(post);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  removeLike = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;
    try {
      const post = await this.model.findOneAndUpdate(
        {
          _id: postId,
        },
        { $pull: { postUsersLiked: userId } }
      );
      return res.json(post);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
  addComment = async (req, res) => {
    const { postId } = req.params;
    const { senderId, senderUsername, senderPic, comment } = req.body;
    try {
      const addedComment = await this.model.findOneAndUpdate(
        {
          _id: postId,
        },
        {
          $push: {
            postUserComments: {
              senderId: senderId,
              senderUsername: senderUsername,
              senderPic: senderPic,
              comment: comment,
            },
          },
        }
      );
      return res.json(addedComment);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = PostController;
