import mongoose from "mongoose";
import templateModel from "../model/template-model.js";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "../service/cloudinary-service.js";
import logger from "../config/logger.js";
import { logAnalyticsEvent } from '../service/analytics-logger.js'

const MAX_TEMPLATES_RETURNED = 1000;

// Get all templates - NO CHANGES NEEDED
const getAllTemplates = async (req, res, next) => {
  try {
    const templates = await templateModel.find({}).sort({ createdAt: -1 }).limit(MAX_TEMPLATES_RETURNED);
    await logAnalyticsEvent({ eventType: 'template_fetch_all', userId: req.user ? req.user.userId : null, meta: { count: templates.length, ip: req.ip } });
    logger.info(`[Template][GetAll][Success] Returned ${templates.length} templates`);
    res.status(200).json(templates);
  } catch (error) {
    logger.error(`[Template][GetAll][Error] ${error.message}`);
    const err = new Error("Server error retrieving templates");
    err.name = error.name || "GET ALL TEMPLATES FAILED";
    err.status = 500;
    next(err);
  }
};

// Create a new template - UPDATED
const createTemplate = async (req, res, next) => {
  try {
    // Destructure fields from the request body
    const { templateName, layoutSlots, templateComponents, templateFieldDefinition, tags } = req.body;
    let parsedLayoutSlots, parsedTemplateComponents, parsedTemplateFieldDefinition, parsedTags;

    if (!templateName) {
      logger.warn(`[Template][Create][ValidationFail] Template name is missing`);
      const err = new Error("Template name is required");
      err.status = 400;
      return next(err);
    }

    // Parse and validate layoutSlots
    if (layoutSlots) {
      try {
        parsedLayoutSlots = JSON.parse(layoutSlots);
        if (!Array.isArray(parsedLayoutSlots)) throw new Error('layoutSlots must be a valid JSON array.');
      } catch (error) {
        logger.warn(`[Template][Create][ValidationFail] Invalid layoutSlots: ${error.message}`);
        const err = new Error(error.message || 'Invalid format for layoutSlots.');
        err.status = 400;
        return next(err);
      }
    }

    // Parse and validate templateComponents
    if (templateComponents) {
      try {
        parsedTemplateComponents = JSON.parse(templateComponents);
        if (typeof parsedTemplateComponents !== 'object' || parsedTemplateComponents === null || Array.isArray(parsedTemplateComponents)) {
            throw new Error('templateComponents must be a valid JSON object.');
        }
        if (!parsedTemplateComponents.htmlShell || !parsedTemplateComponents.baseCss) {
            throw new Error('templateComponents must include htmlShell and baseCss.');
        }
        // --- NEW: Validate sectionPresets if it exists ---
        if (parsedTemplateComponents.sectionPresets && !Array.isArray(parsedTemplateComponents.sectionPresets)) {
            throw new Error('sectionPresets must be a valid JSON array.');
        }
      } catch (error) {
        logger.warn(`[Template][Create][ValidationFail] Invalid templateComponents: ${error.message}`);
        const err = new Error(error.message || 'Invalid format for templateComponents.');
        err.status = 400;
        return next(err);
      }
    } else {
        const err = new Error('templateComponents object is required.');
        err.status = 400;
        return next(err);
    }

    // Parse templateFieldDefinition
    if (templateFieldDefinition) {
      try {
        parsedTemplateFieldDefinition = JSON.parse(templateFieldDefinition);
        if (!Array.isArray(parsedTemplateFieldDefinition)) throw new Error('fieldDefinitions must be a valid JSON array.');
      } catch (error) {
        logger.warn(`[Template][Create][ValidationFail] Invalid field definition: ${error.message}`);
        const err = new Error(error.message || 'Invalid format for fieldDefinitions.');
        err.status = 400;
        return next(err);
      }
    }

    // Parse tags
    if (tags) {
        try {
            parsedTags = JSON.parse(tags);
            if (typeof parsedTags !== 'object' || Array.isArray(parsedTags)) throw new Error('Tags must be a valid JSON object.');
        } catch (error) {
            logger.warn(`[Template][Create][ValidationFail] Invalid tags format: ${error.message}`);
            const err = new Error(error.message || 'Invalid format for tags.');
            err.status = 400;
            return next(err);
        }
    }
    
    // Handle image upload
    let templateImageUrl = '';
    let templatePublicId = '';
    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.buffer, req.file.originalname);
      templateImageUrl = result.secure_url;
      templatePublicId = result.public_id;
    } else {
      logger.warn(`[Template][Create][ValidationFail] Image missing`);
      const err = new Error('Template image file is required.');
      err.status = 400;
      return next(err);
    }

    // Construct the new template object
    const newTemplate = {
      templateName,
      layoutSlots: parsedLayoutSlots,
      templateComponents: parsedTemplateComponents,
      templateImage: templateImageUrl,
      templateImageId: templatePublicId,
      templateFieldDefinition: parsedTemplateFieldDefinition || [],
      tags: parsedTags || {},
    };

    const savedTemplate = await templateModel.create(newTemplate);

    await logAnalyticsEvent({ eventType: 'template_create', userId: req.user ? req.user.userId : null, meta: { templateId: savedTemplate._id, ip: req.ip } });
    logger.info(`[Template][Create][Success] Created template: ${templateName}`);
    res.status(201).json({ message: 'Template created successfully', template: savedTemplate });

  } catch (error) {
    logger.error(`[Template][Create][Error] ${error.message}`);
    const err = new Error("Server error creating template");
    err.name = error.name || "TEMPLATE CREATION FAILED";
    err.status = 500;
    next(err);
  }
};

// Update an existing template - UPDATED
const updateTemplate = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    const { templateName, layoutSlots, templateComponents, templateFieldDefinition, tags } = req.body;
    let parsedLayoutSlots, parsedTemplateComponents, parsedTemplateFieldDefinition, parsedTags;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      logger.warn(`[Template][Update][ValidationFail] Invalid ID: ${templateId}`);
      const err = new Error("Invalid template id format");
      err.status = 400;
      return next(err);
    }

    const template = await templateModel.findById(templateId);
    if (!template) {
      logger.warn(`[Template][Update][NotFound] ID: ${templateId}`);
      const err = new Error("Template not found");
      err.status = 404;
      return next(err);
    }

    // Parse and validate layoutSlots if provided
    if (layoutSlots !== undefined) {
      try {
        parsedLayoutSlots = JSON.parse(layoutSlots);
        if (!Array.isArray(parsedLayoutSlots)) throw new Error('layoutSlots must be a valid JSON array.');
      } catch (error) {
        logger.warn(`[Template][Update][ValidationFail] Invalid layoutSlots: ${error.message}`);
        const err = new Error(error.message || 'Invalid format for layoutSlots.');
        err.status = 400;
        return next(err);
      }
    }

    // Parse and validate templateComponents if provided
    if (templateComponents !== undefined) {
      try {
        parsedTemplateComponents = JSON.parse(templateComponents);
        if (typeof parsedTemplateComponents !== 'object' || parsedTemplateComponents === null || Array.isArray(parsedTemplateComponents)) {
            throw new Error('templateComponents must be a valid JSON object.');
        }
        // --- NEW: Validate sectionPresets if it exists ---
        if (parsedTemplateComponents.sectionPresets && !Array.isArray(parsedTemplateComponents.sectionPresets)) {
            throw new Error('sectionPresets must be a valid JSON array.');
        }
      } catch (error) {
        logger.warn(`[Template][Update][ValidationFail] Invalid templateComponents: ${error.message}`);
        const err = new Error(error.message || 'Invalid format for templateComponents.');
        err.status = 400;
        return next(err);
      }
    }

    // Parse templateFieldDefinition if provided
    if (templateFieldDefinition !== undefined) {
      try {
        parsedTemplateFieldDefinition = JSON.parse(templateFieldDefinition);
        if (!Array.isArray(parsedTemplateFieldDefinition)) throw new Error('fieldDefinitions must be a valid JSON array.');
      } catch (error) {
        logger.warn(`[Template][Update][ValidationFail] Invalid field definition: ${error.message}`);
        const err = new Error(error.message || 'Invalid format for fieldDefinitions.');
        err.status = 400;
        return next(err);
      }
    }

    // Parse tags if provided
    if (tags !== undefined) {
      try {
        parsedTags = JSON.parse(tags);
        if (typeof parsedTags !== 'object' || Array.isArray(parsedTags)) throw new Error('Tags must be a valid JSON object.');
      } catch (error) {
        logger.warn(`[Template][Update][ValidationFail] Invalid tags format: ${error.message}`);
        const err = new Error(error.message || 'Invalid format for tags.');
        err.status = 400;
        return next(err);
      }
    }

    // Handle image update
    let updatedImageUrl = template.templateImage;
    let updatedImageId = template.templateImageId;
    if (req.file) {
      if (template.templateImageId) {
        await deleteImageFromCloudinary(template.templateImageId);
      }
      const result = await uploadImageToCloudinary(req.file.buffer, req.file.originalname);
      updatedImageUrl = result.secure_url;
      updatedImageId = result.public_id;
    }

    // Construct the update object
    const templateNewData = {
      templateName: templateName || template.templateName,
      layoutSlots: parsedLayoutSlots || template.layoutSlots,
      templateComponents: parsedTemplateComponents || template.templateComponents,
      templateImage: updatedImageUrl,
      templateImageId: updatedImageId,
      templateFieldDefinition: parsedTemplateFieldDefinition || template.templateFieldDefinition,
      tags: parsedTags || template.tags,
    };
    
    const updatedTemplate = await templateModel.findByIdAndUpdate(
      templateId,
      { $set: templateNewData },
      { new: true, runValidators: true }
    );

    await logAnalyticsEvent({ eventType: 'template_update', userId: req.user ? req.user.userId : null, meta: { templateId, ip: req.ip } });
    logger.info(`[Template][Update][Success] ID: ${templateId}`);
    res.status(200).json({ message: 'Template updated successfully', template: updatedTemplate });

  } catch (error) {
    logger.error(`[Template][Update][Error] ID: ${req.params.templateId} - ${error.message}`);
    const err = new Error("Server error updating template");
    err.name = error.name || "UPDATE TEMPLATE FAILED";
    err.status = error.status || 500;
    next(err);
  }
};

// Delete a template - NO CHANGES NEEDED
const deleteTemplate = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      logger.warn(`[Template][Delete][ValidationFail] Invalid ID: ${templateId}`);
      const err = new Error("Invalid template id format");
      err.status = 400;
      return next(err);
    }
    const template = await templateModel.findById(templateId);
    if (!template) {
      logger.warn(`[Template][Delete][NotFound] ID: ${templateId}`);
      const err = new Error("Template not found");
      err.status = 404;
      return next(err);
    }
    if (template.templateImageId) {
      await deleteImageFromCloudinary(template.templateImageId);
    }
    await templateModel.findByIdAndDelete(templateId);
    await logAnalyticsEvent({ eventType: 'template_delete', userId: req.user ? req.user.userId : null, meta: { templateId, ip: req.ip } });
    logger.info(`[Template][Delete][Success] ID: ${templateId}`);
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    logger.error(`[Template][Delete][Error] ID: ${req.params.templateId} - ${error.message}`);
    const err = new Error("Server error deleting template");
    err.name = error.name || "DELETE TEMPLATE FAILED";
    err.status = error.status || 500;
    next(err);
  }
};

// Get a single template by ID - NO CHANGES NEEDED
const getTemplateById = async (req, res, next) => {
  try {
    const { templateId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      logger.warn(`[Template][GetById][ValidationFail] Invalid ID: ${templateId}`);
      const err = new Error("Invalid template id format");
      err.status = 400;
      return next(err);
    }
    const template = await templateModel.findById(templateId);
    if (!template) {
      logger.warn(`[Template][GetById][NotFound] ID: ${templateId}`);
      const err = new Error("Template not found");
      err.status = 404;
      return next(err);
    }
    await logAnalyticsEvent({ eventType: 'template_fetch_by_id', userId: req.user ? req.user.userId : null, meta: { templateId, ip: req.ip } });
    logger.info(`[Template][GetById][Success] ID: ${templateId}`);
    res.status(200).json(template);
  } catch (error) {
    logger.error(`[Template][GetById][Error] ID: ${req.params.templateId} - ${error.message}`);
    const err = new Error("Server error retrieving the template");
    err.name = error.name || "RETRIEVE TEMPLATE FAILED";
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