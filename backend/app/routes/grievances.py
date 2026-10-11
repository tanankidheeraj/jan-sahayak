import random
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Grievance
from app.schemas import GrievanceCreateRequest, GrievanceResponse, GrievanceStatusUpdate
from app.ai_service import classify_and_draft_grievance

router = APIRouter(prefix="/api/grievance", tags=["Grievance"])

@router.post("", response_model=GrievanceResponse)
def submit_grievance(req: GrievanceCreateRequest, db: Session = Depends(get_db)):
    """
    Files a citizen grievance.
    AI categorizes the complaint (water, roads, electricity, sanitation, health, other),
    computes urgency, assigns the government department, and auto-generates
    formal letters in English and citizen's chosen language.
    Returns tracking ID.
    """
    analysis = classify_and_draft_grievance(
        description=req.description,
        user_language=req.user_language or "en",
        citizen_name=req.citizen_name or "Citizen",
        city=req.city or "New Delhi"
    )

    # Generate unique Tracking ID e.g. GRV-2026-4821
    random_suffix = random.randint(1000, 9999)
    tracking_id = f"GRV-2026-{random_suffix}"
    
    # Ensure uniqueness
    while db.query(Grievance).filter(Grievance.id == tracking_id).first():
        random_suffix = random.randint(1000, 9999)
        tracking_id = f"GRV-2026-{random_suffix}"

    title = req.title or analysis.get("title_native") or analysis.get("title_en") or "Citizen Grievance"

    grievance = Grievance(
        id=tracking_id,
        title=title,
        description=req.description,
        user_language=req.user_language or "en",
        translated_title_en=analysis.get("title_en", title),
        translated_description_en=analysis.get("formal_letter_en", req.description),
        formal_letter=analysis.get("formal_letter_native") or analysis.get("formal_letter_en"),
        category=analysis.get("category", "other"),
        urgency=analysis.get("urgency", "Medium"),
        department=analysis.get("department", "Municipal Department"),
        status="Open",
        citizen_name=req.citizen_name or "Citizen",
        citizen_phone=req.citizen_phone,
        address=req.address or f"Ward, {req.city or 'New Delhi'}",
        city=req.city or "New Delhi",
        latitude=req.latitude,
        longitude=req.longitude,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(grievance)
    db.commit()
    db.refresh(grievance)
    return grievance


@router.get("/{grievance_id}", response_model=GrievanceResponse)
def get_grievance_by_id(grievance_id: str, db: Session = Depends(get_db)):
    """Retrieve grievance status and full redressal dossier by tracking ID."""
    clean_id = grievance_id.strip().upper()
    grievance = db.query(Grievance).filter(Grievance.id == clean_id).first()
    if not grievance:
        # Also try case-insensitive or partial match
        grievance = db.query(Grievance).filter(Grievance.id.ilike(f"%{clean_id}%")).first()
        
    if not grievance:
        raise HTTPException(
            status_code=404,
            detail=f"Grievance with Tracking ID '{grievance_id}' not found. Please verify the ID."
        )
    return grievance


@router.patch("/{grievance_id}/status", response_model=GrievanceResponse)
def update_grievance_status(
    grievance_id: str,
    body: GrievanceStatusUpdate,
    db: Session = Depends(get_db)
):
    """Admin updates status (Open, In Progress, Resolved) and adds resolution notes."""
    clean_id = grievance_id.strip().upper()
    grievance = db.query(Grievance).filter(Grievance.id == clean_id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")

    valid_statuses = ["Open", "In Progress", "Resolved"]
    if body.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{body.status}'. Must be one of: {', '.join(valid_statuses)}"
        )

    grievance.status = body.status
    if body.resolution_notes:
        grievance.resolution_notes = body.resolution_notes
    grievance.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(grievance)
    return grievance


# Also provide plural route GET /api/grievances for listing
list_router = APIRouter(prefix="/api/grievances", tags=["Grievances List"])

@list_router.get("", response_model=List[GrievanceResponse])
def list_grievances(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    query = db.query(Grievance)
    if status and status.lower() != "all":
        query = query.filter(Grievance.status.ilike(status))
    if category and category.lower() != "all":
        query = query.filter(Grievance.category.ilike(category))
    if city and city.lower() != "all":
        query = query.filter(Grievance.city.ilike(city))
        
    return query.order_by(Grievance.created_at.desc()).limit(limit).all()
