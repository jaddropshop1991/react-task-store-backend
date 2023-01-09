
const express =require("express");

const app =express();
const mongoose =require("mongoose");

const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const categoryRoute = require("./routes/category");
const stripeRoute = require("./routes/stripe");
const cors  = require("cors");

dotenv.config();

mongoose.connect(
   process.env.MONGO_URL
    ).then(()=>console.log("DB Connection Successful"))
    .catch((err)=>{
        console.log(err);
    });


    app.use(cors());
    app.use(express.json());

    app.use("/api/auth", authRoute);
    app.use("/api/users", userRoute);
    app.use("/api/products", productRoute);
    app.use("/api/categories", categoryRoute);
    app.use("/api/orders", orderRoute);
    app.use("/api/carts", cartRoute);
    app.use("/api/checkout", stripeRoute);

{*app.listen("https://gold-spotless-seal.cyclic.app/" || 5000, ()=>{
 console.log("backend server is running!")
});*}

// Production
var server = app.listen(process.env.PORT || 3000, function () {
	var port = server.address().port;
	console.log("Express is working on port " + port)
})
