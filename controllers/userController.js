const BaseController = require("./baseController");
class UserController extends BaseController {
  constructor(model) {
    super(model);
  }

  getOne = async (req, res) => {
    const { name, email } = req.body;
    console.log("here");
    console.log(name, email);

    try {
      const user = await this.model.findOneAndUpdate(
        { email: email },
        { $setOnInsert: { name: name } },
        { upsert: true, new: true }
      );
      return res.json(user);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = UserController;
