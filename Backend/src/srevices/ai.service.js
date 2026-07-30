// const {GoogleGenAI } = require("@google/genai");
// const {z} = require("zod");
// const {zodToJsonSchema} = require("zod-to-json-schema");

// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_GENAI_API_KEY,
//     httpOptions:{
//         timeout:120000
//     }
// });

// const interviewReportSchema = z.object({
//     matchScore:z.number().describe("A score between 0 and 100 indicating how well teh candidate's profile matches the job description"),
//     technicalQuestions:z.array(z.object({
//         question:z.string().describe("The technical question can be asked in the interview"),
//         intention:z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc")
//     })).describe("Technical question can be asked in the interview along with thier intention and how to answer them"),

//     behavioralQuestions: z.array(z.object({
//         question:z.string().describe("The technical question can be asked in the interview"),
//         intention:z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc")
//     })).describe("Behavioral question can be asked in the interview along with thier intention and how to answer them"),

//     skillGaps: z.array(z.object({
//         skill:z.string().describe("The skill which the candidate is lacking"),
//         severity:z.enum(["Low", "Medium", "High"]).describe("Severity level of the skill gap, indicating how critical this missing skill is for the job role — Low means minor gap with little impact, Medium means moderate gap that should be improved, High means critical gap that significantly affects the candidate's fit for the role")
//     })).describe("List of skill gaps in the candidate's profile along with thier severity"),

//     preparationPlan: z.array(z.object({
//     day: z.number().describe("The day number in the preparation plan, starting from 1"),
//     focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, behavioral prep"),
//     tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan effectively")
// })).describe("A day-wise preparation plan for the candidate to follow in order to close their skill gaps and prepare for the interview")
// })

// // async function generateInterviewReport({resume, selfDescription, jobDescription}){

// //     const prompt = `Generate an interview report for a candidate with the following details:
// //     Resume: ${resume},
// //     selfDescription: ${selfDescription},
// //     jobDescription: ${jobDescription}
// //     `

   
  

// //     const response = await ai.models.generateContent({
// //     model: "gemini-2.5-flash",
// //     contents: prompt,
// //     config: {
// //         responseMimeType: "application/json",
// //         responseSchema: zodToJsonSchema(interviewReportSchema, {
// //             target: "jsonSchema7",
// //             $refStrategy: "none"
// //         })
// //     }

// // });

// //     console.log(response.text)
// // };

// async function generateInterviewReport({resume, selfDescription, jobDescription}){
//     try {
//         const prompt = `...`;
//         const response = await ai.models.generateContent({
//             model: "gemini-3.5-flash", // fix model name
//             contents: prompt,
//             config: {
//                 responseMimeType: "application/json",
//                 responseSchema: zodToJsonSchema(interviewReportSchema, {
//                     target: "jsonSchema7",
//                     $refStrategy: "none"
//                 })
//             }
//         });

//         console.log(response.text);
//         return JSON.parse(response.text); // agar aage use karna hai
//     } catch (err) {
//         console.error("Gemini API error:", err);
//         throw err;
//     }
// }

// module.exports = generateInterviewReport;

const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
    httpOptions: {
        timeout: 120000
    }
});

// IMPORTANT: Gemini's responseSchema does NOT use standard JSON Schema.
// It needs Google's own Schema format, where "type" values come from the
// Type enum ("OBJECT", "STRING", "ARRAY", "NUMBER"...) in
// uppercase form. Passing a zod-to-json-schema output (lowercase "object",
// "string" etc.) gets silently ignored by Gemini, which is why the model
// was freely inventing its own JSON structure instead of following ours.
const interviewReportSchema = {
    type: "OBJECT",
    properties: {
        title: {
            type: "STRING",
            description: "A short, descriptive title for this interview report, based on the job role/position mentioned in the job description"
        },
        matchScore: {
            type: "NUMBER",
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
        },
        technicalQuestions: {
            type: "ARRAY",
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "The technical question that can be asked in the interview" },
                    intention: { type: "STRING", description: "The intention of interviewer behind asking this question" },
                    answer: { type: "STRING", description: "How to answer this question, what points to cover, what approach to take etc" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "ARRAY",
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "The behavioral question that can be asked in the interview" },
                    intention: { type: "STRING", description: "The intention of interviewer behind asking this question" },
                    answer: { type: "STRING", description: "How to answer this question, what points to cover, what approach to take etc" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "ARRAY",
            description: "List of skill gaps in the candidate's profile along with their severity",
            items: {
                type: "OBJECT",
                properties: {
                    skill: { type: "STRING", description: "The skill which the candidate is lacking" },
                    severity: {
                        type: "STRING",
                        enum: ["low", "medium", "high"],
                        description: "Severity level of the skill gap"
                    }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "ARRAY",
            description: "A day-wise preparation plan for the candidate",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "NUMBER", description: "The day number in the preparation plan, starting from 1" },
                    focus: { type: "STRING", description: "The main focus of this day in the preparation plan" },
                    tasks: {
                        type: "ARRAY",
                        description: "List of tasks to be done on this day",
                        items: { type: "STRING" }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["title","matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    try {
        const prompt = `Generate an interview report for a candidate with the following details:
        Resume: ${resume},
        selfDescription: ${selfDescription},
        jobDescription: ${jobDescription}
        `;

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: interviewReportSchema
            }
        });

        
        const parsedReport = JSON.parse(response.text);
        console.log(JSON.stringify(parsedReport, null, 2));
        return parsedReport;

    } catch (err) {
        console.error("Gemini API error:", err);
        throw err;
    }
}

async function generatePdfFromHtml(htmlContent){

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, {waitUntil: "networkidle0"})

    const pdfBuffer = await page.pdf({ format: "A4", margin:{
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm"
    }});

    await browser.close()

    return pdfBuffer
}


async function generateResumePdf({resume, selfDescription, jobDescription}){

    const resumePdfSchema = {
    type: "OBJECT",
    properties: {
        html: {
            type: "STRING",
            description: "The complete, self-contained HTML content of the resume, including inline CSS for styling. It should be print-friendly (A4 size), professional, ATS-friendly, and ready to be converted directly into a PDF using Puppeteer. Do not include external stylesheets or scripts, only inline <style> tags."
        }
    },
    required: ["html"]
};

const prompt = `Generate a resume  for a candidate with the following detail:
Resume: ${resume},
Self Description: ${selfDescription},
Job Description: ${jobDescription}

the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description 
`

const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseJsonSchema: resumePdfSchema
    }
})

const jsonContent =  JSON.parse(response.text)

const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

return pdfBuffer
}

module.exports = {generateInterviewReport, generateResumePdf};

