import React, { useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Eye, 
  Download, 
  Save, 
  ArrowLeft, 
  Loader2, 
  Edit2, 
  CheckCircle2, 
  Sparkles,
  Star,
  Zap,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import useResumeContext from "@/hooks/useResume";

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
  onEnhance,
}) => {
  const nameInputRef = useRef(null);
  const resumeCtx = useResumeContext();

  useEffect(() => {
    try {
      console.log('[Enhance] Header mounted. onEnhance present:', Boolean(onEnhance));
    } catch {}
  }, [onEnhance]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const progressBarColor = useMemo(() => {
    const { progress } = progressData;
    if (progress === 100) return 'from-green-500 to-emerald-500';
    if (progress >= 75) return 'from-blue-500 to-indigo-500';
    if (progress >= 50) return 'from-cyan-500 to-blue-500';
    if (progress >= 25) return 'from-yellow-400 to-orange-400';
    return 'from-amber-400 to-yellow-400';
  }, [progressData]);

  const getSaveButtonContent = () => {
    if (saveStatus === 'saving') {
      return (
        <>
          <Loader2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-0.5 sm:mr-1 md:mr-2 animate-spin" />
          <span className="hidden md:inline">Saving...</span>
          <span className="md:hidden">...</span>
        </>
      );
    }
    if (saveStatus === 'success') {
      return (
        <>
          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-0.5 sm:mr-1 md:mr-2" />
          <span className="hidden md:inline">Saved!</span>
          <span className="md:hidden">✓</span>
        </>
      );
    }
    return (
      <>
        <Save className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-0.5 sm:mr-1 md:mr-2" />
        <span className="hidden md:inline">{isDirty ? 'Save Changes' : 'Save Resume'}</span>
        <span className="md:hidden">Save</span>
      </>
    );
  };

  return (
    <motion.header 
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-white/40 to-purple-50/30 pointer-events-none" />
      
      <div className="container mx-auto px-2 sm:px-4 md:px-6 relative z-10">
        <div className="flex items-center justify-between py-2 sm:py-3 md:py-4">
          
          {/* Left Section - Back Button & Resume Info */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 min-w-0 flex-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onBack}
                variant="ghost"
                className="p-1.5 sm:p-2 md:p-3 rounded-xl hover:bg-white/60 backdrop-blur-sm transition-all duration-300 group"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-slate-600 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all duration-300" />
              </Button>
            </motion.div>

            <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0 flex-1">
              {/* Resume Name */}
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                {isEditingName ? (
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="relative"
                  >
                    <Input
                      ref={nameInputRef}
                      value={resumeName}
                      onChange={onNameChange}
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                      className="text-xs sm:text-sm md:text-lg font-bold bg-white/80 backdrop-blur-sm border-blue-200 focus:border-blue-400 rounded-lg px-2 py-1 min-w-[120px] sm:min-w-[200px] md:min-w-[300px]"
                    />
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm pointer-events-none" />
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => setIsEditingName(true)}
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors duration-300 group min-w-0"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="truncate">{resumeName}</span>
                    <Edit2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </motion.button>
                )}
              </div>

              {/* Template Name & Progress */}
              <div className="flex items-center gap-1 sm:gap-2 md:gap-4 min-w-0">
                <span className="text-xs sm:text-sm text-slate-500 flex items-center gap-0.5 sm:gap-1 truncate">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                  <span className="truncate">{templateName}</span>
                </span>
                
                {/* Progress Indicator */}
                <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 flex-shrink-0">
                  <div className="w-12 sm:w-16 md:w-24 h-1 sm:h-1.5 md:h-2 bg-slate-200/60 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${progressBarColor} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressData.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-medium hidden md:inline">
                    {progressData.completed}/{progressData.total}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-3 flex-shrink-0">
            
            {/* Dirty State Indicator */}
            {isDirty && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-0.5 sm:gap-1 text-amber-600 text-xs font-medium bg-amber-50/80 backdrop-blur-sm px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full border border-amber-200/50"
              >
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="hidden md:inline">Unsaved changes</span>
                <span className="md:hidden">Unsaved</span>
              </motion.div>
            )}

            {/* Preview Button */}
            {/* <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onPreview}
                variant="outline"
                className="bg-white/60 backdrop-blur-sm hover:bg-white/80 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 rounded-2xl px-6 py-3 font-semibold transition-all duration-300 group"
              >
                <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Preview
              </Button>
            </motion.div> */}

            {/* Enhance Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => {
                  try {
                    console.log('[Enhance] Header button clicked');
                  } catch {}
                  try {
                    if (onEnhance) {
                      console.log('[Enhance] Calling onEnhance...');
                      onEnhance();
                      console.log('[Enhance] onEnhance call returned');
                    } else {
                      console.warn('[Enhance] onEnhance is not provided');
                      try {
                        const { editorFormData, resumeSetupData } = resumeCtx || {};
                        console.log('[Enhance][Fallback] Using context data');
                        console.log('[Enhance][Fallback] editorFormData:', editorFormData);
                        console.log('[Enhance][Fallback] resumeSetupData:', resumeSetupData);

                        const isMeaningful = (val) => {
                          if (val === null || val === undefined) return false;
                          if (typeof val === 'string') {
                            const trimmed = val.trim();
                            if (!trimmed) return false;
                            if (/^\[.*\]$/.test(trimmed)) return false;
                            return true;
                          }
                          if (Array.isArray(val)) return val.length > 0;
                          if (typeof val === 'number') return true;
                          if (typeof val === 'boolean') return true;
                          if (typeof val === 'object') return Object.keys(val).length > 0;
                          return false;
                        };
                        const pruneContent = (node) => {
                          if (Array.isArray(node)) {
                            return node.map(pruneContent).filter(isMeaningful);
                          }
                          if (node && typeof node === 'object') {
                            const result = {};
                            Object.entries(node).forEach(([k, v]) => {
                              const pv = pruneContent(v);
                              if (isMeaningful(pv)) result[k] = pv;
                            });
                            return result;
                          }
                          return node;
                        };

                        const raw = editorFormData?.content || {};
                        const cleaned = pruneContent(raw);
                        const payload = { resumeData: cleaned, globalContext: resumeSetupData || {} };
                        console.log('[Enhance][Fallback] Generated payload:', payload);
                      } catch (fallbackErr) {
                        console.error('[Enhance][Fallback] Failed to generate payload:', fallbackErr);
                      }
                    }
                  } catch (err) {
                    console.error('[Enhance] onEnhance threw error:', err);
                  }
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold group text-xs sm:text-sm"
              >
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-0.5 sm:mr-1 md:mr-2 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline">Enhance</span>
                <span className="md:hidden">AI</span>
              </Button>
            </motion.div>

            {/* Download Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onDownloadPdf}
                disabled={isDownloadingPdf}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold group text-xs sm:text-sm"
              >
                {isDownloadingPdf ? (
                  <>
                    <Loader2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-0.5 sm:mr-1 md:mr-2 animate-spin" />
                    <span className="hidden md:inline">Downloading...</span>
                    <span className="md:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-0.5 sm:mr-1 md:mr-2 group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline">Download</span>
                    <span className="md:hidden">PDF</span>
                  </>
                )}
              </Button>
            </motion.div>

            {/* Save Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onSave}
                disabled={saveStatus === 'saving'}
                className={cn(
                  "rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold group text-xs sm:text-sm",
                  saveStatus === 'success'
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                )}
              >
                {getSaveButtonContent()}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Progress Bar
        {progressData.progress < 100 && (
          <motion.div 
            className="pb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-slate-700">Complete Your Resume</span>
                </div>
                <span className="text-sm text-slate-600">
                  {Math.round(progressData.progress)}% Complete
                </span>
              </div>
              
              <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className={`h-full bg-gradient-to-r ${progressBarColor} rounded-full shadow-sm`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressData.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              
              {progressData.progress < 100 && (
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                  <Zap className="w-3 h-3" />
                  Fill in {progressData.total - progressData.completed} more section{progressData.total - progressData.completed !== 1 ? 's' : ''} to boost your success rate
                </div>
              )}
            </div>
          </motion.div>
        )} */}

        {/* Success Message */}
        {progressData.progress === 100 && (
          <motion.div 
            className="pb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 backdrop-blur-sm rounded-2xl p-4 border border-green-200/50">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-5 h-5 text-green-500 fill-current" />
                </motion.div>
                <span className="text-sm font-semibold text-green-700">
                  Excellent! Your resume is complete and ready to impress employers.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default EditorHeader;