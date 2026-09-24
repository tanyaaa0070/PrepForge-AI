/**
 * api.js — Frontend API service for communicating with the FastAPI backend.
 *
 * Uses VITE_API_URL environment variable (never hardcodes production URLs).
 * Implements AbortController for request cancellation and stale response protection.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Generates a study set by sending the user's input to the backend.
 *
 * @param {Object} payload - { input, difficulty, mode, question_count }
 * @param {AbortSignal} signal - AbortController signal for cancellation
 * @returns {Promise<Object>} The validated study set JSON
 * @throws {Error} On network failure, timeout, or server error
 */
export async function generateStudySet(payload, signal) {
  const url = `${API_BASE}/api/generate`;

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal, // AbortController signal for cancellation
    });
  } catch (err) {
    // Distinguish between abort and network errors
    if (err.name === 'AbortError') {
      throw new Error('ABORTED');
    }
    throw new Error('Unable to connect to the server. Please check your internet connection.');
  }

  // Handle HTTP error responses
  if (!response.ok) {
    let errorMessage = 'Something went wrong while generating your study set.';

    try {
      const errorData = await response.json();
      // Use the backend's user-friendly message if available
      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // If we can't parse the error response, use the default message
    }

    throw new Error(errorMessage);
  }

  // Parse and return the JSON response
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Received an invalid response from the server.');
  }

  return data;
}

/**
 * Health check — verifies the backend is reachable.
 */
export async function checkHealth() {
  const url = `${API_BASE}/api/health`;
  const response = await fetch(url);
  return response.json();
}
