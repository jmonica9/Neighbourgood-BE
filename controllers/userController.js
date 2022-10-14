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
}

module.exports = UserController;
