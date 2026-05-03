from App.service.authentication_service import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from App.config.db_connection import get_db
from App.service.interview_service import end_interview_service, get_interview_report_service, interview_conversation_service , interview_save_report
from App.model.candidate_interview_details import CandidateInterviewDetails
from App.schema.interview_schema import ChatRequest, InterviewReportResponse, InterviewReportSchema

router = APIRouter(tags=["Mock interview management"])

@router.post("/interview-conversation/{interview_id}")
def interview_conversation(interview_id: str, request: ChatRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return interview_conversation_service(db,interview_id,current_user.id,request.user_answer)

@router.post("/end-interview/{interview_id}")
def end_interview(interview_id: str,db: Session = Depends(get_db),current_user=Depends(get_current_user)):
    return end_interview_service(db, interview_id, current_user)

@router.post("/save-report",response_model=InterviewReportResponse)
async def save_report(request: InterviewReportSchema, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return interview_save_report(db, request, current_user)

@router.get("/get-interview-report")
async def get_interview_report(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_interview_report_service(db, current_user.id)