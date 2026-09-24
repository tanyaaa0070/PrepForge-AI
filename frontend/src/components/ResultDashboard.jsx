import React from 'react';

/**
 * ResultDashboard — Displays score, percentage, strong/weak areas,
 * and retest button after the user completes a quiz or flashcard session.
 *
 * Props:
 *   - results: { correct: [...], wrong: [...], total: number }
 *   - mode: 'flashcards' | 'quiz'
 *   - onRetest: callback to retest wrong answers
 *   - onNewSession: callback to start a new study session
 *   - onContinueToQuiz: (optional) callback for mixed mode to continue to quiz
 */
export default function ResultDashboard({
  results,
  mode,
  onRetest,
  onNewSession,
  onContinueToQuiz,
}) {
  const { correct, wrong, total } = results;
  const correctCount = correct.length;
  const wrongCount = wrong.length;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Determine score quality
  let scoreClass = 'results__score-big--good';
  let emoji = '🎉';
  let message = 'Excellent work!';

  if (percentage < 50) {
    scoreClass = 'results__score-big--poor';
    emoji = '💪';
    message = 'Keep practicing — you\'ll get there!';
  } else if (percentage < 80) {
    scoreClass = 'results__score-big--ok';
    emoji = '👍';
    message = 'Good effort! Review the topics below.';
  }

  // Calculate strong and weak areas from categories
  const strongAreas = extractCategories(correct);
  const weakAreas = extractCategories(wrong);

  return (
    <div className="results container">
      {/* Header */}
      <div className="results__header">
        <div className="results__icon">{emoji}</div>
        <h2 className="results__title">
          {mode === 'flashcards' ? 'Review Complete' : 'Quiz Complete'}
        </h2>
        <p className="results__subtitle">{message}</p>
      </div>

      {/* Score Card */}
      <div className="results__score-card">
        <div className={`results__score-big ${scoreClass}`}>
          {correctCount} / {total}
        </div>
        <div className="results__percentage">{percentage}%</div>

        <div className="results__stats">
          <div className="results__stat">
            <div className="results__stat-value">{total}</div>
            <div className="results__stat-label">Total</div>
          </div>
          <div className="results__stat">
            <div className="results__stat-value" style={{ color: 'var(--success)' }}>
              {correctCount}
            </div>
            <div className="results__stat-label">Correct</div>
          </div>
          <div className="results__stat">
            <div className="results__stat-value" style={{ color: 'var(--error)' }}>
              {wrongCount}
            </div>
            <div className="results__stat-label">Incorrect</div>
          </div>
        </div>
      </div>

      {/* Strong & Weak Areas */}
      {(strongAreas.length > 0 || weakAreas.length > 0) && (
        <div className="results__areas">
          {strongAreas.length > 0 && (
            <div className="results__area">
              <h3 className="results__area-title">
                <span style={{ color: 'var(--success)' }}>✓</span> Strong Areas
              </h3>
              <ul className="results__area-list">
                {strongAreas.map((area, i) => (
                  <li key={i} className="results__area-item">{area}</li>
                ))}
              </ul>
            </div>
          )}

          {weakAreas.length > 0 && (
            <div className="results__area">
              <h3 className="results__area-title">
                <span style={{ color: 'var(--error)' }}>✗</span> Weak Areas
              </h3>
              <ul className="results__area-list">
                {weakAreas.map((area, i) => (
                  <li key={i} className="results__area-item">{area}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="results__actions">
        {wrongCount > 0 ? (
          <button className="btn btn--primary btn--lg" onClick={onRetest}>
            🔄 Retest Wrong Answers ({wrongCount})
          </button>
        ) : (
          <p style={{ color: 'var(--success)', fontWeight: 600, fontSize: 'var(--font-lg)' }}>
            🏆 Perfect score! There are no questions to retest.
          </p>
        )}

        {onContinueToQuiz && (
          <button className="btn btn--secondary btn--lg" onClick={onContinueToQuiz}>
            Continue to Quiz →
          </button>
        )}

        <button className="btn btn--secondary btn--lg" onClick={onNewSession}>
          ✨ New Study Set
        </button>
      </div>
    </div>
  );
}

/**
 * Extracts unique category names from a list of questions/cards.
 */
function extractCategories(items) {
  const categories = new Set();
  items.forEach((item) => {
    // item could be a card (from flashcards) or { question: {...} } (from quiz)
    const category = item.category || item.question?.category;
    if (category) categories.add(category);
  });
  return Array.from(categories);
}
