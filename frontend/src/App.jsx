import React from 'react';
import './App.css';

import Header from './components/Header';
import PromptInput from './components/PromptInput';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import FlashcardDeck from './components/FlashcardDeck';
import Quiz from './components/Quiz';
import ResultDashboard from './components/ResultDashboard';
import useStudySession from './hooks/useStudySession';

/**
 * App — Root component that renders the correct view based on useStudySession state.
 *
 * Views:
 *   input            → PromptInput (landing page)
 *   loading          → LoadingState
 *   error            → ErrorState
 *   flashcards       → FlashcardDeck
 *   quiz             → Quiz
 *   flashcard-results → ResultDashboard (with "Continue to Quiz" in mixed mode)
 *   results          → ResultDashboard (final)
 */
export default function App() {
  const {
    view,
    studySet,
    error,
    mode,
    sessionResults,
    isRetesting,
    retestQuestions,
    generate,
    handleFlashcardComplete,
    handleQuizComplete,
    continueToQuiz,
    startRetest,
    reset,
    retry,
  } = useStudySession();

  const renderView = () => {
    switch (view) {
      case 'input':
        return (
          <PromptInput
            onGenerate={generate}
            isLoading={false}
          />
        );

      case 'loading':
        return <LoadingState />;

      case 'error':
        return (
          <ErrorState
            message={error}
            onRetry={retry}
            onGoBack={reset}
          />
        );

      case 'flashcards': {
        const cards = isRetesting ? retestQuestions : studySet?.cards;
        if (!cards || cards.length === 0) {
          return (
            <ErrorState
              message="No flashcards available."
              onRetry={retry}
              onGoBack={reset}
            />
          );
        }
        return (
          <FlashcardDeck
            cards={cards}
            onComplete={handleFlashcardComplete}
            title={isRetesting ? 'Retesting Wrong Answers' : studySet?.title}
          />
        );
      }

      case 'quiz': {
        const questions = isRetesting ? retestQuestions : studySet?.quiz;
        if (!questions || questions.length === 0) {
          return (
            <ErrorState
              message="No quiz questions available."
              onRetry={retry}
              onGoBack={reset}
            />
          );
        }
        return (
          <Quiz
            questions={questions}
            onComplete={handleQuizComplete}
            title={isRetesting ? 'Retesting Wrong Answers' : studySet?.title}
          />
        );
      }

      case 'flashcard-results':
        return (
          <ResultDashboard
            results={sessionResults}
            mode="flashcards"
            onRetest={startRetest}
            onNewSession={reset}
            onContinueToQuiz={continueToQuiz}
          />
        );

      case 'results':
        return (
          <ResultDashboard
            results={sessionResults}
            mode={mode === 'flashcards' ? 'flashcards' : 'quiz'}
            onRetest={startRetest}
            onNewSession={reset}
          />
        );

      default:
        return <PromptInput onGenerate={generate} isLoading={false} />;
    }
  };

  return (
    <div className="app">
      <Header onReset={reset} />
      <main className="app__content">
        {renderView()}
      </main>
    </div>
  );
}
