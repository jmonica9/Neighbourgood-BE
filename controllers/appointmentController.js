const BaseController = require("./baseController");

class AppointmentController extends BaseController {
  constructor(model, chatModel) {
    //base model
    super(model);
    this.chatModel = chatModel;
  }

  getOne = async (req, res) => {
    const { chatroomId } = req.body;
    try {
      const appointment = await this.model.findOne({ chatroomId: chatroomId });
      return res.json(appointment);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  insertOne = async (req, res) => {
    const { requestorId, ownerId, listingId, proposedDateAndTime } = req.body;
    try {
      const appointment = await this.model.create({
        requestorId: requestorId,
        ownerId: ownerId,
        listingId: listingId,
        proposedDateAndTime: proposedDateAndTime,
      });
      return res.json(appointment);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = AppointmentController;
