import { body, param, validationResult } from 'express-validator';
import logger from '../config/logger.js';

// [1] Defensive, production-grade validator
const resumeValidatorsMode = (mode) => {
  const validators = [];

  if (mode === 'create') {
    validators.push(
      body('templateId')
        .notEmpty().withMessage('Template ID is required.')
        .isMongoId().withMessage('Invalid Template ID format.')
    );
    validators.push(
      body('resumeData')
        .notEmpty().withMessage("Resume data is required.")
        .custom((val) => typeof val === 'object' && val !== null && !Array.isArray(val))
        .withMessage("Resume data must be a valid object.")
        // [OPTIONAL] Defensive: check for excessively large resume
        .custom(val => Object.keys(val).length <= 1000)
        .withMessage("Resume data is too large.")
    );
  } else if (mode === 'update') {
    validators.push(
      body('resumeData')
        .optional()
        .custom((val) => typeof val === 'object' && val !== null && !Array.isArray(val))
        .withMessage('Resume data must be a valid object.')
        // [OPTIONAL] Defensive: check for large update
        .custom(val => !val || Object.keys(val).length <= 1000)
        .withMessage("Resume data is too large.")
    );
  } else if (mode === 'generateSummary') {
    validators.push(
      body('resumeData')
        .isObject()
        .withMessage('Resume data must be a valid object.')
        // [OPTIONAL] Defensive: check for large update
        .custom(val => !val || Object.keys(val).length <= 1000)
        .withMessage("Resume data is too large.")
    );
  }

  validators.push(
    body('resumeName')
      .optional()
      .isString().withMessage("Resume name must be a string.")
      .trim()
      .isLength({ max: 100 }).withMessage('Resume name cannot exceed 100 characters.')
    // .escape() // [OPTIONAL] Only if used in HTML output, not needed for backend storage
  );

  if (['getById', 'update', 'delete'].includes(mode)) {
    validators.push(
      param('resumeId')
        .isMongoId().withMessage('Invalid resume Id format')
    );
  }

  return validators;
};

// [2] Secure error handler (never send invalid values to client)
const resumeValidation = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    logger.warn(`[Validation][Resume][Fail] IP: ${req.ip}, Errors: ${JSON.stringify(error.array())}`);
    // Only expose field & message to client (never the invalid value)
    const safeErrors = error.array().map(e => ({
      field: e.path,
      message: e.msg,
    }));
    const err = new Error('Validation Error');
    err.status = 400;
    err.name = 'VALIDATION_ERROR';
    err.message = safeErrors;
    return next(err);
  }
  next();
};

export {
  resumeValidatorsMode,
  resumeValidation
};
