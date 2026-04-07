from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from App.config.db_connection import get_db
from App.service.documents_service import process_resume_file , delete_file , get_all_documents
from App.service.authentication_service import get_current_user
from App.schema.candidate_documents_schema import CandidateDocumentResponse, DocumentDelete, ListDocuments


router= APIRouter(tags=["candidate document management"])


@router.get("/get-documents",response_model=ListDocuments)
async def get_documents(db: Session = Depends(get_db)):
    return get_all_documents(db)


@router.post("/upload-documents", response_model=CandidateDocumentResponse)
async def upload_documents(upload_file: UploadFile = File(...), db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    candidate_doc = await process_resume_file(upload_file, db)
    return candidate_doc

@router.delete("/delete-document/{resume_id}",response_model=DocumentDelete)
async def delete_document(resume_id:str, db:Session=Depends(get_db), current_user=Depends(get_current_user)):
    return delete_file(resume_id ,db)

