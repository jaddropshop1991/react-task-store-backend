const { verifyToken , verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

const router = require("express").Router();
const CryptoJS =require("crypto-js");
const Product = require("../models/Product");


//CREATE
router.post("/",verifyTokenAndAdmin,async(req,res)=>{
    const newProduct = new Product(req.body)

    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct)
    }
    catch(err){
        res.status(500).json(err)
    }
})


//UPDATE PRODUCT

router.put("/:id",verifyTokenAndAdmin,async (req,res)=>{
    
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            //take everything in req.body and set it agian
            $set: req.body
        }, {new:true}
        );
        res.status(200).json(updatedProduct);
    } catch (err){
        res.status(500).json(err);
    }
})

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted...")
    } catch{
        res.status(500).json(err)
    }
})


//GET PRODUCT
router.get("/find/:id", async (req,res)=>{
    try{
       const product= await Product.findById(req.params.id)
      
       res.status(200).json(product);
       
    } catch{
        res.status(500).json(err)
    }
})


//GET ALL PRODUCTS
router.get("/",  async (req,res)=>{
       //fetch by new query
       const qNew =req.query.new
       //fetch by category query
       const qCategory =req.query.category
    try{

     let products;

     //if /api/product?new=true
     if(qNew){
        products = await Product.find().sort({createdAt: -1}).limit(5);

     }
       //if /api/product?category=men
     else if(qCategory){
        products = await Product.find({
            categories: {
                $in: [qCategory],
            }
        })
       
     }
     // else fetch all products
     else{
        products = await Product.find();
     }

    //    const users= query ? await Product.find().sort({_id:-1}).limit(5):await User.find()
       
     
       res.status(200).json(products);
       
    } catch{
        res.status(500).json(err)
    }
})


module.exports = router