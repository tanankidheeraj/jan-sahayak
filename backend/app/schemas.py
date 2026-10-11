from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Chat schemas
class ChatMessageItem(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"
    session_id: Optional[str] = None
    history: Optional[List[ChatMessageItem]] = []

class ChatResponse(BaseModel):
    reply: str
    detected_language: str
    speech_lang_code: str
    suggested_actions: Optional[List[str]] = []
    gemini_active: bool = True

# Scheme matching schemas
class SchemeMatchRequest(BaseModel):
    age: int = Field(..., ge=0, le=120)
    state: str = Field(default="All")
    income: float = Field(default=0, ge=0)
    occupation: str = Field(default="Any")
    gender: str = Field(default="All")  # "All", "Female", "Male"
    category: str = Field(default="General")  # "General", "OBC", "SC", "ST", "BPL", "Minority"

class SchemeItem(BaseModel):
    id: str
    name: str
    name_hi: Optional[str] = None
    category: str
    ministry: str
    description: str
    benefits: str
    documents_required: List[str]
    application_steps: List[str]
    official_portal: str
    match_score: int  # 0 to 100
    match_reasons: List[str]

class SchemeMatchResponse(BaseModel):
    user_profile: Dict[str, Any]
    total_matched: int
    schemes: List[SchemeItem]

# Grievance schemas
class GrievanceCreateRequest(BaseModel):
    description: str
    title: Optional[str] = None
    user_language: Optional[str] = "en"
    citizen_name: Optional[str] = "Citizen"
    citizen_phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = "New Delhi"
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class GrievanceResponse(BaseModel):
    id: str
    title: str
    description: str
    user_language: str
    translated_title_en: Optional[str] = None
    translated_description_en: Optional[str] = None
    formal_letter: Optional[str] = None
    category: str
    urgency: str
    department: str
    status: str
    citizen_name: Optional[str] = None
    citizen_phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class GrievanceStatusUpdate(BaseModel):
    status: str  # "Open", "In Progress", "Resolved"
    resolution_notes: Optional[str] = None

# Infrastructure Issue schemas
class IssueReportResponse(BaseModel):
    id: str
    image_url: str
    detected_issue: str
    severity: str
    category: str
    safety_notes: Optional[str] = None
    description: Optional[str] = None
    latitude: float
    longitude: float
    address: Optional[str] = None
    city: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Admin statistics schemas
class AdminStatsResponse(BaseModel):
    total_grievances: int
    total_issue_reports: int
    total_cases: int
    resolution_rate_percent: float
    by_category: Dict[str, int]
    by_status: Dict[str, int]
    by_city: Dict[str, int]
    by_urgency: Dict[str, int]
    hotspots: List[Dict[str, Any]]
    recent_grievances: List[GrievanceResponse]
    recent_issues: List[IssueReportResponse]

class AdminSummaryResponse(BaseModel):
    executive_summary: str
    emerging_trends: List[str]
    critical_hotspots: List[str]
    key_recommendations: List[str]
    generated_at: str
    ai_powered: bool
