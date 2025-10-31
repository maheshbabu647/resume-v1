import resumeModel from "../model/resume-model.js";
import puppeteer from 'puppeteer';
import logger from '../config/logger.js';
import { logAnalyticsEvent } from '../service/analytics-logger.js';
import { generateAIFieldContent as generateAIFieldContentService, enhanceResumeContent as enhanceResumeContentService } from '../service/ai-summary-service.js';


// [SECURITY] Max allowed HTML size for PDF generation
const MAX_HTML_SIZE = 100_000; // 100 KB

// [SECURITY] Max resumes per user
const MAX_RESUMES_PER_USER = 100;

export const createResume = async (req, res, next) => {
  try {
    const { templateId, resumeData, resumeName, spacingMultiplier, fontSizeMultiplier, stylePackKey, sectionOrder, selectedIndustry } = req.body;
    const userId = req.user.userId;

    // [SECURITY] Prevent spam by limiting resumes per user
    const existingCount = await resumeModel.countDocuments({ userId });
    if (existingCount >= MAX_RESUMES_PER_USER) {
      logger.warn(`[Resume][Create][Limit] User: ${userId} exceeded resume limit`);
      const err = new Error('Resume limit reached. Please delete an old resume before creating a new one.');
      err.status = 429;
      return next(err);
    }

    const resume = {
      userId,
      templateId,
      resumeData,
      resumeName: resumeName || undefined,
      spacingMultiplier,
      fontSizeMultiplier,
      stylePackKey,
      sectionOrder,
      selectedIndustry
    };

    const savedResume = await resumeModel.create(resume);
    const populatedResume = await resumeModel.findById(savedResume._id)
      .populate('templateId', 'templateName templateImage');

    // === Analytics Logging ===
    await logAnalyticsEvent({
      eventType: 'resume_create',
      userId,
      meta: { resumeId: savedResume._id, templateId, ip: req.ip }
    });

    logger.info(`[Resume][Create] User: ${userId} created resume: ${savedResume._id}`);

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      resume: populatedResume || savedResume
    });
  } catch (error) {
    logger.error(`[Resume][Create][Error] User: ${req.user?.userId || 'unknown'} - ${error.message}`);
    const err = new Error('Error creating the resume: ' + (error.message || error));
    err.status = 400;
    err.name = 'FAILED TO CREATE RESUME';
    next(err);
  }
};

export const getResumeById = async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const userId = req.user.userId;

    const resume = await resumeModel.findById(resumeId)
      .populate('templateId', 'templateName templateImage templateComponents templateFieldDefinition');

    if (!resume) {
      logger.warn(`[Resume][GetById][NotFound] ID: ${resumeId} by user: ${userId}`);
      const err = new Error('Resume not found.');
      err.status = 404;
      return next(err);
    }

    if (resume.userId.toString() !== userId.toString()) {
      logger.warn(`[Resume][GetById][Unauthorized] Resume: ${resumeId} requested by user: ${userId}`);
      const err = new Error('Unauthorized. You do not have permission to access this resume.');
      err.status = 403;
      return next(err);
    }

    // === Analytics Logging ===
    await logAnalyticsEvent({
      eventType: 'resume_view',
      userId,
      meta: { resumeId, ip: req.ip }
    });

    logger.info(`[Resume][GetById][Success] Resume: ${resumeId} by user: ${userId}`);

    res.status(200).json({ success: true, resume });
  } catch (error) {
    logger.error(`[Resume][GetById][Error] Resume: ${req.params.resumeId} - ${error.message}`);
    const err = new Error(error.message || 'Server error while fetching resume.');
    err.status = error.status || 500;
    next(err);
  }
};

export const updateResume = async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { resumeData, resumeName, spacingMultiplier, fontSizeMultiplier, stylePackKey, sectionOrder, selectedIndustry } = req.body;
    const userId = req.user.userId;

    const resume = await resumeModel.findById(resumeId);

    if (!resume) {
      logger.warn(`[Resume][Update][NotFound] ID: ${resumeId} by user: ${userId}`);
      const err = new Error('Resume not found.');
      err.status = 404;
      return next(err);
    }

    if (resume.userId.toString() !== userId.toString()) {
      logger.warn(`[Resume][Update][Unauthorized] Resume: ${resumeId} modified by user: ${userId}`);
      const err = new Error('Unauthorized. You do not have permission to modify this resume.');
      err.status = 403;
      return next(err);
    }

    const updateResume = {
      resumeName: resumeName || resume.resumeName,
      resumeData: resumeData || resume.resumeData,
      spacingMultiplier: spacingMultiplier || resume.spacingMultiplier,
      fontSizeMultiplier: fontSizeMultiplier || resume.fontSizeMultiplier,
      stylePackKey: stylePackKey || resume.stylePackKey,
      sectionOrder: sectionOrder || resume.sectionOrder,
      selectedIndustry: selectedIndustry || resume.selectedIndustry
    };

    await resumeModel.findByIdAndUpdate(resumeId, updateResume);

    const populatedResume = await resumeModel.findById(resumeId)
      .populate('templateId', 'templateName templateImage templateCode');

    // === Analytics Logging ===
    await logAnalyticsEvent({
      eventType: 'resume_update',
      userId,
      meta: { resumeId, ip: req.ip }
    });

    logger.info(`[Resume][Update][Success] Resume: ${resumeId} updated by user: ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      resume: populatedResume
    });
  } catch (error) {
    logger.error(`[Resume][Update][Error] Resume: ${req.params.resumeId} - ${error.message}`);
    const err = new Error(error.message || 'Server error while updating resume.');
    err.status = error.status || 500;
    next(err);
  }
};

export const getAllResumes = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const resumes = await resumeModel.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(MAX_RESUMES_PER_USER)
      .populate('templateId', 'templateName templateImage');

    // === Analytics Logging ===
    await logAnalyticsEvent({
      eventType: 'resumes_fetch_all',
      userId,
      meta: { count: resumes.length, ip: req.ip }
    });

    logger.info(`[Resume][GetAll][Success] User: ${userId} fetched all resumes (${resumes.length})`);

    res.status(200).json({ success: true, resumes });
  } catch (error) {
    logger.error(`[Resume][GetAll][Error] User: ${req.user?.userId || 'unknown'} - ${error.message}`);
    const err = new Error(error.message || 'Failed to fetch the resumes.');
    err.status = error.status || 500;
    next(err);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const userId = req.user.userId;

    const resume = await resumeModel.findById(resumeId);

    if (!resume) {
      logger.warn(`[Resume][Delete][NotFound] ID: ${resumeId} by user: ${userId}`);
      const err = new Error('Resume not found.');
      err.status = 404;
      return next(err);
    }

    if (resume.userId.toString() !== userId.toString()) {
      logger.warn(`[Resume][Delete][Unauthorized] Resume: ${resumeId} deleted by user: ${userId}`);
      const err = new Error('Unauthorized. You do not have permission to delete this resume.');
      err.status = 403;
      return next(err);
    }

    await resumeModel.findByIdAndDelete(resumeId);

    // === Analytics Logging ===
    await logAnalyticsEvent({
      eventType: 'resume_delete',
      userId,
      meta: { resumeId, ip: req.ip }
    });

    logger.info(`[Resume][Delete][Success] Resume: ${resumeId} deleted by user: ${userId}`);

    res.status(200).json({ message: 'Resume deleted successfully.' });
  } catch (error) {
    logger.error(`[Resume][Delete][Error] Resume: ${req.params.resumeId} - ${error.message}`);
    const err = new Error(error.message || 'Server error while deleting resume.');
    err.status = error.status || 500;
    next(err);
  }
};
export const downlaodResume = async (req, res, next) => {
  try {
    const { html } = req.body;
    const userId = req.user ? req.user.userId : 'unknown';

    if (!html || typeof html !== 'string') {
      logger.warn(`[Resume][Download][ValidationFail] No HTML provided by user: ${userId}`);
      const err = new Error('No HTML provided for PDF download.');
      err.status = 400;
      return next(err);
    }

    logger.info(`[Resume][Download][Request] User: ${userId}`);

    const fullHtml = `<style>body { margin: 0; }</style>${html}`;

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1240,      
      height: 1754,     
      deviceScaleFactor: 2, 
    });
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      width: '210mm',
      height: '297mm',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        left: '0px',
        bottom: '0px',
      }
    });
    await browser.close();

    await logAnalyticsEvent({
      eventType: 'resume_download',
      userId,
      meta: { ip: req.ip }
    });

    logger.info(`[Resume][Download][Success] Resume PDF generated for user: ${userId}`);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume.pdf"',
    });

    res.status(200).send(pdfBuffer); // Use 200 OK for a successful file delivery
  } catch (error) {
    logger.error(`[Resume][Download][Error] User: ${req.user ? req.user.userId : 'unknown'} - ${error.message}`);
    const err = new Error(error.message || 'Server error while downloading resume.');
    err.status = error.status || 500;
    next(err);
  }
};

export const generateResumeSummary = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { resumeData, sessionId } = req.body;

    await logAnalyticsEvent({
      eventType: 'resume_generate_summary_attempt',
      userId,
      meta: { ip: req.ip }
    });

    const summary = await generateAISummary(resumeData, req.user, sessionId);

    await logAnalyticsEvent({
      eventType: 'resume_generate_summary_success',
      userId,
      meta: { ip: req.ip }
    });

    logger.info(`[Resume][Summary][Success] User: ${userId} generated resume summary`)
    res.status(200).json({
      success: true,
      summary
    });
  } catch (error) {
    logger.error(`[Resume][Summary][Error] User: ${req.user?.userId || 'unknown'} - ${error.message}`);
    const err = new Error(error.message || 'Error generating resume summary.');
    err.status = 500;
    next(err);
  }
};

export const generateFieldContent = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { fieldName, fieldLabel, fieldType, globalContext, localContext, userNotes, sessionId } = req.body || {};

    await logAnalyticsEvent({
      eventType: 'resume_generate_field_attempt',
      userId,
      meta: { fieldName, ip: req.ip }
    });

    const content = await generateAIFieldContentService({
      fieldName,
      fieldLabel,
      fieldType,
      globalContext: globalContext || {},
      localContext: localContext || {},
      userNotes: userNotes || '',
      user: req.user,
      sessionId
    });

    await logAnalyticsEvent({
      eventType: 'resume_generate_field_success',
      userId,
      meta: { fieldName, ip: req.ip }
    });

    res.status(200).json({ success: true, content });
  } catch (error) {
    console.error('[Resume][FieldGen][Error]', error);
    const err = new Error(error.message || 'Error generating field content.');
    err.status = error.status || 500;
    next(err);
  }
};

export const enhanceEntireResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { resumeData, globalContext, userNotes, sessionId } = req.body || {};

    await logAnalyticsEvent({
      eventType: 'resume_enhance_attempt',
      userId,
      meta: { ip: req.ip }
    });

    const enhanced = await enhanceResumeContentService({
      resumeData: resumeData || {},
      globalContext: globalContext || {},
      userNotes: userNotes || '',
      user: req.user,
      sessionId
    });

    await logAnalyticsEvent({
      eventType: 'resume_enhance_success',
      userId,
      meta: { ip: req.ip }
    });

    res.status(200).json({ success: true, enhancedResumeData: enhanced });
  } catch (error) {
    console.error('[Resume][Enhance][Error]', error);
    const err = new Error(error.message || 'Error enhancing resume.');
    err.status = error.status || 500;
    next(err);
  }
};

