import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * ATS Score Service API
 * Handles communication with the backend ATS score analysis endpoints
 */
class ATSScoreService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/ats-score`,
      timeout: 60000, // 60 seconds timeout for AI analysis
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
        console.error('ATS Score API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Analyze ATS compatibility between resume and job description
   * @param {File} resumeFile - Resume file
   * @param {File} jobDescriptionFile - Job description file
   * @returns {Promise<Object>} - ATS analysis results
   */
  async analyzeATSScore(resumeFile, jobDescriptionFile) {
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescriptionFile);

      const response = await this.api.post('/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`ATS Analysis Progress: ${percentCompleted}%`);
        },
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('ATS score analysis failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'ATS analysis failed',
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Get ATS score interpretation guide
   * @returns {Promise<Object>} - Score guide data
   */
  async getScoreGuide() {
    try {
      const response = await this.api.get('/guide');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error('Failed to get score guide:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get score guide',
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Health check for ATS score service
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
   * Format ATS score for display
   * @param {number} score - ATS score (0-100)
   * @returns {Object} - Formatted score data
   */
  formatScore(score) {
    if (score >= 90) {
      return {
        level: 'Excellent',
        description: 'Your resume is highly optimized for ATS systems',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-500'
      };
    } else if (score >= 75) {
      return {
        level: 'Good',
        description: 'Your resume has good ATS compatibility with room for improvement',
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-500'
      };
    } else if (score >= 60) {
      return {
        level: 'Fair',
        description: 'Your resume needs optimization for better ATS performance',
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-500'
      };
    } else {
      return {
        level: 'Poor',
        description: 'Your resume requires significant optimization for ATS systems',
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-500'
      };
    }
  }

  /**
   * Get progress message based on analysis step
   * @param {string} step - Analysis step
   * @returns {string} - Progress message
   */
  getProgressMessage(step) {
    const messages = {
      'uploading': 'Uploading files...',
      'extracting': 'Extracting text from documents...',
      'analyzing': 'Analyzing ATS compatibility with AI...',
      'processing': 'Processing results...',
      'complete': 'Analysis complete!'
    };
    return messages[step] || 'Processing...';
  }
}

// Create and export a singleton instance
const atsScoreService = new ATSScoreService();
export default atsScoreService;


