from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime
from App.model.Base import Base
import uuid

class InterviewReport(Base):
    __tablename__ = "interview_report"

    report_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    interview_report = Column(JSONB, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)