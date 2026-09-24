import React from 'react';

/**
 * ErrorState — Displays user-friendly error messages with retry and
 * go-back options. Never shows raw server errors to the user.
 */
export default function ErrorState({ message, onRetry, onGoBack }) {
  return (
    <div className="error-state container">
      <div className="error-state__icon">⚠️</div>
      <h2 className="error-state__title">Something went wrong</h2>
      <p className="error-state__message">
        {message || 'An unexpected error occurred while generating your study set.'}
      </p>
      <div className="error-state__actions">
        {onRetry && (
          <button className="btn btn--primary" onClick={onRetry}>
            🔄 Try Again
          </button>
        )}
        {onGoBack && (
          <button className="btn btn--secondary" onClick={onGoBack}>
            ← Go Back
          </button>
        )}
      </div>
    </div>
  );
}
