const pdfParse = require("pdf-parse");
const {generateInterviewReport, generateResumePdf} = require("../srevices/ai.service");
const interviewReportModel = require("../models/interviewReport.model");


/**
 * @description Controller to generate interview report based on user selfdescription, resume and jobDescription:
 */
async function generateInterViewReportController(req, res) {
    console.log("🔥 CONTROLLER HIT 🔥");
    try {

         console.log("BODY:", req.body);   // <-- YE LINE YAHAN ADD KAREIN
        console.log("FILE:", req.file);

        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF file is required. Send it as form-data with key 'resume' and type 'File'."
            });
        }

        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        const { selfDescription, jobDescription } = req.body;

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription: selfDescription,
            jobDescription: jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resumeText: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (err) {
        console.error("generateInterViewReportController error:", err);
        res.status(500).json({
            message: "Failed to generate interview report",
            error: err.message
        });
    }
}

async function getInterviewReportByIdController(req,res){

    const {interviewId} = req.params;

    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.id});

    if(!interviewReport){
        res.status(400).json({
            message: "Report not found"
        })
        return
    }
    
    res.status(200).json({
        message: "Report fetched successfully",
        interviewReport
    });
};

async function getAllInterviewReportsController(req,res){

    const interviewReports = await interviewReportModel.find({user: req.user.id}).sort({createdAt: -1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -improvementAreas -skillGaps -preparationPlan");

    res.status(200).json({
        message: "Interview reports fetched successfully",
        interviewReports
    });
};

/**
 * @description Controller to generate a resume pdf based on user selfdescription, resume and job description  
 */
async function generateResumePdfController(req,res){

    const {interviewReportId} = req.params;

    const interviewReport = await interviewReportModel.findById(interviewReportId);
    
    if(!interviewReportId){
        return (
            res.status(400).json({
                message: "Interview report not found"
            })
        )
    };
    
    const {resume, selfDescription, jobDescription} = interviewReport;

    const pdfBuffer = await generateResumePdf({resume, selfDescription, jobDescription});

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController };