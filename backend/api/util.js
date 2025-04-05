// bcrypt js
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { verifyToken } = require("../middlewares/verifyToken");

// req handler for registration
const createUserOrAdmin = async (req, res) => {
    //get users and authors collection object
    const userCollectionObj = req.app.get('usercollection');
    const adminCollectionObj = req.app.get('admincollection');
    const user = req.body;

    //check duplicate user
    if (user.userType === 'user') {
        //find user by username
        let status = await userCollectionObj.findOne({ userName: user.userName });
        if (status != null) {
            return res.send({ message: "user already existed" });
        }

        //hash password
        const hashedPassword = await bcryptjs.hash(user.password, 7);
        //replace plain password with hashed password
        user.password = hashedPassword;
        await userCollectionObj.insertOne(user);
        res.send({ message: "user created" });
    }

    if (user.userType === 'admin') {
       //find user by username
       let status = await adminCollectionObj.findOne({ userName: user.userName });
       if (status != null) {
           return res.send({ message: "admin already existed" });
       }
       
       //hash password
       const hashedPassword = await bcryptjs.hash(user.password, 7);
       //replace plain password with hashed password
       user.password = hashedPassword;
       await adminCollectionObj.insertOne(user);
       res.send({ message: "admin created" });
    }
};

// const userOrAdminLogin = async (req, res) => {
//     const userCollectionObj = req.app.get('usercollection');
//     const user = req.body;

//     if (user.userType === 'user') {
//         let dbUser = await userCollectionObj.findOne({ userName: user.userName });
//         if (dbUser === null) {
//             return res.send({ message: "invalid user name" });
//         }
//         let status = await bcryptjs.compare(user.password, dbUser.password);
//         if (status === false) {
//             return res.send({ message: "password invalid" });
//         } else {
//             //generation token
//             const signedToken = jwt.sign({ userName: dbUser.userName }, process.env.SECRET_KEY, { expiresIn: '1d' });
//             delete dbUser.password;
//             res.send({ message: "login success", token: signedToken, user: dbUser });
//         }
//     }

//     if (user.userType ==="admin") {
//         // Admin credentials are stored in .env
//         let dbUser = await adminCollectionObj.findOne({ userName: user.userName });
//         if (dbUser === null) {
//             return res.send({ message: "invalid user name" });
//         }
//         let status = await bcryptjs.compare(user.password, dbUser.password);
//         if (status === false) {
//             return res.send({ message: "password invalid" });
//         } else {
//             //generation token
//             const signedToken = jwt.sign({ userName: dbUser.userName }, process.env.SECRET_KEY, { expiresIn: '1d' });
//             delete dbUser.password;
//             res.send({ message: "login success", token: signedToken, user: dbUser });
//         }
//     }
// };

const userOrAdminLogin = async (req, res) => {
    const { userName, password, userType } = req.body;
    console.log(userType);
    // Validate input
    if (!userName || !password || !userType) {
        return res.send({ message: "Missing required fields: userName, password, and userType" });
    }

    try {
        let dbUser;
        let collection;
        
        // Determine whether the user is a normal user or admin
        if (userType === 'user') {
            collection = req.app.get('usercollection');
            dbUser = await collection.findOne({ userName });
        } else if (userType === 'admin') {
            collection = req.app.get('admincollection');
            dbUser = await collection.findOne({ userName });
        } else {
            return res.send({ message: "Invalid userType. Must be 'user' or 'admin'" });
        }

        if (!dbUser) {
            console.log('uss')
            return res.send({ message: "Invalid username" });
        }

        // Compare passwords
        const isPasswordValid = await bcryptjs.compare(password, dbUser.password);
        if (!isPasswordValid) {
            console.log('pass')
            return res.send({ message: "Invalid password" });
        }

        // Generate JWT token
        const signedToken = jwt.sign({ userName: dbUser.userName, userType }, process.env.SECRET_KEY, { expiresIn: '1d' });
        delete dbUser.password; // Don't send the password back in the response

        // Send success response with token and user info
        console.log('sucess')
        return res.send({ message: "Login success", token: signedToken, user: dbUser });
    } catch (error) {
        // Handle errors and send an internal server error response
        console.error("Error during login:", error);
        return res.send({ message: "Internal server error" });
    }
};


module.exports = { createUserOrAdmin, userOrAdminLogin };
