import React, { useState } from 'react';
import Flashcard from './Flashcard';

/**
 * FlashcardDeck — Manages navigation through a set of flashcards.
 * Tracks which cards the user marked as "Got It" vs "Got It Wrong".
 * Calls onComplete with results when the user finishes all cards.
 */
export default function FlashcardDeck({ cards, onComplete, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState({ correct: [], wrong: [] });

  const totalCards = cards.length;
  const currentCard = cards[currentIndex];
  const progress = ((currentIndex) / totalCards) * 100;

  const handleGotIt = () => {
    const newResults = {
      ...results,
      correct: [...results.correct, currentCard],
    };
    setResults(newResults);
    goToNext(newResults);
  };

  const handleGotItWrong = () => {
    const newResults = {
      ...results,
      wrong: [...results.wrong, currentCard],
    };
    setResults(newResults);
    goToNext(newResults);
  };

  const goToNext = (updatedResults) => {
    setShowAnswer(false);
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All cards reviewed — send results
      onComplete(updatedResults);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setShowAnswer(false);
      setCurrentIndex(currentIndex - 1);
      // Remove the last result since we're going back
      const allResults = [...results.correct, ...results.wrong];
      const lastResult = allResults[allResults.length - 1];
      if (lastResult) {
        setResults({
          correct: results.correct.filter((c) => c.id !== lastResult.id),
          wrong: results.wrong.filter((c) => c.id !== lastResult.id),
        });
      }
    }
  };

  return (
    <div className="flashcard-deck container">
      {/* Header */}
      <div className="flashcard-deck__header">
        <h2 className="flashcard-deck__title">{title || 'Flashcards'}</h2>
        <span className="flashcard-deck__counter">
          Card {currentIndex + 1} of {totalCards}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flashcard-deck__progress">
        <div className="progress-bar">
          <div
            className="progress-bar__fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Flashcard */}
      <Flashcard
        card={currentCard}
        showAnswer={showAnswer}
        onToggleAnswer={() => setShowAnswer(true)}
      />

      {/* Self-Assessment Buttons (only visible when answer is shown) */}
      {showAnswer && (
        <div className="flashcard__actions">
          <button className="btn btn--error" onClick={handleGotItWrong}>
            ✗ I Got It Wrong
          </button>
          <button className="btn btn--success" onClick={handleGotIt}>
            ✓ I Got It
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flashcard__nav">
        <button
          className="btn btn--secondary btn--sm"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>

        <div className="flashcard__score">
          <div className="flashcard__score-item">
            <div className="flashcard__score-value flashcard__score-value--correct">
              {results.correct.length}
            </div>
            <div className="flashcard__score-label">Correct</div>
          </div>
          <div className="flashcard__score-item">
            <div className="flashcard__score-value flashcard__score-value--wrong">
              {results.wrong.length}
            </div>
            <div className="flashcard__score-label">Wrong</div>
          </div>
        </div>

        <div style={{ width: '88px' }} /> {/* Spacer to balance layout */}
      </div>
    </div>
  );
}
