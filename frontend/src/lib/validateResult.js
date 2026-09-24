/**
 * validateResult.js — Frontend validation for the AI-generated study set.
 *
 * Never trust AI output blindly. This function validates the structure
 * and content of the API response before the React app renders it.
 *
 * Returns { valid: true, data } on success, or { valid: false, error } on failure.
 */
export function validateStudySet(data) {
  try {
    // 1. Check that data exists and is an object
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Response is empty or not an object.' };
    }

    // 2. Check required top-level fields
    if (typeof data.title !== 'string' || !data.title.trim()) {
      return { valid: false, error: 'Missing or invalid title.' };
    }

    // 3. Validate cards array (if present)
    if (data.cards !== undefined && data.cards !== null) {
      if (!Array.isArray(data.cards)) {
        return { valid: false, error: 'Cards must be an array.' };
      }

      for (let i = 0; i < data.cards.length; i++) {
        const card = data.cards[i];
        if (!card.id || typeof card.id !== 'string') {
          return { valid: false, error: `Card ${i + 1} is missing a valid id.` };
        }
        if (!card.question || typeof card.question !== 'string') {
          return { valid: false, error: `Card ${i + 1} is missing a question.` };
        }
        if (!card.answer || typeof card.answer !== 'string') {
          return { valid: false, error: `Card ${i + 1} is missing an answer.` };
        }
      }
    }

    // 4. Validate quiz array (if present)
    if (data.quiz !== undefined && data.quiz !== null) {
      if (!Array.isArray(data.quiz)) {
        return { valid: false, error: 'Quiz must be an array.' };
      }

      for (let i = 0; i < data.quiz.length; i++) {
        const q = data.quiz[i];

        if (!q.id || typeof q.id !== 'string') {
          return { valid: false, error: `Quiz question ${i + 1} is missing a valid id.` };
        }
        if (!q.question || typeof q.question !== 'string') {
          return { valid: false, error: `Quiz question ${i + 1} is missing a question.` };
        }
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          return { valid: false, error: `Quiz question ${i + 1} must have exactly 4 options.` };
        }
        if (!q.correct_answer || typeof q.correct_answer !== 'string') {
          return { valid: false, error: `Quiz question ${i + 1} is missing correct_answer.` };
        }
        // Check that correct_answer matches one of the options
        if (!q.options.includes(q.correct_answer)) {
          return {
            valid: false,
            error: `Quiz question ${i + 1}: correct_answer does not match any option.`,
          };
        }
        if (!q.explanation || typeof q.explanation !== 'string') {
          return { valid: false, error: `Quiz question ${i + 1} is missing an explanation.` };
        }
      }
    }

    // 5. Check that at least cards or quiz has content
    const hasCards = Array.isArray(data.cards) && data.cards.length > 0;
    const hasQuiz = Array.isArray(data.quiz) && data.quiz.length > 0;

    if (!hasCards && !hasQuiz) {
      return { valid: false, error: 'Response contains no cards or quiz questions.' };
    }

    return { valid: true, data };
  } catch (err) {
    return { valid: false, error: 'Validation failed: ' + err.message };
  }
}
