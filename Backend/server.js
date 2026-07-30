require("dotenv").config();

const app = require("./src/app");
const connectedDb = require("./src/config/database");
const invokeGeminiAi = require("./src/srevices/ai.service");

connectedDb();


app.listen(3000, (req,res) =>{
    console.log("srever is listening on port 3000")
});
