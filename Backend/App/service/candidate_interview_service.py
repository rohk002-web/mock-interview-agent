from datetime import datetime,timedelta
from uuid import UUID
from uuid import UUID
from App.config.db_connection import get_db
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from App.model.candidate_documents import CandidateDocument
from App.model.candidate_interview_details import CandidateInterviewDetails
from uuid import UUID



def get_interview_details_service(db:Session,current_user):
    interview_details = db.query(CandidateInterviewDetails).filter(
        CandidateInterviewDetails.user_id == current_user.id
    ).all()

    if not interview_details:
        raise HTTPException(status_code=404, detail="Interview details not found")

    data= [
        {
        "interview_id": str(interview.interview_id),
        "resume_id": str(interview.resume_id),
        "role": interview.role,
        "years_of_experience": interview.years_of_experience,
        "interview_level": interview.interview_level,
        "interview_mode": interview.interview_mode
        }
        for interview in interview_details

    ]
    return {
         "message": "Interview details retrieved successfully",
         "data": data
     }

def get_interview_details_service_id(db:Session,current_user, interview_id: UUID):
    interview_details = db.query(CandidateInterviewDetails).filter(
        CandidateInterviewDetails.interview_id == interview_id,
        CandidateInterviewDetails.user_id == current_user.id
    ).first()

    if not interview_details:
        raise HTTPException(status_code=404, detail="Interview details not found")

    return {
        "interview_id": str(interview_details.interview_id),
        "resume_id": str(interview_details.resume_id),
        "role": interview_details.role,
        "years_of_experience": interview_details.years_of_experience,
        "interview_level": interview_details.interview_level,
        "interview_mode": interview_details.interview_mode
    }

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
    
def update_interview_details_service(db:Session,current_user, resume_id: int, role: str, years_of_experience: float, interview_level: str, interview_mode: str, interview_id: int):
    try:
        interview_details = db.query(CandidateInterviewDetails).filter(
            CandidateInterviewDetails.interview_id == interview_id,
        CandidateInterviewDetails.interview_id == interview_id,
            CandidateInterviewDetails.user_id == current_user.id
        ).first()

        if not interview_details:
            raise HTTPException(status_code=404, detail="Interview details not found")

        resume = db.query(CandidateDocument).filter(
            CandidateDocument.resume_id == resume_id,
            CandidateDocument.user_id == current_user.id
        ).first()

        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")

        interview_details.resume_id = resume_id
        interview_details.role = role
        interview_details.years_of_experience = years_of_experience
        interview_details.interview_level = interview_level
        interview_details.interview_mode = interview_mode

        db.commit()

        return {
            "interview_id": str(interview_details.interview_id),
            "message": "Interview details updated successfully"
        }
    except HTTPException:
        raise 
    except Exception as e:
        raise Exception(f"Failed to update interview details: {str(e)}")
    
    
def delete_interview_details_service(
    db: Session,
    current_user,
    interview_id: UUID
):


    interview_id = UUID(str(interview_id))

    interview_details = db.query(CandidateInterviewDetails).filter(
        CandidateInterviewDetails.interview_id == interview_id
    ).first()

    if not interview_details:
        raise HTTPException(
            status_code=404,
            detail="Interview details not found (check interview_id or user ownership)"
        )

    db.delete(interview_details)
    db.commit()

    return {
        "message": "Interview details deleted successfully",
        "interview_id": str(interview_id)
    }