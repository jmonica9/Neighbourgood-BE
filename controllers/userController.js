const BaseController = require("./baseController");
const cloudinary = require("../config/cloudinaryConfig");
const { json } = require("body-parser");

class UserController extends BaseController {
  constructor(model) {
    super(model);
  }

  getOne = async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await this.model.findOne({ _id: userId });
      return res.json(user);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  getOneUsername = async (req, res) => {
    const { username } = req.params;
    try {
      const user = await this.model.findOne({ username: username });
      return res.json(user);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  updateOne = async (req, res) => {
    const { userId } = req.params;
    const { username, email } = req.body;
    try {
      const user = await this.model.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          username: username,
          email: email,
        }
      );
      return res.json(user);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  updateProfilePicture = async (req, res) => {
    const { file } = req.body;
    const { userId } = req.params;
    // console.log("file:", file);
    try {
      const uploadImg = await cloudinary.uploader.upload(file, {
        folder: "profilepicture",
      });
      const user = await this.model.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          cloudimg: {
            public_id: uploadImg.public_id,
            url: uploadImg.secure_url,
          },
        }
      );
      return res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  updateFriend = async (req, res) => {
    const { userId } = req.params;
    const { friendId } = req.body;
    const { action } = req.body;
    try {
      if (action === "add") {
        const user = await this.model.findOneAndUpdate(
          { _id: userId },
          {
            $push: { accountsFollowing: friendId },
          }
        );
        return res.json(user);
      } else {
        const user = await this.model.findOneAndUpdate(
          { _id: userId },
          {
            $pull: { accountsFollowing: friendId },
          }
        );
        return res.json(user);
      }
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = UserController;
