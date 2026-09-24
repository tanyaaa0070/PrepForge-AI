"""
Prompts module for StudyGen AI.
Defines system instructions and prompt templates to enforce structured JSON output from Gemini.
"""

SYSTEM_INSTRUCTION = """You are an expert educational content generator.

Convert the user's study material into structured learning content.

Return ONLY valid JSON.

Do not return markdown.
Do not return ```json.
Do not return any explanation outside JSON.

Follow the exact schema.

Generate technically accurate content.
Avoid duplicate questions.
Match the requested difficulty.
Respect the requested number of questions.

For multiple-choice questions:
- Generate exactly four options.
- Only one option is correct.
- correct_answer must exactly match one option.
- Provide a concise explanation.

For flashcards:
- Create a clear question.
- Provide a concise and technically accurate answer.

Never return null for required fields."""


def build_generation_prompt(
    user_input: str,
    difficulty: str,
    mode: str,
    question_count: int,
) -> str:
    """
    Constructs the prompt for Gemini with mode-specific instructions and the target JSON schema.
    """
    mode_instructions = ""
    if mode == "flashcards":
        mode_instructions = f"Generate {question_count} flashcards in the 'cards' array. Keep the 'quiz' array empty ([])."
    elif mode == "quiz":
        mode_instructions = f"Generate {question_count} quiz questions in the 'quiz' array. Keep the 'cards' array empty ([])."
    else:  # mixed
        cards_count = question_count // 2
        quiz_count = question_count - cards_count
        mode_instructions = (
            f"Generate approximately {cards_count} flashcards in the 'cards' array "
            f"and {quiz_count} quiz questions in the 'quiz' array (total {question_count})."
        )

    return f"""{SYSTEM_INSTRUCTION}

USER INPUT:
{user_input}

DIFFICULTY:
{difficulty}

MODE:
{mode}

QUESTION COUNT:
{question_count}

MODE SPECIFIC INSTRUCTION:
{mode_instructions}

REQUIRED JSON SCHEMA:
{{
  "title": "A concise, engaging title for this study set",
  "summary": "A 1-2 sentence overview of the topics covered",
  "cards": [
    {{
      "id": "card-1",
      "question": "Clear, concept-testing question",
      "answer": "Concise, accurate answer",
      "category": "Specific subtopic or domain",
      "difficulty": "{difficulty}",
      "tags": ["tag1", "tag2"]
    }}
  ],
  "quiz": [
    {{
      "id": "quiz-1",
      "question": "Multiple choice question testing understanding",
      "options": [
        "First option",
        "Second option",
        "Third option",
        "Fourth option"
      ],
      "correct_answer": "First option",
      "explanation": "Concise explanation of why this answer is correct",
      "category": "Specific subtopic or domain",
      "difficulty": "{difficulty}"
    }}
  ]
}}

Remember: Return ONLY valid parseable JSON. Do not include markdown blocks or preamble.
"""
