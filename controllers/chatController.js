const BaseController = require("./baseController");

class ChatController extends BaseController {
  constructor(model, listingModel) {
    //base model
    super(model);
    this.listingModel = listingModel;
  }

  getOneListing = async (req, res) => {
    const { listingId } = req.params;
    try {
      const listing = await this.listingModel.findById(listingId);
      return res.json(listing);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  createChatroom = async (req, res) => {
    const { listingId, requestorId, ownerId } = req.body;
    console.log("thisonerannowcreatechatroom", listingId, requestorId, ownerId);
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
}

module.exports = ChatController;
