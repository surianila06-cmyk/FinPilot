import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from pypdf import PdfReader
from app.services.gemini_service import extract_financial_profile
from app.services.health_score import calculate_financial_score, score_label
from app.config.settings import MAX_UPLOAD_MB

router = APIRouter(prefix="/api", tags=["Upload"])

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

MAX_BYTES = MAX_UPLOAD_MB * 1024 * 1024  # Convert MB → bytes


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # ── Validate content type ────────────────────────────────────────────
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # ── Read into memory ─────────────────────────────────────────────────
    contents = await file.read()

    # ── Server-side size check ───────────────────────────────────────────
    if len(contents) > MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_UPLOAD_MB}MB.",
        )

    # ── Save with unique name to avoid collision ─────────────────────────
    safe_name = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_FOLDER, safe_name)

    try:
        with open(file_path, "wb") as f:
            f.write(contents)

        # ── Extract PDF text ─────────────────────────────────────────────
        reader = PdfReader(file_path)
        extracted_text = ""
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"

        if not extracted_text.strip():
            raise HTTPException(
                status_code=422,
                detail="Could not extract readable text from PDF.",
            )

        # ── Extract financial profile ────────────────────────────────────
        profile = extract_financial_profile(extracted_text)
        score = calculate_financial_score(profile)

        return {
            "filename": file.filename,
            "pages": len(reader.pages),
            "financial_profile": profile,
            "financial_score": score,
            "score_label": score_label(score),
        }

    finally:
        # ── Clean up temp file ───────────────────────────────────────────
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except OSError:
                pass
