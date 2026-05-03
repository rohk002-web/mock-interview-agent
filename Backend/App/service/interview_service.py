from App.Prompt.interview_prompt import INTERVIEW_START_PROMPT, CHAT_PROMPT , EVALUATION_PROMPT
from App.schema.interview_schema import InterviewReportSchema
from fastapi import HTTPException
import json
from App.model.candidate_documents import CandidateDocument
from App.model.candidate_interview_details import CandidateInterviewDetails
from App.model.interview_chat import InterviewChatHistory
from groq import Groq
from App.model.interview_report import InterviewReport
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


def start_interview_service(db, interview_id, user_id):

    interview = db.query(CandidateInterviewDetails).filter(
        CandidateInterviewDetails.interview_id == interview_id,
        CandidateInterviewDetails.user_id == user_id
    ).first()

    if not interview:
        raise ValueError("Interview not found")

    # create dummy embedding for role-based retrieval
    query_embedding = get_embedding(
        f"{interview.role} {interview.interview_level}"
    )

    chunks = get_relevant_chunks(
        db,
        interview.resume_id,
        query_embedding,
        top_k=5
    )

    resume_context = "\n".join([c.document_text for c in chunks])

    prompt = INTERVIEW_START_PROMPT.format(
        resume=resume_context,
        role=interview.role,
        experience=interview.years_of_experience,
        level=interview.interview_level
    )

    question = call_llm(prompt)

    db.add(InterviewChatHistory(
        interview_id=interview.interview_id,
        question=question
    ))
    db.commit()

    return {"question": question}


def chat_service(db, interview_id, user_id, user_answer):

    interview = db.query(CandidateInterviewDetails).filter(
        CandidateInterviewDetails.interview_id == interview_id,
        CandidateInterviewDetails.user_id == user_id
    ).first()

    if not interview:
        raise ValueError("Interview not found")

    # STEP 1: GET LAST QUESTION
    last = db.query(InterviewChatHistory)\
        .filter_by(interview_id=interview.interview_id)\
        .order_by(InterviewChatHistory.created_at.desc())\
        .first()

    last.answer = user_answer
    db.commit()

    # STEP 2: CREATE EMBEDDING FOR USER ANSWER
    query_embedding = get_embedding(user_answer)

    # STEP 3: VECTOR SEARCH (MOST IMPORTANT PART)
    relevant_chunks = get_relevant_chunks(
        db,
        interview.resume_id,
        query_embedding,
        top_k=3
    )

    resume_context = "\n".join([c.document_text for c in relevant_chunks])

    # STEP 4: LLM PROMPT
    prompt = CHAT_PROMPT.format(
        resume=resume_context,
        question=last.question,
        answer=user_answer,
        role=interview.role,
        level=interview.interview_level
    )

    result = call_llm(prompt)

    if "INTERVIEW_END" in result:
        return {"message": "Interview Completed"}

    next_question = result.split("Next Question:")[-1]

    db.add(InterviewChatHistory(
        interview_id=interview.interview_id,
        question=next_question
    ))
    db.commit()

    return {"response": result}




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



def end_interview_service(db, interview_id, current_user):

    # STEP 1: validate interview
    interview = db.query(CandidateInterviewDetails).filter(
        CandidateInterviewDetails.interview_id == interview_id,
        CandidateInterviewDetails.user_id == current_user.id
    ).first()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    # STEP 2: get chat history
    chats = db.query(InterviewChatHistory).filter(
        InterviewChatHistory.interview_id == interview_id
    ).all()

    if not chats:
        raise HTTPException(status_code=400, detail="No interview data found")

    # STEP 3: format history
    chat_history_text = ""
    for c in chats:
        chat_history_text += f"""
        Q: {c.question}
        A: {c.answer}
        Score: {c.score}
        Feedback: {c.feedback}
        -------------------
        """

    prompt = EVALUATION_PROMPT.format(chat_history=chat_history_text)
    response = call_llm(prompt)

    result = parse_evaluation_response(response)

    return result


def interview_save_report(db, report, current_user):
    try:
        new_report = InterviewReport(
            user_id=current_user.id,
             interview_report={
                "total_score": report.total_score,
                "weak_topics": report.weak_topics,
                "improvement_suggestions": report.improvement_suggestions,
                "summary": report.summary
             }
        )

        db.add(new_report)
        db.commit()
        db.refresh(new_report)

        return {
            "message": "Report saved successfully"
        }

    except Exception as e:
        raise Exception(f"Failed to save report: {str(e)}")
    

def get_interview_report_service(db, user_id):
    interviews = db.query(InterviewReport).filter(
        InterviewReport.user_id == user_id
    ).all()

    if not interviews:
        return {
            "message": "No interview Report found",
            "interview_report": []
        }

    return {
        "message": "Interview Report retrieved successfully",
        "interview_report": [
            {
                "total_score": interview.interview_report["total_score"],
                "weak_topics": interview.interview_report["weak_topics"],
                "improvement_suggestions": interview.interview_report["improvement_suggestions"],
                "summary": interview.interview_report["summary"]
            }
            for interview in interviews
        ]
    }