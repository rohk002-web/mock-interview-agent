from sqlalchemy import Column, DateTime, Text,Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from datetime import datetime
import uuid
from App.model.Base import Base
from App.model.users import User
from pgvector.sqlalchemy import Vector 


class CandidateDocument(Base):
    __tablename__ = "candidate_documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4) 
    user_id= Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    resume_id = Column(UUID(as_uuid=True), default=uuid.uuid4)
    document_text = Column(Text, nullable=False)
    file_name = Column(Text, nullable=True)
    embedding = Column(Vector(3072), nullable=False) 
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)