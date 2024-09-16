const exp = require('express');
const app=exp()

require('dotenv').config()

const path=require('path')

//add body parsing
app.use(exp.json())



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



//error handling middleware handles the 7
app.use((err,req,res,next)=>{
    res.send({status:"Error",message:err.message})
})







const port=process.env.PORT ;


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
