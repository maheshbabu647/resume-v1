import { body, param, validationResult } from 'express-validator'
import logger from '../config/logger.js'

// [1] Template field validation & sanitization
const templateValidatorsMode = (mode) => {
  const validators = []

  if (mode === 'create' || mode === 'update') {
    validators.push(
      body('templateName')
        .if((value, { req }) => mode === 'create' || value !== undefined)
        .notEmpty().withMessage('Template name is required.')
        .trim()
        // .escape() // [OPTIONAL] Only if displaying in HTML output
        .blacklist('<>"/\\&') // [ADDED] Prevent HTML/JS injection
    )
    validators.push(
      body('templateCode')
        .if((value, { req }) => mode === 'create' || value !== undefined)
        .notEmpty().withMessage('Template code is required.')
        .trim()
    )
    validators.push(
      body('templateImage')
        .if((value, { req }) => value !== undefined)
        .notEmpty().withMessage('Template image URL is required.')
        .isURL().withMessage('Template image must be a valid URL.')
        .trim()
        .blacklist('<>"/\\&') // [ADDED] Defensive
    )
  }

  if (['update', 'delete', 'getById'].includes(mode)) {
    validators.push(
      param('templateId')
        .isMongoId().withMessage('Invalid template ID format.')
    )
  }

  return validators
}

// [2] Error handling: never leak full validation structure, just safe details
const templateValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    logger.warn(`[Validation][Template][Fail] IP: ${req.ip}, Errors: ${JSON.stringify(errors.array())}`)

    // Build safe, user-friendly errors (no field values returned)
    const safeErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
    }))

    const err = new Error('Validation Error')
    err.status = 400
    err.name = 'VALIDATION_ERROR'
    err.message = safeErrors
    return next(err)
  }
  next()
}

export {
  templateValidatorsMode,
  templateValidation
}
