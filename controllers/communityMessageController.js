const BaseController = require("./baseController");

class CommunityMessageController extends BaseController {
  constructor(model) {
    //base model
    super(model);
  }

  insertOne = async (req, res) => {
    const { messageText, senderName, senderId } = req.body;
    console.log("this ran", messageText, senderName, senderId);
    try {
      const message = await this.model.create({
        senderId: senderId,
        messageText: messageText,
        senderName: senderName,
      });
      return res.json(message);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  getAll = async (req, res) => {
    console.log("this ran");
    try {
      const message = await this.model.find();
      return res.json(message);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = CommunityMessageController;
