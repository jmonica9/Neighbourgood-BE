const BaseController = require("./baseController");
const cloudinary = require("../config/cloudinaryConfig");

class ListingController extends BaseController {
  constructor(model, userModel) {
    //base model
    super(model);
    this.userModel = userModel;
  }

  getOneListing = async (req, res) => {
    const { listingId } = req.body;
    try {
      const listing = await this.model.findById(listingId);
      return res.json(listing);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  //sort by categories
  sortByCategories = async (req, res) => {
    const { type } = req.params;
    const { categories } = req.body;
    // console.log("sort by categories!!");
    // console.log("type req.params", type);
    // console.log("req.body", req.body);
    // console.log("categories from req.body", categories);

    try {
      // const listing = await this.model.aggregate({
      //   $match: { categories: { $in: categories }, type: { $in: [type] } },
      // });
      const listing = await this.model.find({
        categories: { $all: categories },
        type: type,
      });

      // console.log(listing, "after sorting");
      return res.json(listing);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
  //deleteOne({ size: 'large' }
  deleteOne = async (req, res) => {
    const { listingId } = req.params;
    // console.log("listingid req.params", listingId);
    // console.log("delete route!");

    try {
      const user = await this.model.deleteOne({ _id: listingId });
      return res.json(user);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  insertOne = async (req, res) => {
    // console.log("reqbody", req.body);
    const { userId, title, image, categories, description, type, username } =
      req.body;
    // console.log("inserting!");

    try {
      const uploadImg = await cloudinary.uploader.upload(image, {
        folder: `${type}`,
        // max_width: 150,
        // min_width: 100,
        // width: "17vh",
        //crop:scale / or wtv
      });
      const listing = await this.model.create({
        userId: userId,
        username: username,
        title: title,
        image: image,
        cloudimg: {
          public_id: uploadImg.public_id,
          url: uploadImg.secure_url,
        },
        categories: categories,
        description: description,
        type: type,
      });

      return res.json(listing);
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
    // console.log("get type listings route");
    // console.log(req.params, "req params");
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
    // console.log("get my type listings route");
    // console.log(req.params, "req params");
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
    // console.log("get my type listings route");
    // console.log(req.params, "req params");
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

  getAllFromUser = async (req, res) => {
    const { userId } = req.params;
    // console.log("GET FRIENDSSS ROUTEEEE");
    try {
      const listings = await this.model.find({ userId: userId }).exec();
      // console.log("get all from user!");
      return res.json(listings);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  addUserRequest = async (req, res) => {
    // console.log("this ran");
    const { listing, userId } = req.body;
    // console.log(listing, userId);
    try {
      const response = await this.model.findOneAndUpdate(
        { _id: listing._id },
        { $addToSet: { requestorIds: userId } },
        { upsert: true, new: true }
      );
      return res.json(response);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  withdrawUserRequest = async (req, res) => {
    console.log("withdrawal ran");
    const { listing, userId } = req.body;
    console.log(listing, userId);
    try {
      const response = await this.model.findOneAndUpdate(
        { _id: listing._id },
        { $pull: { requestorIds: userId } },
        { new: true }
      );
      return res.json(response);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = ListingController;
