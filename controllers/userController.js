const BaseController = require("./baseController");
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

  updateFriend = async (req, res) => {
    const { userId } = req.params;
    const { friendId } = req.body;
    const { action } = req.body;
    console.log(userId, friendId, action);
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
