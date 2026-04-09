import os
import fitz 
from dotenv import load_dotenv
from google import genai
from App.model.candidate_documents import CandidateDocument
from fastapi import HTTPException
import redis.asyncio as redis
import hashlib
import json

load_dotenv()

redis_host = os.getenv('REDIS_HOST')
redis_port = os.getenv('REDIS_PORT')
redis_db = os.getenv('REDIS_DB')

async def process_resume_file(file, db, current_user):
    name_only = os.path.splitext(file.filename)[0]  
    extension = os.path.splitext(file.filename)[1]
    if not name_only and extension:
        raise Exception("The uploaded file appears to be missing a name or has an invalid format.")
    
    pdf_bytes = await file.read()
    if not pdf_bytes:
        raise Exception("The uploaded PDF appears to be empty or unreadable.")

    # Step 2: Compute hash
    file_hash = hashlib.sha256(pdf_bytes).hexdigest()

    # Step 3: Connect to Redis
    redis_client = redis.Redis(host=redis_host, port=int(redis_port), db=int(redis_db))

    # Step 4: Check Redis cache
    cached_data = await redis_client.get(file_hash)
    if cached_data:
        cached_data = json.loads(cached_data)
        embedding_vector = cached_data["embedding"]
        text_content = cached_data["document_text"]
        print("----------cache data from redis----------")
    else:
        # Step 5: Parse PDF
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text_content = "".join([page.get_text() for page in doc])
        if not text_content:
            raise Exception("The uploaded PDF appears to be empty or unreadable.")

        # Step 6: Generate embedding via API
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

        # Step 7: Save to Redis cache
        cache_value = json.dumps({
            "document_text": text_content,
            "embedding": embedding_vector
        })
        await redis_client.set(file_hash, cache_value, ex=30*24*3600)  # optional 30-day TTL

    # Step 8: Save to PostgreSQL
    try:
        candidate_doc = CandidateDocument(
            user_id=current_user.id,
            document_text=text_content,
            file_name=file.filename,
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


def delete_file(resume_id, db, current_user):
    candidate_doc = db.query(CandidateDocument).filter(
        CandidateDocument.resume_id == resume_id,
        CandidateDocument.user_id == current_user.id
    ).first()
    if not candidate_doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(candidate_doc)
    db.commit()
    return {"message": "Document deleted successfully"}

def get_all_documents(db, current_user):
    candidate_docs = db.query(CandidateDocument).filter(CandidateDocument.user_id == current_user.id).all()
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
                "file_name":doc.file_name,
                "created_at": doc.created_at
            }
            for doc in candidate_docs
        ]
    }

     