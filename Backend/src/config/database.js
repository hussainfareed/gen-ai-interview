const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require("mongoose");

const connectedDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to database");
    }catch(err){
        console.log(err)
    }
};

module.exports = connectedDb;