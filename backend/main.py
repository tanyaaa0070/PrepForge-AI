import os
import logging
from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from schemas import GenerateRequest, StudySetResponse
from ai_service import generate_study_content

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("studygen.main")

# Initialize FastAPI application
app = FastAPI(
    title="StudyGen AI API",
    description="Backend API for AI-powered study assistant generating structured flashcards and quizzes.",
    version="1.0.0",
)

# CORS Configuration
frontend_url = os.getenv("FRONTEND_URL", "").rstrip("/")
allowed_origins: List[str] = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]
if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/api/health", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Health check endpoint to verify backend service readiness.
    """
    return {"status": "ok"}


@app.post(
    "/api/generate",
    response_model=StudySetResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Study Set",
    description="Accepts user topic/notes, calls Gemini LLM, validates output, and returns structured flashcards and quiz questions."
)
async def generate_study_set(request: GenerateRequest):
    """
    Generates structured flashcards and quiz content from user notes/topics.
    """
    logger.info(
        f"Generate request received: mode={request.mode}, "
        f"difficulty={request.difficulty}, count={request.question_count}"
    )

    try:
        study_set = await generate_study_content(request)
        logger.info(
            f"Successfully generated study set '{study_set.title}' with "
            f"{len(study_set.cards)} cards and {len(study_set.quiz)} quiz questions."
        )
        return study_set

    except ValueError as val_err:
        logger.warning(f"Validation or generation error: {val_err}")
        # User-friendly validation or configuration error
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(val_err),
        )

    except RuntimeError as run_err:
        logger.error(f"Upstream AI service error: {run_err}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service is temporarily unavailable or returned an error. Please try again.",
        )

    except Exception as e:
        logger.exception(f"Unexpected server error during study set generation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while generating your study set. Please try again.",
        )


if __name__ == "__main__":
    # Render and production deployment port compatibility
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    logger.info(f"Starting StudyGen AI backend on {host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=True)
