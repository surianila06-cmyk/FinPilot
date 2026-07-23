from fastapi import FastAPI

from app.routes.profile import router as profile_router
from app.routes.gemini import router as gemini_router
from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router

app = FastAPI(
    title="FinPilot AI Backend",
    version="1.0.0",
    description="Agentic AI Financial Copilot Backend"
)

# Register all routes
app.include_router(profile_router)
app.include_router(gemini_router)
app.include_router(upload_router)
app.include_router(chat_router)

@app.get("/")
async def root():
    return {
        "status": "success",
        "message": "FinPilot AI Backend is running!"
    }