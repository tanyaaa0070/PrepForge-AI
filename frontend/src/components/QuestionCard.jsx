import React from 'react';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

/**
 * QuestionCard — Renders a single MCQ question with 4 options.
 * After submission, highlights correct/incorrect and shows explanation.
 */
export default function QuestionCard({
  question,
  selectedOption,
  onSelectOption,
  isSubmitted,
  onSubmit,
  onNext,
  isLast,
}) {
  const isCorrect = isSubmitted && selectedOption === question.correct_answer;

  return (
    <div className="question-card">
      {/* Meta */}
      <div className="question-card__meta">
        <span className="question-card__category">{question.category}</span>
        <span className={`badge badge--${question.difficulty}`}>
          {question.difficulty}
        </span>
      </div>

      {/* Question Text */}
      <p className="question-card__text">{question.question}</p>

      {/* Options */}
      <div className="question-card__options">
        {question.options.map((option, index) => {
          let optionClass = 'option';

          if (isSubmitted) {
            optionClass += ' option--disabled';
            if (option === question.correct_answer) {
              optionClass += ' option--correct';
            }
            if (option === selectedOption && option !== question.correct_answer) {
              optionClass += ' option--incorrect';
            }
            if (option === selectedOption) {
              optionClass += ' option--selected';
            }
          } else {
            if (option === selectedOption) {
              optionClass += ' option--selected';
            }
          }

          return (
            <div
              key={index}
              className={optionClass}
              onClick={() => {
                if (!isSubmitted) onSelectOption(option);
              }}
              role="button"
              tabIndex={isSubmitted ? -1 : 0}
              aria-label={`Option ${OPTION_LETTERS[index]}: ${option}`}
            >
              <span className="option__letter">{OPTION_LETTERS[index]}</span>
              <span className="option__text">{option}</span>
            </div>
          );
        })}
      </div>

      {/* Explanation (shown after submission) */}
      {isSubmitted && (
        <div
          className={`question-card__explanation question-card__explanation--${
            isCorrect ? 'correct' : 'incorrect'
          }`}
        >
          <p
            className={`question-card__explanation-title question-card__explanation-title--${
              isCorrect ? 'correct' : 'incorrect'
            }`}
          >
            {isCorrect ? '✓ Correct!' : `✗ Incorrect — Answer: ${question.correct_answer}`}
          </p>
          <p className="question-card__explanation-text">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="question-card__actions">
        {!isSubmitted ? (
          <button
            className="btn btn--primary"
            onClick={onSubmit}
            disabled={!selectedOption}
          >
            Submit Answer
          </button>
        ) : (
          <button className="btn btn--primary" onClick={onNext}>
            {isLast ? 'See Results' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
}
