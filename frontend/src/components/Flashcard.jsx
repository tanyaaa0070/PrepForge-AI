import React from 'react';

/**
 * Flashcard — A single flashcard that shows a question and reveals
 * the answer when the user clicks "Show Answer".
 */
export default function Flashcard({ card, showAnswer, onToggleAnswer }) {
  return (
    <div className="flashcard">
      {/* Meta: category + difficulty badge */}
      <div className="flashcard__meta">
        <span className="flashcard__category">{card.category}</span>
        <span className={`badge badge--${card.difficulty}`}>
          {card.difficulty}
        </span>
      </div>

      {/* Question */}
      <div className="flashcard__question">
        {card.question}
      </div>

      {/* Show Answer Button or Answer */}
      {!showAnswer ? (
        <button
          className="btn btn--primary flashcard__show-btn"
          onClick={onToggleAnswer}
        >
          Show Answer
        </button>
      ) : (
        <div className="flashcard__answer-section">
          <p className="flashcard__answer-label">Answer</p>
          <p className="flashcard__answer-text">{card.answer}</p>
        </div>
      )}
    </div>
  );
}
