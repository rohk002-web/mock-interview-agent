from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from App.config.db_connection import get_db
from App.service.authentication_service import get_current_user
from App.service.candidate_interview_service import add_interview_details , get_interview_details_service , update_interview_details_service , delete_interview_details_service
from App.schema.candidate_interview_schema import CandidateInterviewDetailsResponse, SaveCandidateInterviewDetails, InterviewDetailsListResponse
from uuid import UUID

router= APIRouter(tags=["Interview details management"])

@router.get("/interview-details", response_model=InterviewDetailsListResponse)
async def get_interview_details(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_interview_details_service(db, current_user)

@router.post("/add-interview-details",response_model=CandidateInterviewDetailsResponse)
async def interview_details(request: SaveCandidateInterviewDetails, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return add_interview_details(db, current_user, resume_id=request.resume_id, role=request.role, years_of_experience=request.years_of_experience, interview_level=request.interview_level, interview_mode=request.interview_mode)

@router.put("/update-interview-details/{interview_id}",response_model=CandidateInterviewDetailsResponse)
async def update_interview_details(interview_id: UUID, request: SaveCandidateInterviewDetails, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return update_interview_details_service(db, current_user, resume_id=request.resume_id, role=request.role, years_of_experience=request.years_of_experience, interview_level=request.interview_level, interview_mode=request.interview_mode, interview_id=interview_id)
    

@router.delete("/delete-interview-details/{interview_id}",response_model=CandidateInterviewDetailsResponse)
async def delete_interview_details(interview_id: UUID, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return delete_interview_details_service(db, current_user, interview_id=interview_id)