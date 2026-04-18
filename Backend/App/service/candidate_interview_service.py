from datetime import datetime,timedelta
from App.config.db_connection import get_db
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from App.model.candidate_documents import CandidateDocument
from App.model.candidate_interview_details import CandidateInterviewDetails
import uuid


def add_interview_details(db:Session,current_user, resume_id: int, role: str, years_of_experience: float, interview_level: str, interview_mode: str):
    try:
        resume = db.query(CandidateDocument).filter(
        CandidateDocument.resume_id == resume_id,
        CandidateDocument.user_id == current_user.id
    ).first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        interview_details= CandidateInterviewDetails(
            resume_id=resume_id,
            user_id=current_user.id,
            role=role,
            years_of_experience=years_of_experience,
            interview_level=interview_level,
            interview_mode=interview_mode
        )
        db.add(interview_details)
        db.commit()

        return{
            "interview_id": str(interview_details.interview_id),
            "message":"Interview details added successfully"
        }
    except HTTPException:
        raise 
    except Exception as e:
        raise Exception(f"Failed to add interview details: {str(e)}")
