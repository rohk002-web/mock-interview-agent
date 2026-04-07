from sqlalchemy import Column, DateTime, Text,Float
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from datetime import datetime
import uuid
from App.model.Base import Base


class CandidateDocument(Base):
    __tablename__ = "candidate_documents"

    resume_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_text = Column(Text, nullable=False)
    embedding = Column(ARRAY(Float), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)