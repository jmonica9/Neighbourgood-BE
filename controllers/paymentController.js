const BaseController = require("./baseController");
const stripe = require("../config/stripe");
const { json } = require("body-parser");

class PaymentController extends BaseController {
  constructor(model, listingModel) {
    //base model
    super(model);
    this.listingModel = listingModel;
  }

  //stripe deposit payment for lending listings ONLY
  //stripe controllers
  createAccount = async (req, res) => {
    const postStripeCharge = (res) => (stripeErr, stripeRes) => {
      if (stripeErr) {
        // console.log(stripeErr);
        res.status(500).send({ err: stripeErr });
      } else {
        // console.log(stripeRes);
        res.status(200).send({ success: stripeRes });
      }
    };
    const account = await stripe.accounts.create({
      type: "standard",
      // capabilities: {
      //   card_payments: { requested: true },
      //   transfers: { requested: true },
      // },
    });
    console.log(account);
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "http://localhost:3001/reauth",
      return_url: "http://localhost:3001/",
      type: "account_onboarding",
    });
    console.log(accountLink);
    return res.json({ accountLink, account });
  };

  addPayment = async (req, res) => {
    const postStripeCharge = (res) => (stripeErr, stripeRes) => {
      if (stripeErr) {
        // console.log(stripeErr);
        return res.status(500).send({ err: stripeErr });
      } else {
        // console.log(stripeRes);
        res.status(200).send({ success: stripeRes });
      }
    };
    const payment = await stripe.charges.create(
      req.body,
      postStripeCharge(res)
    );
  };

  addRefund = async (req, res) => {
    const postStripeCharge = (res) => (stripeErr, stripeRes) => {
      if (stripeErr) {
        // console.log(stripeErr);
        return res.status(500).send({ err: stripeErr });
      } else {
        // console.log(stripeRes);
        res.status(200).send({ success: stripeRes });
      }
    };
    const { charge, amount } = req.body;
    const refund = await stripe.refunds.create(req.body, postStripeCharge(res));
    //charge: chargeID,
    //amount: amount,
  };

  addCustomer = async (req, res) => {
    const { source, email } = req.body;
    // console.log(req.body);
    const postStripeCharge = (res) => (stripeErr, stripeRes) => {
      if (stripeErr) {
        // console.log(stripeErr);
        return res.status(500).send({ err: stripeErr });
      } else {
        // console.log(stripeRes);
        res.status(200).send({ success: stripeRes });
      }
    };
    const newCustomer = await stripe.customers.create(
      {
        source: source,
        email: email,
      },
      postStripeCharge(res)
    );
  };
  attachPaymentMethod = async (req, res) => {
    const { paymentMethodId, customerId } = req.body;
    console.log(req.body);
    const postStripeCharge = (res) => (stripeErr, stripeRes) => {
      if (stripeErr) {
        // console.log(stripeErr);
        return res.status(500).send({ err: stripeErr });
      } else {
        // console.log(stripeRes);
        res.status(200).send({ success: stripeRes });
      }
    };
    const attachedPaymentMethod = await stripe.paymentMethods.attach(
      paymentMethodId,
      { customer: customerId },
      postStripeCharge(res)
    );
  };

  addBalance = async () => {
    const add = await stripe.charges.create({
      amount: 5000,
      currency: "sgd",
      source: "tok_bypassPending",
      description: "Adding Funds Urgently",
    });
  };

  claimDeposit = async (req, res) => {
    const { accountId } = req.body;
    const postStripeCharge = (res) => (stripeErr, stripeRes) => {
      if (stripeErr) {
        console.log(stripeErr);
        return res.status(500).send({ err: stripeErr });
      } else {
        // console.log(stripeRes);
        res.status(200).send({ success: stripeRes });
      }
    };
    const balance = await stripe.balance.retrieve(function (err, balance) {
      if (err) console.log(err);
      else {
        console.log(balance);
        // return res.json(balance);
      }
    });

    const payout = await stripe.transfers.create(
      {
        amount: 100,
        currency: "sgd",
        destination: accountId,
      },
      postStripeCharge(res)
    );
  };
  // database controllers
  getOne = async (req, res) => {
    console.log("getOne");
    const { listingId } = req.params;
    try {
      const payment = await this.model.findOne({ listingId: listingId });
      return res.json(payment);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  insertOne = async (req, res) => {
    const { listingId } = req.params;
    const { payerId, receiverId, amount, chargeId } = req.body;
    console.log(req.body);
    try {
      const payment = await this.model.create({
        listingId: listingId,
        payerId: payerId,
        receiverId: receiverId,
        amount: amount,
        chargeId: chargeId,
        status: "Payment Deposited",
      });
      return res.json(payment);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: true, msg: err });
    }
  };

  updateOne = async (req, res) => {
    const { listingId } = req.params;
    const payment = await this.model.findOneAndUpdate(
      { listingId: listingId },
      { status: "Deposit Returned" }
    );
  };

  // getOne = async (req, res) => {
  //   res.send({
  //     message: "To Stripe Server",
  //     timestamp: new Date().toISOString(),
  //   });
  // };
}

module.exports = PaymentController;
