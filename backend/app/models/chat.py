from pydantic import BaseModel
from typing import Any


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    question: str
    profile: dict[str, Any]
    chat_history: list[ChatMessage] = []