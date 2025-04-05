const exp = require('express');
const app=exp()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const path=require('path')
const expressAsyncHandler=require('express-async-handler')

//add body parsing
app.use(exp.json())



app.use(cors({
    origin: 'http://localhost:5500', // allow your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//connecting frontend and backend
app.use(exp.static(path.join(__dirname,'../frontend/build')))

//mongo client
const mongoClient=require('mongodb').MongoClient
//connect mongodb server
mongoClient.connect(process.env.DBURL)
.then(client=>{
    //get databse object
    const ecommerceObj=client.db('ecommercedb')
    //get collection obj
    const productsCollection=ecommerceObj.collection('products')
    const userCollection=ecommerceObj.collection('user')
    const adminCollection=ecommerceObj.collection('admin')
    //share collection to api
    app.set('usercollection',userCollection)
    app.set('productscollection',productsCollection)
    app.set('admincollection',adminCollection)
    console.log("db connection is success")
})
.catch(err=>{
    console.log("error in db connection",err);
})

//import apis
const userApp=require('./api/user-api')

const adminApp=require('./api/admin-api')

//handover the requests to specific routesbased on starting path


app.use('/user-api',userApp)
app.use('/admin-api',adminApp)

app.get('/products/search', expressAsyncHandler(async (req, res) => {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).send({ message: "Query parameter is missing" });
    }
  
    const regex = new RegExp(query, 'i'); // i => case-insensitive
  
    // Search across multiple fields
    console.log('workingggg')
    const results = await productsCollection.find({
      $or: [
        { name: regex },
        { brand: regex },
        { category: regex }
      ]
    }).toArray();
  
    if (results.length === 0) {
      res.send({ message: "no products found", payload: [] });
    } else {
      res.send({ message: "search success", payload: results });
    }
  }));



//error handling middleware handles the 7
app.use((err,req,res,next)=>{
    res.send({status:"Error",message:err.message})
})







const port=process.env.PORT ;


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
