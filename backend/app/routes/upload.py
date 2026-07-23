from fastapi import APIRouter, UploadFile, File, HTTPException
import os
from pypdf import PdfReader
from app.services.gemini_service import extract_financial_profile
from app.services.health_score import calculate_financial_score

router = APIRouter(
    prefix="/api",
    tags=["Upload"]
)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # Accept only PDFs
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Save uploaded file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Read PDF
    reader = PdfReader(file_path)

    extracted_text = ""

    for page in reader.pages:
        text = page.extract_text()
        if text:
            extracted_text += text + "\n"

    profile = extract_financial_profile(extracted_text)
    score = calculate_financial_score(profile)

    return {
        "filename": file.filename,
        "pages": len(reader.pages),
        "financial_profile": profile,
        "financial_score": score
    }