const BaseController = require("./baseController");

class ChatController extends BaseController {
  constructor(model, listingModel) {
    //base model
    super(model);
    this.listingModel = listingModel;
  }

  getOneChatroom = async (req, res) => {
    const { chatroomId } = req.params;
    try {
      const chatroom = await this.model.findById(chatroomId);
      return res.json(chatroom);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  getOneListing = async (req, res) => {
    const { listingId } = req.params;
    console.log("this ran", listingId);
    try {
      const listing = await this.listingModel.findById(listingId);
      return res.json(listing);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  createChatroom = async (req, res) => {
    const { listingId, requestorId, ownerId } = req.body;
    try {
      const chatroom = await this.model.create({
        listingId: listingId,
        requestorId: requestorId,
        ownerId: ownerId,
      });
      return res.json(chatroom);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  joinOneChatroom = async (req, res) => {
    const { listing, userId } = req.body;
    try {
      const chatroom = await this.model.findOne({
        listingId: listing._id,
        $or: [{ requestorId: userId }, { ownerId: userId }],
      });
      return res.json(chatroom);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = ChatController;
