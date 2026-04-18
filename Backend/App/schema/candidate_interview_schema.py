from datetime import datetime
from typing import Optional
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
  

    class Config:
        from_attributes = True
