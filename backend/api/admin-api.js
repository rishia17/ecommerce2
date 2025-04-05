// create mini express application
const exp=require('express')
const adminApp=exp.Router()
const {createUserOrAdmin,userOrAdminLogin}=require('./util')
const expressAsyncHandler=require('express-async-handler')

const verifyToken=require("../middlewares/verifyToken")


let productsCollection;
let adminCollection;
adminApp.use((req,res,next)=>{
    adminCollection=req.app.get('admincollection')
    productsCollection=req.app.get('productscollection')
    next()
})


//getting collection object
adminApp.post('/user',expressAsyncHandler(createUserOrAdmin))

adminApp.post('/login',expressAsyncHandler(userOrAdminLogin))

// to save new product
adminApp.post('/new-product',expressAsyncHandler(async(req,res)=>{
    // get a new product
    const newProduct=req.body;
    //sav new product to products collection
    console.log(newProduct)
    await productsCollection.insertOne(newProduct)
    // send res
    res.send({message:"new product is added"})
}))



adminApp.post('/product-filter',expressAsyncHandler(async(req,res)=>{


    let categoriesArray = req.body.category;

    console.log(categoriesArray);
    // Check if any category in the product matches with the categoryArray
    const filteredProducts = await productsCollection.find({ category: { $in: categoriesArray } }).toArray();
    res.send({ message: "filtered products", payload: filteredProducts });


  }));
    


//export
module.exports=adminApp;