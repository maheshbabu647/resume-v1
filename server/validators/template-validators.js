// import { body, param, validationResult } from 'express-validator';
// import logger from '../config/logger.js';

// // Custom validator to check if a string is valid JSON
// const isJSONString = (value, { req }) => {
//   try {
//     JSON.parse(value);
//   } catch (e) {
//     return false;
//   }
//   return true;
// };

// // Custom validator to check if templateComponents is a valid object with required keys
// const isValidTemplateComponents = (value, { req }) => {
//     try {
//         const components = JSON.parse(value);
//         if (typeof components !== 'object' || components === null || Array.isArray(components)) {
//             throw new Error('Must be a JSON object.');
//         }
//         if (!components.htmlShell || !components.baseCss) {
//             throw new Error('Must contain "htmlShell" and "baseCss" properties.');
//         }
//     } catch (e) {
//         return false;
//     }
//     return true;
// };


// // Template field validation & sanitization
// const templateValidatorsMode = (mode) => {
//   const validators = [];

//   if (mode === 'create' || mode === 'update') {
//     // --- EXISTING VALIDATORS (MODIFIED) ---
//     validators.push(
//       body('templateName')
//         .if((value, { req }) => mode === 'create' || value !== undefined)
//         .notEmpty().withMessage('Template name is required.')
//         .trim()
//         .blacklist('<>"/\\&') // Prevent HTML/JS injection
//     );

//     // --- REMOVED VALIDATOR for `templateCode` ---

//     // --- NEW VALIDATORS for our modular schema ---
//     validators.push(
//         body('layoutSlots')
//           .if((value, { req }) => mode === 'create' || value !== undefined)
//           .notEmpty().withMessage('layoutSlots is required.')
//           .custom(isJSONString).withMessage('layoutSlots must be a valid JSON array string.')
//     );
    
//     validators.push(
//         body('templateComponents')
//           .if((value, { req }) => mode === 'create' || value !== undefined)
//           .notEmpty().withMessage('templateComponents is required.')
//           .custom(isValidTemplateComponents).withMessage('templateComponents must be a valid JSON object string with htmlShell and baseCss.')
//     );

//     validators.push(
//         body('templateFieldDefinition')
//           .if((value, { req }) => mode === 'create' || value !== undefined)
//           .notEmpty().withMessage('templateFieldDefinition is required.')
//           .custom(isJSONString).withMessage('templateFieldDefinition must be a valid JSON array string.')
//     );
    
//     validators.push(
//         body('tags')
//           .optional() // Tags are not strictly required
//           .custom(isJSONString).withMessage('tags must be a valid JSON object string.')
//     );
//   }

//   if (['update', 'delete', 'getById'].includes(mode)) {
//     validators.push(
//       param('templateId')
//         .isMongoId().withMessage('Invalid template ID format.')
//     );
//   }

//   return validators;
// };

// // Error handling middleware (no changes needed here)
// const templateValidation = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     logger.warn(`[Validation][Template][Fail] IP: ${req.ip}, Errors: ${JSON.stringify(errors.array())}`);

//     const safeErrors = errors.array().map(err => ({
//       field: err.path,
//       message: err.msg,
//     }));

//     const err = new Error('Validation Error');
//     err.status = 400;
//     err.name = 'VALIDATION_ERROR';
//     err.message = safeErrors;
//     return next(err);
//   }
//   next();
// };

// export {
//   templateValidatorsMode,
//   templateValidation
// };



import { body, param, validationResult } from 'express-validator';
import logger from '../config/logger.js';

// Custom validator to check if a string is a valid JSON string.
const isJSONString = (value) => {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }
  return true;
};

// --- NEW ---
// Custom validator to specifically check if a string is a valid JSON array.
const isJSONArrayString = (value) => {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      // It's valid JSON, but not an array.
      return false; 
    }
  } catch (e) {
    // It's not valid JSON at all.
    return false;
  }
  return true;
};

// Custom validator to check if templateComponents is a valid object with required keys.
const isValidTemplateComponents = (value) => {
    try {
        const components = JSON.parse(value);
        if (typeof components !== 'object' || components === null || Array.isArray(components)) {
            throw new Error('Must be a JSON object.');
        }
        if (!components.htmlShell || !components.baseCss) {
            throw new Error('Must contain "htmlShell" and "baseCss" properties.');
        }
    } catch (e) {
        return false;
    }
    return true;
};


// Main validation logic based on the operation mode (create, update, etc.)
const templateValidatorsMode = (mode) => {
  const validators = [];

  if (mode === 'create' || mode === 'update') {
    validators.push(
      body('templateName')
        // Only require it on create, or on update if the field is present.
        .if((value, { req }) => mode === 'create' || value !== undefined)
        .notEmpty().withMessage('Template name is required.')
        .trim()
        .blacklist('<>"/\\&') // Basic XSS prevention
    );
    
    validators.push(
        body('layoutSlots')
          .if((value, { req }) => mode === 'create' || value !== undefined)
          .notEmpty().withMessage('layoutSlots is required.')
          .custom(isJSONArrayString).withMessage('layoutSlots must be a valid JSON array string.')
    );
    
    validators.push(
        body('templateComponents')
          .if((value, { req }) => mode === 'create' || value !== undefined)
          .notEmpty().withMessage('templateComponents is required.')
          .custom(isValidTemplateComponents).withMessage('templateComponents must be a valid JSON object string with htmlShell and baseCss.')
    );

    validators.push(
        body('templateFieldDefinition')
          .if((value, { req }) => mode === 'create' || value !== undefined)
          .notEmpty().withMessage('templateFieldDefinition is required.')
          .custom(isJSONArrayString).withMessage('templateFieldDefinition must be a valid JSON array string.')
    );
    
    validators.push(
        body('tags')
          .optional() // Tags are not strictly required
          .custom(isJSONString).withMessage('tags must be a valid JSON object string.')
    );

    // --- NEW VALIDATORS for isAtsRecommended and presets ---
    validators.push(
        body('isAtsRecommended')
          .optional() // This field is not required on create or update
          .isBoolean().withMessage('isAtsRecommended must be a boolean (true or false).')
    );

    validators.push(
        body('presets')
          .optional() // Presets are also optional
          .custom(isJSONArrayString).withMessage('presets must be a valid JSON array string.')
    );
  }

  // Parameter validation for routes that include an ID
  if (['update', 'delete', 'getById'].includes(mode)) {
    validators.push(
      param('templateId')
        .isMongoId().withMessage('Invalid template ID format.')
    );
  }

  return validators;
};

// Error handling middleware to process validation results
const templateValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`[Validation][Template][Fail] IP: ${req.ip}, Errors: ${JSON.stringify(errors.array())}`);

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
  templateValidatorsMode,
  templateValidation
};