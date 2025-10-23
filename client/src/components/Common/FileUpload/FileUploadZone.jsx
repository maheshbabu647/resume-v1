/**
 * @fileoverview File Upload Zone Component - Reusable drag-and-drop file upload
 * @module components/Common/FileUpload/FileUploadZone
 * @description A reusable file upload component with drag-and-drop support,
 * file validation, and visual feedback.
 */

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, File, FileType, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Formats file size in human-readable format
 * @private
 * @function formatFileSize
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "2.5 MB")
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Gets icon component for file type
 * @private
 * @function getFileIcon
 * @param {string} fileType - MIME type
 * @returns {React.Component} Icon component
 */
const getFileIcon = (fileType) => {
  if (fileType?.includes('pdf')) return FileText;
  if (fileType?.includes('word') || fileType?.includes('document')) return File;
  return FileType;
};

/**
 * Gets color class for file type
 * @private
 * @function getFileColor
 * @param {string} fileType - MIME type
 * @returns {string} Tailwind color class
 */
const getFileColor = (fileType) => {
  if (fileType?.includes('pdf')) return 'text-red-500';
  if (fileType?.includes('word') || fileType?.includes('document')) return 'text-blue-500';
  return 'text-gray-500';
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * File Upload Zone Component
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Upload zone title
 * @param {string} [props.description] - Upload zone description
 * @param {Array<string>} [props.acceptedFormats=['.pdf', '.docx', '.doc', '.txt']] - Accepted file formats
 * @param {number} [props.maxSizeMB=10] - Maximum file size in MB
 * @param {Function} props.onFileSelect - Callback when file is selected
 * @param {Function} [props.onFileRemove] - Callback when file is removed
 * @param {Object|null} [props.selectedFile] - Currently selected file object
 * @param {boolean} [props.showPreview=true] - Whether to show file preview
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 * @description Reusable file upload component with drag-and-drop support,
 * file validation, and visual feedback. Handles file selection and preview.
 * @example
 * <FileUploadZone
 *   title="Upload Resume"
 *   description="PDF, DOCX, or TXT"
 *   acceptedFormats={['.pdf', '.docx']}
 *   maxSizeMB={10}
 *   onFileSelect={handleFileSelect}
 *   onFileRemove={handleFileRemove}
 *   selectedFile={file}
 * />
 */
const FileUploadZone = ({
  title,
  description,
  acceptedFormats = ['.pdf', '.docx', '.doc', '.txt'],
  maxSizeMB = 10,
  onFileSelect,
  onFileRemove,
  selectedFile = null,
  showPreview = true,
  className
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // ========================================================================
  // FILE VALIDATION
  // ========================================================================
  
  const isFileTypeSupported = (file) => {
    const fileName = file.name.toLowerCase();
    return acceptedFormats.some(ext => fileName.endsWith(ext.toLowerCase()));
  };

  const isFileSizeValid = (file) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  };

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================
  
  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'enter' || type === 'over') {
      setIsDragActive(true);
    } else if (type === 'leave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!isFileTypeSupported(file)) {
      alert(`Unsupported file type. Please upload: ${acceptedFormats.join(', ')}`);
      return;
    }
    
    if (!isFileSizeValid(file)) {
      alert(`File size too large. Maximum size: ${maxSizeMB}MB`);
      return;
    }

    const fileData = {
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'ready'
    };

    onFileSelect(fileData);
  };

  const handleRemove = () => {
    if (onFileRemove) {
      onFileRemove();
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ========================================================================
  // RENDER
  // ========================================================================
  
  if (selectedFile && showPreview) {
    const Icon = getFileIcon(selectedFile.type);
    const colorClass = getFileColor(selectedFile.type);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("w-full", className)}
      >
        <Card className="border-2 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center bg-muted", colorClass)}>
                <Icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              
              {onFileRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className={cn("border-2 border-dashed border-border hover:border-primary/50 transition-colors", className)}>
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold text-foreground">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-8">
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300",
            isDragActive 
              ? "border-primary bg-primary/5 scale-105" 
              : "border-border hover:border-primary/50 hover:bg-muted/20"
          )}
          onDragEnter={(e) => handleDrag(e, 'enter')}
          onDragLeave={(e) => handleDrag(e, 'leave')}
          onDragOver={(e) => handleDrag(e, 'over')}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <motion.div
            className="space-y-4"
            animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {isDragActive ? "Drop your file here" : "Drag & drop your file here"}
              </h3>
              <p className="text-muted-foreground mb-4">
                or click to browse files
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {acceptedFormats.map((format) => {
                const Icon = format.includes('pdf') ? FileText : 
                            format.includes('doc') ? File : FileType;
                const color = format.includes('pdf') ? 'text-red-500' : 
                             format.includes('doc') ? 'text-blue-500' : 'text-gray-500';
                
                return (
                  <span
                    key={format}
                    className={cn(
                      "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted",
                      color
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {format.replace('.', '').toUpperCase()}
                  </span>
                );
              })}
            </div>

            <p className="text-sm text-muted-foreground">
              Maximum file size: {maxSizeMB}MB
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadZone;

