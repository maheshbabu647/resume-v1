import React, { useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Download, Save, ArrowLeft, Loader2, Edit2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const EditorHeader = ({
  // --- Data Props ---
  resumeName,
  templateName,
  progressData,
  isDirty,
  saveStatus,
  isDownloadingPdf,
  isEditingName,
  
  // --- Handler Props ---
  setIsEditingName,
  onNameChange,
  onBack,
  onPreview,
  onDownloadPdf,
  onSave,
}) => {
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);
  
  const progressBarColor = useMemo(() => {
    const { progress } = progressData;
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-600';
    if (progress >= 50) return 'bg-sky-500';
    if (progress >= 25) return 'bg-yellow-400';
    return 'bg-amber-400';
  }, [progressData]);

  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border shadow-sm px-2 sm:px-4 py-2.5">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* --- LEFT SIDE: Back Navigation & Resume Name --- */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} aria-label="Go back" className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground flex-shrink-0">
              <ArrowLeft size={18} />
            </Button>
            <div className="flex items-center gap-1.5 min-w-0 group">
              {isEditingName ? (
                <Input
                  ref={nameInputRef}
                  value={resumeName}
                  onChange={onNameChange}
                  className="flex-grow min-w-0 text-base sm:text-lg font-semibold p-1 h-9 border-input focus-visible:ring-1 focus-visible:ring-primary truncate bg-transparent"
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                />
              ) : (
                <h2 className="flex-grow min-w-0 text-base sm:text-lg font-semibold p-1 h-9 truncate cursor-pointer" onClick={() => setIsEditingName(true)}>
                  {resumeName || "Untitled Resume"}
                </h2>
              )}
              <Edit2 size={14} className="text-muted-foreground/60 group-hover:text-primary transition-colors cursor-pointer flex-shrink-0" onClick={() => setIsEditingName(true)} />
            </div>
          </div>
          {/* --- Progress Bar (kept under the name for clarity) --- */}
          <div className="mt-1.5 pl-10 sm:pl-11 max-w-xs">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-medium text-muted-foreground">Progress</p>
              <p className="text-xs font-semibold text-foreground">{progressData.completed} / {progressData.total}</p>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className={cn("h-1.5 rounded-full transition-all duration-300 ease-in-out", progressBarColor)}
                style={{ width: `${progressData.progress}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* --- RIGHT SIDE: Template Info & Action Buttons --- */}
        <div className="flex flex-col items-end flex-shrink-0">
          <p className="text-xs text-muted-foreground mb-1.5">Using Template: <span className="font-medium text-foreground">{templateName || '...'}</span></p>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Button variant="outline" size="sm" onClick={onPreview} className="border-border text-xs sm:text-sm h-8 px-2 sm:px-3">
              <Eye size={14} className="sm:mr-1.5" /> <span className="hidden sm:inline">Preview</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onDownloadPdf} disabled={isDownloadingPdf || saveStatus === 'saving'} className="border-border text-xs sm:text-sm h-8 px-2 sm:px-3">
              {isDownloadingPdf ? <Loader2 size={14} className="animate-spin sm:mr-1.5" /> : <Download size={14} className="sm:mr-1.5" />} <span className="hidden sm:inline">{isDownloadingPdf ? '...' : 'PDF'}</span>
            </Button>
            <Button size="sm" onClick={onSave} disabled={saveStatus === 'saving' || !isDirty} className={cn("text-xs sm:text-sm h-8 px-2 sm:px-3 w-[88px] transition-all", saveStatus === 'success' && 'bg-green-500 hover:bg-green-600')}>
              {saveStatus === 'saving' ? <Loader2 size={16} className="animate-spin" /> : saveStatus === 'success' ? <span className="flex items-center"><CheckCircle2 size={14} className="mr-1.5" /> Saved!</span> : <span className="flex items-center"><Save size={14} className="mr-1.5" /> {isDirty ? 'Save' : 'Saved'}</span>}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EditorHeader;