const BaseController = require("./baseController");
class LocationController extends BaseController {
  constructor(model) {
    super(model);
  }

  getDistinct = async (req, res) => {
    console.log("register route!", req.body);

    const location = await this.model.distinct("location");
    res.json(location);
  };

  //   insertOne = async (req, res) => {
  //     console.log("register route!", req.body);

  // try
  //    { const locationn = await this.model.findOneAndUpdate(
  //       { location: req.body.location },
  //       { $setOnInsert: { location: req.body.location } },
  //       { upsert: true, new: true },
  //       }
  // catch (err){
  //    if (err) {
  //           callback(err);
  //         }
  //       };

  // }

  insertOne = async (req, res) => {
    // const { location } = req.body;
    console.log(req.body.location, "req.body");
    try {
      const location = await this.model.findOneAndUpdate(
        { location: req.body.location },
        { $setOnInsert: { location: req.body.location } },
        { upsert: true, new: true }
      );
      return res.json(location);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  };
  // const location = await this.model.create({
  //   location: req.body.location,
  // });

  // const locationn = await this.model.findOrCreate({
  //   location: req.body.location,
  // });
  //   console.log("location created?:", locationn);
  //   res.json(locationn);
  // };
}

module.exports = LocationController;
