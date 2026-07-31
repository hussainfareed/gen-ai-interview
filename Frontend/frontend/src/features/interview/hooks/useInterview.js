import { generateInterviewReport, getInterviewReportById,getAllInterviewReports, generateResumePdf } from "../services/interview.api";
import { interviewContext } from "../interview.context";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export const useInterview = ()=>{
    const context = useContext(interviewContext);
    const {interviewId} = useParams();

    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {loading, setLoading, report, setReport, reports, setReports} = context;

    const generateReport = async ({jobDescription, selfDescription, resumeFile})=>{
        setLoading(true)
        try{
             const response = await generateInterviewReport({jobDescription, selfDescription, resumeFile})
            setReport(response.interviewReport)
            return response.interviewReport
        }catch(err){
            console.log(err)
            alert(err?.response?.data?.message || "Report generate nahi ho saka. Dobara try karein.")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const getReportById = async (interviewId)=>{
        setLoading(true)
        try{
             const response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport)
            return response.interviewReport
        }catch(err){
            console.log(err)
            alert(err?.response?.data?.message || "Report was not loaded")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const getReports = async()=>{
        setLoading(true)
        try{
             const response = await getAllInterviewReports();
            setReports(response.interviewReports)
            return response.interviewReports;
        }catch(err){
            console.log(err)
            return []
        }finally{
            setLoading(false)
        }
    };


    const getResumePdf = async (interviewReportId) => {
    setLoading(true)
    try {
        const response = await generateResumePdf({ interviewReportId })
        const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `resume_${interviewReportId}.pdf`)
        document.body.appendChild(link)
        link.click()
    }
    catch (error) {
        console.log(error)
        alert(error?.response?.data?.message || "PDF not dowanload")
        throw error
    } finally {
        setLoading(false)
    }
}

    useEffect(() =>{
        if(interviewId){
            getReportById(interviewId)
        }else{
            getReports()
        }
    }, [interviewId])

    return {loading, report, reports, generateReport, getReportById,  getReports, getResumePdf}
};