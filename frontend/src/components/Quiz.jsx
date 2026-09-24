import React, { useState } from 'react';
import QuestionCard from './QuestionCard';

/**
 * Quiz — Displays quiz questions one at a time.
 * Tracks answers and calls onComplete with results when finished.
 */
export default function Quiz({ questions, onComplete, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  // answers: [{ question, selectedOption, isCorrect }]

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / totalQuestions) * 100;

  const handleSubmit = () => {
    const isCorrect = selectedOption === currentQuestion.correct_answer;
    const answer = {
      question: currentQuestion,
      selectedOption,
      isCorrect,
    };
    setAnswers([...answers, answer]);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Quiz complete
      const finalAnswers = [
        ...answers,
      ];
      // The last answer was already pushed in handleSubmit
      onComplete(finalAnswers);
    }
  };

  return (
    <div className="quiz container">
      {/* Header */}
      <div className="quiz__header">
        <h2 className="quiz__title">{title || 'Quiz'}</h2>
        <span className="quiz__counter">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="quiz__progress">
        <div className="progress-bar">
          <div
            className="progress-bar__fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Question */}
      <QuestionCard
        question={currentQuestion}
        selectedOption={selectedOption}
        onSelectOption={setSelectedOption}
        isSubmitted={isSubmitted}
        onSubmit={handleSubmit}
        onNext={handleNext}
        isLast={currentIndex === totalQuestions - 1}
      />
    </div>
  );
}
