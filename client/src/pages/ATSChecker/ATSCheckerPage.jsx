// import React, { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Upload, FileText, File, FileType, X, CheckCircle, AlertCircle, Loader2, Sparkles, ArrowRight, Zap, Target, TrendingUp, Award, ChevronRight } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import { useNavigate } from 'react-router-dom';
// import atsScoreService from '@/api/atsScoreServiceApi.js';
// import textExtractionService from '@/api/textExtractionServiceApi.js';
// import { getAllTemplates } from '@/api/templateServiceApi.js';

// const ATSCheckerPage = () => {
//   const navigate = useNavigate();
//   const [resumeFile, setResumeFile] = useState(null);
//   const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [dragActiveResume, setDragActiveResume] = useState(false);
//   const [dragActiveJobDesc, setDragActiveJobDesc] = useState(false);
//   const [atsResults, setAtsResults] = useState(null);
//   const [analysisStep, setAnalysisStep] = useState('');
//   const [showTemplateSelection, setShowTemplateSelection] = useState(false);
//   const [templates, setTemplates] = useState([]);
//   const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
//   const [isOptimizing, setIsOptimizing] = useState(false);
//   const [resumeText, setResumeText] = useState('');
//   const [jobDescriptionText, setJobDescriptionText] = useState('');
//   const resumeInputRef = useRef(null);
//   const jobDescInputRef = useRef(null);

//   const supportedFormats = [
//     { type: 'application/pdf', label: 'PDF', icon: FileText, color: 'text-red-500' },
//     { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'DOCX', icon: File, color: 'text-blue-500' },
//     { type: 'application/msword', label: 'DOC', icon: File, color: 'text-blue-600' },
//     { type: 'text/plain', label: 'TXT', icon: FileType, color: 'text-gray-500' }
//   ];

//   // Enhanced file type validation that checks both MIME type and file extension
//   const isFileTypeSupported = (file) => {
//     const supportedMimeTypes = [
//       'application/pdf',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       'application/msword',
//       'text/plain'
//     ];
    
//     const supportedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    
//     // Check MIME type first
//     if (supportedMimeTypes.includes(file.type)) {
//       return true;
//     }
    
//     // If MIME type is not detected or incorrect, check file extension
//     const fileName = file.name.toLowerCase();
//     const hasValidExtension = supportedExtensions.some(ext => fileName.endsWith(ext));
    
//     // Also check for empty or generic MIME types that might be valid files
//     const isEmptyOrGenericType = !file.type || file.type === '' || file.type === 'application/octet-stream';
    
//     return hasValidExtension && (isEmptyOrGenericType || supportedMimeTypes.includes(file.type));
//   };

//   const handleDrag = (e, type) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       if (type === 'resume') {
//         setDragActiveResume(true);
//       } else {
//         setDragActiveJobDesc(true);
//       }
//     } else if (e.type === 'dragleave') {
//       if (type === 'resume') {
//         setDragActiveResume(false);
//       } else {
//         setDragActiveJobDesc(false);
//       }
//     }
//   };

//   const handleDrop = (e, type) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (type === 'resume') {
//       setDragActiveResume(false);
//     } else {
//       setDragActiveJobDesc(false);
//     }
    
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFile(e.dataTransfer.files[0], type);
//     }
//   };

//   const handleFile = (file, type) => {
//     // Enhanced file type validation
//     const isValidType = isFileTypeSupported(file);
//     const isValidSize = textExtractionService.isFileSizeValid(file, 10); // 10MB limit
    
//     console.log('File validation:', {
//       name: file.name,
//       type: file.type,
//       size: file.size,
//       isValidType,
//       isValidSize
//     });
    
//     if (!isValidType) {
//       alert(`Unsupported file type: ${file.type || 'unknown'}. Please upload PDF, DOCX, DOC, or TXT files.`);
//       return;
//     }
    
//     if (!isValidSize) {
//       alert('File size too large. Please upload files smaller than 10MB.');
//       return;
//     }

//     const fileData = {
//       file,
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       status: 'ready'
//     };

//     if (type === 'resume') {
//       setResumeFile(fileData);
//     } else {
//       setJobDescriptionFile(fileData);
//     }
//   };

//   const handleFileInput = (e, type) => {
//     if (e.target.files && e.target.files[0]) {
//       handleFile(e.target.files[0], type);
//     }
//   };

//   const removeFile = (type) => {
//     if (type === 'resume') {
//       setResumeFile(null);
//     } else {
//       setJobDescriptionFile(null);
//     }
//   };

//   const formatFileSize = (bytes) => {
//     return textExtractionService.formatFileSize(bytes);
//   };

//   const getFileIcon = (fileType) => {
//     const typeInfo = textExtractionService.getFileTypeInfo(fileType);
//     const iconMap = {
//       'FileText': FileText,
//       'File': File,
//       'FileType': FileType
//     };
//     return iconMap[typeInfo.icon] || FileText;
//   };

//   const getFileColor = (fileType) => {
//     const typeInfo = textExtractionService.getFileTypeInfo(fileType);
//     return typeInfo.color;
//   };

//   const handleAnalyze = async () => {
//     if (!resumeFile || !jobDescriptionFile) {
//       alert('Please upload both resume and job description files.');
//       return;
//     }

//     setIsUploading(true);
//     setAtsResults(null);
//     setShowTemplateSelection(false);
    
//     try {
//       console.log('Starting ATS analysis...');
//       setAnalysisStep('uploading');
      
//       // Call ATS score analysis service (it will extract text internally)
//       const result = await atsScoreService.analyzeATSScore(resumeFile.file, jobDescriptionFile.file);
      
//       if (result.success) {
//         console.log('✅ ATS analysis completed successfully:');
//         console.log('ATS Results:', result.data);
        
//         // Extract the texts from ATS results (backend already extracted them)
//         if (result.data.resumeText) {
//           console.log('✅ Resume text extracted (length):', result.data.resumeText.length);
//           setResumeText(result.data.resumeText);
//         } else {
//           console.warn('⚠️ No resume text in ATS results');
//         }
        
//         if (result.data.jobDescriptionText) {
//           console.log('✅ Job description text extracted (length):', result.data.jobDescriptionText.length);
//           setJobDescriptionText(result.data.jobDescriptionText);
//         } else {
//           console.warn('⚠️ No job description text in ATS results');
//         }
        
//         setAtsResults(result.data);
//         setAnalysisStep('complete');
//       } else {
//         console.error('❌ ATS analysis failed:', result.error);
//         alert(`ATS analysis failed: ${result.error}`);
//       }
      
//     } catch (error) {
//       console.error('Analysis error:', error);
//       alert('Error analyzing files. Please try again.');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Load templates when user clicks "Get Your Optimized Resume"
//   const handleGetOptimizedResume = async () => {
//     setIsLoadingTemplates(true);
//     setShowTemplateSelection(true);
//     try {
//       console.log('🔍 Fetching templates...');
//       const response = await getAllTemplates();
//       console.log('📦 Templates response:', response);
//       console.log('📦 Response type:', typeof response);
//       console.log('📦 Is array?:', Array.isArray(response));
      
//       // Backend returns templates array directly
//       const templatesList = Array.isArray(response) ? response : (response.templates || response.data || []);
//       console.log('📋 Templates list:', templatesList);
//       console.log('📊 Number of templates:', templatesList.length);
      
//       setTemplates(templatesList);
      
//       if (templatesList.length === 0) {
//         console.warn('⚠️ No templates found!');
//         alert('No templates available. Please add templates first or contact support.');
//         setShowTemplateSelection(false);
//       }
//     } catch (error) {
//       console.error('❌ Error loading templates:', error);
//       alert(`Failed to load templates: ${error.message || 'Unknown error'}. Please try again.`);
//       setShowTemplateSelection(false);
//     } finally {
//       setIsLoadingTemplates(false);
//     }
//   };

//   // Handle template selection and navigate to editor with optimized data
//   const handleTemplateSelect = async (template) => {
//     setIsOptimizing(true);
//     try {
//       console.log('🎯 Optimizing resume with ATS feedback...');
//       console.log('📋 Template:', template.templateName);
//       console.log('📄 Resume Text Length:', resumeText?.length || 0);
//       console.log('🎯 Job Description Text Length:', jobDescriptionText?.length || 0);
//       console.log('📊 ATS Results:', atsResults);
//       console.log('🔧 Template Field Definition:', template.templateFieldDefinition);
      
//       // Validate required data
//       if (!resumeText || !jobDescriptionText || !atsResults) {
//         const missing = [];
//         if (!resumeText) missing.push('resume text');
//         if (!jobDescriptionText) missing.push('job description text');
//         if (!atsResults) missing.push('ATS results');
        
//         throw new Error(`Missing required data: ${missing.join(', ')}. Please run the analysis again.`);
//       }
      
//       // Generate optimized resume content using the new API
//       console.log('🚀 Calling optimization API...');
//       const optimizationResult = await atsScoreService.generateOptimizedResume(
//         resumeText,
//         jobDescriptionText,
//         atsResults,
//         template.templateFieldDefinition
//       );
      
//       console.log('✅ Optimization result:', optimizationResult);

//       if (optimizationResult.success && optimizationResult.data) {
//         console.log('✨ Optimization successful! Navigating to editor...');
        
//         // Navigate to editor with pre-filled optimized data
//         navigate(`/resume/new/${template._id}`, {
//           state: {
//             mode: 'ats-optimize',
//             optimizedResumeData: {
//               content: optimizationResult.data,
//               sectionsConfig: {}
//             },
//             atsResults: atsResults,
//             jobDescription: jobDescriptionText,
//             skipSetupDialog: true,
//             resumeText: resumeText
//           }
//         });
//       } else {
//         const errorMsg = optimizationResult.error || optimizationResult.message || 'Failed to generate optimized resume';
//         console.error('❌ Optimization failed:', errorMsg);
//         throw new Error(errorMsg);
//       }
      
//     } catch (error) {
//       console.error('❌ Error optimizing resume:', error);
//       alert(`Failed to optimize resume: ${error.message}. Please try again.`);
//     } finally {
//       setIsOptimizing(false);
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12">
//       <div className="container mx-auto px-6 max-w-6xl">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="space-y-8"
//         >
//           {/* Header */}
//           <motion.div variants={itemVariants} className="text-center space-y-4">
//             <motion.div
//               className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-3 mb-4"
//               whileHover={{ scale: 1.05 }}
//             >
//               <Target className="w-5 h-5 text-primary" />
//               <span className="text-sm font-semibold text-primary">Free ATS Score Checker</span>
//             </motion.div>
            
//             <h1 className="text-5xl font-bold text-foreground bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">
//               Beat the ATS, Land the Interview
//             </h1>
//             <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//               90% of companies use ATS systems. Is your resume making it through? 
//               <span className="block mt-2 font-semibold text-foreground">
//                 Check your score → See what's missing → Get an optimized resume in minutes
//               </span>
//             </p>

//             {/* Value Props */}
//             <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8">
//               <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
//                 <CardContent className="p-6 text-center">
//                   <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
//                   <h3 className="font-semibold mb-2">Instant Analysis</h3>
//                   <p className="text-sm text-muted-foreground">Get detailed ATS score in seconds</p>
//                 </CardContent>
//               </Card>
//               <Card className="border-2 border-accent-purple/20 bg-gradient-to-br from-accent-purple/5 to-transparent">
//                 <CardContent className="p-6 text-center">
//                   <Target className="w-8 h-8 text-accent-purple mx-auto mb-3" />
//                   <h3 className="font-semibold mb-2">AI-Powered Fix</h3>
//                   <p className="text-sm text-muted-foreground">Auto-optimize with missing keywords</p>
//                 </CardContent>
//               </Card>
//               <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
//                 <CardContent className="p-6 text-center">
//                   <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
//                   <h3 className="font-semibold mb-2">Ready in Minutes</h3>
//                   <p className="text-sm text-muted-foreground">Download optimized resume instantly</p>
//                 </CardContent>
//               </Card>
//             </div>
//           </motion.div>

//           {/* File Upload Section - Compact when results shown */}
//           {!atsResults && (
//             <>
//               {/* Resume Upload Section */}
//               <motion.div variants={itemVariants}>
//                 <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
//                   <CardHeader>
//                     <CardTitle className="text-center text-xl font-semibold text-foreground">
//                       📄 Upload Your Resume
//                     </CardTitle>
//                     <CardDescription className="text-center">
//                       Upload your resume in PDF, DOCX, DOC, or TXT format
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="p-8">
//                     <div
//                       className={cn(
//                         "relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300",
//                         dragActiveResume 
//                           ? "border-primary bg-primary/5 scale-105" 
//                           : "border-border hover:border-primary/50 hover:bg-muted/20"
//                       )}
//                       onDragEnter={(e) => handleDrag(e, 'resume')}
//                       onDragLeave={(e) => handleDrag(e, 'resume')}
//                       onDragOver={(e) => handleDrag(e, 'resume')}
//                       onDrop={(e) => handleDrop(e, 'resume')}
//                     >
//                       <input
//                         ref={resumeInputRef}
//                         type="file"
//                         accept=".pdf,.docx,.doc,.txt"
//                         onChange={(e) => handleFileInput(e, 'resume')}
//                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                       />
                      
//                       <motion.div
//                         className="space-y-4"
//                         animate={dragActiveResume ? { scale: 1.05 } : { scale: 1 }}
//                         transition={{ type: "spring", stiffness: 300 }}
//                       >
//                         <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
//                           <FileText className="w-8 h-8 text-primary" />
//                         </div>
                        
//                         <div>
//                           <h3 className="text-xl font-semibold text-foreground mb-2">
//                             {dragActiveResume ? "Drop your resume here" : "Drag & drop your resume here"}
//                           </h3>
//                           <p className="text-muted-foreground mb-4">
//                             or click to browse files
//                           </p>
//                         </div>

//                         <div className="flex flex-wrap justify-center gap-2">
//                           {supportedFormats.map((format) => {
//                             const Icon = format.icon;
//                             return (
//                               <span
//                                 key={format.type}
//                                 className={cn(
//                                   "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted",
//                                   format.color
//                                 )}
//                               >
//                                 <Icon className="w-3 h-3" />
//                                 {format.label}
//                               </span>
//                             );
//                           })}
//                         </div>

//                         <p className="text-sm text-muted-foreground">
//                           Maximum file size: 10MB
//                         </p>
//                       </motion.div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>

//               {/* Job Description Upload Section */}
//               <motion.div variants={itemVariants}>
//                 <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
//                   <CardHeader>
//                     <CardTitle className="text-center text-xl font-semibold text-foreground">
//                       🎯 Upload Job Description
//                     </CardTitle>
//                     <CardDescription className="text-center">
//                       Upload the job description you're targeting
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="p-8">
//                     <div
//                       className={cn(
//                         "relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300",
//                         dragActiveJobDesc 
//                           ? "border-primary bg-primary/5 scale-105" 
//                           : "border-border hover:border-primary/50 hover:bg-muted/20"
//                       )}
//                       onDragEnter={(e) => handleDrag(e, 'jobdesc')}
//                       onDragLeave={(e) => handleDrag(e, 'jobdesc')}
//                       onDragOver={(e) => handleDrag(e, 'jobdesc')}
//                       onDrop={(e) => handleDrop(e, 'jobdesc')}
//                     >
//                       <input
//                         ref={jobDescInputRef}
//                         type="file"
//                         accept=".pdf,.docx,.doc,.txt"
//                         onChange={(e) => handleFileInput(e, 'jobdesc')}
//                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                       />
                      
//                       <motion.div
//                         className="space-y-4"
//                         animate={dragActiveJobDesc ? { scale: 1.05 } : { scale: 1 }}
//                         transition={{ type: "spring", stiffness: 300 }}
//                       >
//                         <div className="mx-auto w-16 h-16 bg-accent-purple/10 rounded-full flex items-center justify-center">
//                           <File className="w-8 h-8 text-accent-purple" />
//                         </div>
                        
//                         <div>
//                           <h3 className="text-xl font-semibold text-foreground mb-2">
//                             {dragActiveJobDesc ? "Drop job description here" : "Drag & drop job description here"}
//                           </h3>
//                           <p className="text-muted-foreground mb-4">
//                             or click to browse files
//                           </p>
//                         </div>

//                         <div className="flex flex-wrap justify-center gap-2">
//                           {supportedFormats.map((format) => {
//                             const Icon = format.icon;
//                             return (
//                               <span
//                                 key={format.type}
//                                 className={cn(
//                                   "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted",
//                                   format.color
//                                 )}
//                               >
//                                 <Icon className="w-3 h-3" />
//                                 {format.label}
//                               </span>
//                             );
//                           })}
//                         </div>

//                         <p className="text-sm text-muted-foreground">
//                           Maximum file size: 10MB
//                         </p>
//                       </motion.div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>

//               {/* Uploaded Files Display */}
//               <AnimatePresence>
//                 {(resumeFile || jobDescriptionFile) && (
//                   <motion.div
//                     variants={itemVariants}
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     className="space-y-4"
//                   >
//                     <h3 className="text-lg font-semibold text-foreground">
//                       📎 Uploaded Files
//                     </h3>
                    
//                     <div className="grid md:grid-cols-2 gap-4">
//                       {/* Resume File */}
//                       {resumeFile && (
//                         <motion.div
//                           initial={{ opacity: 0, x: -20 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           exit={{ opacity: 0, x: 20 }}
//                           className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
//                         >
//                           <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", getFileColor(resumeFile.type))}>
//                             {React.createElement(getFileIcon(resumeFile.type), { className: "w-5 h-5" })}
//                           </div>
                          
//                           <div className="flex-1 min-w-0">
//                             <p className="font-medium text-foreground truncate">
//                               {resumeFile.name}
//                             </p>
//                             <p className="text-sm text-muted-foreground">
//                               {formatFileSize(resumeFile.size)}
//                             </p>
//                             <p className="text-xs text-primary font-medium">
//                               Resume
//                             </p>
//                           </div>
                          
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeFile('resume')}
//                             className="text-muted-foreground hover:text-destructive"
//                           >
//                             <X className="w-4 h-4" />
//                           </Button>
//                         </motion.div>
//                       )}

//                       {/* Job Description File */}
//                       {jobDescriptionFile && (
//                         <motion.div
//                           initial={{ opacity: 0, x: -20 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           exit={{ opacity: 0, x: 20 }}
//                           className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
//                         >
//                           <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", getFileColor(jobDescriptionFile.type))}>
//                             {React.createElement(getFileIcon(jobDescriptionFile.type), { className: "w-5 h-5" })}
//                           </div>
                          
//                           <div className="flex-1 min-w-0">
//                             <p className="font-medium text-foreground truncate">
//                               {jobDescriptionFile.name}
//                             </p>
//                             <p className="text-sm text-muted-foreground">
//                               {formatFileSize(jobDescriptionFile.size)}
//                             </p>
//                             <p className="text-xs text-accent-purple font-medium">
//                               Job Description
//                             </p>
//                           </div>
                          
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeFile('jobdesc')}
//                             className="text-muted-foreground hover:text-destructive"
//                           >
//                             <X className="w-4 h-4" />
//                           </Button>
//                         </motion.div>
//                       )}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {/* Analyze Button */}
//               <motion.div variants={itemVariants} className="text-center">
//                 <Button
//                   onClick={handleAnalyze}
//                   disabled={!resumeFile || !jobDescriptionFile || isUploading}
//                   size="lg"
//                   className="px-12 py-6 text-lg font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
//                 >
//                   {isUploading ? (
//                     <>
//                       <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                       {atsScoreService.getProgressMessage(analysisStep)}
//                     </>
//                   ) : (
//                     <>
//                       <Sparkles className="w-5 h-5 mr-2" />
//                       Check My ATS Score
//                       <ArrowRight className="w-5 h-5 ml-2" />
//                     </>
//                   )}
//                 </Button>
//                 <p className="text-sm text-muted-foreground mt-3">
//                   ✨ Free • Instant • AI-Powered
//                 </p>
//               </motion.div>
//             </>
//           )}

//           {/* ATS Results Display */}
//           <AnimatePresence>
//             {atsResults && (
//               <motion.div
//                 variants={itemVariants}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="space-y-6"
//               >
//                 {/* Compact File Info when results shown */}
//                 {resumeFile && jobDescriptionFile && (
//                   <Card className="bg-muted/30">
//                     <CardContent className="p-4">
//                       <div className="flex items-center justify-between flex-wrap gap-4">
//                         <div className="flex items-center gap-4">
//                           <div className="text-sm">
//                             <span className="font-medium text-foreground">📄 {resumeFile.name}</span>
//                             <span className="text-muted-foreground mx-2">vs</span>
//                             <span className="font-medium text-foreground">🎯 {jobDescriptionFile.name}</span>
//                           </div>
//                         </div>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => {
//                             setAtsResults(null);
//                             setShowTemplateSelection(false);
//                           }}
//                         >
//                           Start New Analysis
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}

//                 {/* ATS Score Card - More Prominent */}
//                 <Card className="border-4 border-primary/30 bg-gradient-to-br from-primary/10 via-accent-purple/5 to-background shadow-2xl">
//                   <CardContent className="text-center space-y-6 py-12">
//                     <div className="space-y-2">
//                       <h3 className="text-2xl font-semibold text-muted-foreground">Your ATS Score</h3>
//                       <div className="text-8xl font-black text-primary drop-shadow-lg">
//                         {atsResults.atsScore}
//                         <span className="text-5xl text-muted-foreground">/100</span>
//                       </div>
//                       <div className={`inline-flex items-center px-6 py-3 rounded-full text-xl font-bold ${
//                         atsResults.scoreInterpretation.bgColor
//                       } ${atsResults.scoreInterpretation.textColor} ${atsResults.scoreInterpretation.borderColor} border-4 shadow-lg`}>
//                         {atsResults.scoreInterpretation.level}
//                       </div>
//                       <p className="text-muted-foreground text-xl max-w-2xl mx-auto pt-2">
//                         {atsResults.scoreInterpretation.description}
//                       </p>
//                     </div>

//                     {/* Progress Bar */}
//                     <div className="max-w-md mx-auto">
//                       <Progress 
//                         value={atsResults.atsScore} 
//                         className="h-4"
//                       />
//                     </div>

//                     {/* CTA - Prominent */}
//                     {atsResults.atsScore < 90 && !showTemplateSelection && (
//                       <motion.div
//                         initial={{ scale: 0.9, opacity: 0 }}
//                         animate={{ scale: 1, opacity: 1 }}
//                         transition={{ delay: 0.5 }}
//                         className="pt-6"
//                       >
//                         <div className="bg-gradient-to-r from-primary to-accent-purple p-8 rounded-2xl shadow-2xl">
//                           <Award className="w-16 h-16 text-white mx-auto mb-4" />
//                           <h3 className="text-3xl font-bold text-white mb-2">
//                             Let's Fix That!
//                           </h3>
//                           <p className="text-white/90 mb-6 text-lg">
//                             We'll create an ATS-optimized resume for you with all the missing keywords and skills
//                           </p>
//                           <Button
//                             onClick={handleGetOptimizedResume}
//                             disabled={isLoadingTemplates}
//                             size="lg"
//                             variant="secondary"
//                             className="px-12 py-6 text-lg font-bold shadow-xl hover:scale-105 transition-transform"
//                           >
//                             {isLoadingTemplates ? (
//                               <>
//                                 <Loader2 className="w-6 h-6 mr-3 animate-spin" />
//                                 Loading Templates...
//                               </>
//                             ) : (
//                               <>
//                                 <Sparkles className="w-6 h-6 mr-3" />
//                                 Get Your Optimized Resume
//                                 <ChevronRight className="w-6 h-6 ml-3" />
//                               </>
//                             )}
//                           </Button>
//                         </div>
//                       </motion.div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Template Selection */}
//                 <AnimatePresence>
//                   {showTemplateSelection && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -20 }}
//                       className="space-y-4"
//                     >
//                       <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
//                         <CardHeader>
//                           <CardTitle className="text-2xl text-center flex items-center justify-center gap-3">
//                             <Sparkles className="w-7 h-7 text-primary" />
//                             Choose Your Template
//                             <Sparkles className="w-7 h-7 text-primary" />
//                           </CardTitle>
//                           <CardDescription className="text-center text-base">
//                             Select a template and we'll automatically fill it with your optimized resume content
//                           </CardDescription>
//                         </CardHeader>
//                         <CardContent className="p-8">
//                           {isOptimizing && (
//                             <div className="text-center py-12">
//                               <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
//                               <p className="text-lg font-medium">Optimizing your resume with AI...</p>
//                               <p className="text-sm text-muted-foreground mt-2">
//                                 Adding missing keywords, skills, and improving content
//                               </p>
//                             </div>
//                           )}

//                           {!isOptimizing && isLoadingTemplates && (
//                             <div className="text-center py-12">
//                               <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
//                               <p className="text-lg font-medium">Loading templates...</p>
//                             </div>
//                           )}

//                           {!isOptimizing && !isLoadingTemplates && templates.length === 0 && (
//                             <div className="text-center py-12">
//                               <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//                               <p className="text-lg font-medium text-muted-foreground">No templates available</p>
//                               <p className="text-sm text-muted-foreground mt-2">Please contact support or try again later.</p>
//                             </div>
//                           )}

//                           {!isOptimizing && !isLoadingTemplates && templates.length > 0 && (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                               {templates.map((template) => (
//                                 <motion.div
//                                   key={template._id}
//                                   whileHover={{ scale: 1.05 }}
//                                   whileTap={{ scale: 0.98 }}
//                                   className="group"
//                                 >
//                                   <Card 
//                                     className="cursor-pointer border-2 border-border hover:border-primary hover:shadow-2xl transition-all overflow-hidden h-full"
//                                     onClick={() => handleTemplateSelect(template)}
//                                   >
//                                     <CardContent className="p-6 text-center space-y-4">
//                                       <div className="bg-gradient-to-br from-primary/10 to-accent-purple/10 rounded-lg p-8 group-hover:from-primary/20 group-hover:to-accent-purple/20 transition-colors">
//                                         <FileText className="w-16 h-16 text-primary mx-auto" />
//                                       </div>
//                                       <div>
//                                         <h3 className="font-bold text-lg mb-2">{template.templateName}</h3>
//                                         <p className="text-sm text-muted-foreground line-clamp-2">
//                                           {template.templateDescription}
//                                         </p>
//                                       </div>
//                                       <Button
//                                         variant="outline"
//                                         className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
//                                       >
//                                         Select Template
//                                         <ArrowRight className="w-4 h-4 ml-2" />
//                                       </Button>
//                                     </CardContent>
//                                   </Card>
//                                 </motion.div>
//                               ))}
//                             </div>
//                           )}
//                         </CardContent>
//                       </Card>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 {/* Detailed Analysis - Collapsible */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-xl flex items-center gap-2">
//                       <Target className="w-6 h-6 text-primary" />
//                       Detailed Analysis
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     {/* Keyword & Skills Match */}
//                     <div className="grid md:grid-cols-2 gap-6">
//                       {/* Keyword Match */}
//                       <Card className="border-2 border-border">
//                         <CardHeader>
//                           <CardTitle className="text-lg flex items-center justify-between">
//                             Keywords
//                             <Badge variant="outline" className="text-base">
//                               {atsResults.keywordMatch.score}%
//                             </Badge>
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                           {atsResults.keywordMatch.matchedKeywords.length > 0 && (
//                             <div>
//                               <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
//                                 <CheckCircle className="w-4 h-4" />
//                                 Matched ({atsResults.keywordMatch.matchedKeywords.length})
//                               </h4>
//                               <div className="flex flex-wrap gap-2">
//                                 {atsResults.keywordMatch.matchedKeywords.slice(0, 10).map((keyword, index) => (
//                                   <Badge key={index} variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
//                                     {keyword}
//                                   </Badge>
//                                 ))}
//                                 {atsResults.keywordMatch.matchedKeywords.length > 10 && (
//                                   <Badge variant="outline">
//                                     +{atsResults.keywordMatch.matchedKeywords.length - 10} more
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           )}
//                           {atsResults.keywordMatch.missingKeywords.length > 0 && (
//                             <div>
//                               <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
//                                 <AlertCircle className="w-4 h-4" />
//                                 Missing ({atsResults.keywordMatch.missingKeywords.length})
//                               </h4>
//                               <div className="flex flex-wrap gap-2">
//                                 {atsResults.keywordMatch.missingKeywords.map((keyword, index) => (
//                                   <Badge key={index} variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
//                                     {keyword}
//                                   </Badge>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </CardContent>
//                       </Card>

//                       {/* Skills Match */}
//                       <Card className="border-2 border-border">
//                         <CardHeader>
//                           <CardTitle className="text-lg flex items-center justify-between">
//                             Skills
//                             <Badge variant="outline" className="text-base">
//                               {atsResults.skillsMatch.score}%
//                             </Badge>
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                           {atsResults.skillsMatch.matchedSkills.length > 0 && (
//                             <div>
//                               <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
//                                 <CheckCircle className="w-4 h-4" />
//                                 Matched ({atsResults.skillsMatch.matchedSkills.length})
//                               </h4>
//                               <div className="flex flex-wrap gap-2">
//                                 {atsResults.skillsMatch.matchedSkills.slice(0, 10).map((skill, index) => (
//                                   <Badge key={index} variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
//                                     {skill}
//                                   </Badge>
//                                 ))}
//                                 {atsResults.skillsMatch.matchedSkills.length > 10 && (
//                                   <Badge variant="outline">
//                                     +{atsResults.skillsMatch.matchedSkills.length - 10} more
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           )}
//                           {atsResults.skillsMatch.missingSkills.length > 0 && (
//                             <div>
//                               <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
//                                 <AlertCircle className="w-4 h-4" />
//                                 Missing ({atsResults.skillsMatch.missingSkills.length})
//                               </h4>
//                               <div className="flex flex-wrap gap-2">
//                                 {atsResults.skillsMatch.missingSkills.map((skill, index) => (
//                                   <Badge key={index} variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
//                                     {skill}
//                                   </Badge>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </CardContent>
//                       </Card>
//                     </div>

//                     {/* Suggestions, Strengths, and Improvements */}
//                     <div className="grid md:grid-cols-3 gap-6">
//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="text-base text-blue-600 flex items-center gap-2">
//                             <Sparkles className="w-4 h-4" />
//                             Suggestions
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <ul className="space-y-2">
//                             {atsResults.suggestions.slice(0, 5).map((suggestion, index) => (
//                               <li key={index} className="flex items-start gap-2 text-sm">
//                                 <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
//                                 <span className="text-muted-foreground">{suggestion}</span>
//                               </li>
//                             ))}
//                           </ul>
//                         </CardContent>
//                       </Card>

//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="text-base text-green-600 flex items-center gap-2">
//                             <CheckCircle className="w-4 h-4" />
//                             Strengths
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <ul className="space-y-2">
//                             {atsResults.strengths.slice(0, 5).map((strength, index) => (
//                               <li key={index} className="flex items-start gap-2 text-sm">
//                                 <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                                 <span className="text-muted-foreground">{strength}</span>
//                               </li>
//                             ))}
//                           </ul>
//                         </CardContent>
//                       </Card>

//                       <Card>
//                         <CardHeader>
//                           <CardTitle className="text-base text-red-600 flex items-center gap-2">
//                             <AlertCircle className="w-4 h-4" />
//                             Improvements
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <ul className="space-y-2">
//                             {atsResults.improvements.slice(0, 5).map((improvement, index) => (
//                               <li key={index} className="flex items-start gap-2 text-sm">
//                                 <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
//                                 <span className="text-muted-foreground">{improvement}</span>
//                               </li>
//                             ))}
//                           </ul>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Info Alert */}
//           {!atsResults && (
//             <motion.div variants={itemVariants}>
//               <Alert className="border-primary/30 bg-primary/5">
//                 <Sparkles className="h-4 w-4 text-primary" />
//                 <AlertDescription>
//                   <strong className="text-primary">How it works:</strong> Upload your resume and job description. 
//                   Our AI analyzes compatibility and shows you exactly what's missing. Then, get a perfectly optimized resume in just a few clicks!
//                 </AlertDescription>
//               </Alert>
//             </motion.div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default ATSCheckerPage;


// @/components/ATSCheckerPage/ATSCheckerPage.jsx
// (This is the main file you'll import into your routes)

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import atsScoreService from '@/api/atsScoreServiceApi.js';

// Import the new step components
import FileUploadStep from '@/components/AtsChecker/FileUploadStep';
import FileDropzone from '@/components/AtsChecker/FileDropzone';
import AnalyzingStep from '@/components/AtsChecker/AnalyzingStep';
import ResultsStep from '@/components/AtsChecker/ResultsStep';
import LimitReachedAlert from '@/components/Common/LimitReachedAlert';
import useAuthContext from '@/hooks/useAuth';
import AuthDialog from '@/components/Auth/AuthDialog';

const ATSCheckerPage = () => {
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload', 'analyzing', 'results'
  const [atsResults, setAtsResults] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [limitError, setLimitError] = useState(null); // For displaying limit errors

  // Restore ATS data after OAuth redirect
  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem('ats_optimization_data');
      if (savedData) {
        console.log('🔄 Found saved ATS data, restoring...');
        const parsedData = JSON.parse(savedData);
        
        // Check if data is not too old (within 1 hour)
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - parsedData.timestamp < oneHour) {
          console.log('✅ Restoring ATS data:', parsedData);
          
          // Restore the data
          setResumeText(parsedData.resumeText || '');
          setJobDescriptionText(parsedData.jobDescriptionText || '');
          setAtsResults(parsedData.atsResults || null);
          
          // Restore file info
          if (parsedData.resumeFileName) {
            setResumeFile({
              name: parsedData.resumeFileName,
              status: 'ready'
            });
          }
          if (parsedData.jobDescFileName) {
            setJobDescriptionFile({
              name: parsedData.jobDescFileName,
              status: 'ready'
            });
          }
          
          // If we have results, show them
          if (parsedData.atsResults) {
            setCurrentStep('results');
          }
          
          console.log('✅ ATS data restored successfully');
        } else {
          console.log('⏰ Saved data is too old, removing...');
          localStorage.removeItem('ats_optimization_data');
        }
      }
    } catch (error) {
      console.error('❌ Failed to restore ATS data:', error);
      localStorage.removeItem('ats_optimization_data');
    }
  }, []);

  const handleAnalyze = async (resumeFile, jdInput) => {
    setResumeFile(resumeFile);
    // If text input was used, keep a lightweight placeholder; else keep file meta
    if (jdInput && jdInput.text) {
      setJobDescriptionFile({ name: 'Pasted Job Description', status: 'ready' });
    } else {
      setJobDescriptionFile(jdInput);
    }
    setCurrentStep('analyzing');
    setAtsResults(null);

    try {
      // This function now provides progress updates
      const onProgress = (step) => {
        setAnalysisProgress(atsScoreService.getProgressMessage(step));
      };

      onProgress('uploading'); // Initial progress message
      const result = await atsScoreService.analyzeATSScore(
        resumeFile.file,
        jdInput && jdInput.text ? jdInput.text : jdInput.file,
        onProgress
      );

      if (result.success) {
        setAtsResults(result.data);
        setResumeText(result.data.resumeText || '');
        setJobDescriptionText(result.data.jobDescriptionText || '');
        setCurrentStep('results');
      } else {
        // Check if it's a limit error
        if (result.isLimitError && result.limitError) {
          setLimitError(result.limitError);
          setCurrentStep('upload'); // Go back to upload step to show the error
        } else {
          alert(`ATS analysis failed: ${result.error}`);
          setCurrentStep('upload'); // Reset on failure
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
      // Check if error has limit error data
      if (error.isLimitError && error.limitError) {
        setLimitError(error.limitError);
        setCurrentStep('upload');
      } else {
        alert('Error analyzing files. Please try again.');
        setCurrentStep('upload');
      }
    }
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setAtsResults(null);
    setResumeFile(null);
    setJobDescriptionFile(null);
    setAnalysisProgress('');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // Standardized section padding
    <div className="min-h-screen bg-background py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Header Section (Hero) */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-4"
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Free ATS Score Checker
              </span>
            </motion.div>

            {/* Standardized H1 */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Beat the ATS,
              <span className="block bg-gradient-to-r from-primary via-accent-purple to-accent-pink bg-clip-text text-transparent">
                Land the Interview
              </span>
            </h1>
            
            {/* Standardized Lead Paragraph */}
            <p className="text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto">
              Is your resume making it past the robots? Check your score, see
              what's missing, and get an optimized resume in minutes.
            </p>

            {/* Value Props - Standardized Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
              <Card className="bg-card border border-border">
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-1">Instant Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Get a detailed score in seconds.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border border-border">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-accent-purple mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-1">AI-Powered Fix</h3>
                  <p className="text-sm text-muted-foreground">
                    Auto-optimize with missing keywords.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border border-border">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-success mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-1">Get Hired Faster</h3>
                  <p className="text-sm text-muted-foreground">
                    Instantly download your new resume.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Step-by-Step Uploader & Results */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {currentStep === 'upload' && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Limit Error Alert */}
                  {limitError && (
                    <LimitReachedAlert
                      limitError={limitError}
                      onSignUp={() => {
                        setLimitError(null);
                        // Redirect to signup or open auth dialog
                        window.location.href = '/signup';
                      }}
                      onClose={() => setLimitError(null)}
                    />
                  )}
                  
                  <FileUploadStep onAnalyze={handleAnalyze} />
                </motion.div>
              )}

              {currentStep === 'analyzing' && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnalyzingStep message={analysisProgress} />
                </motion.div>
              )}

              {currentStep === 'results' && atsResults && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  <ResultsStep
                    results={atsResults}
                    onReset={handleReset}
                    resumeText={resumeText}
                    jobDescriptionText={jobDescriptionText}
                    // Pass down original file info for display
                    resumeFile={resumeFile}
                    jobDescriptionFile={jobDescriptionFile}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ATSCheckerPage;