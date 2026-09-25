# PrepForge AI

AI-powered study assistant that converts any topic or notes into interactive flashcards and quizzes.

Built with **React + Vite** (frontend), **FastAPI + Pydantic** (backend), and **Google Gemini API** (AI).

---

## Live Demo

- **Frontend App:** [https://prepforge-ai-omega.vercel.app](https://prepforge-ai-omega.vercel.app)
- **Backend API (Health Check):** [https://prepforge-ai-1.onrender.com/api/health](https://prepforge-ai-1.onrender.com/api/health)

---

## Features

- Enter any topic, paste notes, or describe what you want to learn
- Choose difficulty (Beginner / Intermediate / Advanced)
- Choose mode (Flashcards / Quiz / Mixed) and question count (5 / 10 / 15)
- AI generates structured flashcards and MCQ quiz questions
- Flip-style flashcards with self-assessment tracking
- One-at-a-time quiz with instant feedback and explanations
- Score dashboard with strong/weak area breakdown
- Retest only the questions you got wrong
- Full error handling, loading states, and mobile responsive UI

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, JavaScript, CSS |
| Backend | Python, FastAPI, Pydantic |
| AI | Google Gemini API (gemini-3.6-flash) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Architecture

```
User Input → React Frontend → POST /api/generate → FastAPI Backend → Gemini API
                                                         ↓
                                                   Pydantic Validation
                                                         ↓
                                              Structured JSON Response
                                                         ↓
                                           Frontend JS Validation → Interactive UI
```

The Gemini API key stays on the backend. It is never exposed to the browser.

---

## Project Structure

```
PrepForge-AI/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── PromptInput.jsx
│       │   ├── Flashcard.jsx
│       │   ├── FlashcardDeck.jsx
│       │   ├── QuestionCard.jsx
│       │   ├── Quiz.jsx
│       │   ├── ResultDashboard.jsx
│       │   ├── LoadingState.jsx
│       │   └── ErrorState.jsx
│       ├── hooks/
│       │   └── useStudySession.js
│       ├── lib/
│       │   ├── api.js
│       │   └── validateResult.js
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── main.py
│   ├── schemas.py
│   ├── ai_service.py
│   ├── prompts.py
│   └── test_schemas.py
│
└── README.md
```

---

## How to Run

### 1. Get a Gemini API Key

Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a free API key.

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```
GEMINI_API_KEY=your_key_here
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/generate` | Generate flashcards and quiz from user input |

### POST /api/generate — Request Body

```json
{
  "input": "Explain Python decorators and generators",
  "difficulty": "intermediate",
  "mode": "mixed",
  "question_count": 10
}
```

---

## Validation

AI output is validated twice before rendering:

1. **Backend (Pydantic)** — Checks JSON structure, required fields, exactly 4 MCQ options, correct answer matches an option
2. **Frontend (JavaScript)** — Re-validates before React renders anything

If validation fails, the user sees an error message with a retry button. The app never crashes on bad AI output.

---

## License

MIT
