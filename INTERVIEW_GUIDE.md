# 🎓 StudyGen AI — Final Deliverables & Interview Mastery Guide

---

## 1. 📂 Final Folder Structure

```
studygen-ai/
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          # Sticky header with branding & AI badge
│   │   │   ├── PromptInput.jsx     # Topic input, select controls, submit handler
│   │   │   ├── Flashcard.jsx       # Single flashcard flip & content component
│   │   │   ├── FlashcardDeck.jsx   # Deck navigation, progress bar, counters
│   │   │   ├── QuestionCard.jsx    # Single MCQ card with option selection
│   │   │   ├── Quiz.jsx            # Quiz sequence manager & feedback
│   │   │   ├── ResultDashboard.jsx # Score, percentage, strong/weak areas, retest
│   │   │   ├── LoadingState.jsx    # Multi-step animated loading indicator
│   │   │   └── ErrorState.jsx      # User-friendly error displays and retry actions
│   │   ├── hooks/
│   │   │   └── useStudySession.js  # Centralized state management & async handlers
│   │   ├── lib/
│   │   │   ├── api.js              # Fetch service with AbortController support
│   │   │   └── validateResult.js   # Client-side runtime validation
│   │   ├── App.jsx                 # View router based on session state
│   │   ├── App.css                 # Component-specific styles
│   │   ├── index.css               # Global tokens, typography, dark theme
│   │   └── main.jsx                # DOM mounting & React.StrictMode
│   ├── .env                        # Local development environment (ignored by git)
│   ├── .env.example                # Frontend environment template
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── main.py                     # API endpoints, CORS middleware, runner
│   ├── schemas.py                  # Pydantic models for request & AI response
│   ├── ai_service.py               # Gemini prompt orchestration & JSON parsing
│   ├── prompts.py                  # System instruction & prompt templates
│   ├── test_schemas.py             # Pytest test suite for validation models
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # Local backend environment (ignored by git)
│   └── .env.example                # Backend environment template
│
├── .gitignore                      # Git ignore rules (secrets, venvs, builds)
├── README.md                       # Comprehensive documentation
└── INTERVIEW_GUIDE.md              # Interview pitch, Q&A, and bug scenarios
```

---

## 2. ⚡ Complete Local Setup Instructions

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **Google Gemini API Key** (Free from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

### Backend Setup (Terminal 1)

```bash
cd backend

# 1. Create a virtual environment
python -m venv .venv

# 2. Activate the virtual environment
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create your local .env file
# Add your Gemini API key to backend/.env:
GEMINI_API_KEY=AIzaSy...
FRONTEND_URL=http://localhost:5173
PORT=8000
HOST=0.0.0.0

# 5. Run automated tests to verify schemas
python -m pytest test_schemas.py

# 6. Start the FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- Health check: `http://127.0.0.1:8000/api/health`
- Interactive Swagger docs: `http://127.0.0.1:8000/docs`

---

### Frontend Setup (Terminal 2)

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Configure .env file
# frontend/.env contains:
VITE_API_URL=http://localhost:8000

# 3. Verify production build
npm run build

# 4. Start Vite development server
npm run dev
```
- Application UI: `http://localhost:5173`

---

## 3. 🔐 Environment Variables Summary

| Scope | Variable | Purpose | Value Example |
| :--- | :--- | :--- | :--- |
| **Backend** | `GEMINI_API_KEY` | Secret authentication key for Google Gemini API | `AIzaSyD-xxx...` |
| **Backend** | `FRONTEND_URL` | Allowed origin for CORS middleware | `http://localhost:5173` or `https://app.vercel.app` |
| **Backend** | `PORT` | Listening port for Render production | `8000` |
| **Backend** | `HOST` | Interface binding for production | `0.0.0.0` |
| **Frontend** | `VITE_API_URL` | Base URL of the backend API | `http://localhost:8000` or `https://api.onrender.com` |

---

## 4. 🐙 GitHub Instructions

Your local Git repository is initialized with clean, atomic commits:

```bash
# In e:\PrepForge AI:
# 1. Create a new empty repository on GitHub named "studygen-ai"
# 2. Link your local repo to GitHub:
git remote add origin https://github.com/<your-username>/studygen-ai.git
git branch -M main
git push -u origin main
```

---

## 5. ☁️ Deployment Instructions

### A. Deploy Backend to Render (Free Tier)
1. Sign up/log in at [Render.com](https://render.com/).
2. Click **New +** → **Web Service**.
3. Select your GitHub repository (`studygen-ai`).
4. Configure service details:
   - **Name**: `studygen-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **Advanced** → **Add Environment Variable**:
   - `GEMINI_API_KEY`: Paste your Gemini API key.
   - `FRONTEND_URL`: `https://studygen-ai.vercel.app` (or your Vercel URL).
6. Click **Create Web Service**. Note the deployed URL (e.g., `https://studygen-api.onrender.com`).

### B. Deploy Frontend to Vercel
1. Sign up/log in at [Vercel.com](https://vercel.com/).
2. Click **Add New...** → **Project**.
3. Select your `studygen-ai` repository.
4. Configure project settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**:
   - `VITE_API_URL`: `https://studygen-api.onrender.com` (your Render URL from step A).
6. Click **Deploy**.

---

## 6. 🎙️ Project Explanation for Interviews

### 30-Second Elevator Pitch
> *"StudyGen AI is an AI-powered active recall study assistant. Instead of a generic conversational chatbot, users enter any topic or study notes, and our system generates strictly structured flashcards and multiple-choice quizzes. It uses Google's Gemini API with a FastAPI backend and implements a dual-layer validation architecture: Pydantic on the server and runtime JavaScript checks on the client. On the frontend, users get interactive flip cards, timed MCQs with instant explanations, dynamic performance analytics identifying strong versus weak topics, and wrong-answer retesting."*

---

### 2-Minute Detailed Project Walkthrough
> *"When building StudyGen AI, the primary goal was to avoid the common anti-pattern of wrapping an LLM in a chat bubble interface. Chatbots encourage passive reading, whereas effective studying requires active recall and deliberate practice.*
>
> *Here is how the architecture works:*
> 1. **Client Layer**: *Built in React 18 with Vite and pure JavaScript. The UI state is orchestrated by a single custom hook, `useStudySession`. It acts as a finite state machine transitioning through `input`, `loading`, `flashcards`, `quiz`, and `results`.*
> 2. **Network & Concurrency**: *To protect against race conditions, we implement stale response protection. Each generation request increments an internal request ID counter and creates an `AbortController`. If a user fires a second request while the first is in-flight, the first is canceled, preventing stale data from overwriting new state.*
> 3. **Backend & Security**: *The React frontend never talks directly to Gemini. Calling an LLM from client-side JavaScript exposes API keys in browser network tabs. Instead, the call routes through our FastAPI backend, keeping `GEMINI_API_KEY` strictly server-side.*
> 4. **Prompt Engineering & Validation**: *FastAPI constructs an educational prompt enforcing JSON mode (`response_mime_type="application/json"`). Before returning data to the client, Pydantic validates that root keys exist, every card has questions and answers, and every quiz question has exactly 4 options with the correct answer matching one of them.*
> 5. **Client-Side Verification & Analytics**: *Before rendering, `validateResult.js` on the frontend re-verifies the payload. During review, the app tracks user performance in real-time, categorizes strong versus weak topics from metadata tags, and provides a targeted 'Retest Wrong Answers' feature until full mastery is achieved."*

---

## 7. ❓ Essential Interview Questions & Answers

### Q1: Why use React instead of Vanilla JavaScript or Next.js?
**Answer:**
> *"React's component-based model and declarative state updates are ideal for dynamic interfaces like interactive flashcard flips, multi-step quizzes, and score dashboards. We chose Vite with standard React SPA rather than Next.js because this application is entirely client-interactive behind a single generation step. SSR (Server-Side Rendering) was unnecessary for our use case and would add unnecessary server infrastructure complexity."*

### Q2: Why FastAPI for the backend?
**Answer:**
> *"FastAPI is asynchronous, lightweight, and has first-class integration with Pydantic. It provides high throughput with Python's `asyncio`, automatically generates OpenAPI (Swagger) documentation, and performs request/response serialization with type enforcement in milliseconds."*

### Q3: Why can't the Gemini API key be in React?
**Answer:**
> *"Any environment variable bundled into a frontend build (like Vite's `VITE_` variables) is embedded into the client-side JavaScript bundle. Anyone inspecting the browser's DevTools Sources tab or Network requests could extract the API key and abuse the developer's quota or incur financial charges. Keeping the key in the FastAPI backend guarantees it never touches the client."*

### Q4: Why structured JSON instead of streaming text?
**Answer:**
> *"Streaming raw text is great for conversational bots, but StudyGen AI needs to render rich, interactive UI components: progress bars, 4-option radio buttons, card flipping, and categorical score analytics. Structured JSON turns generative AI into reliable data structures that components can safely parse and render."*

### Q5: What happens if Gemini returns malformed JSON or markdown fences?
**Answer:**
> *"We handle this at multiple layers:*
> *First, we pass `response_mime_type="application/json"` to Gemini's generation config to force valid JSON output.*
> *Second, in `backend/ai_service.py`, our regex cleaner `clean_json_response()` strips any potential ` ```json ` markdown code fences.*
> *Third, if JSON decoding fails, we catch `json.JSONDecodeError` and return a clean HTTP 422 error detail rather than crashing the server.*
> *Fourth, Pydantic validates the parsed dictionary against our `StudySetResponse` schema."*

### Q6: How does the "Retest Wrong Answers" feature work under the hood?
**Answer:**
> *"During the quiz or flashcard session, user responses are captured in React state: `answers: [{ question, selectedOption, isCorrect }]`. When the session finishes, we filter `answers` where `isCorrect === false`. Clicking 'Retest Wrong Answers' sets `isRetesting: true`, populates `retestQuestions` with only those wrong items, and restarts the quiz component with the filtered subset."*

### Q7: How does Stale Response Protection work?
**Answer:**
> *"If a user submits Topic A, then changes their mind and quickly submits Topic B, Topic A might finish after Topic B due to network variance. We solve this with two techniques:*
> 1. *`AbortController.abort()` cancels the in-flight HTTP request.*
> 2. *An incrementing `requestIdRef` counter: when a response arrives, we check `if (thisRequestId !== requestIdRef.current) return;`. If the request ID is stale, the response is discarded silently."*

### Q8: How is CORS configured?
**Answer:**
> *"FastAPI's `CORSMiddleware` is configured to allow `http://localhost:5173` in local development and the production URL stored in the `FRONTEND_URL` environment variable. We explicitly do not use wildcard `allow_origins=['*']` in production to prevent unauthorized cross-origin requests."*

---

## 8. 🐛 Tricky Bugs Interviewers Might Ask You to Fix

### Scenario 1: *"An option in the MCQ contains leading/trailing whitespace, causing `correct_answer === selectedOption` to evaluate to false even when correct."*
**Fix**: In `QuestionCard.jsx`, normalize both sides with `.trim()`:
```javascript
const isCorrect = isSubmitted && selectedOption?.trim() === question.correct_answer?.trim();
```

### Scenario 2: *"User clicks 'Show Answer' on Flashcard 1, then clicks 'Next'. Flashcard 2 opens with its answer already visible."*
**Fix**: Reset `showAnswer` to `false` whenever navigating cards:
```javascript
const goToNext = () => {
  setShowAnswer(false);
  setCurrentIndex(prev => prev + 1);
};
```

### Scenario 3: *"Gemini generates 3 options instead of 4 for a quiz question."*
**Fix**: Handled by our Pydantic validator in `schemas.py`:
```python
@field_validator("options")
@classmethod
def validate_options_count(cls, v: List[str]) -> List[str]:
    if len(v) != 4:
        raise ValueError(f"Quiz question must have exactly 4 options, got {len(v)}.")
    return v
```
*If validation fails, the backend catches it and returns HTTP 422, prompting the user to regenerate.*

### Scenario 4: *"A slow mobile 3G connection causes network timeout and leaves the UI frozen in the loading state."*
**Fix**: Handled in `api.js` via AbortController and try/catch error boundaries that reset `isLoading` and transition `view` to `'error'`.

---

## 9. 🚀 Future Production Improvements

1. **Local Storage / IndexedDB Cache**: Cache generated study sets by topic hash so revisiting the same topic loads instantly without consuming LLM tokens.
2. **Spaced Repetition Algorithm (SuperMemo SM-2)**: Add review scheduling (1 day, 3 days, 1 week intervals) based on card recall difficulty.
3. **Anki (.apkg) & PDF Export**: Export generated flashcards directly to popular spaced repetition software.
4. **Voice Interaction**: Integrate Web Speech API for auditory flashcard prompts and voice recall.
