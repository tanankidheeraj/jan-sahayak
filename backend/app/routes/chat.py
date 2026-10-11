from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ChatRequest, ChatResponse
from app.models import ChatSessionMessage
from app.ai_service import chat_with_assistant

router = APIRouter(prefix="/api/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
def handle_chat_message(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Multilingual conversation endpoint.
    Supports Hindi, English, Telugu, Tamil, Bengali, Marathi.
    Returns citizen-friendly concise answers and speech code for TTS.
    """
    history_dicts = [{"role": h.role, "content": h.content} for h in (req.history or [])]
    
    result = chat_with_assistant(
        message=req.message,
        language=req.language or "en",
        history=history_dicts
    )

    # Optionally persist message to SQLite
    if req.session_id:
        try:
            user_msg = ChatSessionMessage(
                session_id=req.session_id,
                role="user",
                language=result.get("detected_language", "en"),
                content=req.message
            )
            bot_msg = ChatSessionMessage(
                session_id=req.session_id,
                role="assistant",
                language=result.get("detected_language", "en"),
                content=result.get("reply", "")
            )
            db.add(user_msg)
            db.add(bot_msg)
            db.commit()
        except Exception as e:
            db.rollback()
            print(f"Error saving chat log: {e}")

    return ChatResponse(
        reply=result["reply"],
        detected_language=result["detected_language"],
        speech_lang_code=result["speech_lang_code"],
        suggested_actions=result.get("suggested_actions", []),
        gemini_active=result.get("gemini_active", False)
    )
