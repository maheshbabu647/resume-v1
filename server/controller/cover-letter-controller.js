import coverLetterModel from "../model/cover-letter-model.js";
import logger from '../config/logger.js';
import { logAnalyticsEvent } from '../service/analytics-logger.js';
import { generateAICoverLetter } from '../service/ai-summary-service.js';

// --- Cover Letter Management ---

/**
 * Generates a cover letter using the AI service but does NOT save it.
 * It returns the generated text directly to the user.
 */
const generateCoverLetter = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { userName, companyName, jobTitle, jobDescription, userSkills } = req.body;
    const coverLetterData = { userName, companyName, jobTitle, jobDescription, userSkills };

    await logAnalyticsEvent({ eventType: 'cover_letter_generate_attempt', userId, meta: { ip: req.ip } });
    
    const coverLetterContent = await generateAICoverLetter(coverLetterData);

    await logAnalyticsEvent({ eventType: 'cover_letter_generate_success', userId, meta: { ip: req.ip } });
    logger.info(`[CoverLetter][Generate][Success] User: ${userId} generated a cover letter text.`);
    
    // Respond with just the generated text and success status
    res.status(200).json({ success: true, coverLetterContent: coverLetterContent });
  } catch (error) {
    logger.error(`[CoverLetter][Generate][Error] User: ${req.user?.userId || 'unknown'} - ${error.message}`);
    const err = new Error('Error generating cover letter.');
    err.status = 500;
    next(err);
  }
};

/**
 * Saves a new cover letter to the database.
 * The user can call this after they are satisfied with the generated text.
 */
const saveCoverLetter = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { companyName, jobTitle, coverLetterContent, originalInputs } = req.body;

        const newCoverLetter = {
            userId,
            companyName,
            jobTitle,
            coverLetterContent,
            originalInputs
        };

        const savedCoverLetter = await coverLetterModel.create(newCoverLetter);
        await logAnalyticsEvent({ eventType: 'cover_letter_save', userId, meta: { coverLetterId: savedCoverLetter._id, ip: req.ip }});
        logger.info(`[CoverLetter][Save][Success] User: ${userId} saved cover letter: ${savedCoverLetter._id}`);

        res.status(201).json({ success: true, message: 'Cover letter saved successfully!', coverLetter: savedCoverLetter });
    } catch (error) {
        logger.error(`[CoverLetter][Save][Error] User: ${req.user?.userId || 'unknown'} - ${error.message}`);
        const err = new Error('Error saving cover letter.');
        err.status = 500;
        next(err);
    }
};

/**
 * Gets all saved cover letters for the logged-in user.
 */
const getAllCoverLetters = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const coverLetters = await coverLetterModel.find({ userId }).sort({ updatedAt: -1 });

    logger.info(`[CoverLetter][GetAll][Success] User: ${userId} fetched ${coverLetters.length} cover letters.`);
    res.status(200).json({ success: true, coverLetters });
  } catch (error) {
    logger.error(`[CoverLetter][GetAll][Error] User: ${req.user.userId} - ${error.message}`);
    next(new Error('Failed to fetch cover letters.'));
  }
};

/**
 * Updates the content of a specific saved cover letter.
 */
const updateCoverLetter = async (req, res, next) => {
  try {
    const { coverLetterId } = req.params;
    const { coverLetterContent } = req.body;
    const { userId } = req.user;

    const letter = await coverLetterModel.findById(coverLetterId);
    if (!letter) {
        return res.status(404).json({ success: false, message: 'Cover letter not found.' });
    }
    if (letter.userId.toString() !== userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    letter.coverLetterContent = coverLetterContent;
    const updatedLetter = await letter.save();
    
    logger.info(`[CoverLetter][Update][Success] User: ${userId} updated cover letter: ${coverLetterId}`);
    res.status(200).json({ success: true, message: 'Cover letter updated successfully.', coverLetter: updatedLetter });
  } catch (error) {
    logger.error(`[CoverLetter][Update][Error] User: ${req.user.userId} - ${error.message}`);
    next(new Error('Failed to update cover letter.'));
  }
};

/**
 * Deletes a specific saved cover letter.
 */
const deleteCoverLetter = async (req, res, next) => {
  try {
    const { coverLetterId } = req.params;
    const { userId } = req.user;

    const letter = await coverLetterModel.findById(coverLetterId);
    if (!letter) {
        return res.status(404).json({ success: false, message: 'Cover letter not found.' });
    }
    if (letter.userId.toString() !== userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    await coverLetterModel.findByIdAndDelete(coverLetterId);

    logger.info(`[CoverLetter][Delete][Success] User: ${userId} deleted cover letter: ${coverLetterId}`);
    res.status(200).json({ success: true, message: 'Cover letter deleted successfully.' });
  } catch (error) {
    logger.error(`[CoverLetter][Delete][Error] User: ${req.user.userId} - ${error.message}`);
    next(new Error('Failed to delete cover letter.'));
  }
};


export {
  generateCoverLetter,
  saveCoverLetter,
  getAllCoverLetters,
  updateCoverLetter,
  deleteCoverLetter
};