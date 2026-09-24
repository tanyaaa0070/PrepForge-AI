import React, { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
  'Analyzing your study material...',
  'Generating your study set...',
  'Preparing your interactive content...',
];

/**
 * LoadingState — Animated loading screen with rotating messages.
 * Cycles through messages to give the user feedback during generation.
 */
export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading container">
      <div className="loading__spinner" />
      <p className="loading__text">{LOADING_MESSAGES[messageIndex]}</p>
      <p className="loading__subtext">
        This may take a few seconds depending on the complexity of your request.
      </p>
    </div>
  );
}
