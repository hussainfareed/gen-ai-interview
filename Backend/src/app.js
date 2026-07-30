const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "https://gen-ai-interview-675p6rd2b-hussainfareeds-projects.vercel.app",
    credentials: true
}));

/* require all routes here */
const authRoutes = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/* using all the routes here */
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRouter);

module.exports = app;