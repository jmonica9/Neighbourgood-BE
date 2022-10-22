const BaseController = require("./baseController");

class MessageController extends BaseController {
  constructor(model, chatModel) {
    //base model
    super(model);
    this.chatModel = chatModel;
  }

  insertOneWithoutDate = async (req, res) => {
    const { chatroomId, userId } = req.params;
    const { messageText, senderName } = req.body;
    try {
      const message = await this.model.create({
        chatroomId: chatroomId,
        senderId: userId,
        messageText: messageText,
        senderName: senderName,
      });
      return res.json(message);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  insertOneWithDate = async (req, res) => {
    const { chatroomId, userId } = req.params;
    const { messageText, proposedDate, senderName } = req.body;
    try {
      const message = await this.model.create({
        chatroomId: chatroomId,
        senderId: userId,
        messageText: messageText,
        proposedDate: proposedDate,
        senderName: senderName,
      });
      return res.json(message);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  getChatRoomMessages = async (req, res) => {
    const { chatroomId } = req.params;
    try {
      const messages = await this.model.find({ chatroomId: chatroomId });
      return res.json(messages);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  deleteOneWithDate = async (req, res) => {
    const { chatroomId } = req.body;
    try {
      const user = await this.model.deleteOne({
        chatroomId: chatroomId,
        proposedDate: { $exists: true },
      });
      return res.json(user);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = MessageController;
