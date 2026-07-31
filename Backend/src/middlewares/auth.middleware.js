const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model"); 

async function authUser(req,res,next){

    // Pehle cookie check karo, agar nahi mili to Authorization header check karo (Safari/iOS fix)
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if(!token){
        res.status(400).json({message: "Token not provided"})
        return;
    };

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({token});

    if(isTokenBlacklisted){
        res.status(400).json({
            message: "Token is invalid"
        });
        return;
    }

    try{
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    }catch(err){
        return res.status(401).json({
            message: "Invalid Token"
        });
    }
};

module.exports = {authUser}; 
