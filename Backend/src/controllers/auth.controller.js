const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");


/**
 * @name registerUserController
 * @description register a new user, expects username ,email and password
 */
async function registerUserController(req,res){
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        res.status(400).json({message: "please provide the username, email and password"})
        return;
    }

    const isUserAlreadyRegistered = await userModel.findOne({
        $or: [{username}, {email}]
    });

    if(isUserAlreadyRegistered){
        res.status(400).json({message: "Account already exist with this email address or username"})
        return;
    };

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash
    });

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000 // 1 din
    });

    res.status(201).json({
        message: "user registered successfully", 
        token, // ⬅ ab token JSON response mein bhi milega (Safari cookie-block ke liye backup)
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
};

/**
 * @name loginusercontroller
 * @decription login a user, expects  email  and password in the request body
 */

async function loginUserController(req,res){
    const {email, password} = req.body;

    const user = await userModel.findOne({email});

    if(!user){
        res.status(400).json({
            message: "Invalid email and password"
        })
        return
    };

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        res.status(400).json({message: "Incvalid email and password"});
        return;
    };

     const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000 // 1 din
    });

    res.status(200).json({
        message: "User login successfully",
        token, // ⬅ ab token JSON response mein bhi milega (Safari cookie-block ke liye backup)
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

async function logoutUserController(req,res){
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if(token){
        await tokenBlacklistModel.create({token})
    };

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.status(200).json({
        message: "user logged out successfully"
    });
}

async function getMeController(req,res){

    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User details fetched successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
};

module.exports = {
    registerUserController,
    loginUserController, 
    logoutUserController, 
    getMeController
    };
