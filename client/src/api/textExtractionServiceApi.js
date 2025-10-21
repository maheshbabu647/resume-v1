import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Text Extraction Service API
 * Handles communication with the backend text extraction endpoints
 */
class TextExtractionService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/text-extraction`,
      timeout: 30000, // 30 seconds timeout for file uploads
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Add request interceptor for authentication
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
        console.error('Text Extraction API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Extract text from uploaded file
   * @param {File} file - The file to extract text from
   * @returns {Promise<Object>} - Extracted text and metadata
   */
  async extractText(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.api.post('/extract', formData, {
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
      console.error('Text extraction failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Text extraction failed',
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Extract text from specific PDF pages
   * @param {File} file - The PDF file
   * @param {Array<number>} pages - Array of page numbers to extract
   * @returns {Promise<Object>} - Extracted text and metadata
   */
  async extractFromPDFPages(file, pages) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pages', JSON.stringify(pages));

      const response = await this.api.post('/extract-pdf-pages', formData, {
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
      console.error('PDF pages extraction failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'PDF pages extraction failed',
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Extract text and HTML from DOCX file
   * @param {File} file - The DOCX file
   * @returns {Promise<Object>} - Extracted text, HTML and metadata
   */
  async extractFromDOCXWithHTML(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.api.post('/extract-docx-html', formData, {
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
      console.error('DOCX HTML extraction failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'DOCX HTML extraction failed',
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Get supported file types
   * @returns {Promise<Object>} - Supported file types and descriptions
   */
  async getSupportedTypes() {
    try {
      const response = await this.api.get('/supported-types');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Failed to get supported types:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get supported types',
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Health check for text extraction service
   * @returns {Promise<Object>} - Service health status
   */
  async healthCheck() {
    try {
      const response = await this.api.get('/health');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Health check failed',
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Validate file type
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

  /**
   * Get file type icon and color
   * @param {string} mimeType - File MIME type
   * @returns {Object} - Icon component and color class
   */
  getFileTypeInfo(mimeType) {
    const typeMap = {
      'application/pdf': {
        icon: 'FileText',
        color: 'text-red-500',
        label: 'PDF'
      },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
        icon: 'File',
        color: 'text-blue-500',
        label: 'DOCX'
      },
      'application/msword': {
        icon: 'File',
        color: 'text-blue-600',
        label: 'DOC'
      },
      'text/plain': {
        icon: 'FileType',
        color: 'text-gray-500',
        label: 'TXT'
      }
    };

    return typeMap[mimeType] || {
      icon: 'FileText',
      color: 'text-gray-500',
      label: 'Unknown'
    };
  }
}

// Create and export a singleton instance
const textExtractionService = new TextExtractionService();
export default textExtractionService;
