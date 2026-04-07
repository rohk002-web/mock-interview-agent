import os
import fitz 
from dotenv import load_dotenv
from google import genai
from App.model.candidate_documents import CandidateDocument
from fastapi import HTTPException, status

load_dotenv()

async def process_resume_file(file, db):
    pdf_bytes = await file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text_content = "".join([page.get_text() for page in doc])

    if not text_content:
        raise Exception("The uploaded PDF appears to be empty or unreadable.")

    try:
        api_key = os.getenv("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key)

        response = await client.aio.models.embed_content(
            model="gemini-embedding-001",
            contents=text_content
        )

        if response.embeddings and len(response.embeddings) > 0:
            embedding_vector = response.embeddings[0].values
        else:
            raise Exception("No embedding values found in the API response.")

    except Exception as e:
        raise Exception(f"Error generating embedding: {str(e)}")

    try:
        candidate_doc = CandidateDocument(
            document_text=text_content,
            embedding=embedding_vector  
        )
        db.add(candidate_doc)
        db.commit()

        return {
            "resume_id": str(candidate_doc.resume_id),
            "message": "Resume processed and stored successfully",
        }
    except Exception as e:
        raise Exception(f"Database storage failed: {str(e)}")


def delete_file(resume_id, db):
    candidate_doc = db.query(CandidateDocument).filter(CandidateDocument.resume_id == resume_id).first()
    if not candidate_doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db.delete(candidate_doc)
    db.commit()
    return {"message": "Document deleted successfully"}

def get_all_documents(db):
    candidate_docs = db.query(CandidateDocument).all()
    if not candidate_docs:
        return{
            "message": "No documents found",
            "documents": []
        }
    return{
        "message": "Documents retrieved successfully",
        "documents": [
            {
                "resume_id": str(doc.resume_id),
                "document_text": doc.document_text,
                "embedding": doc.embedding,
                "created_at": doc.created_at
            }
            for doc in candidate_docs
        ]
    }

     