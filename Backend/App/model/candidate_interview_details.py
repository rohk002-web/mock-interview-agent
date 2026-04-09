from sqlalchemy import Column , String , Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from App.model.Base import Base

class CandidateInterviewDetails(Base):
    __tablename__ = "candidate_interview_details"

    user_id= Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    interview_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    resume_id= Column(UUID(as_uuid=True), ForeignKey("candidate_documents.resume_id"), nullable=False)
    role= Column(String, nullable=False)
    years_of_experience= Column(Float, nullable=False)
    interview_level= Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
