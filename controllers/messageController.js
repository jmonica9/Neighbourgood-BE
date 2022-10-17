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
    console.log("thisranhere", chatroomId, userId, messageText);
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

  // insertOneWithDate = async (req, res) => {
  //   const { chatroomId, userId } = req.params;
  //   const { messageText, proposedDate } = req.body;
  //   console.log("thisranhere", chatroomId, userId, messageText);
  //   try {
  //     const message = await this.model.create({
  //       chatroomId: chatroomId,
  //       senderId: userId,
  //       messageText: messageText,
  //       proposedDate: proposedDate,
  //     });
  //     return res.json(message);
  //   } catch (err) {
  //     return res.status(400).json({ error: true, msg: err });
  //   }
  // };

  getChatRoomMessages = async (req, res) => {
    const { chatroomId } = req.params;
    try {
      const messages = await this.model.find({ chatroomId: chatroomId });
      return res.json(messages);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = MessageController;
