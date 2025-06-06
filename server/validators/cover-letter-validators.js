import { body, param, validationResult } from 'express-validator';
import logger from '../config/logger.js';

const coverLetterValidatorsMode = (mode) => {
  const validators = [];

  if (mode === 'generate') {
    validators.push(
      body('userName').notEmpty().withMessage('User name is required.').trim(),
      body('companyName').notEmpty().withMessage('Company name is required.').trim(),
      body('jobTitle').notEmpty().withMessage('Job title is required.').trim(),
      body('jobDescription').notEmpty().withMessage('Job description is required.').trim(),
      body('userSkills').notEmpty().withMessage('Please provide some key skills.').trim()
    );
  } else if (mode === 'save') {
    validators.push(
      body('companyName').notEmpty().withMessage('Company name is required.').trim(),
      body('jobTitle').notEmpty().withMessage('Job title is required.').trim(),
      body('coverLetterContent').notEmpty().withMessage('Cover letter content cannot be empty.').trim()
    );
  } else if (mode === 'update') {
     validators.push(
      param('coverLetterId').isMongoId().withMessage('Invalid Cover Letter ID format.'),
      body('coverLetterContent').notEmpty().withMessage('Cover letter content cannot be empty.').trim()
    );
  } else if (mode === 'delete') {
     validators.push(
      param('coverLetterId').isMongoId().withMessage('Invalid Cover Letter ID format.')
    );
  }

  return validators;
};

const coverLetterValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`[Validation][CoverLetter][Fail] IP: ${req.ip}, Errors: ${JSON.stringify(errors.array())}`);
    
    const safeErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
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
  coverLetterValidatorsMode,
  coverLetterValidation
};
