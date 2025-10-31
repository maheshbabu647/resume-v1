// @/components/ATSCheckerPage/FileUploadStep.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, File, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import textExtractionService from '@/api/textExtractionServiceApi.js';


// Import the new reusable component
import FileDropzone from './FileDropzone';

const FileUploadStep = ({ onAnalyze }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [jobDescriptionMode, setJobDescriptionMode] = useState('file'); // 'file' | 'text'
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Re-usable file handling logic
  const handleFile = (file, type) => {
    setError(null); // Clear previous errors
    const isValidType = textExtractionService.isSupportedFileType(file);
    const isValidSize = textExtractionService.isFileSizeValid(file, 10); // 10MB limit

    if (!isValidType) {
      setError(`Unsupported file type: ${file.name}. Please upload PDF, DOCX, DOC, or TXT.`);
      return;
    }
    if (!isValidSize) {
      setError(`File size too large: ${file.name}. Please upload files smaller than 10MB.`);
      return;
    }

    const fileData = {
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    };

    if (type === 'resume') {
      setResumeFile(fileData);
    } else {
      setJobDescriptionFile(fileData);
    }
  };

  const handleAnalyzeClick = () => {
    if (!resumeFile) {
      setError('Please upload your resume.');
      return;
    }

    if (jobDescriptionMode === 'file') {
      if (!jobDescriptionFile) {
        setError('Please upload the job description file or switch to Paste Text.');
        return;
      }
      setIsAnalyzing(true);
      setError(null);
      onAnalyze(resumeFile, jobDescriptionFile);
      return;
    }

    // Text mode validations
    const trimmed = (jobDescriptionText || '').trim();
    if (trimmed.length < 50) {
      setError('Please paste a longer job description (at least 50 characters).');
      return;
    }
    if (trimmed.length > 20000) {
      setError('Job description is too long. Please keep it under 20,000 characters.');
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    // Pass an object that carries the pasted text instead of a file
    onAnalyze(resumeFile, { text: trimmed });
  };

  return (
    <Card className="border border-border shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/30 p-4 sm:p-6 border-b border-border">
        {/* Standardized Card Title */}
        <CardTitle className="text-xl sm:text-2xl font-semibold text-center">
          Start Your Analysis
        </CardTitle>
        <CardDescription className="text-center text-sm sm:text-base">
          Upload your files to get your free ATS score.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Side-by-side layout for uploaders - stacks vertically on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FileDropzone
            title="Step 1: Upload Your Resume"
            icon={FileText}
            iconColor="text-primary"
            onFileSelect={(file) => handleFile(file, 'resume')}
            file={resumeFile}
            onRemove={() => setResumeFile(null)}
          />
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <File className="w-5 h-5 text-accent-purple" />
                <span className="text-base sm:text-lg font-semibold">
                  {jobDescriptionMode === 'file' ? 'Step 2: Upload Job Description' : 'Step 2: Paste Job Description'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:inline-flex w-full sm:w-auto rounded-md border border-border p-1 gap-1">
                <button
                  type="button"
                  className={`px-3 py-1 text-sm rounded w-full sm:w-auto ${jobDescriptionMode === 'file' ? 'bg-muted' : ''}`}
                  onClick={() => setJobDescriptionMode('file')}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 text-sm rounded w-full sm:w-auto ${jobDescriptionMode === 'text' ? 'bg-muted' : ''}`}
                  onClick={() => setJobDescriptionMode('text')}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {jobDescriptionMode === 'file' ? (
              <FileDropzone
                title="Upload Job Description"
                icon={File}
                iconColor="text-accent-purple"
                onFileSelect={(file) => handleFile(file, 'jobdesc')}
                file={jobDescriptionFile}
                onRemove={() => setJobDescriptionFile(null)}
                showTitle={false}
              />
            ) : (
              <div className="border border-border rounded-xl p-4 bg-muted/20">
                <textarea
                  value={jobDescriptionText}
                  onChange={(e) => setJobDescriptionText(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="w-full h-48 resize-y bg-transparent outline-none"
                />
                <div className="text-xs text-muted-foreground mt-2">
                  {`${(jobDescriptionText || '').length} / 20000 characters`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyze Button */}
        <div className="text-center pt-2 sm:pt-4">
          <Button
            onClick={handleAnalyzeClick}
            disabled={!resumeFile || (jobDescriptionMode === 'file' ? !jobDescriptionFile : false) || isAnalyzing}
            size="lg"
            // Responsive button - full width on mobile, auto on larger screens
            className="w-full sm:w-auto px-6 sm:px-10 py-3 text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                <span className="hidden sm:inline">Starting Analysis...</span>
                <span className="sm:hidden">Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Check My ATS Score</span>
                <span className="sm:hidden">Check ATS Score</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </>
            )}
          </Button>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3">
            ✨ Free • Instant • AI-Powered
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadStep;