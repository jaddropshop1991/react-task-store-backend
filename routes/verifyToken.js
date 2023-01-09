
const jwt = require('jsonwebtoken');

//verify the web token
const verifyToken = (req,res,next)=> {
    const authHeader = req.headers.token
    if(authHeader){
        //split token after the word bearer
        const token = authHeader.split(" ")[1];

        
        //jwt verify
        jwt.verify(token, process.env.JWT_SEC,(err,user)=>{
            if(err) res.status(403).json("Token is not valid!");
            // if everything is ok assign user to request
            req.user = user;
            // exit to router
            next();
        })
    }else{
        
        return res.status(401).json("You are not authenticated!")
    }
};

const verifyTokenAndAuthorization = (req,res,next)=>{
    //check we saved in the tokenif token belongs to client or admin from the is admin 
 verifyToken(req,res,()=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
        //continue route function
        next()
    } else{
        res.status(401).json("You are not allowed!");
    }
 })
}


const verifyTokenAndAdmin = (req,res,next)=>{
    //check we saved in the tokenif token belongs to client or admin from the is admin 
 verifyToken(req,res,()=>{
    if(req.user.isAdmin){
        //continue route function
        next()
    } else{
        res.status(401).json("You are not allowed!");
    }
 })
}

module.exports = {verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin};