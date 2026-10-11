from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, DateTime
from app.database import Base

class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    user_language = Column(String(10), default="en")
    
    # Official generated versions
    translated_title_en = Column(String(255), nullable=True)
    translated_description_en = Column(Text, nullable=True)
    formal_letter = Column(Text, nullable=True)  # Formal draft in English/Citizen language
    
    category = Column(String(50), nullable=False)  # water, roads, electricity, sanitation, health, other
    urgency = Column(String(20), default="Medium")  # Low, Medium, High, Critical
    department = Column(String(150), nullable=False)
    status = Column(String(30), default="Open")  # Open, In Progress, Resolved
    
    citizen_name = Column(String(150), default="Anonymous Citizen")
    citizen_phone = Column(String(20), nullable=True)
    address = Column(String(255), nullable=True)
    city = Column(String(100), default="New Delhi")
    
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class IssueReport(Base):
    __tablename__ = "issue_reports"

    id = Column(String(50), primary_key=True, index=True)
    image_url = Column(String(255), nullable=False)
    detected_issue = Column(String(150), nullable=False)  # e.g. "Severe Pothole", "Garbage Dump Overflow"
    severity = Column(String(20), default="Medium")  # Low, Medium, High, Critical
    category = Column(String(50), default="roads")  # roads, sanitation, electricity, water, other
    safety_notes = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String(255), default="Geo-located Point")
    city = Column(String(100), default="Delhi NCR")
    status = Column(String(30), default="Open")  # Open, In Progress, Resolved
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ChatSessionMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(100), index=True)
    role = Column(String(20))  # user, assistant
    language = Column(String(10), default="en")
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
