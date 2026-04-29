from pydantic import BaseModel

class ChatRequest(BaseModel):
    user_answer: str


class InterviewReportSchema(BaseModel):
    total_score: int
    weak_topics: list[str]
    improvement_suggestions: list[str]
    summary: str

class InterviewReportResponse(BaseModel):
    message: str