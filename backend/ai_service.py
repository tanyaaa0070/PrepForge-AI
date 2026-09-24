import os
import re
import json
import logging
from typing import Any, Dict
from dotenv import load_dotenv

import google.generativeai as genai
from schemas import GenerateRequest, StudySetResponse
from prompts import build_generation_prompt

# Load environment variables
load_dotenv()

logger = logging.getLogger("studygen.ai_service")


def clean_json_response(raw_text: str) -> str:
    """
    Strips code block wrappers (e.g. ```json ... ```) or whitespace
    to ensure clean, parseable JSON text.
    """
    text = raw_text.strip()
    # Match markdown code block if present
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        return match.group(1).strip()
    return text


def ensure_ids(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Guarantees every card and quiz question has a unique string ID
    if the AI omitted or malformed it.
    """
    if "cards" in data and isinstance(data["cards"], list):
        for idx, card in enumerate(data["cards"], start=1):
            if isinstance(card, dict) and not card.get("id"):
                card["id"] = f"card-{idx}"

    if "quiz" in data and isinstance(data["quiz"], list):
        for idx, q in enumerate(data["quiz"], start=1):
            if isinstance(q, dict) and not q.get("id"):
                q["id"] = f"quiz-{idx}"

    return data


async def generate_study_content(request: GenerateRequest) -> StudySetResponse:
    """
    Coordinates AI content generation:
    1. Validates API key existence.
    2. Builds the structured prompt.
    3. Calls Google Gemini API with JSON mode.
    4. Parses raw text into JSON.
    5. Validates with Pydantic StudySetResponse.
    6. Returns structured response.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or not api_key.strip():
        raise ValueError(
            "GEMINI_API_KEY is not configured on the server. "
            "Please add GEMINI_API_KEY to backend/.env."
        )

    # Configure Gemini SDK
    genai.configure(api_key=api_key.strip())

    # Build prompt
    prompt = build_generation_prompt(
        user_input=request.input,
        difficulty=request.difficulty,
        mode=request.mode,
        question_count=request.question_count,
    )

    # Candidate models in order of preference (speed, availability & quota)
    candidate_models = [
        "gemini-3.6-flash",
        "gemini-3.5-flash",
        "gemini-flash-latest",
        "gemini-2.5-flash-lite",
        "gemini-3.7-flash",
        "gemini-1.5-flash",
    ]

    last_error: Exception | None = None
    raw_response_text: str | None = None

    for model_name in candidate_models:
        try:
            model = genai.GenerativeModel(
                model_name=model_name,
                generation_config={
                    "temperature": 0.4,
                    "top_p": 0.95,
                    "response_mime_type": "application/json",
                },
            )
            response = await model.generate_content_async(prompt)
            if response and response.text:
                raw_response_text = response.text
                break
        except Exception as e:
            logger.warning(f"Model {model_name} failed: {e}. Trying next model...")
            last_error = e
            continue

    if not raw_response_text:
        # If async call failed or models failed, try synchronous fallback
        for model_name in candidate_models:
            try:
                model = genai.GenerativeModel(
                    model_name=model_name,
                    generation_config={
                        "temperature": 0.4,
                        "top_p": 0.95,
                        "response_mime_type": "application/json",
                    },
                )
                response = model.generate_content(prompt)
                if response and response.text:
                    raw_response_text = response.text
                    break
            except Exception as e:
                last_error = e
                continue

    if not raw_response_text:
        raise RuntimeError(
            f"Failed to communicate with Gemini API: {last_error or 'No response received'}"
        )

    # Parse JSON
    cleaned_text = clean_json_response(raw_response_text)
    try:
        parsed_data = json.loads(cleaned_text)
    except json.JSONDecodeError as json_err:
        logger.error(f"Malformed JSON from AI: {cleaned_text}")
        raise ValueError(f"AI returned malformed JSON: {json_err}")

    if not isinstance(parsed_data, dict):
        raise ValueError("AI response root must be a JSON object.")

    # Guarantee IDs
    parsed_data = ensure_ids(parsed_data)

    # Pydantic validation (Phase 6 requirement)
    try:
        validated_response = StudySetResponse.model_validate(parsed_data)
    except Exception as validation_err:
        logger.error(f"Pydantic validation failed: {validation_err}")
        raise ValueError(f"Generated content failed schema validation: {validation_err}")

    return validated_response
