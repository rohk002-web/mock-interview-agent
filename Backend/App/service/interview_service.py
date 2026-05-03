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
from App.service.embedding_logic import get_embedding, get_relevant_chunks, call_llm, parse_evaluation_response

def start_interview_service(db, interview_id, user_id):

    interview = db.query(CandidateInterviewDetails).filter(
        CandidateInterviewDetails.interview_id == interview_id,
        CandidateInterviewDetails.user_id == user_id
    ).first()

    if not interview:
        raise ValueError("Interview not found")

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

    last = db.query(InterviewChatHistory)\
        .filter_by(interview_id=interview.interview_id)\
        .order_by(InterviewChatHistory.created_at.desc())\
        .first()

    last.answer = user_answer
    db.commit()

    query_embedding = get_embedding(user_answer)

    relevant_chunks = get_relevant_chunks(
        db,
        interview.resume_id,
        query_embedding,
        top_k=3
    )

    resume_context = "\n".join([c.document_text for c in relevant_chunks])

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

    next_question = result.strip()

    db.add(InterviewChatHistory(
        interview_id=interview.interview_id,
        question=next_question
    ))
    db.commit()

    return {"question": next_question}



def end_interview_service(db, interview_id, current_user):

    interview = db.query(CandidateInterviewDetails).filter(
        CandidateInterviewDetails.interview_id == interview_id,
        CandidateInterviewDetails.user_id == current_user.id
    ).first()

    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    chats = db.query(InterviewChatHistory).filter(
        InterviewChatHistory.interview_id == interview_id
    ).all()

    if not chats:
        raise HTTPException(status_code=400, detail="No interview data found")

    chat_history = ""
    for c in chats:
        chat_history += f"""
        Q: {c.question}
        A: {c.answer}
        -------------------
        """

    prompt = EVALUATION_PROMPT.format(chat_history=chat_history)

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