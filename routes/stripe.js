const router = require("express").Router();
const stripe = require("stripe")("sk_test_51MMyJuLoXB8VCEN0Re1sIWuhEzXCgsBvVQikPFffsJwSgLxPApguRC6rpYHYF3B0vBvPc67DpsW5iBCArOSIu00T00Rrz1QKxi");

router.post("/payment", (req, res) => {
    console.log("payment function entered =====")
    console.log(req.body.tokenId.id);
  stripe.charges.create(
    {
      source: req.body.tokenId.id,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;