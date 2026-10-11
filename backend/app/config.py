import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory for backend
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file from Sahaya project root or backend folder
root_env = BASE_DIR.parent / ".env"
backend_env = BASE_DIR / ".env"

if root_env.exists():
    load_dotenv(root_env)
elif backend_env.exists():
    load_dotenv(backend_env)
else:
    load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# Database SQLite path
DB_PATH = BASE_DIR / "jan_sahayak.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Uploads directory for infrastructure images
UPLOADS_DIR = BASE_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

# Schemes JSON data path
SCHEMES_FILE = BASE_DIR / "data" / "schemes.json"

# Supported Indian languages
SUPPORTED_LANGUAGES = {
    "hi": "हिन्दी (Hindi)",
    "en": "English",
    "te": "తెలుగు (Telugu)",
    "ta": "தமிழ் (Tamil)",
    "bn": "বাংলা (Bengali)",
    "mr": "मराठी (Marathi)"
}

# Language speech recognition codes
LANGUAGE_SPEECH_CODES = {
    "hi": "hi-IN",
    "en": "en-IN",
    "te": "te-IN",
    "ta": "ta-IN",
    "bn": "bn-IN",
    "mr": "mr-IN"
}
