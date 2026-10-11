import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base, SessionLocal
from app.config import UPLOADS_DIR, GEMINI_API_KEY
from app.seed_data import seed_database
from app.ai_service import is_gemini_active

from app.routes.chat import router as chat_router
from app.routes.schemes import router as schemes_router
from app.routes.grievances import router as grievance_router, list_router as grievances_list_router
from app.routes.issues import router as issues_router
from app.routes.admin import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema is created
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed sample complaints on initial launch
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
        
    yield

app = FastAPI(
    title="Jan Sahayak (जन सहायक) API",
    description="AI-powered Multilingual Citizen Services, Scheme Matching, Grievance Redressal, and Civic Infrastructure API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware to allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for static images
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# Include Routers
app.include_router(chat_router)
app.include_router(schemes_router)
app.include_router(grievance_router)
app.include_router(grievances_list_router)
app.include_router(issues_router)
app.include_router(admin_router)

@app.get("/")
def root():
    return {
        "app": "Jan Sahayak (जन सहायक) Backend",
        "status": "online",
        "docs": "/docs",
        "gemini_active": is_gemini_active(),
        "gemini_status_message": "Gemini API connected and ready." if is_gemini_active() else "Gemini API key is not set. Resilient local NLP engine active."
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "gemini_configured": bool(GEMINI_API_KEY),
        "gemini_active": is_gemini_active(),
        "database": "connected"
    }
