import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
APP_ENV: str = os.getenv("APP_ENV", "development")
MAX_UPLOAD_MB: int = int(os.getenv("MAX_UPLOAD_MB", "10"))