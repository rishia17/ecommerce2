const exp=require('express')
const adminApp=exp.Router()
const {createUserOrAdmin,userOrAdminLogin}=require('./util')
const expressAsyncHandler=require('express-async-handler')
const cheerio = require("cheerio");
const googleTrends = require('google-trends-api');
const verifyToken=require("../middlewares/verifyToken")
const axios = require('axios')


let productsCollection;
let adminCollection;
adminApp.use((req,res,next)=>{
    adminCollection=req.app.get('admincollection')
    productsCollection=req.app.get('productscollection')
    next()
})

function getDynamicPrice(basePrice, demandFactor = 0.5, competitorPrice = null) {
  let price = basePrice;

  // Adjust based on demand
  if (demandFactor > 0.8) {
    price *= 1.15;
  } else if (demandFactor > 0.6) {
    price *= 1.1;
  } else if (demandFactor < 0.3) {
    price *= 0.85;
  }

  // Compete with competitor price if available
  if (competitorPrice && price > competitorPrice) {
    price = competitorPrice * 0.98;
  }

  return Math.round(price * 100) / 100;
}


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

  adminApp.get('/users', expressAsyncHandler(async (req, res) => {
    try {
      const usersList = await userCollection.find().toArray();
      res.send({ message: "All users fetched successfully", payload: usersList });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send({ message: "Failed to fetch users", error });
    }
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

  adminApp.post("/calculate-price", async (req, res) => {
    try {
      let { basePrice, product } = req.body;
      basePrice = parseFloat(basePrice);
  
      if (isNaN(basePrice)) {
        return res.json({ error: "basePrice must be a number" });
      }
  
      const name = product.name.split(" ").slice(0, 3).join(" ");
      const encodedName = encodeURIComponent(name);
  
      // 🔍 Flipkart scrape
      const flipkartResponse = await axios.get(`https://www.flipkart.com/search?q=${encodedName}`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        },
      });
  
      const $ = cheerio.load(flipkartResponse.data);
      const priceText = $('div.Nx9bqj._4b5DiR').first().text().replace(/[₹,]/g, "");
      const competitorPrice = parseFloat(priceText);
  
      // 📈 Google Trends demand factor
      const results = await googleTrends.interestOverTime({ keyword: name, geo: "IN" });
      const parsed = JSON.parse(results);
      const timelineData = parsed.default.timelineData;
      const averageInterest =
        timelineData.reduce((sum, item) => sum + item.value[0], 0) / timelineData.length;
      const demandFactor = Math.min(1, averageInterest/100); // Normalize between 0-1
  
      // 🧮 Calculate dynamic price
      const dynamicPrice = getDynamicPrice(basePrice, demandFactor, competitorPrice);
  
      res.json({ dynamicPrice, demandFactor, competitorPrice });
    } catch (e) {
      res.json({ error: e.message });
    }
  });
//export
module.exports=adminApp;