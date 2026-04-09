from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from App.config.db_connection import get_db
from App.service.authentication_service import get_current_user
from App.service.candidate_interview_service import add_interview_details
from App.schema.candidate_interview_schema import CandidateInterviewDetailsResponse, SaveCandidateInterviewDetails

router= APIRouter(tags=["Interview details management"])

@router.post("/add-interview-details",response_model=CandidateInterviewDetailsResponse)
async def interview_details(request: SaveCandidateInterviewDetails, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return add_interview_details(db, current_user, resume_id=request.resume_id, role=request.role, years_of_experience=request.years_of_experience, interview_level=request.interview_level)