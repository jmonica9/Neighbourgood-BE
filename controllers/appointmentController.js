const BaseController = require("./baseController");

class AppointmentController extends BaseController {
  constructor(model, chatModel) {
    //base model
    super(model);
    this.chatModel = chatModel;
  }

  getOne = async (req, res) => {
    const { listingId, chatroomId } = req.body;
    console.log(listingId, chatroomId);
    try {
      const appointment = await this.model.findOne({
        listingId: listingId,
        chatroomId: chatroomId,
      });
      return res.json(appointment);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  insertOne = async (req, res) => {
    const { requestorId, ownerId, listingId, proposedDateAndTime, chatroomId } =
      req.body;
    try {
      const appointment = await this.model.create({
        chatroomId: chatroomId,
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

  deleteOne = async (req, res) => {
    const { requestorId, ownerId, listingId } = req.body;
    try {
      const user = await this.model.deleteOne({
        listingId: listingId,
        requestorId: requestorId,
        ownerId: ownerId,
      });
      return res.json(user);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  confirmOneAppointment = async (req, res) => {
    const { requestorId, ownerId, listingId } = req.body;
    try {
      const appointment = await this.model.findOneAndUpdate(
        {
          requestorId: requestorId,
          ownerId: ownerId,
          listingId: listingId,
        },
        {
          confirmed: true,
        },
        {
          new: true,
        }
      );
      return res.json(appointment);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = AppointmentController;
