from App.schema.interview_schema import InterviewReportSchema
from fastapi import HTTPException
import json
from App.model.candidate_documents import CandidateDocument
from groq import Groq
import os
from google import genai

def get_resume(db, resume_id, user_id):
    return db.query(CandidateDocument).filter(
        CandidateDocument.resume_id == resume_id,
        CandidateDocument.user_id == user_id
    ).first()


def get_embedding(text):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    response = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=text
    )

    return response.embeddings[0].values

def get_relevant_chunks(db, resume_id, query_embedding, top_k=3):
    return (
        db.query(CandidateDocument)
        .filter(CandidateDocument.resume_id == resume_id)
        .order_by(CandidateDocument.embedding.cosine_distance(query_embedding))
        .limit(top_k)
        .all()
    )

def call_llm(prompt):
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    return response.choices[0].message.content


def parse_evaluation_response(response: str):

    try:
        data = json.loads(response)
        validated = InterviewReportSchema(**data)
        return validated

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid LLM response format: {str(e)}"
        )

