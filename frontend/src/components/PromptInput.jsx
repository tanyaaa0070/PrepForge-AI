import React, { useState } from 'react';

const EXAMPLE_TEXT = `Prepare me for a Python interview covering OOP, decorators, generators, exception handling and data structures.`;

/**
 * PromptInput — Main input form with topic textarea, difficulty/mode/count selectors,
 * and generate button. Validates non-empty input before calling onGenerate.
 */
export default function PromptInput({ onGenerate, isLoading }) {
  const [input, setInput] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [mode, setMode] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(10);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = () => {
    // Clear previous validation error
    setValidationError('');

    // Validate non-empty input
    const trimmed = input.trim();
    if (!trimmed) {
      setValidationError('Please enter a topic or study material.');
      return;
    }

    if (trimmed.length < 3) {
      setValidationError('Please provide more detail (min 3 characters).');
      return;
    }

    onGenerate({
      input: trimmed,
      difficulty,
      mode,
      question_count: questionCount,
    });
  };

  const handleUseExample = () => {
    setInput(EXAMPLE_TEXT);
    setValidationError('');
  };

  return (
    <div className="prompt-section">
      {/* Hero */}
      <div className="hero">
        <h1 className="hero__title">
          Forge Your Knowledge.{' '}
          <span className="hero__title-accent">Ace Your Prep.</span>
        </h1>
        <p className="hero__subtitle">
          Drop any topic, paste your messy notes, or throw in an entire syllabus
          — our AI turns it into flashcards and quizzes you can actually learn from.
        </p>
      </div>

      {/* Input Card */}
      <div className="container">
        <div className="prompt-card">
          <label htmlFor="study-input" className="prompt-card__label">
            What do you want to learn?
          </label>

          <textarea
            id="study-input"
            className="prompt-card__textarea"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="Paste your topic, notes, or study material..."
            disabled={isLoading}
          />

          <p className="prompt-card__hint">
            Be specific for better results — include topics, subtopics, or concepts you want to cover.
          </p>

          {/* Controls */}
          <div className="controls">
            <div className="control-group">
              <label htmlFor="difficulty-select" className="control-group__label">
                Difficulty
              </label>
              <select
                id="difficulty-select"
                className="control-group__select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={isLoading}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="mode-select" className="control-group__label">
                Mode
              </label>
              <select
                id="mode-select"
                className="control-group__select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                disabled={isLoading}
              >
                <option value="flashcards">Flashcards</option>
                <option value="quiz">Quiz</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="count-select" className="control-group__label">
                Questions
              </label>
              <select
                id="count-select"
                className="control-group__select"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                disabled={isLoading}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="generate-btn-wrapper">
            <button
              id="generate-btn"
              className="generate-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              <span className="generate-btn__icon">✨</span>
              {isLoading ? 'Generating...' : 'Generate Study Set'}
            </button>
          </div>

          {/* Validation Error */}
          {validationError && (
            <p className="validation-msg" role="alert">
              {validationError}
            </p>
          )}

          {/* Example */}
          <div className="example-block">
            <p className="example-block__title">Example Prompt</p>
            <p className="example-block__text" onClick={handleUseExample}>
              "{EXAMPLE_TEXT}"
            </p>
            <p className="example-block__hint">Click to use this example</p>
          </div>
        </div>
      </div>
    </div>
  );
}
