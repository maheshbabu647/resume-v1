import axios from 'axios';
import { isLimitError, parseLimitError } from '../utils/rateLimitHandler.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Resume Parser Service API
 * Handles communication with the backend resume parser endpoints
 */
class ResumeParserService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/resume-parser`,
      timeout: 60000, // 60 seconds timeout for AI processing
    });

    // Add request interceptor for authentication (if needed)
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Resume Parser API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Parse resume from uploaded file
   * @param {File} file - The resume file to parse (PDF, DOCX, DOC, TXT)
   * @param {Object} exampleFormData - Example form data structure to match
   * @returns {Promise<Object>} - Parsed resume data
   */
  async parseResumeFromFile(file, exampleFormData = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (exampleFormData) {
        formData.append('exampleFormData', JSON.stringify(exampleFormData));
      }

      const response = await this.api.post('/parse-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Resume parsing from file failed:', error);
      
      // Check if it's a rate limit or cost limit error
      if (isLimitError(error)) {
        const limitError = parseLimitError(error);
        return {
          success: false,
          error: error.response?.data?.error || 'Resume parsing failed',
          message: error.response?.data?.message || error.message,
          isLimitError: true,
          limitError: limitError,
          hint: error.response?.data?.hint,
          resetTime: error.response?.data?.resetTime
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.error || 'Resume parsing failed',
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Parse resume from raw text
   * @param {string} resumeText - The resume text to parse
   * @param {Object} exampleFormData - Example form data structure to match
   * @returns {Promise<Object>} - Parsed resume data
   */
  async parseResumeFromText(resumeText, exampleFormData = null) {
    try {
      const response = await this.api.post('/parse-text', {
        resumeText,
        exampleFormData,
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Resume parsing from text failed:', error);
      
      // Check if it's a rate limit or cost limit error
      if (isLimitError(error)) {
        const limitError = parseLimitError(error);
        return {
          success: false,
          error: error.response?.data?.error || 'Resume parsing failed',
          message: error.response?.data?.message || error.message,
          isLimitError: true,
          limitError: limitError,
          hint: error.response?.data?.hint,
          resetTime: error.response?.data?.resetTime
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.error || 'Resume parsing failed',
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Validate file type for resume parsing
   * @param {File} file - The file to validate
   * @returns {boolean} - Whether file type is supported
   */
  isSupportedFileType(file) {
    const supportedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];
    
    const supportedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    
    // Check MIME type first
    if (supportedMimeTypes.includes(file.type)) {
      return true;
    }
    
    // If MIME type is not detected or incorrect, check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = supportedExtensions.some(ext => fileName.endsWith(ext));
    
    // Also check for empty or generic MIME types that might be valid files
    const isEmptyOrGenericType = !file.type || file.type === '' || file.type === 'application/octet-stream';
    
    return hasValidExtension && (isEmptyOrGenericType || supportedMimeTypes.includes(file.type));
  }

  /**
   * Validate file size
   * @param {File} file - The file to validate
   * @param {number} maxSizeMB - Maximum file size in MB (default: 10)
   * @returns {boolean} - Whether file size is within limit
   */
  isFileSizeValid(file, maxSizeMB = 10) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Create and export a singleton instance
const resumeParserService = new ResumeParserService();
export default resumeParserService;

