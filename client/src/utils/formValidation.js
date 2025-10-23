/**
 * @fileoverview Form Validation Utilities - Reusable validation functions
 * @module utils/formValidation
 * @description Provides common validation functions for form inputs,
 * reducing code duplication across components.
 */

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

/**
 * Validates email address format
 * @function isValidEmail
 * @param {string} email - Email address to validate
 * @returns {boolean} Whether email is valid
 * @example
 * isValidEmail('test@example.com'); // true
 * isValidEmail('invalid-email'); // false
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ============================================================================
// URL VALIDATION
// ============================================================================

/**
 * Validates URL format
 * @function isValidURL
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is valid
 * @example
 * isValidURL('https://example.com'); // true
 * isValidURL('not-a-url'); // false
 */
export const isValidURL = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ============================================================================
// PHONE NUMBER VALIDATION
// ============================================================================

/**
 * Validates phone number format (international)
 * @function isValidPhone
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone number is valid
 * @example
 * isValidPhone('+1234567890'); // true
 * isValidPhone('123'); // false
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  // Simple international phone validation (10-15 digits)
  const phoneRegex = /^\+?[\d\s()-]{10,15}$/;
  return phoneRegex.test(phone);
};

// ============================================================================
// TEXT LENGTH VALIDATION
// ============================================================================

/**
 * Validates text length
 * @function isValidLength
 * @param {string} text - Text to validate
 * @param {number} [min=0] - Minimum length
 * @param {number} [max=Infinity] - Maximum length
 * @returns {boolean} Whether text length is valid
 * @example
 * isValidLength('Hello', 3, 10); // true
 * isValidLength('Hi', 3, 10); // false
 */
export const isValidLength = (text, min = 0, max = Infinity) => {
  if (!text) return min === 0;
  const length = text.length;
  return length >= min && length <= max;
};

// ============================================================================
// REQUIRED FIELD VALIDATION
// ============================================================================

/**
 * Checks if required field has value
 * @function isRequired
 * @param {*} value - Value to check
 * @returns {boolean} Whether value exists
 * @example
 * isRequired('text'); // true
 * isRequired(''); // false
 * isRequired(null); // false
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// ============================================================================
// FORM VALIDATION
// ============================================================================

/**
 * Validates multiple form fields
 * @function validateForm
 * @param {Object} formData - Form data object
 * @param {Object} rules - Validation rules object
 * @returns {Object} Validation result
 * @returns {boolean} return.valid - Whether form is valid
 * @returns {Object} return.errors - Object with field errors
 * @example
 * const result = validateForm(
 *   { email: 'test@test.com', name: '' },
 *   {
 *     email: { required: true, email: true },
 *     name: { required: true, minLength: 2 }
 *   }
 * );
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  let valid = true;

  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];
    const fieldErrors = [];

    // Required validation
    if (fieldRules.required && !isRequired(value)) {
      fieldErrors.push(`${field} is required`);
      valid = false;
    }

    // Email validation
    if (fieldRules.email && value && !isValidEmail(value)) {
      fieldErrors.push(`${field} must be a valid email`);
      valid = false;
    }

    // URL validation
    if (fieldRules.url && value && !isValidURL(value)) {
      fieldErrors.push(`${field} must be a valid URL`);
      valid = false;
    }

    // Phone validation
    if (fieldRules.phone && value && !isValidPhone(value)) {
      fieldErrors.push(`${field} must be a valid phone number`);
      valid = false;
    }

    // Min length validation
    if (fieldRules.minLength && value && !isValidLength(value, fieldRules.minLength)) {
      fieldErrors.push(`${field} must be at least ${fieldRules.minLength} characters`);
      valid = false;
    }

    // Max length validation
    if (fieldRules.maxLength && value && !isValidLength(value, 0, fieldRules.maxLength)) {
      fieldErrors.push(`${field} must be no more than ${fieldRules.maxLength} characters`);
      valid = false;
    }

    // Custom validation
    if (fieldRules.custom && value) {
      const customResult = fieldRules.custom(value);
      if (!customResult.valid) {
        fieldErrors.push(customResult.message || `${field} is invalid`);
        valid = false;
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  });

  return { valid, errors };
};

// ============================================================================
// SANITIZATION
// ============================================================================

/**
 * Sanitizes text input by removing potentially harmful characters
 * @function sanitizeText
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 * @example
 * sanitizeText('<script>alert("xss")</script>'); // 'scriptalert("xss")/script'
 */
export const sanitizeText = (text) => {
  if (!text) return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitizes object values recursively
 * @function sanitizeObject
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 * @example
 * sanitizeObject({ name: '<script>bad</script>' });
 * // { name: '&lt;script&gt;bad&lt;/script&gt;' }
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};

