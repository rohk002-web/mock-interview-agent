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

def get_resume(db, resume_id, user_id):
    return db.query(CandidateDocument).filter(
        CandidateDocument.resume_id == resume_id,
        CandidateDocument.user_id == user_id
    ).first()


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
    
    resume = get_resume(db, interview.resume_id, interview.user_id)

    prompt = INTERVIEW_START_PROMPT.format(
        resume=resume.document_text,
        role=interview.role,
        experience=interview.years_of_experience,
        level=interview.interview_level
    )

    question = call_llm(prompt)
    
    chat_record = InterviewChatHistory(
        interview_id=interview.interview_id,
        question=question
    )
    db.add(chat_record)
    db.commit()

    return {
        "question": question
    }


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

    if not last:
        raise ValueError("No active interview session found")
    
    last.answer = user_answer
    db.commit()
    
    resume = get_resume(db, interview.resume_id, interview.user_id)

    prompt = CHAT_PROMPT.format(
        resume=resume.document_text,
        question=last.question,
        answer=user_answer
    )

    result = call_llm(prompt)
    if "INTERVIEW_END" in result:
        return {"message": "Interview Completed"}

    next_question = result.split("3. Next Question:")[-1]

    new_row = InterviewChatHistory(
        interview_id=interview.interview_id,
        question=next_question
    )

    db.add(new_row)
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