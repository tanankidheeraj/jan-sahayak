# 🇮🇳 Jan Sahayak (जन सहायक)
### AI for Bharat & Public Services
> A voice-first, multilingual AI assistant empowering Indian citizens to discover welfare schemes, lodge civic grievances with automated departmental routing, and report public infrastructure issues with Vision AI and live GIS maps.

---

## 🌟 Highlights & Problem Statement
Over 800 million citizens across Bharat encounter linguistic, bureaucratic, and digital barriers when trying to navigate government welfare benefits, report civic hazards (potholes, garbage, water leaks), or track grievance redressal.

**Jan Sahayak** bridges this divide by providing:
1. **Multilingual Voice-First Interface:** Supports **Hindi, English, Telugu, Tamil, Bengali, and Marathi** with browser Speech-to-Text (STT) and Text-to-Speech (TTS) read-aloud.
2. **Citizen Scheme Finder:** Evaluates age, state, income, gender, occupation, and social category against **26+ real central and state schemes** (PM-KISAN, Ayushman Bharat, PMAY, PM Ujjwala, PM MUDRA, etc.) with eligibility match scores and step-by-step guides.
3. **Automated Grievance Redressal:** Citizens describe issues by voice or text. AI categorizes the problem (water, roads, electricity, sanitation, health), sets urgency, assigns the municipal department, and auto-generates formal grievance letters in English and the citizen's mother tongue with unique tracking IDs (`GRV-2026-XXXX`).
4. **Public Infrastructure Reporter:** Snap/upload photos of broken infrastructure; Gemini Vision AI detects defects, calculates severity, captures browser GPS, and drops pins on an interactive OpenStreetMap.
5. **Official Governance Command Dashboard (`/admin`):** Real-time command center for municipal officials with complaint volume metrics, hotspot density analysis, one-click status transitions (Open → In Progress → Resolved), and an AI-generated weekly executive briefing.
6. **Universal Accessibility:** WCAG AAA High-Contrast mode, Large Text (`A+`) mode, keyboard navigable, and optimized for low-end mobile browsers.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons |
| **Backend** | FastAPI (Python 3.11), SQLAlchemy ORM, Pydantic v2, Uvicorn |
| **Database** | SQLite with pre-seeded sample grievances across Indian cities |
| **AI & Vision** | Google Gemini API (`gemini-1.5-flash`), PIL, resilient NLP fallbacks |
| **Voice / Speech** | Web Speech API (Speech Recognition & Speech Synthesis) |
| **Mapping & GIS** | Leaflet & OpenStreetMap |

---

## 🚀 Quick Setup & Local Execution

Everything runs locally with **one command for backend** and **one command for frontend**.

### 1. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# (Optional) Create and activate virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server (auto-seeds 30 sample complaints on startup)
python run.py
```
> The backend server starts at **`http://localhost:8000`** (Swagger docs at `http://localhost:8000/docs`).

### 2. Frontend Setup
```bash
# In a new terminal, navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
> The frontend application starts at **`http://localhost:3000`**.

### 3. Environment Variables (Optional)
Create a `.env` file in the root or `backend` folder:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> 🛡️ **Zero-Crash Resilience**: If `GEMINI_API_KEY` is not provided, Jan Sahayak gracefully switches to its built-in rule and NLP analytical engine without crashing.

---

## 📸 Screenshots & Key Views

### 1. Multilingual Voice-First Citizen Assistant (`/chat`)
- Select between Hindi, Telugu, Tamil, Bengali, Marathi, or English.
- Tap the saffron microphone button to speak. Tap "Read Aloud" to listen to responses.

### 2. Scheme Finder Wizard (`/schemes`)
- Enter age, occupation, and family income.
- Instant match scoring across 26+ schemes with required documents and direct official portal links.

### 3. Grievance Filing & Live Tracking (`/grievance`)
- Voice-enabled grievance lodge with AI departmental classification.
- Bilingual formal administrative letters and live status timeline tracker.

### 4. Infrastructure Issue Reporter (`/report-issue`)
- Photo defect upload with Gemini Vision analysis, hazard advisories, and GPS geolocation.

### 5. Official Governance Command Center (`/admin`)
- Real-time resolution metrics, hotspot cluster maps, AI weekly trend briefing, and status action buttons.

---

## ⏱️ 2-Minute Demo Script for Judges

**[0:00 - 0:25] The Problem & Voice Accessibility**
- *"Judges, over 800 million Indian citizens face language and digital barriers accessing public services. Meet Jan Sahayak — a voice-first, multilingual citizen AI assistant."*
- Click the language selector to **हिन्दी (Hindi)**. Click the microphone button and say:
  > *"पीएम किसान योजना के तहत मुझे ₹6,000 कैसे मिलेंगे?"*
- Show the instant response in Hindi and click the **"सुनें (Read Aloud)"** speaker button to demonstrate real-time Speech Synthesis.

**[0:25 - 0:50] Smart Scheme Matching**
- Navigate to **"योजना खोजें (Scheme Finder)"**.
- Select **Age: 32**, **Occupation: Farmer**, **Income: ₹1,80,000**. Click **"पात्र योजनाएं खोजें"**.
- Point out the match results: **PM-KISAN (100% Match)**, **PM Fasal Bima**, **Kisan Credit Card**.
- Click **"View Documents & Steps"** to show required documents (Aadhaar, Khatauni) and the official direct link.

**[0:50 - 1:20] Grievance Redressal & Bilingual Letters**
- Navigate to **"शिकायत दर्ज करें (File Grievance)"**.
- Type: *"For the past 4 days, drinking water pipeline has burst in Sector 14, flooding the street and causing foul smell."*
- Click **Submit Grievance with AI**.
- Highlight the AI result:
  - Categorized as **Water** with **High urgency**.
  - Routed to **Municipal Water Supply & Sewerage Board**.
  - Generated **Tracking ID** (e.g. `GRV-2026-4821`).
  - Auto-generated formal complaint letters in both **English and Hindi**.

**[1:20 - 1:40] Infrastructure Photo Vision & GPS Geotagging**
- Navigate to **"समस्या रिपोर्ट (Report Defect)"**.
- Upload a photo of a road pothole or leaking pipe. Click **"Detect GPS Location"**.
- Click **"Analyze & Submit Issue"**.
- Show the Gemini Vision output: detected defect, severity level, and safety hazard warning mapped directly onto OpenStreetMap.

**[1:40 - 2:00] Official Admin Dashboard (`/admin`)**
- Navigate to **`/admin`**.
- Present the 30 pre-seeded complaints across Delhi, Mumbai, Bengaluru, etc.
- Show the **AI Weekly Executive Briefing** identifying emerging trends and hotspots.
- Click an **"In Progress"** or **"Resolved"** button on the live action desk to demonstrate real-time status transitions.
- Conclude: *"Jan Sahayak turns every citizen into an active participant in governance and gives officials real-time operational clarity."*

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Multilingual conversation with speech code & suggestions |
| `POST` | `/api/schemes/match` | Matches citizen profile against 26+ schemes |
| `GET` | `/api/schemes` | Catalog of all schemes with category & keyword filters |
| `POST` | `/api/grievance` | Classifies complaint, assigns department, creates tracking ID |
| `GET` | `/api/grievance/{id}` | Fetches grievance dossier & timeline by tracking ID |
| `GET` | `/api/grievances` | Lists all grievances with status & city filters |
| `PATCH` | `/api/grievance/{id}/status` | Admin updates status (`Open`, `In Progress`, `Resolved`) |
| `POST` | `/api/report-issue` | Uploads photo, runs Gemini Vision, tags GPS lat/lng |
| `GET` | `/api/reports` | Returns all geo-tagged infrastructure defect reports |
| `GET` | `/api/admin/stats` | Aggregated metrics, category counts, hotspots |
| `GET` | `/api/admin/summary` | AI-written weekly trends & policy recommendations |
| `GET` | `/api/health` | Backend and Gemini configuration health status |
