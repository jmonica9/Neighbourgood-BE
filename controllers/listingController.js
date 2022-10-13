const BaseController = require("./baseController");
class ListingController extends BaseController {
  constructor(model, userModel) {
    //base model
    super(model);
    this.userModel = userModel;
  }

  insertOne = async (req, res) => {
    console.log("reqbody", req.body);
    const { userId, title, image, categories, description, type, username } =
      req.body;
    console.log("inserting!");

    try {
      console.log("trying..lol");
      const listing = await this.model.create({
        userId: userId,
        username: username,
        title: title,
        image: image,
        categories: categories,
        description: description,
        type: type,
      });
      console.log("done");
      // const updateUserListing = await this.userModel.findOneAndUpdate(
      //   { _id: userId },
      //   {
      //     $push: { listingsUser: listing },
      //   },
      //   (err, doc) => {
      //     if (err) console.log(err);
      //     else console.log(doc);
      //   }
      // );
      return res.json(listing);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
  // to be modified
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

  getAllFromUser = async (req, res) => {
    const { userId } = req.params;

    try {
      const listings = await this.model.find({ userId: userId }).exec();
      return res.json(listings);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = ListingController;
