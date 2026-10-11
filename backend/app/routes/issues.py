import os
import uuid
import random
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, Form, File, UploadFile, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import UPLOADS_DIR
from app.models import IssueReport
from app.schemas import IssueReportResponse
from app.ai_service import analyze_infrastructure_image

router = APIRouter(tags=["Infrastructure Issues"])

@router.post("/api/report-issue", response_model=IssueReportResponse)
async def report_civic_issue(
    image: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    description: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    city: Optional[str] = Form("Delhi NCR"),
    db: Session = Depends(get_db)
):
    """
    Submits civic infrastructure defect report (pothole, garbage, streetlight, water leak).
    Stores uploaded image and uses Gemini Vision to detect issue and calculate severity.
    """
    # Generate unique filename
    ext = os.path.splitext(image.filename)[1] if image.filename else ".jpg"
    if not ext:
        ext = ".jpg"
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = UPLOADS_DIR / unique_filename

    # Save uploaded bytes
    contents = await image.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    # Analyze image with Gemini Vision / heuristic engine
    analysis = analyze_infrastructure_image(str(file_path), user_description=description)

    report_id = f"ISSUE-2026-{random.randint(1000, 9999)}"
    while db.query(IssueReport).filter(IssueReport.id == report_id).first():
        report_id = f"ISSUE-2026-{random.randint(1000, 9999)}"

    issue_report = IssueReport(
        id=report_id,
        image_url=f"/uploads/{unique_filename}",
        detected_issue=analysis.get("detected_issue", "Civic Infrastructure Defect"),
        severity=analysis.get("severity", "Medium"),
        category=analysis.get("category", "roads"),
        safety_notes=analysis.get("safety_notes", "Hazardous condition reported."),
        description=analysis.get("description", description or "Captured on camera."),
        latitude=latitude,
        longitude=longitude,
        address=address or f"Lat: {latitude:.4f}, Lng: {longitude:.4f}",
        city=city or "Delhi NCR",
        status="Open",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(issue_report)
    db.commit()
    db.refresh(issue_report)
    return issue_report


@router.get("/api/reports", response_model=List[IssueReportResponse])
def get_all_reports(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Returns all geo-tagged infrastructure issues for Leaflet map visualization."""
    query = db.query(IssueReport)
    if category and category.lower() != "all":
        query = query.filter(IssueReport.category.ilike(category))
    if status and status.lower() != "all":
        query = query.filter(IssueReport.status.ilike(status))
    if city and city.lower() != "all":
        query = query.filter(IssueReport.city.ilike(city))
        
    return query.order_by(IssueReport.created_at.desc()).all()
