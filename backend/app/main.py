from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.profile import router as profile_router
from app.routes.gemini import router as gemini_router
from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router

app = FastAPI(
    title="FinPilot AI Backend",
    version="2.0.0",
    description="Agentic AI Financial Copilot — PDF parsing, financial health scoring, goal planning & personalized advice.",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
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

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(profile_router)
app.include_router(gemini_router)
app.include_router(upload_router)
app.include_router(chat_router)


@app.get("/")
async def root():
    return {
        "status": "success",
        "message": "FinPilot AI Backend v2.0 is running!",
        "version": "2.0.0",
    }


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "service": "FinPilot AI Backend",
        "version": "2.0.0",
    }