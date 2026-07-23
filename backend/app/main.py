from fastapi import FastAPI

app = FastAPI(
    title="FinPilot AI Backend",
    version="1.0.0",
    description="Agentic AI Financial Copilot Backend"
)

@app.get("/")
async def root():
    return {
        "status": "success",
        "message": "FinPilot AI Backend is running!"
    }