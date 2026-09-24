# StudyGen AI

> **AI-Powered Study Assistant** — Convert topics, lecture notes, or interview prep materials into interactive flashcards and quizzes with double-layer JSON validation and intelligent score tracking.

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20JS-blue)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Pydantic-009688)](https://fastapi.tiangolo.com/)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini%20API-8E44AD)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Project Overview

**StudyGen AI** is an educational web application designed for students and professionals preparing for technical interviews or exams. Unlike typical conversational chatbots, StudyGen AI is **purpose-built for active recall and deliberate practice**:

1. The user provides a study topic, syllabus notes, or interview prep prompts.
2. The user configures difficulty (**Beginner**, **Intermediate**, **Advanced**), learning mode (**Flashcards**, **Quiz**, **Mixed**), and question count (**5**, **10**, **15**).
3. The FastAPI backend invokes the **Google Gemini API** with strict structured JSON constraints.
4. Data passes through **two layers of validation** (server-side via **Pydantic**, client-side via custom JavaScript runtime checks) before any UI renders.
5. The React frontend presents **interactive 3D-styled flashcards**, **single-question multiple choice quizzes**, **instant explanations**, a **result dashboard** with strong/weak topic identification, and **wrong-answer retesting**.

---

## 🎯 Features

- **Topic & Notes Input**: Large customizable prompt area with a quick-fill example prompt for rapid testing.
- **Difficulty Selection**: Beginner, Intermediate, and Advanced tiers to match user proficiency.
- **Question Count Controls**: Select between 5, 10, or 15 questions.
- **Learning Modes**:
  - **Flashcard Mode**: Self-paced active recall cards with flip-to-reveal answers and self-assessment buttons (*"I Got It"* / *"I Got It Wrong"*).
  - **Quiz Mode**: Multiple-choice questions (MCQ) presented one at a time with 4 distinct options, real-time answer verification, and in-depth explanations.
  - **Mixed Mode**: Seamless progression through flashcards followed immediately by the quiz.
- **Scoring & Performance Analytics**: Calculates overall percentage score, total questions, correct/incorrect counters, and breaks down performance into **Strong Areas** and **Weak Areas** dynamically computed from category tags.
- **Retest Wrong Answers**: Dedicated review flow that filters solely to questions answered incorrectly until mastery is achieved.
- **Stale Response Protection**: Request ID synchronization and `AbortController` cancellation prevent race conditions and out-of-order API responses from corrupting state.
- **Multi-Phase Loading State**: Dynamic animated loading screen communicating progress ("Analyzing...", "Generating...", "Preparing...").
- **Graceful Error Handling**: User-friendly error screens for missing API keys, network outages, timeout errors, or invalid payloads without exposing raw stack traces.
- **Fully Responsive UI**: Mobile-first fluid CSS design tested across 390px, 768px, 1024px, and 1440px displays.

---

## 🛠 Tech Stack

| Domain | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, JavaScript | Lightweight, component-driven, fast HMR, and hook-based lifecycle. No TypeScript overhead to keep interview walkthroughs concise. |
| **Styling** | Vanilla CSS (CSS Variables) | Modern design tokens, custom glassmorphism, responsive grid/flexbox, zero heavy UI framework lock-in. |
| **Backend** | Python 3.11, FastAPI | Async request handling, native OpenAPI documentation, lightweight footprint, and direct Pydantic integration. |
| **Validation** | Pydantic v2 (Backend) + Custom JS (Frontend) | Double-boundary validation ensures corrupted or malformed LLM responses never reach the UI. |
| **AI Engine** | Google Gemini API (`gemini-1.5-flash`) | Fast token generation, free-tier accessibility, and native JSON mode configuration. |
| **Deployment** | Vercel (Frontend) + Render (Backend) | Independent scalability, SSL by default, and isolated environment variables. |

---

## 🏛 Architecture

```
React Frontend (Vercel)
        ↓  HTTPS (POST /api/generate)
FastAPI Backend (Render)
        ↓  REST / SDK
Google Gemini API (gemini-1.5-flash)
        ↓  Raw JSON Response
Pydantic Validation (Backend Schema)
        ↓  Structured JSON
JavaScript Validation (Frontend Library)
        ↓  Validated State
Interactive UI (FlashcardDeck / Quiz / ResultDashboard)
```

---

## 📂 Project Structure

```
studygen-ai/
│
├── frontend/                       # React Single Page Application (Vite)
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          # Top brand navigation & AI status badge
│   │   │   ├── PromptInput.jsx     # Topic input, select controls, submit handler
│   │   │   ├── Flashcard.jsx       # Single flashcard flip & content component
│   │   │   ├── FlashcardDeck.jsx   # Deck navigation, progress bar, counters
│   │   │   ├── QuestionCard.jsx    # Single MCQ card with option selection
│   │   │   ├── Quiz.jsx            # Quiz sequence manager & feedback
│   │   │   ├── ResultDashboard.jsx # Score, percentage, strong/weak areas, retest
│   │   │   ├── LoadingState.jsx    # Animated loading indicator with step messages
│   │   │   └── ErrorState.jsx      # Friendly error displays and retry actions
│   │   ├── hooks/
│   │   │   └── useStudySession.js  # Centralized state management & async handlers
│   │   ├── lib/
│   │   │   ├── api.js              # Fetch service with AbortController support
│   │   │   └── validateResult.js   # Client-side runtime validation
│   │   ├── App.jsx                 # View router based on session state
│   │   ├── App.css                 # Component-specific styles
│   │   ├── index.css               # Global tokens, typography, dark theme
│   │   └── main.jsx                # DOM mounting & React.StrictMode
│   ├── .env.example                # Frontend environment template
│   ├── package.json
│   └── vite.config.js
│
├── backend/                        # FastAPI Application
│   ├── main.py                     # API endpoints, CORS middleware, runner
│   ├── schemas.py                  # Pydantic models for request & AI response
│   ├── ai_service.py               # Gemini prompt orchestration & JSON parsing
│   ├── prompts.py                  # System instruction & prompt templates
│   ├── test_schemas.py             # Pytest test suite for validation models
│   ├── requirements.txt            # Python dependencies
│   └── .env.example                # Backend environment template
│
├── .gitignore                      # Git ignore rules (secrets, venvs, builds)
└── README.md                       # Comprehensive documentation
```

---

## 🔄 How It Works

1. **User Submission**: The user enters notes or an interview topic into `PromptInput.jsx` and clicks **"Generate Study Set"**.
2. **Client Validation**: The frontend checks that the topic contains at least 3 characters before initiating the network call.
3. **Backend Request**: `api.js` makes an HTTP `POST` to `/api/generate` with an `AbortSignal`.
4. **Prompt Construction**: `backend/prompts.py` builds a prompt requiring Gemini to return strictly schema-adherent JSON.
5. **AI Execution**: `backend/ai_service.py` invokes Gemini with `response_mime_type="application/json"`.
6. **Backend Validation**: `schemas.py` validates that:
   - Root fields exist (`title`, `summary`, `cards`, `quiz`).
   - Every MCQ contains exactly 4 distinct options.
   - Every MCQ's `correct_answer` matches one of the 4 options.
   - Every flashcard has a non-empty question and answer.
7. **Frontend Runtime Validation**: `validateResult.js` re-verifies the payload structure on the client before saving it to React state.
8. **Interactive Practice**: The user flips cards, answers quiz questions, views explanations, and inspects their dynamic mastery breakdown.

---

## 🤖 AI Integration & Structured JSON

Gemini is instructed through system guidelines and few-shot schema definitions:

```json
{
  "title": "Machine Learning Fundamentals",
  "summary": "Key interview concepts in supervised learning, regression, and tree models.",
  "cards": [
    {
      "id": "card-1",
      "question": "What is the primary difference between Bagging and Boosting?",
      "answer": "Bagging trains learners in parallel on bootstrap samples; Boosting trains learners sequentially to correct prior errors.",
      "category": "Ensemble Learning",
      "difficulty": "intermediate",
      "tags": ["machine-learning", "algorithms"]
    }
  ],
  "quiz": [
    {
      "id": "quiz-1",
      "question": "Which loss function is standard for binary classification?",
      "options": [
        "Binary Cross-Entropy",
        "Mean Squared Error",
        "Huber Loss",
        "Hinge Loss"
      ],
      "correct_answer": "Binary Cross-Entropy",
      "explanation": "Binary Cross-Entropy measures performance where output is a probability value between 0 and 1.",
      "category": "Loss Functions",
      "difficulty": "intermediate"
    }
  ]
}
```

---

## 🛡️ Validation & Error Handling

### 1. Dual-Layer Validation
- **Layer 1 (Backend - Pydantic v2)**: Rejects malformed LLM responses before sending them over the wire (`422 Unprocessable Entity`).
- **Layer 2 (Frontend - JavaScript)**: Re-validates data integrity inside `validateResult.js` to ensure the UI never crashes on undefined property reads.

### 2. Stale Response Protection
When users trigger multiple requests consecutively:
- An internal `requestIdRef` counter is incremented per request.
- Outgoing requests use `AbortController` to cancel in-flight HTTP calls.
- If an older response resolves after a newer request has started, it is discarded immediately without state overwrites.

### 3. Graceful Error Fallbacks
- Server down / Network failure: `Unable to connect to the server. Please check your internet connection.`
- Missing backend API key: `GEMINI_API_KEY is not configured on the server. Please add GEMINI_API_KEY to backend/.env.`
- Upstream AI failure: `AI service is temporarily unavailable. Please try again.`

---

## 🚀 Local Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **Google Gemini API Key**: [Get a free key here](https://aistudio.google.com/app/apikey)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/studygen-ai.git
cd studygen-ai
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env
# Edit .env and enter your real GEMINI_API_KEY:
# GEMINI_API_KEY=AIzaSy...

# Start backend server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend will be running at:* `http://127.0.0.1:8000`  
*API Docs (Swagger):* `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
# Open a new terminal in the studygen-ai directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
copy .env.example .env
# Default points to: VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
```
*Frontend will be running at:* `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key (Secret) | `AIzaSyD-xxxxxxxxxxxx` |
| `FRONTEND_URL` | Allowed origin for CORS | `http://localhost:5173` |
| `PORT` | Server listening port | `8000` |
| `HOST` | Server host interface | `0.0.0.0` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the FastAPI backend | `http://localhost:8000` |

> ⚠️ **Important Security Rule**: `GEMINI_API_KEY` is strictly confined to the backend server. It is **never** prefixed with `VITE_` and never imported into React.

---

## 📡 API Endpoints

### 1. `GET /api/health`
Health check to verify server availability.
- **Response**: `200 OK`
```json
{
  "status": "ok"
}
```

### 2. `POST /api/generate`
Generates a structured study set from user input.
- **Request Body**:
```json
{
  "input": "Prepare me for a Python interview covering OOP, decorators, and generators.",
  "difficulty": "intermediate",
  "mode": "mixed",
  "question_count": 10
}
```
- **Response**: `200 OK` (Returns `StudySetResponse` schema)
- **Error Codes**:
  - `422 Unprocessable Entity`: Input failed validation or missing Gemini key.
  - `503 Service Unavailable`: Upstream Gemini API timeout or quota limit.
  - `500 Internal Server Error`: Unexpected server issue.

---

## 🌐 Deployment Guide

### Deploy Backend to Render
1. Push your repository to GitHub.
2. Log in to [Render](https://render.com/) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: `<your_gemini_api_key>`
   - `FRONTEND_URL`: `https://your-frontend.vercel.app`
6. Deploy the service and copy the provided URL (e.g. `https://studygen-api.onrender.com`).

### Deploy Frontend to Vercel
1. Log in to [Vercel](https://vercel.com/) and click **Add New...** -> **Project**.
2. Select your GitHub repository.
3. Configure the project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://studygen-api.onrender.com` (your deployed Render URL)
5. Click **Deploy**.

---

## ⚠️ Known Limitations

- **LLM Rate Limits**: Free-tier Gemini keys have request quotas per minute (RPM). High-frequency generation requests may encounter temporary rate limit responses.
- **Session Persistence**: Study sessions currently reside in React memory (`useState`). Refreshing the browser page resets the current session.
- **Token Input Ceiling**: Inputs are capped at 5,000 characters to prevent excessive context latency on free-tier LLM endpoints.

---

## 💡 Future Improvements

1. **Export to Anki / PDF**: Allow users to download flashcards as `.apkg` files or printable study guides.
2. **Local History (IndexedDB)**: Persist past study sets locally in the browser so users can review previous sets offline.
3. **Spaced Repetition (SM-2 Algorithm)**: Implement interval scheduling based on card difficulty and review history.
4. **Custom MCQ Distractor Tweaks**: Let users adjust the subtlety of wrong options for advanced exam simulations.

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
