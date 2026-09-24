from typing import List, Literal
from pydantic import BaseModel, Field, field_validator, model_validator


class GenerateRequest(BaseModel):
    """
    Validates user generation requests sent from the frontend.
    """
    input: str = Field(
        ...,
        min_length=3,
        max_length=5000,
        description="Study material, topic, notes, or interview prep questions.",
    )
    difficulty: Literal["beginner", "intermediate", "advanced"] = Field(
        default="intermediate",
        description="Difficulty level for generated content.",
    )
    mode: Literal["flashcards", "quiz", "mixed"] = Field(
        default="mixed",
        description="Learning mode: flashcards, quiz, or mixed.",
    )
    question_count: int = Field(
        default=10,
        description="Number of questions to generate (5, 10, or 15).",
    )

    @field_validator("question_count")
    @classmethod
    def validate_count(cls, v: int) -> int:
        if v not in [5, 10, 15]:
            raise ValueError("question_count must be either 5, 10, or 15.")
        return v


class StudyCard(BaseModel):
    """
    A single flashcard with question, answer, category, difficulty, and tags.
    """
    id: str = Field(..., description="Unique card ID, e.g. 'card-1'")
    question: str = Field(..., min_length=1, description="Flashcard question or prompt")
    answer: str = Field(..., min_length=1, description="Concise, accurate answer")
    category: str = Field(default="General", description="Topic category")
    difficulty: str = Field(default="beginner", description="beginner, intermediate, or advanced")
    tags: List[str] = Field(default_factory=list, description="Relevant topic tags")


class QuizQuestion(BaseModel):
    """
    A multiple choice quiz question with exactly four options and an explanation.
    """
    id: str = Field(..., description="Unique quiz question ID, e.g. 'quiz-1'")
    question: str = Field(..., min_length=1, description="MCQ question text")
    options: List[str] = Field(..., description="Exactly four distinct answer options")
    correct_answer: str = Field(..., min_length=1, description="The correct option string")
    explanation: str = Field(..., min_length=1, description="Concise explanation of the answer")
    category: str = Field(default="General", description="Topic category")
    difficulty: str = Field(default="beginner", description="beginner, intermediate, or advanced")

    @field_validator("options")
    @classmethod
    def validate_options_count(cls, v: List[str]) -> List[str]:
        if len(v) != 4:
            raise ValueError(f"Quiz question must have exactly 4 options, got {len(v)}.")
        if any(not opt.strip() for opt in v):
            raise ValueError("Quiz options must not be empty.")
        return v

    @model_validator(mode="after")
    def validate_correct_answer_in_options(self) -> "QuizQuestion":
        if self.correct_answer not in self.options:
            # Try case-insensitive or stripped match if near-exact
            matched = None
            for opt in self.options:
                if opt.strip().lower() == self.correct_answer.strip().lower():
                    matched = opt
                    break
            if matched:
                self.correct_answer = matched
            else:
                raise ValueError(
                    f"correct_answer '{self.correct_answer}' must exactly match one of options: {self.options}"
                )
        return self


class StudySetResponse(BaseModel):
    """
    Complete study set containing flashcards and/or quiz questions.
    """
    title: str = Field(..., min_length=1, description="Title of the study set")
    summary: str = Field(..., min_length=1, description="Brief summary of what this study set covers")
    cards: List[StudyCard] = Field(default_factory=list, description="Array of flashcards")
    quiz: List[QuizQuestion] = Field(default_factory=list, description="Array of quiz questions")

    @model_validator(mode="after")
    def validate_has_content(self) -> "StudySetResponse":
        if not self.cards and not self.quiz:
            raise ValueError("Study set must contain at least one card or quiz question.")
        return self
