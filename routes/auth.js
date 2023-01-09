
const router = require("express").Router();
const User = require("../models/User");
const CryptoJS =require("crypto-js");
const jwt = require('jsonwebtoken');
//REGISTER
router.post("/register", async (req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email:req.body.email,
        //use the crypto s library to hash the password
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    });
    
    try{
      const savedUser = await newUser.save();
     res.status(201).json(savedUser)
    } catch (err){
       res.status(500).json(err);
    }
})

//LOGIN
router.post("/login", async(req,res)=>{
    console.log("login method entered===========")
    console.log(req.body.username)
    console.log(req.body.password)
    try{
        
        const user = await User.findOne({username: req.body.username});
        // if user not found
        !user && res.status(401).json("Wrong credentials!")

        //decrypt password using crypto js library
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password, 
            process.env.PASS_SEC
            );
            //convert decrypted password to string
        const OrginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        //if password not found
        OrginalPassword !== req.body.password && res.status(401).json("Wrong credentials!")

        
        //create json web token
        const accessToken  = jwt.sign({
            //save user._id and user.isAdmin mongo parameters inside the json web token
            id: user._id,
            isAdmin: user.isAdmin

        }, process.env.JWT_SEC,
        {expiresIn: "3d"}
        );


        
        
        //hide the password from the response
        const {password, ...others} =user._doc;
        
        res.status(200).json({...others, accessToken});
    } catch(err){
        console.log("login failed from backend function")
        // res.status(500).json(err);
    }
})


module.exports = router