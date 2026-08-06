import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.profile import router as profile_router
from app.routes.gemini import router as gemini_router
from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router

app = FastAPI(
    title="Prospera AI Backend",
    version="2.0.0",
    description="Agentic AI Financial Copilot — PDF parsing, financial health scoring, goal planning & personalized advice.",
)

# ---------------------- CORS ----------------------

DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Extra comma-separated origins from env, e.g. "https://finpilot.example.com"
ENV_ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
    if o.strip()
]

DEFAULT_ORIGIN_REGEX = r"https://.*\.vercel\.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[*DEFAULT_ALLOWED_ORIGINS, *ENV_ALLOWED_ORIGINS],
    allow_origin_regex=os.getenv("CORS_ALLOWED_ORIGIN_REGEX", DEFAULT_ORIGIN_REGEX),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------- Routers ----------------------

app.include_router(profile_router)
app.include_router(gemini_router)
app.include_router(upload_router)
app.include_router(chat_router)

# ---------------------- Root ----------------------

@app.get("/")
async def root():
    return {
        "status": "success",
        "message": "Prospera AI Backend v2.0 is running!",
        "version": "2.0.0",
    }

# ---------------------- Health Check ----------------------

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "service": "Prospera AI Backend",
        "version": "2.0.0",
    }