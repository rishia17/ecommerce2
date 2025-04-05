// create mini express application
const exp=require('express')
const userApp=exp.Router()
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
userApp.use(cors());
require('dotenv').config();
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb
userApp.use(bodyParser.json());
const {createUserOrAdmin,userOrAdminLogin}=require('./util')
const expressAsyncHandler=require('express-async-handler')
userApp.use((req,res,next)=>{
    userCollection=req.app.get("usercollection")
    productsCollection=req.app.get("productscollection")
    next()
})


//define routes
userApp.post('/user',createUserOrAdmin)
userApp.post('/login',userOrAdminLogin)

// get products of all brands
userApp.get('/products', expressAsyncHandler(async (req, res) => {

    const productsList = await productsCollection.find().toArray();
    res.send({ message: "all products", payload: productsList });
  }));
  

// get filtered products
userApp.post('/product-filter', expressAsyncHandler(async (req, res) => {
          const { categories, brands, minPrice, maxPrice } = req.body;
          // Build the query object based on the filters
          const query = {};

          // Handle categories filter
          if(categories.includes('All')){
            const filteredProducts = await productsCollection.find().toArray();
          res.send({ message: "filtered products", payload: filteredProducts });
          }
          else{
                  if (categories && categories.length > 0) {
                    // Add the category filter to the query
                    const categories2 = categories.filter(category => category.trim() != '');
                    if(categories2.length>0){

                      query.category = { $in: categories2 };
                    }
                }

                // Check if brands array is provided and not empty
                if (brands && brands.length > 0) {
                    // Add the brand filter to the query
                    const brand2 = brands.filter(category => category.trim() != '');
                    if (brand2.length>0){

                      query.brand = { $in: brand2 };
                    }
                }      
                  // Add price range filter if minPrice and maxPrice are valid numbers
                if (!isNaN(parseFloat(minPrice)) && !isNaN(parseFloat(maxPrice))) {
                    // Convert minPrice and maxPrice to numbers
                    const minPriceNum = parseFloat(minPrice);
                    const maxPriceNum = parseFloat(maxPrice);

                    // Add price filter to the query using $expr and $and
                    if (maxPriceNum>=30000) {       
                      const maxPriceNum2=minPriceNum;                               
                      query.$expr = {
                        $and: [
                            { $gte: [{ $toDouble: "$price" }, minPriceNum] },
                            { $gte: [{ $toDouble: "$price" }, maxPriceNum2] }
                        ]
                      };

                    }else{
                     query.$expr = {
                        $and: [
                            { $gte: [{ $toDouble: "$price" }, minPriceNum] },
                            { $lte: [{ $toDouble: "$price" }, maxPriceNum] }
                        ]
                    };
                    }

                }      
              const filteredProducts = await productsCollection.find(query).toArray();
              res.send({ message: "filtered products", payload: filteredProducts });
            

    }
    
    

}));


//add product  to cart

userApp.post('/cart', expressAsyncHandler(async (req, res) => {
  const {  userName,productId } = req.body;
  // Find the user in the database by username
  const user = await userCollection.findOne({ userName: userName });
  if (!user) return res.status(404).send('User not found');
  const result = await userCollection.updateOne(
    { userName: userName },
    { $addToSet: { cart: productId } }
  );
  if (result.modifiedCount === 0) {
    return res.send({ message: "product is not added" });
  }
  res.send({ message: "product added" });
}));



//get all products in cart
userApp.get('/mycart/:user', expressAsyncHandler(async (req, res) => {

  const userName =req.params.user;
  const user = await userCollection.findOne({ userName: userName });
    if (!user) return res.status(404).send('User not found');
    const productIds = user.cart; // Extract product IDs
    const products = await productsCollection.find({
      productId: { $in: productIds }
    }).toArray();
    if(products.length>0)
      res.send({ message: "all cart products", payload: products });
    else{
      res.send({message:"no products"})
    }

}));

//check if cart is present
userApp.post('/cart-check', expressAsyncHandler(async (req, res) => {
  const obj=req.body;
   const cart = await userCollection.findOne(
    { userName: obj.name, cart: obj.id }
  );
  if (cart) {
    res.send({ message: "Item is present in the cart" });
  }
  else{  
    res.send({message:"Item is  not present in the cart"});
  }
}));

//Nodemailer transporter configuration using environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

userApp.post('/send-email', (req, res) => {
  const { Name, email, message } = req.body;

  // Simulating a success response
  // console.log('Fake email sent');
  // console.log(`Name: ${Name}, Email: ${email}, Message: ${message}`);

  // Send a successful response
  res.status(200).send('Email sent (fake): Success');
    });



//delete products in carts
userApp.post('/mycart/:user/:productId', expressAsyncHandler(async (req, res) => {
  const userName = req.params.user;
  const productId = Number(req.params.productId);
  const user = await userCollection.findOne({ userName: userName });
  if (!user) return res.status(404).send('User not found');
  const result = await userCollection.updateOne(
    { userName: userName },
    { $pull: { cart: productId } }
  );
  if (result.modifiedCount === 0) {
    return res.send({message: 'Product is not available'});
  }
  res.send({ message: 'product deleted' });
}));


// to count the products in cart

userApp.get('/cartCount/:user', expressAsyncHandler(async (req, res) => {
  const userName = req.params.user;

  const user = await userCollection.findOne({ userName:userName });

  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  const cartCount = user.cart ? user.cart.length : 0;
  res.send({ message: 'cart count fetched', cartCount });
}));


//top new products
userApp.get('/products/top-new', expressAsyncHandler(async (req, res) => {

    // Fetch top 10 new products
    const topNewProducts = await productsCollection.find({})
      .sort({ dateOfCreation: -1 })
      .limit(10)
      .toArray(); 

    res.send({ message: "products fetched", payload: topNewProducts });

}));

//top discounted products
userApp.get('/products/offers', expressAsyncHandler(async (req, res) => {
    const highOfferProducts = await productsCollection.find({})
      .sort({ discount: -1 })
      .limit(10)
      .toArray(); 

    res.send({ message: "products fetched", payload: highOfferProducts });
  }
));


//products added to wishlist
userApp.post('/wishlist', expressAsyncHandler(async (req, res) => {
  const { userName, productId } = req.body;

  // Find user
  const user = await userCollection.findOne({ userName: userName });
  if (!user) return res.status(404).send('User not found');

  // Add to wishlist (prevent duplicates)
  const result = await userCollection.updateOne(
    { userName: userName },
    { $addToSet: { wishlist: productId } }
  );

  if (result.modifiedCount === 0) {
    return res.send({ message: "product is not added to wishlist" });
  }

  res.send({ message: "product added to wishlist" });
}));


// delete product from wishlist
userApp.post('/wishlist/:user/:productId', expressAsyncHandler(async (req, res) => {
  const userName = req.params.user;
  const productId = Number(req.params.productId);

  const user = await userCollection.findOne({ userName: userName });
  if (!user) return res.status(404).send('User not found');

  const result = await userCollection.updateOne(
    { userName: userName },
    { $pull: { wishlist: productId } }
  );
  console.log("deletedddd")
  if (result.modifiedCount === 0) {
    return res.send({ message: 'Product is not in wishlist' });
  }

  res.send({ message: 'product removed from wishlist' });
}));

// get all products in wishlist
userApp.get('/wishlist/:user', expressAsyncHandler(async (req, res) => {
  const userName = req.params.user;
  const user = await userCollection.findOne({ userName: userName });

  if (!user) return res.status(404).send('User not found');

  const productIds = user.wishlist; // Extract product IDs from wishlist
  const products = await productsCollection.find({
    productId: { $in: productIds }
  }).toArray();

  if (products.length > 0) {
    res.send({ message: "all wishlist products", payload: products });
  } else {
    res.send({ message: "no products" });
  }
}));





// exporting the file
module.exports=userApp;