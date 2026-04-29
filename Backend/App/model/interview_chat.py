from sqlalchemy import Column, Text, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from App.model.Base import Base


class InterviewChatHistory(Base):
    __tablename__ = "interview_chat_history"
    
    chat_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    interview_id = Column(UUID(as_uuid=True),ForeignKey("candidate_interview_details.interview_id"),nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=True)
    score = Column(Integer, nullable=True)   
    feedback = Column(Text, nullable=True)      
    created_at = Column(DateTime, default=datetime.utcnow)