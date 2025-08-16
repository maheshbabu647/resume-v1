import mongoose from "mongoose";
import templateModel from "../model/template-model.js";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "../service/cloudinary-service.js";
import logger from "../config/logger.js";
import { logAnalyticsEvent } from '../service/analytics-logger.js'

// [SECURITY] Max templates returned per request (avoid DDoS on getAll)
const MAX_TEMPLATES_RETURNED = 1000;

// Get all templates
const getAllTemplates = async (req, res, next) => {
  try {
    const templates = await templateModel.find({}).sort({ createdAt: -1 }).limit(MAX_TEMPLATES_RETURNED);

    // === Analytics Logging ===
    await logAnalyticsEvent({
      eventType: 'template_fetch_all',
      userId: req.user ? req.user.userId : null,
      meta: { count: templates.length, ip: req.ip }
    });

    logger.info(`[Template][GetAll][Success] Returned ${templates.length} templates`);
    res.status(200).json(templates);
  } catch (error) {
    logger.error(`[Template][GetAll][Error] ${error.message}`);
    const err = new Error();
    err.name = error.name || "GET ALL TEMPLATES FAILED";
    err.status = 500;
    err.message = error.message || "Server error retrieving templates";
    next(err);
  }
};

// Create a new template
const createTemplate = async (req, res, next) => {
  try {
    // Destructure 'industryImages' from the request body
    const { templateName, templateCode, templateFieldDefinition, tags, industryImages } = req.body;
    let templateImageUrl = '';
    let templatePublicId = '';
    let parsedTemplateFieldDefinition = [];
    let parsedTags = {};
    let parsedIndustryImages = {}; // To hold the parsed industry images map

    if (!templateName || !templateCode) {
      logger.warn(`[Template][Create][ValidationFail] Name or code missing`);
      const err = new Error("Template name and code are required");
      err.status = 400;
      return next(err);
    }

    // Parse and validate templateFieldDefinition
    if (templateFieldDefinition) {
      try {
        parsedTemplateFieldDefinition = JSON.parse(templateFieldDefinition);
        if (!Array.isArray(parsedTemplateFieldDefinition)) {
          throw new Error('fieldDefinitions must be a valid JSON array.');
        }
      } catch (error) {
        logger.warn(`[Template][Create][ValidationFail] Invalid field definition: ${error.message}`);
        const err = new Error(error.message || 'Invalid format for fieldDefinitions.');
        err.status = 400;
        return next(err);
      }
    }

    // Parse and validate tags
    if (tags) {
        try {
            parsedTags = JSON.parse(tags);
            if (typeof parsedTags !== 'object' || Array.isArray(parsedTags)) {
                 throw new Error('Tags must be a valid JSON object.');
            }
        } catch (error) {
            logger.warn(`[Template][Create][ValidationFail] Invalid tags format: ${error.message}`);
            const err = new Error(error.message || 'Invalid format for tags.');
            err.status = 400;
            return next(err);
        }
    }

    // --- NEW: Parse and validate industryImages ---
    if (industryImages) {
        try {
            parsedIndustryImages = JSON.parse(industryImages);
            if (typeof parsedIndustryImages !== 'object' || Array.isArray(parsedIndustryImages)) {
                 throw new Error('Industry Images must be a valid JSON object (a map).');
            }
        } catch (error) {
            logger.warn(`[Template][Create][ValidationFail] Invalid industryImages format: ${error.message}`);
            const err = new Error(error.message || 'Invalid format for industryImages.');
            err.status = 400;
            return next(err);
        }
    }


    // Handle image upload
    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.buffer, req.file.originalname);
      templateImageUrl = result.secure_url;
      templatePublicId = result.public_id;
    } else {
      logger.warn(`[Template][Create][ValidationFail] Image missing`);
      const err = new Error('Template image file is required for creation.');
      err.status = 400;
      return next(err);
    }

    // Construct the new template object including new fields
    const newTemplate = {
      templateName,
      templateCode,
      templateImage: templateImageUrl,
      templateImageId: templatePublicId,
      templateFieldDefinition: parsedTemplateFieldDefinition,
      tags: parsedTags,
      industryImages: parsedIndustryImages // Add the parsed industry images map
      // NOTE: A full implementation for production might also handle multiple file uploads
      // and populate a corresponding `industryImageIds` map.
    };

    const savedTemplate = await templateModel.create(newTemplate);

    // === Analytics Logging ===
    await logAnalyticsEvent({
      eventType: 'template_create',
      userId: req.user ? req.user.userId : null,
      meta: { templateId: savedTemplate._id, ip: req.ip }
    });

    logger.info(`[Template][Create][Success] Name: ${templateName}, Code: ${templateCode}`);
    res.status(201).json({
      message: 'Template created successfully',
      template: savedTemplate,
    });
  } catch (error) {
    logger.error(`[Template][Create][Error] ${error.message}`);
    const err = new Error();
    err.name = error.name || "TEMPLATE CREATION FAILED";
    err.message = error.message || "Server error creating template";
    err.status = 500;
    next(err);
  }
};

// Update an existing template
const updateTemplate = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    // Destructure new fields from the request body
    const { templateName, templateCode, templateFieldDefinition, tags, industryImages } = req.body;
    let parsedTemplateFieldDefinition;
    let parsedTags;
    let parsedIndustryImages; // To hold the parsed industry images map

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      logger.warn(`[Template][Update][ValidationFail] Invalid ID: ${templateId}`);
      const err = new Error("invalid template id format");
      err.status = 400;
      return next(err);
    }

    const template = await templateModel.findById({ _id: templateId });

    if (!template) {
      logger.warn(`[Template][Update][NotFound] ID: ${templateId}`);
      const err = new Error("Template not found");
      err.status = 404;
      return next(err);
    }

    // Parse and validate templateFieldDefinition if provided
    if (templateFieldDefinition !== undefined) {
      try {
        parsedTemplateFieldDefinition = JSON.parse(templateFieldDefinition);
        if (!Array.isArray(parsedTemplateFieldDefinition)) {
          throw new Error('fieldDefinitions must be a valid JSON array.');
        }
      } catch (error) {
        logger.warn(`[Template][Update][ValidationFail] Invalid field definition: ${error.message}`);
        const err = new Error(error.message || 'Invalid format for fieldDefinitions.');
        err.status = 400;
        return next(err);
      }
    }

    // Parse and validate tags if provided
    if (tags !== undefined) {
      try {
        parsedTags = JSON.parse(tags);
        if (typeof parsedTags !== 'object' || Array.isArray(parsedTags)) {
          throw new Error('Tags must be a valid JSON object.');
        }
      } catch (error) {
        logger.warn(`[Template][Update][ValidationFail] Invalid tags format: ${error.message}`);
        const err = new Error(error.message || 'Invalid format for tags.');
        err.status = 400;
        return next(err);
      }
    }
    
    // --- NEW: Parse and validate industryImages if provided ---
    if (industryImages !== undefined) {
      try {
        parsedIndustryImages = JSON.parse(industryImages);
        if (typeof parsedIndustryImages !== 'object' || Array.isArray(parsedIndustryImages)) {
          throw new Error('Industry Images must be a valid JSON object (a map).');
        }
      } catch (error) {
        logger.warn(`[Template][Update][ValidationFail] Invalid industryImages format: ${error.message}`);
        const err = new Error(error.message || 'Invalid format for industryImages.');
        err.status = 400;
        return next(err);
      }
    }

    let updatedImageUrl = template.templateImage;
    let updatedImageId = template.templateImageId;

    // Handle new image upload
    if (req.file) {
      if (template.templateImageId) {
        await deleteImageFromCloudinary(template.templateImageId);
      }
      const result = await uploadImageToCloudinary(req.file.buffer, req.file.originalname);
      updatedImageUrl = result.secure_url;
      updatedImageId = result.public_id;
    }

    // Construct the update object, including new fields
    const templateNewData = {
      templateName: templateName || template.templateName,
      templateCode: templateCode || template.templateCode,
      templateImage: updatedImageUrl,
      templateImageId: updatedImageId,
      templateFieldDefinition: parsedTemplateFieldDefinition || template.templateFieldDefinition,
      tags: parsedTags || template.tags,
      industryImages: parsedIndustryImages || template.industryImages // Add the new or existing industry images
    };
    
    const updatedTemplate = await templateModel.findOneAndUpdate(
      { _id: templateId },
      { $set: templateNewData },
      { new: true }
    );

    // === Analytics Logging ===
    await logAnalyticsEvent({
      eventType: 'template_update',
      userId: req.user ? req.user.userId : null,
      meta: { templateId, ip: req.ip }
    });

    logger.info(`[Template][Update][Success] ID: ${templateId}`);
    res.status(200).json({
      message: 'Template updated successfully',
      template: updatedTemplate,
    });
  } catch (error) {
    logger.error(`[Template][Update][Error] ID: ${req.params.templateId} - ${error.message}`);
    const err = new Error();
    err.name = error.name || "UPDATE TEMPLATE FAILED";
    err.message = error.message || "Server error updating template";
    err.status = error.status || 500;
    next(err);
  }
};

// Delete a template
const deleteTemplate = async (req, res, next) => {
  try {
    const { templateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      logger.warn(`[Template][Delete][ValidationFail] Invalid ID: ${templateId}`);
      const err = new Error("invalid template id format");
      err.status = 400;
      return next(err);
    }

    const template = await templateModel.findById({ _id: templateId });

    if (!template) {
      logger.warn(`[Template][Delete][NotFound] ID: ${templateId}`);
      const err = new Error("Template not found");
      err.status = 404;
      return next(err);
    }

    // Delete the main image from Cloudinary
    if (template.templateImageId) {
      await deleteImageFromCloudinary(template.templateImageId);
    }
    
    // NOTE: A full implementation would also iterate through the `industryImageIds` map
    // and delete each of those images from Cloudinary as well.

    await templateModel.findOneAndDelete({ _id: templateId });

    // === Analytics Logging ===
    await logAnalyticsEvent({
      eventType: 'template_delete',
      userId: req.user ? req.user.userId : null,
      meta: { templateId, ip: req.ip }
    });

    logger.info(`[Template][Delete][Success] ID: ${templateId}`);
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    logger.error(`[Template][Delete][Error] ID: ${req.params.templateId} - ${error.message}`);
    const err = new Error();
    err.name = error.name || "DELETE TEMPLATE FAILED";
    err.message = error.message || "Server error for deleting template";
    err.status = error.status || 500;
    next(err);
  }
};

// Get a single template by ID
const getTemplateById = async (req, res, next) => {
  try {
    const { templateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      logger.warn(`[Template][GetById][ValidationFail] Invalid ID: ${templateId}`);
      const err = new Error("invalid template id format");
      err.status = 400;
      return next(err);
    }

    const template = await templateModel.findById({ _id: templateId });

    if (!template) {
      logger.warn(`[Template][GetById][NotFound] ID: ${templateId}`);
      const err = new Error("Template not found");
      err.status = 404;
      return next(err);
    }

    // === Analytics Logging ===
    await logAnalyticsEvent({
      eventType: 'template_fetch_by_id',
      userId: req.user ? req.user.userId : null,
      meta: { templateId, ip: req.ip }
    });

    logger.info(`[Template][GetById][Success] ID: ${templateId}`);
    res.status(200).json(template);
  } catch (error) {
    logger.error(`[Template][GetById][Error] ID: ${req.params.templateId} - ${error.message}`);
    const err = new Error();
    err.name = error.name || "RETRIEVE TEMPLATE FAILED";
    err.message = error.message || "Server error retrieving the template";
    err.status = error.status || 500;
    next(err);
  }
};

export {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplateById
};