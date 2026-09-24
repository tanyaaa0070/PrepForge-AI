# PrepForge AI

> **AI-Powered Interactive Study Assistant**  
> An educational web tool that converts topics and notes into interactive flashcards and quizzes using structured LLM output, dual-layer validation, and intelligent wrong-answer retesting.

[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Pydantic-009688)](https://fastapi.tiangolo.com/)
[![AI Engine](https://img.shields.io/badge/AI-Google%20Gemini%20API-8E44AD)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Project Overview

**PrepForge AI** takes free-form study material or technical topics and turns them into an interactive learning application. It is **not a chatbot**—there are no conversation bubbles or raw text streams. Instead, a single input generates strictly structured JSON, validated on both the server and client, and rendered as interactive learning components.

### Core Features
- **Free-Form Input**: Paste lecture notes, syllabus topics, or interview questions.
- **Configurable Controls**: Select difficulty (*Beginner*, *Intermediate*, *Advanced*), mode (*Flashcards*, *Quiz*, *Mixed*), and question count (*5*, *10*, *15*).
- **Interactive Flashcards**: Self-paced active recall with question flip, answer reveal, and self-assessment (*"I Got It"* / *"I Got It Wrong"*).
- **Interactive MCQ Quiz**: One question at a time with 4 distinct choices, instant correctness feedback, and clear explanations.
- **Performance Analytics**: Real score percentage, total/correct/incorrect breakdown, and dynamic **Strong & Weak Areas** derived from topic categories.
- **Retest Wrong Answers**: Filter and re-run only the questions answered incorrectly until mastery is achieved.
- **Stale Response Protection**: Request ID synchronization and `AbortController` cancellation prevent race conditions from out-of-order network responses.
- **Graceful Error Handling**: Dedicated UI states for loading, network drops, malformed JSON, and server timeouts.

---

## 🛠 Tech Stack

| Domain | Technology | Reason Selected |
| :--- | :--- | :--- |
| **Frontend** | React 18 (Vite, JavaScript) | Functional components with hooks (`useState`, `useRef`, `useCallback`). No TypeScript overhead to maintain concise code clarity. |
| **Styling** | Vanilla CSS (CSS Variables) | Modern design tokens, custom glassmorphism, responsive grid/flexbox, zero heavy framework lock-in. |
| **Backend** | Python 3.11, FastAPI | High-performance asynchronous endpoint with automatic OpenAPI documentation. |
| **Validation** | Pydantic v2 (Server) + JS (Client) | Dual-layer validation ensures corrupted or malformed LLM responses never crash the UI. |
| **AI Engine** | Google Gemini API (`gemini-3.6-flash`) | Fast inference, structured JSON output mode, and free-tier accessibility. |

---

## 🏛 Architecture

```
User Input (Topic / Notes)
       ↓
React Frontend (Vite) ──[ AbortController + Request ID Guard ]
       ↓  POST /api/generate
FastAPI Backend Proxy (Python)
       ↓  Server-Side Only (Keeps GEMINI_API_KEY Secure)
Google Gemini API (JSON Mode)
       ↓  Raw JSON
Pydantic Validation (schemas.py)
       ↓  Validated StudySetResponse
Frontend Runtime Check (validateResult.js)
       ↓
Interactive UI (FlashcardDeck / Quiz / ResultDashboard)
```

> **Security Note**: The Gemini API key is strictly kept in the FastAPI backend environment. It is never exposed to the browser or client-side bundles.

---

## ⚡ Quick Start / Local Setup

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **Gemini API Key** ([Get free key from Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Backend Setup
```bash
cd backend

# Create & activate virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy template and add your GEMINI_API_KEY:
cp .env.example .env

# Run automated tests
python -m pytest test_schemas.py

# Start FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend runs at:* `http://127.0.0.1:8000` | *Docs:* `http://127.0.0.1:8000/docs`

### 2. Frontend Setup
```bash
# In a new terminal:
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```
*Frontend runs at:* `http://localhost:5173`

*(Alternatively, from the repository root, run `npm install --prefix frontend && npm start`)*

---

## 🛡️ Failure Modes & Defensive Engineering

| Failure Mode | Prevention & Handling |
| :--- | :--- |
| **Malformed JSON** | Prompt enforces `response_mime_type="application/json"`. The backend cleans any markdown fences (`clean_json_response`), catches `json.JSONDecodeError`, and returns HTTP 422 with a user-friendly error state. |
| **Wrong Shape / Missing Keys** | Backend Pydantic schema (`schemas.py`) strictly enforces that all cards have IDs, questions, and answers; quizzes must have exactly 4 options with `correct_answer` matching one option. Frontend re-checks via `validateResult.js`. |
| **Empty Response** | If no cards or questions are returned, the backend rejects the response and the frontend displays a visible retry button. |
| **Slow Response / Latency** | A multi-step animated `LoadingState` cycles through clear progress messages (*"Analyzing..."*, *"Generating..."*, *"Preparing..."*), preventing silent hangs. |
| **Stale Responses (Race Conditions)** | When a user rapidly clicks generate multiple times, `AbortController` cancels previous in-flight requests, and an incrementing `requestIdRef` counter ensures older responses resolving late are discarded. |
| **Network Failure** | Handled with an `ErrorState` component offering a **"Try Again"** button without crashing the app. |

---

## 📂 Project Structure

```
PrepForge-AI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          # Header with branding and AI badge
│   │   │   ├── PromptInput.jsx     # Free-form input, selectors, example prompt
│   │   │   ├── Flashcard.jsx       # Single flip card component
│   │   │   ├── FlashcardDeck.jsx   # Deck navigation, progress bar, counters
│   │   │   ├── QuestionCard.jsx    # Single MCQ with 4 options and feedback
│   │   │   ├── Quiz.jsx            # Quiz sequence manager
│   │   │   ├── ResultDashboard.jsx # Score, percentage, strong/weak areas, retest
│   │   │   ├── LoadingState.jsx    # Animated loading screen
│   │   │   └── ErrorState.jsx      # Error screen with retry action
│   │   ├── hooks/
│   │   │   └── useStudySession.js  # Central finite state machine & async logic
│   │   ├── lib/
│   │   │   ├── api.js              # Fetch client with AbortController
│   │   │   └── validateResult.js   # Client runtime validation
│   │   ├── App.jsx                 # View router based on session state
│   │   ├── App.css                 # Component styling
│   │   ├── index.css               # Design system & dark mode tokens
│   │   └── main.jsx                # React DOM mount
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── main.py                     # FastAPI app, CORS middleware, routes
│   ├── schemas.py                  # Pydantic request and response schemas
│   ├── ai_service.py               # Gemini API caller, model fallback, parser
│   ├── prompts.py                  # Strict prompt templates enforcing JSON schema
│   ├── test_schemas.py             # Pytest test suite for validation models
│   ├── requirements.txt            # Python dependencies
│   └── .env.example                # Backend environment template
│
├── .gitignore
├── package.json                    # Root script shortcuts (npm start / npm run build)
└── README.md
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
PORT=8000
HOST=0.0.0.0
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
```

---

## 🤖 AI Usage Note (Honest Disclosure)

In accordance with the assignment guidelines:
- **AI Coding Assistant**: AI was used as a productivity pair-programmer for scaffolding component templates, generating initial CSS color variables, and writing pytest test fixtures.
- **AI Integration**: The core product integrates **Google Gemini 3.6 Flash** via FastAPI to dynamically generate study content.
- **Original Architecture & Logic**: The finite state machine architecture (`useStudySession.js`), request-ID stale response guard, custom dual-layer validation (`validateResult.js` and `schemas.py`), and wrong-answer retesting logic were custom-designed for this assignment.

---

## ⏱️ Time Spent

Total development time: **~6 hours**
- **Architecture & JSON Schema Design**: ~1.0 hr
- **React Frontend & CSS Design System**: ~1.5 hrs
- **FastAPI Backend & Gemini Integration**: ~1.0 hr
- **Defensive Error Handling & Dual Validation**: ~1.5 hrs
- **Testing, Mobile Responsiveness & Polish**: ~1.0 hr

---

## ⚠️ Known Limitations

1. **Free Tier Rate Limits**: The Google Gemini free-tier has rate limits per minute (RPM). Rapid consecutive generation requests may return rate-limit responses.
2. **Session Persistence**: Sessions are currently stored in React state; refreshing the browser resets the session. (Can be extended with IndexedDB/LocalStorage).
3. **Prompt Character Limit**: Inputs are capped at 5,000 characters to ensure predictable LLM response latency.

---

## 📝 License

This project is licensed under the MIT License.
