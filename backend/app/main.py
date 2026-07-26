from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.profile import router as profile_router
from app.routes.gemini import router as gemini_router
from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router

app = FastAPI(
    title="FinPilot AI Backend",
    version="1.0.0",
    description="Agentic AI Financial Copilot Backend"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "https://fin-pilot-zeta.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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