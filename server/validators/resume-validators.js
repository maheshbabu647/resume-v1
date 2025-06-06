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
        .custom(val => Object.keys(val).length <= 1000)
        .withMessage("Resume data is too large.")
    );
  } else if (mode === 'update') {
    validators.push(
      body('resumeData')
        .optional()
        .custom((val) => typeof val === 'object' && val !== null && !Array.isArray(val))
        .withMessage('Resume data must be a valid object.')
        .custom(val => !val || Object.keys(val).length <= 1000)
        .withMessage("Resume data is too large.")
    );
  } else if (mode === 'generateSummary') {
    validators.push(
      body('resumeData')
        .isObject()
        .withMessage('Resume data must be a valid object.')
        .custom(val => !val || Object.keys(val).length <= 1000)
        .withMessage("Resume data is too large.")
    );
  } else if (mode === 'generateCoverLetter') {
    validators.push(
      body('userName').notEmpty().withMessage('User name is required.').trim(),
      body('companyName').notEmpty().withMessage('Company name is required.').trim(),
      body('jobTitle').notEmpty().withMessage('Job title is required.').trim(),
      body('jobDescription').notEmpty().withMessage('Job description is required.').trim(),
      body('userSkills').notEmpty().withMessage('Please provide some key skills.').trim()
    );
  }


  validators.push(
    body('resumeName')
      .optional()
      .isString().withMessage("Resume name must be a string.")
      .trim()
      .isLength({ max: 100 }).withMessage('Resume name cannot exceed 100 characters.')
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
