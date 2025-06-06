import { body, param, validationResult } from 'express-validator'
import logger from '../config/logger.js'

// ===== User SignUp Validators =====
const userSignUpValidators = [
  body('userName')
    .isString().withMessage('User name must be string')
    .notEmpty().withMessage('User name must not be empty')
    .isAlphanumeric().withMessage('User name should contain only Alphabets and Numbers')
    .isLength({ min: 2, max: 30 }).withMessage('User name must be min of 2 characters and max of 30 characters')
    .trim()
    .custom(value => !['admin', 'root', 'superuser'].includes(value.toLowerCase()))
    .withMessage('That username is not allowed.'),

  body('userEmail')
    .isEmail().withMessage('User email must be in correct format')
    .notEmpty().withMessage('User email must not be empty')
    .normalizeEmail()
    .trim(),

  body('userPassword')
    .isString().withMessage('User password must be a string')
    .notEmpty().withMessage('User Password should not be empty')
    .isLength({ min: 8 }).withMessage('User password must be minimum of 8 characters')
    .matches(/[A-Z]/).withMessage('User password must contain at least one UpperCase')
    .matches(/[a-z]/).withMessage('User Password must contain at least one LowerCase')
    .matches(/[0-9]/).withMessage('User password must contain at least one numeric value')
    .matches(/[\W_]/).withMessage('User password must contain at least one special symbol')
];

// ===== User SignUp Validation Middleware =====
const userSignUpValidation = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    // Log validation failure without leaking sensitive data
    const safeErrors = error.array().map(e => ({
      field: e.path,
      message: e.msg,
    }))
    logger.warn(`[Validation][SignUp][Fail] IP: ${req.ip}, Errors: ${JSON.stringify(safeErrors)}`);
    const err = new Error('Validation Error');
    err.status = 400;
    err.name = 'VALIDATION_ERROR';
    err.message = safeErrors;
    return next(err);
  }
  next();
};

// ===== User SignIn Validators =====
const userSignInValidators = [
  body('userEmail')
    .isEmail().withMessage('User email must be in correct format')
    .notEmpty().withMessage('User email must not be empty')
    .normalizeEmail()
    .trim(),

  body('userPassword')
    .notEmpty().withMessage("User password should not be empty")
    .isString().withMessage("User password must be a string")
];

// ===== Forgot Password Validator =====
const forgotPasswordValidator = [
    body('userEmail')
        .isEmail().withMessage('A valid email is required.')
        .normalizeEmail()
];

// ===== Reset Password Validator =====
const resetPasswordValidator = [
    param('token').notEmpty().withMessage('Token is required.'),
    body('userPassword')
        .isString().withMessage('User password must be a string')
        .notEmpty().withMessage('User Password should not be empty')
        .isLength({ min: 8 }).withMessage('User password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('User password must contain at least one UpperCase')
        .matches(/[a-z]/).withMessage('User Password must contain at least one LowerCase')
        .matches(/[0-9]/).withMessage('User password must contain at least one numeric value')
        .matches(/[\W_]/).withMessage('User password must contain at least one special symbol')
];

// ===== Resend Verification Link Validator =====
const resendVerificationValidator = [
    body('userEmail')
        .isEmail().withMessage('A valid email is required.')
        .normalizeEmail()
];


// ===== User SignIn Validation Middleware =====
const userSignInValidation = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const safeErrors = error.array().map(e => ({
      field: e.path,
      message: e.msg,
    }))
    logger.warn(`[Validation][SignIn][Fail] IP: ${req.ip}, Errors: ${JSON.stringify(safeErrors)}`);
    const err = new Error('Validation Error');
    err.name = 'VALIDATION_ERROR';
    err.status = 400;
    err.message = safeErrors;
    return next(err);
  }
  next();
};

export {
  userSignUpValidators,
  userSignUpValidation,
  userSignInValidators,
  userSignInValidation,
  forgotPasswordValidator,
  resetPasswordValidator,
  resendVerificationValidator
}
