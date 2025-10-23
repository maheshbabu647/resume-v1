/**
 * Rate Limit and Cost Limit Error Handler
 * Provides utilities to handle 429 errors from the backend
 */

/**
 * Check if error is a rate limit or cost limit error
 * @param {Object} error - Axios error object
 * @returns {boolean} - True if it's a limit error
 */
export const isLimitError = (error) => {
  return error.response?.status === 429;
};

/**
 * Parse limit error and return user-friendly data
 * @param {Object} error - Axios error object
 * @returns {Object} - Parsed error data
 */
export const parseLimitError = (error) => {
  if (!isLimitError(error)) {
    return null;
  }

  const data = error.response?.data || {};
  
  return {
    type: getLimitType(data),
    title: getTitle(data),
    message: data.message || 'You have reached a usage limit.',
    hint: data.hint || null,
    resetTime: data.resetTime || null,
    shouldShowSignup: shouldPromptSignup(data),
    isAuthenticated: !data.hint || !data.hint.includes('Sign up'),
    error: data.error || 'Rate limit exceeded'
  };
};

/**
 * Determine the type of limit error
 * @param {Object} data - Error response data
 * @returns {string} - Error type
 */
const getLimitType = (data) => {
  if (data.error === 'Usage limit reached') {
    if (data.message.includes('temporarily at capacity')) {
      return 'SYSTEM_CAPACITY';
    } else if (data.hint && data.hint.includes('Sign up')) {
      return 'FREE_COST_LIMIT';
    } else {
      return 'AUTH_COST_LIMIT';
    }
  } else if (data.error === 'Rate limit exceeded') {
    if (data.hint && data.hint.includes('Sign up')) {
      return 'FREE_RATE_LIMIT';
    } else {
      return 'AUTH_RATE_LIMIT';
    }
  }
  return 'UNKNOWN';
};

/**
 * Get user-friendly title based on error type
 * @param {Object} data - Error response data
 * @returns {string} - Title
 */
const getTitle = (data) => {
  const type = getLimitType(data);
  
  const titles = {
    'FREE_RATE_LIMIT': '🚀 Unlock More Features!',
    'FREE_COST_LIMIT': '🎉 You\'re loving our AI!',
    'AUTH_RATE_LIMIT': '⏳ Take a Quick Break',
    'AUTH_COST_LIMIT': '📊 Daily Limit Reached',
    'SYSTEM_CAPACITY': '🔄 High Demand',
    'UNKNOWN': '⚠️ Usage Limit'
  };
  
  return titles[type] || titles.UNKNOWN;
};

/**
 * Check if we should show signup prompt
 * @param {Object} data - Error response data
 * @returns {boolean} - True if should prompt signup
 */
const shouldPromptSignup = (data) => {
  return !!(data.hint && data.hint.includes('Sign up'));
};

/**
 * Get action button text based on error type
 * @param {Object} limitError - Parsed limit error
 * @returns {string} - Button text
 */
export const getActionButtonText = (limitError) => {
  if (limitError.shouldShowSignup) {
    return 'Sign Up Free';
  } else if (limitError.type === 'SYSTEM_CAPACITY') {
    return 'Try Again Later';
  } else {
    return 'Got It';
  }
};

/**
 * Get detailed explanation based on error type
 * @param {Object} limitError - Parsed limit error
 * @returns {string} - Explanation
 */
export const getDetailedExplanation = (limitError) => {
  const explanations = {
    'FREE_RATE_LIMIT': 'You\'ve tried this feature multiple times. Sign up for a free account to get higher limits and save your work!',
    'FREE_COST_LIMIT': 'You\'ve experienced the power of our AI! Create a free account to continue using these features with higher daily limits.',
    'AUTH_RATE_LIMIT': 'You\'re using our AI features very actively! Please wait a few minutes before trying again.',
    'AUTH_COST_LIMIT': `You've reached your daily usage limit. Your quota will reset at ${limitError.resetTime || 'midnight UTC'}. Thanks for being such an active user!`,
    'SYSTEM_CAPACITY': 'Our AI service is experiencing high demand right now. Please try again in a few minutes. Creating an account gives you priority access!',
    'UNKNOWN': 'Please wait a moment before trying again.'
  };
  
  return explanations[limitError.type] || explanations.UNKNOWN;
};

/**
 * Format error for toast notification
 * @param {Object} limitError - Parsed limit error
 * @returns {Object} - Toast configuration
 */
export const formatForToast = (limitError) => {
  return {
    type: limitError.shouldShowSignup ? 'info' : 'warning',
    title: limitError.title,
    message: limitError.message,
    duration: limitError.shouldShowSignup ? 8000 : 5000,
    action: limitError.shouldShowSignup ? {
      label: 'Sign Up',
      callback: 'openAuthDialog'
    } : null
  };
};

/**
 * Get icon for error type
 * @param {string} type - Error type
 * @returns {string} - Icon name or emoji
 */
export const getIconForType = (type) => {
  const icons = {
    'FREE_RATE_LIMIT': '🚀',
    'FREE_COST_LIMIT': '🎉',
    'AUTH_RATE_LIMIT': '⏳',
    'AUTH_COST_LIMIT': '📊',
    'SYSTEM_CAPACITY': '🔄',
    'UNKNOWN': '⚠️'
  };
  
  return icons[type] || icons.UNKNOWN;
};

export default {
  isLimitError,
  parseLimitError,
  getActionButtonText,
  getDetailedExplanation,
  formatForToast,
  getIconForType
};


