from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class SaveCandidateInterviewDetails(BaseModel):
    resume_id: str
    role: str
    years_of_experience: float
    interview_level: str
    interview_mode: Optional[str] = "chat"


class CandidateInterviewDetailsResponse(BaseModel):
    interview_id: str
    message: str

class GetCandidateInterviewDetailsResponse(BaseModel):
    interview_id: str
    resume_id: str
    role: str
    years_of_experience: float
    interview_level: str
    interview_mode: Optional[str] = "chat"

class InterviewDetailsListResponse(BaseModel):
    message: str
    data: List[GetCandidateInterviewDetailsResponse]

class CandidateInterviewDetailsById(BaseModel):
    interview_id: str
    resume_id: str
    role: str
    years_of_experience: float
    interview_level: str
    interview_mode: Optional[str] = "chat"
  

    class Config:
        from_attributes = True
