/**
 * Session Manager for Anonymous User Tracking
 * Generates and manages unique session IDs for anonymous users
 * to link their usage before and after sign-up
 */

const SESSION_STORAGE_KEY = 'ai_session_id';

/**
 * Generate a unique session ID
 * Uses crypto.randomUUID() if available, fallback to custom implementation
 */
const generateSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Get or create a session ID
 * If user is authenticated, returns null (session tracking not needed)
 * If user is anonymous, returns existing or creates new session ID
 */
export const getSessionId = (isAuthenticated = false) => {
  // Don't track session for authenticated users
  if (isAuthenticated) {
    return null;
  }

  // Check if session ID already exists
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  
  // Create new session ID if it doesn't exist
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    console.log('[SessionManager] New session created:', sessionId);
  }
  
  return sessionId;
};

/**
 * Clear session ID (call this after user signs up/signs in)
 * This prevents linking future authenticated usage to the anonymous session
 */
export const clearSessionId = () => {
  const sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (sessionId) {
    console.log('[SessionManager] Session cleared:', sessionId);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
};

/**
 * Get current session ID without creating a new one
 * Used for linking sessions during sign-up
 */
export const getCurrentSessionId = () => {
  return localStorage.getItem(SESSION_STORAGE_KEY);
};

/**
 * Check if a session exists
 */
export const hasActiveSession = () => {
  return !!localStorage.getItem(SESSION_STORAGE_KEY);
};

export default {
  getSessionId,
  clearSessionId,
  getCurrentSessionId,
  hasActiveSession
};





