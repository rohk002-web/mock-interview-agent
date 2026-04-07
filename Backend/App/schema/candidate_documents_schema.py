from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class GetCandidateDocumentResponse(BaseModel):
    resume_id: str
    document_text: str
    embedding: list[float]
    created_at: datetime

class ListDocuments(BaseModel):
    message: str
    documents: list[GetCandidateDocumentResponse]

class CandidateDocumentResponse(BaseModel):
    resume_id :str
    message: str

class DocumentDelete(BaseModel):
    message: str

    class Config:
        from_attributes = True