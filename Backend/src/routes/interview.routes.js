const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");


const interviewRouter = express.Router();


/**
 * @name post /api/interview/
 * @description generate interview report on the basis of user selfDescription, resume pdf and jobDescription
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController);

/**
 * @route GET /api/interview/:interviewId
 * @description get interview report by interviewId
 * @access private  
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);


/**
 * @route GET /api/interview
 * @description get all interview report
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

/**
 * @route GET /api/interview/resume/pdf
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController )

module.exports = interviewRouter;