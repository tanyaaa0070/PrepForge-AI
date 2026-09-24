import { useState, useRef, useCallback } from 'react';
import { generateStudySet } from '../lib/api';
import { validateStudySet } from '../lib/validateResult';

/**
 * useStudySession — Central state management hook for the entire app.
 *
 * Manages:
 *   - Current view (input, loading, flashcards, quiz, results)
 *   - Study set data from the API
 *   - Error state
 *   - Flashcard & quiz results
 *   - Retest logic for wrong answers
 *   - Stale response protection via requestId counter + AbortController
 *
 * This is the single source of truth — easy to explain in an interview.
 */
export default function useStudySession() {
  // ---- Core State ----
  const [view, setView] = useState('input');          // input | loading | flashcards | quiz | results
  const [studySet, setStudySet] = useState(null);     // validated API response
  const [error, setError] = useState(null);           // user-friendly error message
  const [mode, setMode] = useState('mixed');           // the mode the user selected
  const [sessionResults, setSessionResults] = useState(null); // { correct, wrong, total }
  const [isRetesting, setIsRetesting] = useState(false);
  const [retestQuestions, setRetestQuestions] = useState([]);

  // ---- Stale Response Protection ----
  // requestId increments on every new generate call.
  // When the response arrives, we compare it to the current requestId.
  // If they don't match, the response is stale and gets discarded.
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  /**
   * Generate a new study set from user input.
   * Handles loading, error, validation, and stale response protection.
   */
  const generate = useCallback(async (payload) => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Increment request ID for stale protection
    const thisRequestId = ++requestIdRef.current;

    // Set loading state
    setView('loading');
    setError(null);
    setStudySet(null);
    setSessionResults(null);
    setIsRetesting(false);
    setRetestQuestions([]);
    setMode(payload.mode);

    try {
      // Call the backend API
      const data = await generateStudySet(payload, controller.signal);

      // Stale response check — if a newer request was made, discard this one
      if (thisRequestId !== requestIdRef.current) {
        return; // Silently discard stale response
      }

      // Frontend validation (double validation: backend already validated)
      const validation = validateStudySet(data);
      if (!validation.valid) {
        setError('AI returned an invalid response. Please try again.');
        setView('error');
        return;
      }

      // Store validated study set
      setStudySet(validation.data);

      // Navigate to the appropriate view based on mode
      if (payload.mode === 'flashcards') {
        if (validation.data.cards && validation.data.cards.length > 0) {
          setView('flashcards');
        } else {
          setError('No flashcards were generated. Please try again.');
          setView('error');
        }
      } else if (payload.mode === 'quiz') {
        if (validation.data.quiz && validation.data.quiz.length > 0) {
          setView('quiz');
        } else {
          setError('No quiz questions were generated. Please try again.');
          setView('error');
        }
      } else {
        // Mixed mode: start with flashcards, then quiz
        if (validation.data.cards && validation.data.cards.length > 0) {
          setView('flashcards');
        } else if (validation.data.quiz && validation.data.quiz.length > 0) {
          setView('quiz');
        } else {
          setError('No content was generated. Please try again.');
          setView('error');
        }
      }
    } catch (err) {
      // Don't show error for aborted (stale) requests
      if (err.message === 'ABORTED') return;

      // Stale response check
      if (thisRequestId !== requestIdRef.current) return;

      setError(err.message || 'Something went wrong. Please try again.');
      setView('error');
    }
  }, []);

  /**
   * Handle flashcard completion — receives results from FlashcardDeck.
   */
  const handleFlashcardComplete = useCallback((flashcardResults) => {
    const results = {
      correct: flashcardResults.correct,
      wrong: flashcardResults.wrong,
      total: flashcardResults.correct.length + flashcardResults.wrong.length,
    };
    setSessionResults(results);

    // In mixed mode, if there are quiz questions, show them next
    if (mode === 'mixed' && studySet?.quiz && studySet.quiz.length > 0) {
      setView('flashcard-results');
    } else {
      setView('results');
    }
  }, [mode, studySet]);

  /**
   * Handle quiz completion — receives answers array from Quiz.
   */
  const handleQuizComplete = useCallback((answers) => {
    const correct = answers.filter((a) => a.isCorrect).map((a) => a.question);
    const wrong = answers.filter((a) => !a.isCorrect).map((a) => a.question);

    const results = {
      correct,
      wrong,
      total: answers.length,
    };
    setSessionResults(results);
    setView('results');
  }, []);

  /**
   * Continue from flashcard results to quiz (mixed mode).
   */
  const continueToQuiz = useCallback(() => {
    setSessionResults(null);
    setView('quiz');
  }, []);

  /**
   * Retest wrong answers — filters to only wrong questions.
   */
  const startRetest = useCallback(() => {
    if (!sessionResults || sessionResults.wrong.length === 0) return;

    setRetestQuestions(sessionResults.wrong);
    setIsRetesting(true);
    setSessionResults(null);

    // Determine if these are flashcards or quiz questions
    // Quiz questions have 'options', flashcards don't
    const isQuizRetest = sessionResults.wrong[0]?.options !== undefined;
    setView(isQuizRetest ? 'quiz' : 'flashcards');
  }, [sessionResults]);

  /**
   * Reset everything and go back to the input screen.
   */
  const reset = useCallback(() => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setView('input');
    setStudySet(null);
    setError(null);
    setSessionResults(null);
    setIsRetesting(false);
    setRetestQuestions([]);
  }, []);

  /**
   * Retry the last generation (go back to input view to modify and regenerate).
   */
  const retry = useCallback(() => {
    setView('input');
    setError(null);
  }, []);

  return {
    // State
    view,
    studySet,
    error,
    mode,
    sessionResults,
    isRetesting,
    retestQuestions,

    // Actions
    generate,
    handleFlashcardComplete,
    handleQuizComplete,
    continueToQuiz,
    startRetest,
    reset,
    retry,
  };
}
