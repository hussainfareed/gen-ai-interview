const mongoose = require("mongoose");


/**
 * - job description schema: tsring
 * - resume text : string
 * - self decription : string
 * 
 * - matchScore: Number
 * 
 * - Technical question : 
 *      [{
 *         question : "",
 *         intenstion: "",
 *         answer: "",
 * } 
 * - beahaviour question: 
 *    [{
 *         question : "",
 *         intenstion: "",
 *         answer: "",
 * }
 * - skill gaps : [{
 *    skill: "",
 *    severity:  {
 *       type: string,
 *       enum: ["low", "medium", "high"]
 * }
 * }];
 * 
 * - preparation plan: [{
 *    day: "number",
 *    focus: "string",
 *    tasks: "string"
 * }]
 * 
 */

const technicalQuestionSchema = new mongoose.Schema({
    question :{
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    id: false
});

const behavioralQuestionSchema = new mongoose.Schema({
    question :{
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    id: false
});

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity :{
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    },
}, {
    id: false
});

const preparationPlanSchema = new mongoose.Schema({
    day :{
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks :[{
        type: String,
        required: [true, "Task is required"]
    }]
},{
    id: false
});


const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "job decription is required"]
    },
    resumeText: {
        type: String
    },
    selfDescription: {
        type:  String
    },
    matchScore :{
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [true, "title is required"]
    }
},{
    timestamps: true
});

const interviewReportModel = mongoose.model("interviewReport", interviewReportSchema);

module.exports  = interviewReportModel;