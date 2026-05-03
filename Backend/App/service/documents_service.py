import os
import fitz 
from dotenv import load_dotenv
from google import genai
from App.model.candidate_documents import CandidateDocument
from fastapi import HTTPException
import redis.asyncio as redis
import uuid
from collections import defaultdict

load_dotenv()

redis_host = os.getenv('REDIS_HOST')
redis_port = os.getenv('REDIS_PORT')
redis_db = os.getenv('REDIS_DB')

def split_text(text, chunk_size=200):
    words = text.split()
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)

    return chunks

async def process_resume_file(file, db, current_user):
    pdf_bytes = await file.read()

    if not pdf_bytes:
        raise Exception("Empty file")

    # Extract text
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text_content = "".join(page.get_text() for page in doc)

    if not text_content.strip():
        raise Exception("No text found")

    # Chunk text
    chunks = split_text(text_content, chunk_size=200)

    if not chunks:
        raise Exception("Chunking failed")

    api_key = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)

    embeddings_list = []

    for chunk in chunks:
        response = await client.aio.models.embed_content(
            model="gemini-embedding-001",
            contents=chunk
        )

        embeddings_list.append({
            "chunk": chunk,
            "embedding": response.embeddings[0].values
        })

    try:
        docs = []

        resume_uuid = uuid.uuid4()

        for item in embeddings_list:
            docs.append(
                CandidateDocument(
                    id=uuid.uuid4(),  
                    resume_id=resume_uuid,        
                    user_id=current_user.id,
                    document_text=item["chunk"],
                    file_name=file.filename,
                    embedding=list(item["embedding"])
                )
            )

        db.add_all(docs)
        db.commit()

        return {
            "message": "Resume processed successfully",
            "resume_id": str(resume_uuid),
            "chunks_stored": len(docs)
        }

    except Exception as e:
        db.rollback()
        raise Exception(f"DB error: {str(e)}")



def get_all_documents(db, current_user):
    candidate_docs = (
        db.query(CandidateDocument)
        .filter(CandidateDocument.user_id == current_user.id)
        .all()
    )

    if not candidate_docs:
        return {
            "message": "No documents found",
            "documents": []
        }

    # ✅ GROUP BY resume_id
    grouped = defaultdict(list)

    for doc in candidate_docs:
        grouped[str(doc.resume_id)].append(doc)

    response = []

    for resume_id, docs in grouped.items():
        # merge all chunks into one text
        full_text = " ".join(d.document_text for d in docs)

        response.append({
            "resume_id": resume_id,
            "document_text": full_text,   
            "file_name": docs[0].file_name,
            "created_at": docs[0].created_at
        })

    return {
        "message": "Documents retrieved successfully",
        "documents": response
    }


def delete_file(resume_id, db, current_user):
    candidate_doc = db.query(CandidateDocument).filter(
        CandidateDocument.resume_id == resume_id,
        CandidateDocument.user_id == current_user.id
    ).all()
    if not candidate_doc:
        raise HTTPException(status_code=404, detail="Document not found")
    

    for doc in candidate_doc:
        db.delete(doc)


    db.commit()
    return {"message": "Document deleted successfully"}
     