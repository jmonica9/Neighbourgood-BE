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

  // deprecated code
  //   b64DecodeUnicode = (str)=> {
  //       // Going backwards: from bytestream, to percent-encoding, to original string.
  //       return decodeURIComponent(atob(str).split('').map(function(c) {
  //           return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //       }).join(''));
  //   }

  getTypeListings = async (req, res) => {
    console.log("get type listings route");
    console.log(req.params, "req params");
    const { type } = req.params;
    let requestedtype = type;
    try {
      const listings = await this.model.find({ type: requestedtype });
      // listings.image = new Buffer(data.photo.toString(), "base64");

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
