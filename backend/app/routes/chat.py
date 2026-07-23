from fastapi import APIRouter
from app.models.chat import ChatRequest
from app.planner.planner import planner

router = APIRouter(
    prefix="/api",
    tags=["Chat"]
)


@router.post("/chat")
def chat(request: ChatRequest):

    response = planner(
        request.question,
        request.profile
    )

    return response