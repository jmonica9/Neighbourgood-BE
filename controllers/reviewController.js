// getOneListing = async (req, res) => {
//   const { listingId } = req.params;
//   try {
//     const listing = await this.model.findById(listingId);
//     return res.json(listing);
//   } catch (err) {
//     return res.status(400).json({ error: true, msg: err });
//   }
// };
const BaseController = require("./baseController");
class ReviewController extends BaseController {
  constructor(model, listingModel, userModel) {
    super(model);
    this.model = model;
    this.listingModel = listingModel;
    this.userModel = userModel;
  }
  getOneListing = async (req, res) => {
    const { listingId } = req.params;
    console.log(listingId);
    try {
      const reviews = await this.model.find({ listingId: listingId });
      console.log(reviews);
      // let combinedDetails = [];
      // await reviews.forEach(async (review) => {
      //   const user = await this.userModel.findById(review.postedBy);
      //   const listing = await this.listingModel.findById(listingId);
      //   console.log(user, listing, "USER LISTING!!!!");
      //   // console.log(listing);
      //   // review.user = user;
      //   // console.log(review.user);
      //   // review.listingTitle = listing.title;
      //   combinedDetails.push(
      //     // { review, user, listing }
      //     //     Object.assign(review, listing)
      //     Object.assign(
      //       review,
      //       { username: user?.username, userImg: user?.cloudimg?.url },
      //       { listingTitle: listing.title }
      //     )
      //     //     // Object.assign(review, user, listing)
      //     //     // { reviews: review, user: user, listing: listing }
      //     //     //
      //     //   );
      //   );
      // });

      // console.log(combinedDetails);
      console.log("get reviews for one listing", reviews);
      return res.json(reviews);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };

  insertOne = async (req, res) => {
    const { listingId } = req.params;

    const { reviewText } = req.body;
    console.log(req.body, "inserting review!");
    try {
      const listing = await this.listingModel.findById(listingId);
      console.log(listing);
      const review = await this.model.create({
        listingId: listing._id,
        // hardcode cuz no listing.reservedBy data
        requestorId: "63463666c61a8bfba34be34a",
        ownerId: listing.userId,
        reviewText: reviewText,
        type: listing.type,
      });
      console.log("inserted a review", review);
      return res.json(review);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
}

module.exports = ReviewController;
