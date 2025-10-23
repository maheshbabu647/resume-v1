// @/components/ATSCheckerPage/FileDropzone.jsx

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, File, FileType, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import textExtractionService from '@/api/textExtractionServiceApi.js';

const FileDropzone = ({ title, icon: Icon, iconColor, onFileSelect, file, onRemove }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = (e) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  // Helper functions from original file, now scoped here
  const formatFileSize = (bytes) => textExtractionService.formatFileSize(bytes);
  const getFileIcon = (fileType) => {
    const typeInfo = textExtractionService.getFileTypeInfo(fileType);
    const iconMap = { 'FileText': FileText, 'File': File, 'FileType': FileType };
    return iconMap[typeInfo.icon] || FileText;
  };
  const getFileColor = (fileType) => {
    const typeInfo = textExtractionService.getFileTypeInfo(fileType);
    return typeInfo.color || 'text-foreground';
  };

  return (
    <div className="w-full">
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3 flex items-center gap-2">
        <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5', iconColor)} />
        {title}
      </h3>
      
      {!file ? (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-300 min-h-[140px] sm:min-h-[160px] flex flex-col justify-center items-center cursor-pointer',
            dragActive
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full flex items-center justify-center mb-3 sm:mb-4 pointer-events-none">
            <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-foreground mb-1 pointer-events-none px-2">
            <span className="hidden sm:inline">Drag & drop file or click to upload</span>
            <span className="sm:hidden">Tap to upload</span>
          </p>
          <p className="text-xs text-muted-foreground pointer-events-none px-2">
            <span className="hidden sm:inline">PDF, DOCX, DOC, or TXT (Max 10MB)</span>
            <span className="sm:hidden">PDF, DOCX, DOC, TXT</span>
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-xl border border-border"
        >
          {(() => {
            const IconComponent = getFileIcon(file.type);
            return <IconComponent className={cn('w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0', getFileColor(file.type))} />;
          })()}
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-medium text-foreground truncate">{file.name}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default FileDropzone;