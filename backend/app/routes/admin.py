from collections import Counter
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Grievance, IssueReport
from app.schemas import AdminStatsResponse, AdminSummaryResponse, GrievanceResponse, IssueReportResponse
from app.ai_service import generate_admin_weekly_summary

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(db: Session = Depends(get_db)):
    """
    Computes real-time governance metrics:
    Total complaints, category distribution, resolution rate, city breakdown, and hotspots.
    """
    grievances = db.query(Grievance).all()
    issues = db.query(IssueReport).all()

    total_g = len(grievances)
    total_i = len(issues)
    total_cases = total_g + total_i

    # Count by category
    category_counts = Counter()
    for g in grievances:
        category_counts[g.category] += 1
    for i in issues:
        category_counts[i.category] += 1

    # Count by status
    status_counts = Counter()
    for g in grievances:
        status_counts[g.status] += 1
    for i in issues:
        status_counts[i.status] += 1

    # Count by city
    city_counts = Counter()
    for g in grievances:
        if g.city:
            city_counts[g.city] += 1
    for i in issues:
        if i.city:
            city_counts[i.city] += 1

    # Count by urgency
    urgency_counts = Counter()
    for g in grievances:
        urgency_counts[g.urgency] += 1

    # Calculate resolution rate
    resolved_count = status_counts.get("Resolved", 0)
    res_rate = round((resolved_count / total_cases * 100), 1) if total_cases > 0 else 0.0

    # Calculate hotspots
    hotspots = []
    for city, count in city_counts.most_common(6):
        # find open issues in that city
        open_in_city = sum(1 for g in grievances if g.city == city and g.status != "Resolved") + \
                       sum(1 for i in issues if i.city == city and i.status != "Resolved")
        hotspots.append({
            "location": city,
            "total_complaints": count,
            "unresolved_cases": open_in_city,
            "intensity": "High" if count >= 6 else ("Medium" if count >= 3 else "Low")
        })

    recent_g = db.query(Grievance).order_by(Grievance.created_at.desc()).limit(10).all()
    recent_i = db.query(IssueReport).order_by(IssueReport.created_at.desc()).limit(10).all()

    return AdminStatsResponse(
        total_grievances=total_g,
        total_issue_reports=total_i,
        total_cases=total_cases,
        resolution_rate_percent=res_rate,
        by_category=dict(category_counts),
        by_status=dict(status_counts),
        by_city=dict(city_counts),
        by_urgency=dict(urgency_counts),
        hotspots=hotspots,
        recent_grievances=[GrievanceResponse.model_validate(g) for g in recent_g],
        recent_issues=[IssueReportResponse.model_validate(i) for i in recent_i]
    )

@router.get("/summary", response_model=AdminSummaryResponse)
def get_admin_summary(db: Session = Depends(get_db)):
    """Generates AI-written weekly summary of citizen grievance trends and hotspots."""
    grievances = db.query(Grievance).all()
    issues = db.query(IssueReport).all()
    total_cases = len(grievances) + len(issues)

    category_counts = Counter([g.category for g in grievances] + [i.category for i in issues])
    status_counts = Counter([g.status for g in grievances] + [i.status for i in issues])
    city_counts = Counter([g.city for g in grievances if g.city] + [i.city for i in issues if i.city])

    res_rate = round((status_counts.get("Resolved", 0) / max(total_cases, 1) * 100), 1)

    summary_data = generate_admin_weekly_summary({
        "total_cases": total_cases,
        "resolution_rate": res_rate,
        "by_category": dict(category_counts),
        "by_status": dict(status_counts),
        "by_city": dict(city_counts)
    }, total_cases=total_cases)

    return AdminSummaryResponse(
        executive_summary=summary_data.get("executive_summary", "Weekly civic grievance analysis."),
        emerging_trends=summary_data.get("emerging_trends", []),
        critical_hotspots=summary_data.get("critical_hotspots", []),
        key_recommendations=summary_data.get("key_recommendations", []),
        generated_at=datetime.utcnow().strftime("%d %b %Y, %I:%M %p UTC"),
        ai_powered=summary_data.get("ai_powered", False)
    )
