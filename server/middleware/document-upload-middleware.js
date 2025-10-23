import multer from 'multer';
import path from 'path';
import logger from '../config/logger.js';

// Use memory storage for document processing
const storage = multer.memoryStorage();

// Allowed file extensions for documents
const allowedDocumentExt = ['.pdf', '.docx', '.doc', '.txt'];

// Allowed MIME types for documents
const allowedDocumentMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
  'text/plain', // .txt
  'application/octet-stream' // Generic binary - we'll check extension
];

const documentFileFilter = (req, file, cb) => {
  // Check extension first (most reliable)
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (!allowedDocumentExt.includes(ext)) {
    logger.warn(`[DocumentUpload] File rejected (disallowed ext): ${file.originalname} (${ext}) from ${req.ip}`);
    return cb(new Error(`Invalid file extension. Allowed: ${allowedDocumentExt.join(', ')}`), false);
  }

  // Check MIME type (some files may have generic MIME types, so we're lenient)
  if (!allowedDocumentMimeTypes.includes(file.mimetype)) {
    // If MIME type doesn't match but extension is valid, log warning but allow
    logger.warn(`[DocumentUpload] File has unexpected MIME type but valid extension: ${file.originalname} (${file.mimetype})`);
  }

  // Sanitize filename
  file.originalname = path.basename(file.originalname).replace(/[^a-zA-Z0-9.\-_]/g, '_');

  logger.info(`[DocumentUpload] File accepted: ${file.originalname} (${file.mimetype}) from ${req.ip}`);
  cb(null, true);
};

// Document upload configuration with 10MB limit
const documentUpload = multer({
  storage,
  fileFilter: documentFileFilter,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit for documents
    files: 1 // Only allow single file upload
  },
});

// Multer error handler middleware for documents
export const documentUploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    logger.warn(`[DocumentUpload] Multer error: ${err.message} from ${req.ip}`);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false,
        error: 'File too large', 
        message: 'File size must be less than 10MB'
      });
    }
    
    return res.status(400).json({ 
      success: false,
      error: 'File upload error',
      message: err.message 
    });
  } else if (err) {
    logger.warn(`[DocumentUpload] Error: ${err.message} from ${req.ip}`);
    return res.status(400).json({ 
      success: false,
      error: 'Upload failed',
      message: err.message 
    });
  }
  next();
};

export default documentUpload;

