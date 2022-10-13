const BaseController = require("./baseController");
class ListingController extends BaseController {
  constructor(model, usermodel) {
    //base model
    super(model);
  }

  insertOne = async (req, res) => {
    console.log("reqbody", req.body);
    const { userId, title, image, categories, description, type } = req.body;
    console.log("inserting!");

    try {
      const listing = await this.model.create({
        userId: userId,
        title: title,
        image: image,
        categories: categories,
        description: description,
        type: type,
      });
      return res.json(listing);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

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

  getTypeListings = async (req, res) => {
    console.log("get type listings route");
    console.log(req.params, "req params");
    const { type } = req.params;
    let requestedtype = type;
    try {
      const listings = await this.model.find({ type: requestedtype });
      return res.json(listings);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
  getMyTypeListings = async (req, res) => {
    console.log("get my type listings route");
    console.log(req.params, "req params");
    const { type, userId } = req.params;
    let requestedtype = type;
    let requestedUserId = userId;
    try {
      const listings = await this.model.find({
        type: requestedtype,
        userId: requestedUserId,
      });
      return res.json(listings);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  getMyTypeWatchlist = async (req, res) => {
    console.log("get my type listings route");
    console.log(req.params, "req params");
    const { type, userId } = req.params;
    let requestedtype = type;
    let requestedUserId = userId;
    try {
      const listings = await this.model.find({
        type: requestedtype,
        requestorIds: requestedUserId,
      });
      return res.json(listings);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = ListingController;
