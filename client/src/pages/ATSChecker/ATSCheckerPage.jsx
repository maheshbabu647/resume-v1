import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, File, FileType, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import atsScoreService from '@/api/atsScoreServiceApi.js';
import textExtractionService from '@/api/textExtractionServiceApi.js';

const ATSCheckerPage = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActiveResume, setDragActiveResume] = useState(false);
  const [dragActiveJobDesc, setDragActiveJobDesc] = useState(false);
  const [atsResults, setAtsResults] = useState(null);
  const [analysisStep, setAnalysisStep] = useState('');
  const resumeInputRef = useRef(null);
  const jobDescInputRef = useRef(null);

  const supportedFormats = [
    { type: 'application/pdf', label: 'PDF', icon: FileText, color: 'text-red-500' },
    { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'DOCX', icon: File, color: 'text-blue-500' },
    { type: 'application/msword', label: 'DOC', icon: File, color: 'text-blue-600' },
    { type: 'text/plain', label: 'TXT', icon: FileType, color: 'text-gray-500' }
  ];

  // Enhanced file type validation that checks both MIME type and file extension
  const isFileTypeSupported = (file) => {
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
  };

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      if (type === 'resume') {
        setDragActiveResume(true);
      } else {
        setDragActiveJobDesc(true);
      }
    } else if (e.type === 'dragleave') {
      if (type === 'resume') {
        setDragActiveResume(false);
      } else {
        setDragActiveJobDesc(false);
      }
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'resume') {
      setDragActiveResume(false);
    } else {
      setDragActiveJobDesc(false);
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], type);
    }
  };

  const handleFile = (file, type) => {
    // Enhanced file type validation
    const isValidType = isFileTypeSupported(file);
    const isValidSize = textExtractionService.isFileSizeValid(file, 10); // 10MB limit
    
    console.log('File validation:', {
      name: file.name,
      type: file.type,
      size: file.size,
      isValidType,
      isValidSize
    });
    
    if (!isValidType) {
      alert(`Unsupported file type: ${file.type || 'unknown'}. Please upload PDF, DOCX, DOC, or TXT files.`);
      return;
    }
    
    if (!isValidSize) {
      alert('File size too large. Please upload files smaller than 10MB.');
      return;
    }

    const fileData = {
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'ready'
    };

    if (type === 'resume') {
      setResumeFile(fileData);
    } else {
      setJobDescriptionFile(fileData);
    }
  };

  const handleFileInput = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0], type);
    }
  };

  const removeFile = (type) => {
    if (type === 'resume') {
      setResumeFile(null);
    } else {
      setJobDescriptionFile(null);
    }
  };

  const formatFileSize = (bytes) => {
    return textExtractionService.formatFileSize(bytes);
  };

  const getFileIcon = (fileType) => {
    const typeInfo = textExtractionService.getFileTypeInfo(fileType);
    const iconMap = {
      'FileText': FileText,
      'File': File,
      'FileType': FileType
    };
    return iconMap[typeInfo.icon] || FileText;
  };

  const getFileColor = (fileType) => {
    const typeInfo = textExtractionService.getFileTypeInfo(fileType);
    return typeInfo.color;
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescriptionFile) {
      alert('Please upload both resume and job description files.');
      return;
    }

    setIsUploading(true);
    setAtsResults(null);
    
    try {
      console.log('Starting ATS analysis...');
      setAnalysisStep('uploading');
      
      // Call ATS score analysis service
      const result = await atsScoreService.analyzeATSScore(resumeFile.file, jobDescriptionFile.file);
      
      if (result.success) {
        console.log('✅ ATS analysis completed successfully:');
        console.log('ATS Results:', result.data);
        
        setAtsResults(result.data);
        setAnalysisStep('complete');
      } else {
        console.error('❌ ATS analysis failed:', result.error);
        alert(`ATS analysis failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Error analyzing files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <motion.div
              className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Upload className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">ATS Score Checker</span>
            </motion.div>
            
            <h1 className="text-4xl font-bold text-foreground">
              ATS Score Checker
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your resume and job description to get an ATS compatibility score. 
              We'll analyze how well your resume matches the job requirements.
            </p>
          </motion.div>

          {/* Resume Upload Section */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-center text-xl font-semibold text-foreground">
                  Upload Your Resume
                </CardTitle>
                <CardDescription className="text-center">
                  Upload your resume in PDF, DOCX, DOC, or TXT format
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300",
                    dragActiveResume 
                      ? "border-primary bg-primary/5 scale-105" 
                      : "border-border hover:border-primary/50 hover:bg-muted/20"
                  )}
                  onDragEnter={(e) => handleDrag(e, 'resume')}
                  onDragLeave={(e) => handleDrag(e, 'resume')}
                  onDragOver={(e) => handleDrag(e, 'resume')}
                  onDrop={(e) => handleDrop(e, 'resume')}
                >
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) => handleFileInput(e, 'resume')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <motion.div
                    className="space-y-4"
                    animate={dragActiveResume ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {dragActiveResume ? "Drop your resume here" : "Drag & drop your resume here"}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        or click to browse files
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      {supportedFormats.map((format) => {
                        const Icon = format.icon;
                        return (
                          <span
                            key={format.type}
                            className={cn(
                              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted",
                              format.color
                            )}
                          >
                            <Icon className="w-3 h-3" />
                            {format.label}
                          </span>
                        );
                      })}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Maximum file size: 10MB
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Description Upload Section */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-center text-xl font-semibold text-foreground">
                  Upload Job Description
                </CardTitle>
                <CardDescription className="text-center">
                  Upload the job description you want to match against
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300",
                    dragActiveJobDesc 
                      ? "border-primary bg-primary/5 scale-105" 
                      : "border-border hover:border-primary/50 hover:bg-muted/20"
                  )}
                  onDragEnter={(e) => handleDrag(e, 'jobdesc')}
                  onDragLeave={(e) => handleDrag(e, 'jobdesc')}
                  onDragOver={(e) => handleDrag(e, 'jobdesc')}
                  onDrop={(e) => handleDrop(e, 'jobdesc')}
                >
                  <input
                    ref={jobDescInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) => handleFileInput(e, 'jobdesc')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <motion.div
                    className="space-y-4"
                    animate={dragActiveJobDesc ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="mx-auto w-16 h-16 bg-accent-purple/10 rounded-full flex items-center justify-center">
                      <File className="w-8 h-8 text-accent-purple" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {dragActiveJobDesc ? "Drop job description here" : "Drag & drop job description here"}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        or click to browse files
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      {supportedFormats.map((format) => {
                        const Icon = format.icon;
                        return (
                          <span
                            key={format.type}
                            className={cn(
                              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted",
                              format.color
                            )}
                          >
                            <Icon className="w-3 h-3" />
                            {format.label}
                          </span>
                        );
                      })}
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Maximum file size: 10MB
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Uploaded Files Display */}
          <AnimatePresence>
            {(resumeFile || jobDescriptionFile) && (
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  Uploaded Files
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Resume File */}
                  {resumeFile && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
                    >
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", getFileColor(resumeFile.type))}>
                        {React.createElement(getFileIcon(resumeFile.type), { className: "w-5 h-5" })}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {resumeFile.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(resumeFile.size)}
                        </p>
                        <p className="text-xs text-primary font-medium">
                          Resume
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile('resume')}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}

                  {/* Job Description File */}
                  {jobDescriptionFile && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
                    >
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", getFileColor(jobDescriptionFile.type))}>
                        {React.createElement(getFileIcon(jobDescriptionFile.type), { className: "w-5 h-5" })}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {jobDescriptionFile.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(jobDescriptionFile.size)}
                        </p>
                        <p className="text-xs text-accent-purple font-medium">
                          Job Description
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile('jobdesc')}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze Button */}
          <motion.div variants={itemVariants} className="text-center">
            <Button
              onClick={handleAnalyze}
              disabled={!resumeFile || !jobDescriptionFile || isUploading}
              size="lg"
              className="px-8 py-3 text-lg"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {atsScoreService.getProgressMessage(analysisStep)}
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Analyze ATS Score
                </>
              )}
            </Button>
          </motion.div>

          {/* ATS Results Display */}
          <AnimatePresence>
            {atsResults && (
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* ATS Score Card */}
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent-purple/5">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-foreground">
                      ATS Compatibility Score
                    </CardTitle>
                    <CardDescription>
                      Your resume's compatibility with Applicant Tracking Systems
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="text-6xl font-bold text-primary">
                      {atsResults.atsScore}/100
                    </div>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${
                      atsResults.scoreInterpretation.bgColor
                    } ${atsResults.scoreInterpretation.textColor} ${atsResults.scoreInterpretation.borderColor} border-2`}>
                      {atsResults.scoreInterpretation.level}
                    </div>
                    <p className="text-muted-foreground text-lg">
                      {atsResults.scoreInterpretation.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Detailed Analysis */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Keyword Match */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Keyword Match</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-2xl font-bold text-primary">
                        {atsResults.keywordMatch.score}%
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Matched Keywords:</h4>
                        <div className="flex flex-wrap gap-1">
                          {atsResults.keywordMatch.matchedKeywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">Missing Keywords:</h4>
                        <div className="flex flex-wrap gap-1">
                          {atsResults.keywordMatch.missingKeywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills Match */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Skills Match</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-2xl font-bold text-primary">
                        {atsResults.skillsMatch.score}%
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Matched Skills:</h4>
                        <div className="flex flex-wrap gap-1">
                          {atsResults.skillsMatch.matchedSkills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">Missing Skills:</h4>
                        <div className="flex flex-wrap gap-1">
                          {atsResults.skillsMatch.missingSkills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Improvement Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {atsResults.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Strengths and Improvements */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-600">Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {atsResults.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-red-600">Areas for Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {atsResults.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Alert */}
          <motion.div variants={itemVariants}>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>ATS Score Checker:</strong> Upload your resume and job description to get an ATS compatibility score. 
                We'll analyze how well your resume matches the job requirements and provide detailed feedback.
              </AlertDescription>
            </Alert>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ATSCheckerPage;
