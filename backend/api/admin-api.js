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


  adminApp.get('/related/:productId', async (req, res) => {
    const { productId } = req.params;
  
    const mainProduct = await productsCollection.findOne({ productId: Number(productId) });
  
    if (!mainProduct) {
      return res.send({ message: "Product not found" });
    }
  
    const relatedProducts = await productsCollection.find({
      $and: [
        { productId: { $ne: Number(productId) } }, // exclude the current product
        {
          $or: [
            { category: mainProduct.category },
            { brand: mainProduct.brand }
          ]
        }
      ]
    }).limit(6).toArray();
  
    res.send(relatedProducts);
  });
    
  adminApp.get('/products', expressAsyncHandler(async (req, res) => {
  
    const productsList = await productsCollection.find().toArray();
    res.send({ message: "all products", payload: productsList });
  }));

  adminApp.put('/edit-product', expressAsyncHandler(async (req, res) => {
      const updatedProduct = req.body;

      if (!updatedProduct.productId) {
        return res.status(400).send({ message: 'Missing productId' });
      }
    
      // Prevent MongoDB immutable field issue
      delete updatedProduct._id;
    
      // Optional: sanitize fields here if needed
    
      const result = await productsCollection.updateOne(
        { productId: updatedProduct.productId },
        { $set: updatedProduct }
      );
    
      if (result.matchedCount === 0) {
        return res.status(404).send({ message: 'Product not found' });
      }
    
      // Fetch the updated product to return it
      const modifiedProduct = await productsCollection.findOne({ productId: updatedProduct.productId });
    
      res.send({ message: 'product modified', product: modifiedProduct });
    }));

// Delete a product by ID
adminApp.delete('/delete-product/:productId', expressAsyncHandler(async (req, res) => {
    const { productId } = req.params;
    console.log("Deleting product with productId:", productId);
  
    try {
      // Convert string to BSON Long
    //   const longProductId = Long.fromString(productId);
  
      const result = await productsCollection.deleteOne({ productId: Number(productId) });
      console.log(result)
      if (result.deletedCount === 1) {
        res.send({ message: "Product deleted successfully" });
      } else {
        res.send({ message: "Product not found" });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      res.send({ message: "Error deleting product" });
    }
  }));
//export
module.exports=adminApp;