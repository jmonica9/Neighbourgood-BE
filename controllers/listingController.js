const BaseController = require("./baseController");
const cloudinary = require("../config/cloudinaryConfig");
// const stripe = require("../stripe");

class ListingController extends BaseController {
  constructor(model, userModel) {
    //base model
    super(model);
    this.userModel = userModel;
  }

  getOne = async (req, res) => {
    const { listingId } = req.params;
    try {
      const listing = await this.model.findById(listingId);
      return res.json(listing);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
  markComplete = async (req, res) => {
    console.log("withdrawal ran");
    const { listing, userId } = req.body;
    console.log(listing, userId);
    try {
      const response = await this.model.findOneAndUpdate(
        { _id: listing._id },
        { $pull: { completed: true } },
        { new: true }
      );
      console.log("mark complete ran, response: ", response);
      return res.json(response);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  //sort by categories
  sortByCategories = async (req, res) => {
    console.log(req.body, "req body sortbyCategories ");
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

  //sort by location
  sortByLocation = async (req, res) => {
    console.log(req.body, "req body sortbyLocation ");

    const { type } = req.params;
    const { location } = req.body;
    console.log(type, "reqparams sortbylocation");
    try {
      const listing = await this.model.find({
        location: location,
        type: type,
      });

      console.log(listing, "after sorting");
      return res.json(listing);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
  //sort by location and categories
  sortByCategoriesAndLocation = async (req, res) => {
    console.log(req.body, "req body sortbyCategoriesAndLocation ");
    const { type } = req.params;
    const { location, categories } = req.body;
    try {
      // const listing = await this.model.find({
      //   $and: [
      //     { location: { $all: locations, $exists: true } },
      //     { categories: { $all: categories, $exists: true } },
      //     { type: type },
      //   ],
      // });

      const listing = await this.model.find({
        $and: [
          { location: location },
          { categories: { $all: categories, $exists: true } },
          { type: type },
        ],
      });

      // const listing = await this.model.find({
      //   $and: [
      //     { location: { $where: locations } },
      //     { location: { $exists: true } },
      //     { categories: { $all: categories, $exists: true } },
      //     { type: type },
      //   ],
      // });

      console.log(listing, "after sorting lOC N CAT");
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
    console.log("reqbody", req.body);
    const {
      userId,
      title,
      image,
      categories,
      description,
      type,
      username,
      location,
    } = req.body;
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
        location: location,
        completed: false,
      });

      return res.json(listing);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  updateOne = async (req, res) => {
    const { listingId } = req.params;
    const { title, image, categories, description, type } = req.body;
    try {
      if (image) {
        const uploadImg = await cloudinary.uploader.upload(image, {
          folder: `${type}`,
        });
        const listingPicture = await this.model.findOneAndUpdate(
          { _id: listingId },
          {
            image: image,
            cloudimg: {
              public_id: uploadImg.public_id,
              url: uploadImg.secure_url,
            },
          }
        );
        console.log(listingPicture);
      }
      const listing = await this.model.findOneAndUpdate(
        { _id: listingId },
        {
          title: title,
          categories: categories,
          description: description,
          type: type,
        }
      );

      return res.json(listing);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  getTypeListings = async (req, res) => {
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

  sortByCategoriesAndLocation = async (req, res) => {
    try {
      const listings = await this.model.find({
        location: location,
        categories: location,
      });
      return res.json(listings);
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
    const { listing, userId } = req.body;
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

  // getOneListing = async (req, res) => {
  //   const { listingId } = req.params;
  //   try {
  //     console.log("tis ran", listingId);
  //     const listing = await this.model.findById(listingId);

  //     return res.json(listing);
  //   } catch (err) {
  //     return res.status(400).json({ error: true, msg: err });
  //   }
  // };

  reserveListing = async (req, res) => {
    const { listingId, requestorId } = req.body;

    try {
      const response = await this.model.findOneAndUpdate(
        { _id: listingId },
        { reservedBy: requestorId },
        { new: true }
      );
      return res.json(response);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  addLike = async (req, res) => {
    const { listingId } = req.params;
    const { userId } = req.body;
    const response = await this.model.findOneAndUpdate(
      { _id: listingId },
      {
        $push: { usersLiked: userId },
      }
    );
    // console.log(response);
    return res.json(response);
  };
  removeLike = async (req, res) => {
    const { listingId } = req.params;
    const { userId } = req.body;
    const response = await this.model.findOneAndUpdate(
      { _id: listingId },
      {
        $pull: { usersLiked: userId },
      }
    );
    // console.log(response);
    return res.json(response);
  };

  addComment = async (req, res) => {
    const { listingId } = req.params;
    const { senderId, senderUsername, senderPic, comment } = req.body;
    try {
      const response = await this.model.findOneAndUpdate(
        { _id: listingId },
        {
          $push: {
            comment: {
              senderId: senderId,
              senderUsername: senderUsername,
              senderPic: senderPic,
              comment: comment,
              createdAt: new Date(),
            },
          },
        }
      );
      return res.json(response);
    } catch (err) {
      return res.json(err);
    }
  };

  getComments = async (req, res) => {
    const { listingId } = req.params;
    try {
      const comments = await this.model.findById(listingId);
      // .populate({ path: "senderId", model: "User" })
      let sendersData = [];
      comments.comment.forEach(async (comment) => {
        let userInfo = await this.userModel.findById(comment.senderId);
        sendersData.push({ userInfo, comment });
        // console.log(sendersData.length);
        if (sendersData.length == comments.comment.length)
          return res.json(sendersData);
      });

      // return res.json(sendersData);
    } catch (err) {
      return res.json(err);
    }
  };
}

module.exports = ListingController;
