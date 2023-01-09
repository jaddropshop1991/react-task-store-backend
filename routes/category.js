const { verifyToken , verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

const router = require("express").Router();
const CryptoJS =require("crypto-js");
const Category = require("../models/Category");



//CREATE
router.post("/",verifyTokenAndAdmin,async(req,res)=>{
    const newCategory = new Category(req.body)

    try{
        const savedCategory = await newCategory.save();
        res.status(200).json(savedCategory)
    }
    catch(err){
        res.status(500).json(err)
    }
})


//UPDATE Category

router.put("/:id",verifyTokenAndAdmin,async (req,res)=>{
    
    try{
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, {
            //take everything in req.body and set it agian
            $set: req.body
        }, {new:true}
        );
        res.status(200).json(updatedCategory);
    } catch (err){
        res.status(500).json(err);
    }
})

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        await Category.findByIdAndDelete(req.params.id)
        res.status(200).json("Category has been deleted...")
    } catch{
        res.status(500).json(err)
    }
})


//GET Category
router.get("/find/:id", async (req,res)=>{
    try{
       const category= await Category.findById(req.params.id)
      
       res.status(200).json(category);
       
    } catch{
        res.status(500).json(err)
    }
})


//GET ALL CategoryS
router.get("/",  async (req,res)=>{
       //fetch by new query
       const qNew =req.query.new
       //fetch by category query
       const qCategory =req.query.category
    try{

     let Categorys;

     //if /api/Category?new=true
     if(qNew){
        Categorys = await Category.find().sort({createdAt: -1}).limit(5);

     }
       //if /api/Category?category=men
     else if(qCategory){
        Categorys = await Category.find({
            categories: {
                $in: [qCategory],
            }
        })
       
     }
     // else fetch all Categorys
     else{
        Categorys = await Category.find();
     }

    //    const users= query ? await Category.find().sort({_id:-1}).limit(5):await User.find()
       
     
       res.status(200).json(Categorys);
       
    } catch{
        res.status(500).json(err)
    }
})

module.exports = router