// import React, { useRef, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { 
//   Eye, 
//   Download, 
//   Save, 
//   ArrowLeft, 
//   Loader2, 
//   Edit2, 
//   CheckCircle2, 
//   Sparkles,
//   Star,
//   Zap,
//   Heart
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const EditorHeader = ({
//   // --- Data Props ---
//   resumeName,
//   templateName,
//   progressData,
//   isDirty,
//   saveStatus,
//   isDownloadingPdf,
//   isEditingName,

//   // --- Handler Props ---
//   setIsEditingName,
//   onNameChange,
//   onBack,
//   onPreview,
//   onDownloadPdf,
//   onSave,
// }) => {
//   const nameInputRef = useRef(null);

//   useEffect(() => {
//     if (isEditingName && nameInputRef.current) {
//       nameInputRef.current.focus();
//       nameInputRef.current.select();
//     }
//   }, [isEditingName]);

//   const progressBarColor = useMemo(() => {
//     const { progress } = progressData;
//     if (progress === 100) return 'from-green-500 to-emerald-500';
//     if (progress >= 75) return 'from-blue-500 to-indigo-500';
//     if (progress >= 50) return 'from-cyan-500 to-blue-500';
//     if (progress >= 25) return 'from-yellow-400 to-orange-400';
//     return 'from-amber-400 to-yellow-400';
//   }, [progressData]);

//   const getSaveButtonContent = () => {
//     if (saveStatus === 'saving') {
//       return (
//         <>
//           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//           Saving...
//         </>
//       );
//     }
//     if (saveStatus === 'success') {
//       return (
//         <>
//           <CheckCircle2 className="w-4 h-4 mr-2" />
//           Saved!
//         </>
//       );
//     }
//     return (
//       <>
//         <Save className="w-4 h-4 mr-2" />
//         {isDirty ? 'Save Changes' : 'Save Resume'}
//       </>
//     );
//   };

//   return (
//     <motion.header 
//       className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg"
//       initial={{ y: -20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5, ease: "easeOut" }}
//     >
//       {/* Background gradient overlay */}
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-white/40 to-purple-50/30 pointer-events-none" />
      
//       <div className="container mx-auto px-6 relative z-10">
//         <div className="flex items-center justify-between py-4">
          
//           {/* Left Section - Back Button & Resume Info */}
//           <div className="flex items-center gap-4">
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Button
//                 onClick={onBack}
//                 variant="ghost"
//                 className="p-3 rounded-2xl hover:bg-white/60 backdrop-blur-sm transition-all duration-300 group"
//               >
//                 <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all duration-300" />
//               </Button>
//             </motion.div>

//             <div className="flex flex-col gap-1">
//               {/* Resume Name */}
//               <div className="flex items-center gap-2">
//                 {isEditingName ? (
//                   <motion.div
//                     initial={{ scale: 0.95 }}
//                     animate={{ scale: 1 }}
//                     className="relative"
//                   >
//                     <Input
//                       ref={nameInputRef}
//                       value={resumeName}
//                       onChange={onNameChange}
//                       onBlur={() => setIsEditingName(false)}
//                       onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
//                       className="text-lg font-bold bg-white/80 backdrop-blur-sm border-blue-200 focus:border-blue-400 rounded-xl px-3 py-1 min-w-[300px]"
//                     />
//                     <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm pointer-events-none" />
//                   </motion.div>
//                 ) : (
//                   <motion.button
//                     onClick={() => setIsEditingName(true)}
//                     className="flex items-center gap-2 text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors duration-300 group"
//                     whileHover={{ scale: 1.02 }}
//                   >
//                     {resumeName}
//                     <Edit2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </motion.button>
//                 )}
//               </div>

//               {/* Template Name & Progress */}
//               <div className="flex items-center gap-4">
//                 <span className="text-sm text-slate-500 flex items-center gap-1">
//                   <Sparkles className="w-3 h-3" />
//                   {templateName}
//                 </span>
                
//                 {/* Progress Indicator */}
//                 <div className="flex items-center gap-2">
//                   <div className="w-24 h-2 bg-slate-200/60 rounded-full overflow-hidden">
//                     <motion.div
//                       className={`h-full bg-gradient-to-r ${progressBarColor} rounded-full`}
//                       initial={{ width: 0 }}
//                       animate={{ width: `${progressData.progress}%` }}
//                       transition={{ duration: 0.8, ease: "easeOut" }}
//                     />
//                   </div>
//                   <span className="text-xs text-slate-500 font-medium">
//                     {progressData.completed}/{progressData.total} sections
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Section - Action Buttons */}
//           <div className="flex items-center gap-3">
            
//             {/* Dirty State Indicator */}
//             {isDirty && (
//               <motion.div
//                 initial={{ scale: 0, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 className="flex items-center gap-1 text-amber-600 text-sm font-medium bg-amber-50/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-amber-200/50"
//               >
//                 <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
//                 Unsaved changes
//               </motion.div>
//             )}

//             {/* Preview Button */}
//             {/* <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Button
//                 onClick={onPreview}
//                 variant="outline"
//                 className="bg-white/60 backdrop-blur-sm hover:bg-white/80 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 rounded-2xl px-6 py-3 font-semibold transition-all duration-300 group"
//               >
//                 <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
//                 Preview
//               </Button>
//             </motion.div> */}

//             {/* Download Button */}
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Button
//                 onClick={onDownloadPdf}
//                 disabled={isDownloadingPdf}
//                 className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold group"
//               >
//                 {isDownloadingPdf ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Downloading...
//                   </>
//                 ) : (
//                   <>
//                     <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
//                     Download
//                   </>
//                 )}
//               </Button>
//             </motion.div>

//             {/* Save Button */}
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Button
//                 onClick={onSave}
//                 disabled={saveStatus === 'saving'}
//                 className={cn(
//                   "rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold group",
//                   saveStatus === 'success'
//                     ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
//                     : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
//                 )}
//               >
//                 {getSaveButtonContent()}
//               </Button>
//             </motion.div>
//           </div>
//         </div>

//         {/* Enhanced Progress Bar
//         {progressData.progress < 100 && (
//           <motion.div 
//             className="pb-4"
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//           >
//             <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-2">
//                   <Star className="w-4 h-4 text-blue-500" />
//                   <span className="text-sm font-semibold text-slate-700">Complete Your Resume</span>
//                 </div>
//                 <span className="text-sm text-slate-600">
//                   {Math.round(progressData.progress)}% Complete
//                 </span>
//               </div>
              
//               <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden shadow-inner">
//                 <motion.div
//                   className={`h-full bg-gradient-to-r ${progressBarColor} rounded-full shadow-sm`}
//                   initial={{ width: 0 }}
//                   animate={{ width: `${progressData.progress}%` }}
//                   transition={{ duration: 1, ease: "easeOut" }}
//                 />
//               </div>
              
//               {progressData.progress < 100 && (
//                 <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
//                   <Zap className="w-3 h-3" />
//                   Fill in {progressData.total - progressData.completed} more section{progressData.total - progressData.completed !== 1 ? 's' : ''} to boost your success rate
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )} */}

//         {/* Success Message */}
//         {progressData.progress === 100 && (
//           <motion.div 
//             className="pb-4"
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.3 }}
//           >
//             <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 backdrop-blur-sm rounded-2xl p-4 border border-green-200/50">
//               <div className="flex items-center gap-2">
//                 <motion.div
//                   animate={{ rotate: [0, 10, -10, 0] }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//                 >
//                   <Heart className="w-5 h-5 text-green-500 fill-current" />
//                 </motion.div>
//                 <span className="text-sm font-semibold text-green-700">
//                   Excellent! Your resume is complete and ready to impress employers.
//                 </span>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </motion.header>
//   );
// };

// export default EditorHeader;

import React, { useRef, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Save, ArrowLeft, Loader2, Edit2, CheckCircle2 } from "lucide-react";
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
    // FIX: Corrected the typo from 'nameInputinputRef' to 'nameInputRef'
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
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border shadow-sm px-2 sm:px-4 py-2">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* --- LEFT SIDE: Back Navigation & Resume Name --- */}
          <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
            <Button variant="ghost" size="icon" onClick={onBack} aria-label="Go back" className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:bg-accent hover:text-accent-foreground flex-shrink-0">
              <ArrowLeft size={18} />
            </Button>
            <div className="flex items-center gap-1.5 min-w-0 group" onClick={() => setIsEditingName(true)}>
              {isEditingName ? (
                <Input
                  ref={nameInputRef}
                  value={resumeName}
                  onChange={onNameChange}
                  className="text-base sm:text-lg font-semibold p-1 h-9 border-input focus-visible:ring-1 focus-visible:ring-primary truncate bg-transparent"
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                />
              ) : (
                <h2 className="text-base sm:text-lg font-semibold p-1 h-9 truncate cursor-pointer">
                  {resumeName || "Untitled Resume"}
                </h2>
              )}
              <Edit2 size={14} className="text-muted-foreground/60 group-hover:text-primary transition-colors cursor-pointer flex-shrink-0" />
            </div>
          </div>
          
          {/* --- RIGHT SIDE: Template Info & Action Buttons --- */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <p className="hidden md:block text-xs text-muted-foreground mr-2">Using: <span className="font-medium text-foreground">{templateName || '...'}</span></p>
            
            {/* FIX: Changed 'hidden sm:flex' to 'flex' to make it visible on all screen sizes. */}
            <Button variant="outline" size="sm" onClick={onDownloadPdf} disabled={isDownloadingPdf || saveStatus === 'saving'} className="flex border-border text-xs sm:text-sm h-8 px-2 sm:px-3">
              {isDownloadingPdf ? <Loader2 size={14} className="animate-spin sm:mr-1.5" /> : <Download size={14} className="sm:mr-1.5" />} 
              <span className="hidden sm:inline">{isDownloadingPdf ? '...' : 'PDF'}</span>
            </Button>
            
            <Button size="sm" onClick={onSave} disabled={saveStatus === 'saving' || !isDirty} className={cn("text-xs sm:text-sm h-8 px-3 min-w-[70px] sm:min-w-[88px] transition-all", saveStatus === 'success' && 'bg-green-500 hover:bg-green-600')}>
              {saveStatus === 'saving' ? <Loader2 size={16} className="animate-spin" /> : saveStatus === 'success' ? <span className="flex items-center"><CheckCircle2 size={14} className="sm:mr-1.5" /> <span className="hidden sm:inline">Saved!</span><span className="sm:hidden">Done</span></span> : <span className="flex items-center"><Save size={14} className="sm:mr-1.5" /> {isDirty ? 'Save' : 'Saved'}</span>}
            </Button>
          </div>
        </div>
        
        {/* --- Progress Bar --- */}
        <div className="mt-2.5">
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
    </header>
  );
};

export default EditorHeader;
