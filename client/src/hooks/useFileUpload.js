/**
 * @fileoverview File Upload Hook - Reusable hook for file upload operations
 * @module hooks/useFileUpload
 * @description Custom React hook for managing file uploads with validation,
 * progress tracking, and error handling.
 */

import { useState, useCallback } from 'react';

/**
 * File validation configuration
 * @typedef {Object} ValidationConfig
 * @property {Array<string>} [acceptedFormats] - Accepted file extensions (e.g., ['.pdf', '.docx'])
 * @property {number} [maxSizeMB] - Maximum file size in megabytes
 * @property {Function} [customValidator] - Custom validation function
 */

/**
 * File upload configuration
 * @typedef {Object} UploadConfig
 * @property {ValidationConfig} [validation] - File validation rules
 * @property {boolean} [multiple=false] - Allow multiple file uploads
 * @property {Function} [onUploadStart] - Callback when upload starts
 * @property {Function} [onUploadComplete] - Callback when upload completes
 * @property {Function} [onUploadError] - Callback when upload fails
 */

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates file type against accepted formats
 * @private
 * @function validateFileType
 * @param {File} file - File to validate
 * @param {Array<string>} acceptedFormats - Accepted file extensions
 * @returns {boolean} Whether file type is valid
 */
const validateFileType = (file, acceptedFormats) => {
  if (!acceptedFormats || acceptedFormats.length === 0) return true;
  
  const fileName = file.name.toLowerCase();
  return acceptedFormats.some(ext => 
    fileName.endsWith(ext.toLowerCase())
  );
};

/**
 * Validates file size against maximum limit
 * @private
 * @function validateFileSize
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum size in megabytes
 * @returns {boolean} Whether file size is valid
 */
const validateFileSize = (file, maxSizeMB) => {
  if (!maxSizeMB) return true;
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Formats file size to human-readable string
 * @private
 * @function formatFileSize
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// ============================================================================
// HOOK
// ============================================================================

/**
 * Custom hook for managing file uploads
 * @hook
 * @function useFileUpload
 * @param {UploadConfig} [config={}] - Upload configuration
 * @returns {Object} File upload state and handlers
 * @returns {Array<Object>} return.files - Array of uploaded file objects
 * @returns {boolean} return.isUploading - Whether upload is in progress
 * @returns {string|null} return.error - Error message if upload failed
 * @returns {number} return.progress - Upload progress (0-100)
 * @returns {Function} return.selectFiles - Handler to select files
 * @returns {Function} return.removeFile - Handler to remove a file
 * @returns {Function} return.clearFiles - Handler to clear all files
 * @returns {Function} return.uploadFiles - Handler to upload files
 * @description Manages file upload state including validation, progress tracking,
 * and error handling. Supports single and multiple file uploads.
 * @example
 * const fileUpload = useFileUpload({
 *   validation: {
 *     acceptedFormats: ['.pdf', '.docx'],
 *     maxSizeMB: 10
 *   },
 *   onUploadComplete: (files) => console.log('Uploaded:', files)
 * });
 * 
 * // Select files
 * <input type="file" onChange={fileUpload.selectFiles} />
 * 
 * // Upload
 * <button onClick={fileUpload.uploadFiles}>Upload</button>
 */
export const useFileUpload = (config = {}) => {
  const {
    validation = {},
    multiple = false,
    onUploadStart,
    onUploadComplete,
    onUploadError
  } = config;

  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  /**
   * Validates a file against configured rules
   * @function validateFile
   * @param {File} file - File to validate
   * @returns {Object} Validation result
   * @returns {boolean} return.valid - Whether file is valid
   * @returns {string} [return.error] - Error message if invalid
   */
  const validateFile = useCallback((file) => {
    const { acceptedFormats, maxSizeMB, customValidator } = validation;

    // Type validation
    if (acceptedFormats && !validateFileType(file, acceptedFormats)) {
      return {
        valid: false,
        error: `File type not supported. Accepted formats: ${acceptedFormats.join(', ')}`
      };
    }

    // Size validation
    if (maxSizeMB && !validateFileSize(file, maxSizeMB)) {
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit. Current size: ${formatFileSize(file.size)}`
      };
    }

    // Custom validation
    if (customValidator) {
      const customResult = customValidator(file);
      if (!customResult.valid) {
        return customResult;
      }
    }

    return { valid: true };
  }, [validation]);

  /**
   * Selects files for upload
   * @function selectFiles
   * @param {Event} event - File input change event
   * @returns {void}
   */
  const selectFiles = useCallback((event) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    if (selectedFiles.length === 0) return;

    // Validate each file
    const validatedFiles = selectedFiles.map(file => {
      const validation = validateFile(file);
      return {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        ...validation
      };
    });

    // Check for validation errors
    const invalidFiles = validatedFiles.filter(f => !f.valid);
    if (invalidFiles.length > 0) {
      setError(invalidFiles[0].error);
      return;
    }

    setError(null);
    
    if (multiple) {
      setFiles(prev => [...prev, ...validatedFiles]);
    } else {
      setFiles(validatedFiles);
    }
  }, [multiple, validateFile]);

  /**
   * Removes a file from the upload list
   * @function removeFile
   * @param {number} index - Index of file to remove
   * @returns {void}
   */
  const removeFile = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setError(null);
  }, []);

  /**
   * Clears all files
   * @function clearFiles
   * @returns {void}
   */
  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
    setProgress(0);
  }, []);

  /**
   * Uploads selected files
   * @async
   * @function uploadFiles
   * @param {Function} uploadFn - Function to perform the actual upload
   * @returns {Promise<void>}
   */
  const uploadFiles = useCallback(async (uploadFn) => {
    if (files.length === 0) {
      setError('No files selected');
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      if (onUploadStart) {
        onUploadStart(files);
      }

      const result = await uploadFn(files);

      setProgress(100);
      
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err) {
      const errorMessage = err.message || 'Upload failed';
      setError(errorMessage);
      
      if (onUploadError) {
        onUploadError(err);
      }
    } finally {
      setIsUploading(false);
    }
  }, [files, onUploadStart, onUploadComplete, onUploadError]);

  return {
    files,
    isUploading,
    error,
    progress,
    selectFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    validateFile
  };
};

export default useFileUpload;

