// bcrypt js
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { verifyToken } = require("../middlewares/verifyToken");

// req handler for registration
const createUserOrAdmin = async (req, res) => {
    //get users and authors collection object
    const userCollectionObj = req.app.get('usercollection');
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
        // Skip admin creation since credentials are stored in env
        res.status(403).send({ message: "Admin creation is restricted." });
    }
};

const userOrAdminLogin = async (req, res) => {
    const userCollectionObj = req.app.get('usercollection');
    const user = req.body;

    if (user.userType === 'user') {
        let dbUser = await userCollectionObj.findOne({ userName: user.userName });
        if (dbUser === null) {
            return res.send({ message: "invalid user name" });
        }
        let status = await bcryptjs.compare(user.password, dbUser.password);
        if (status === false) {
            return res.send({ message: "password invalid" });
        } else {
            //generation token
            const signedToken = jwt.sign({ userName: dbUser.userName }, process.env.SECRET_KEY, { expiresIn: '1d' });
            delete dbUser.password;
            res.send({ message: "login success", token: signedToken, user: dbUser });
        }
    }

    if (user.userType === 'admin') {
        // Admin credentials are stored in .env
        const adminUserName = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (user.userName !== adminUserName) {
            return res.send({ message: "invalid admin user name" });
        }

        // Compare password (plain-text for this example; ideally, hash it in .env)
        const status = await bcryptjs.compare(user.password, adminPassword);
        if (!status) {
            return res.send({ message: "password invalid" });
        } else {
            //generation token
            const signedToken = jwt.sign({ userName: adminUserName }, process.env.SECRET_KEY, { expiresIn: '1d' });
            res.send({ message: "login success", token: signedToken });
        }
    }
};

module.exports = { createUserOrAdmin, userOrAdminLogin };
