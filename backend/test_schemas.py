import pytest
from pydantic import ValidationError
from schemas import GenerateRequest, StudyCard, QuizQuestion, StudySetResponse


def test_generate_request_valid():
    req = GenerateRequest(
        input="Prepare me for a Python interview covering decorators",
        difficulty="intermediate",
        mode="mixed",
        question_count=10,
    )
    assert req.question_count == 10
    assert req.mode == "mixed"
    assert req.difficulty == "intermediate"


def test_generate_request_too_short():
    with pytest.raises(ValidationError):
        GenerateRequest(input="ab", question_count=10)


def test_generate_request_invalid_count():
    with pytest.raises(ValidationError):
        GenerateRequest(input="Valid study text", question_count=7)


def test_study_card_valid():
    card = StudyCard(
        id="card-1",
        question="What is a decorator?",
        answer="A function that modifies the behavior of another function.",
        category="Python",
        difficulty="intermediate",
        tags=["python", "oop"]
    )
    assert card.id == "card-1"
    assert card.category == "Python"


def test_quiz_question_valid():
    q = QuizQuestion(
        id="quiz-1",
        question="Which keyword defines a generator?",
        options=["yield", "return", "pass", "break"],
        correct_answer="yield",
        explanation="yield pauses the function and yields a value.",
        category="Python",
        difficulty="intermediate"
    )
    assert q.correct_answer == "yield"


def test_quiz_question_not_four_options():
    with pytest.raises(ValidationError):
        QuizQuestion(
            id="quiz-1",
            question="Invalid question",
            options=["A", "B", "C"],
            correct_answer="A",
            explanation="Explanation",
            category="Python",
            difficulty="intermediate"
        )


def test_quiz_question_correct_answer_not_in_options():
    with pytest.raises(ValidationError):
        QuizQuestion(
            id="quiz-1",
            question="Invalid question",
            options=["A", "B", "C", "D"],
            correct_answer="E",
            explanation="Explanation",
            category="Python",
            difficulty="intermediate"
        )


def test_study_set_response_empty():
    with pytest.raises(ValidationError):
        StudySetResponse(
            title="Empty Set",
            summary="No cards and no quiz",
            cards=[],
            quiz=[]
        )


def test_study_set_response_valid():
    res = StudySetResponse(
        title="Python Mastery",
        summary="Covers essential Python concepts.",
        cards=[
            StudyCard(
                id="card-1",
                question="What is a decorator?",
                answer="A function that takes another function as argument.",
                category="Core",
                difficulty="intermediate"
            )
        ],
        quiz=[]
    )
    assert len(res.cards) == 1
    assert res.title == "Python Mastery"


def test_clean_json_response_with_trailing_ticks():
    from ai_service import clean_json_response
    raw = '{\n  "title": "Test Title"\n}\n``'
    cleaned = clean_json_response(raw)
    assert cleaned == '{\n  "title": "Test Title"\n}'


def test_clean_json_response_with_markdown_block():
    from ai_service import clean_json_response
    raw = '```json\n{"title": "Test"}\n```'
    cleaned = clean_json_response(raw)
    assert cleaned == '{"title": "Test"}'


def test_ensure_ids_missing_ids():
    from ai_service import ensure_ids
    data = {
        "cards": [{"question": "Q1", "answer": "A1"}],
        "quiz": [{"question": "Q2"}]
    }
    result = ensure_ids(data)
    assert result["cards"][0]["id"] == "card-1"
    assert result["quiz"][0]["id"] == "quiz-1"


if __name__ == "__main__":
    pytest.main(["-v", __file__])

