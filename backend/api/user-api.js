// create mini express application
const exp=require('express')
const userApp=exp.Router()
const nodemailer = require('nodemailer');
const checksum = require('./checksum')
const transacturl = require('./config')

const cron = require("node-cron");
const bodyParser = require('body-parser');
const cors = require('cors');

let cartItems = []
userApp.use(cors());
require('dotenv').config();
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb
userApp.use(bodyParser.json());
const {createUserOrAdmin,userOrAdminLogin}=require('./util')
const expressAsyncHandler=require('express-async-handler')
userApp.use(cors({
    origin: 'http://localhost:5500', // allow your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

userApp.use('*',cors())
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
  const details = req.body;
  const {  userName,productId } = req.body.obj;
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
  let addedAt = new Date()
  let person = details.user
  cartItems.push({
    user:person,
    addedAt:addedAt,
    emailSent: false
  });
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
  cartItems = cartItems.filter(item => !(item.productId === productId && item.user.email === userEmail));
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

// route: /product-api/related/:productId

userApp.get('/related/:productId', expressAsyncHandler(async (req, res) => {
  const { productId } = req.params;
  // console.log("first")
  // console.log(productId)

  const mainProduct = await productsCollection.findOne({ productId: Number(productId) });
  // console.log(mainProduct)
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
  // console.log(relatedProducts)

  res.send(relatedProducts);
}));


// Add product to recently viewed
userApp.post('/recently-viewed', expressAsyncHandler(async (req, res) => {
  const { userName, productId } = req.body;

  const user = await userCollection.findOne({ userName: userName });
  if (!user) return res.status(404).send('User not found');

  await userCollection.updateOne(
    { userName },
    { $pull: { recentlyViewed: productId } }
  );
  await userCollection.updateOne(
    { userName },
    { $push: { recentlyViewed: { $each: [productId], $position: 0 } } }
  );
  await userCollection.updateOne(
    { userName },
    [{ $set: { recentlyViewed: { $slice: ["$recentlyViewed", 10] } } }]
  );

  res.send({ message: "Product added to recently viewed" });
}));


//get all products in recently viewed
userApp.get('/recently-viewed/:user', expressAsyncHandler(async (req, res) => {
  const userName = req.params.user;
  const user = await userCollection.findOne({ userName: userName });

  if (!user) return res.status(404).send('User not found');

  const productIds = user.recentlyViewed || [];

  if (productIds.length === 0) {
    return res.send({ message: "no products" });
  }

  const products = await productsCollection.find({
    productId: { $in: productIds }
  }).toArray();

  // Optional: maintain the order of recentlyViewed
  const orderedProducts = productIds.map(id => products.find(p => p.productId === id)).filter(Boolean);

  res.send({ message: "recently viewed products", payload: orderedProducts });
}));



cron.schedule("0 10 * * *", async () => {
  console.log("Cron triggered")
    // ✅ Get unique users from cart using Map
    const uniqueUsers = new Map();

    cartItems.forEach(item => {
      if (!uniqueUsers.has(item.user.email)) {
        uniqueUsers.set(item.user.email, item.user.name);
      }
    });
  
    // ✅ Send emails to users with cart items
    for (const [email, name] of uniqueUsers.entries()) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: email,
          subject: "🛒 Items waiting in your cart!",
          html: `
            <p>Hi ${name},</p>
            <p>You still have items in your cart! Don’t forget to complete your purchase.</p>
            <p>🛍️ <a href="http://localhost:5500/">Click here to continue shopping in BuyIt.</a></p>
          `
        });
  
        console.log(`✅ Reminder sent to ${email}`);
      } catch (err) {
        console.error(`❌ Failed to send reminder to ${email}:, ${err}`);
      }
    }
});



userApp.post('/transact', async function(req, res, next) {
  try {
    const obj = req.body;
    const id = `OID${Date.now()}`;
    
    const data = {
      amount: 100,
      firstName: obj.userName,
      buyerEmail: obj.email,
      currency: "INR",
      merchantIdentifier: "fb2016ffd3a64b2994a6289dc2b671a4",
      orderId: id,
      returnUrl: "http://localhost:5500/user-api/status"
    };


    
    const orderEntry = {
      orderId: id,
      products: obj.products || [],
      amount: data.amount,
      status: "initiated",
      date: new Date()
    };

    await userCollection.updateOne(
      { email: obj.email }, // or use {_id: ObjectId(obj.userId)} if you're using IDs
      { $push: { orders: orderEntry } },
      { upsert: true }
    );

    console.log("Order entry pushed:", orderEntry);

    // 🔐 Zaakpay integration
    var checksumstring = checksum.getChecksumString(data);
    var calculatedchecksum = checksum.calculateChecksum(checksumstring);
    var url = transacturl.merchantInfo.transactApi;

    return res.send({
      url: url,
      checksum: calculatedchecksum,
      data: data
    });
  } catch (err) {
    console.error("Transaction error:", err);
    res.status(500).send({ error: "Transaction failed" });
  }
});


userApp.post('/status', async function(req, res) {
  try {
      console.log(req.body)

      // console.log("Message: " + res.getResponseCodes(req.body.responseCode))
      if(req.body.responseCode == 100){
          return res.redirect(`http://localhost:5500/success?id=${req.body.orderId}&checksum=${req.body.checksum}`);
      } else {
          return res.redirect(`http://localhost:5500/failure?id=${req.body.orderId}&checksum=${req.body.checksum}`);
      }
  } catch (error) {
      console.log(error)
  }
});





// exporting the file
module.exports=userApp;