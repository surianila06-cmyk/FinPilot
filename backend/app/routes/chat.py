from fastapi import APIRouter
from app.models.chat import ChatRequest
from app.planner.planner import planner

router = APIRouter(prefix="/api", tags=["Chat"])


@router.post("/chat")
def chat(request: ChatRequest):
    history = [m.model_dump() for m in (request.chat_history or [])]
    response = planner(
        query=request.question,
        profile=request.profile,
        chat_history=history,
    )
    return response