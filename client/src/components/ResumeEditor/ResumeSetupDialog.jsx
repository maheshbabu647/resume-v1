import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Briefcase, 
  BarChart3, 
  Sparkles, 
  FileText, 
  PenTool,
  Upload,
  Type,
  FileUp,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import resumeParserService from '@/api/resumeParserServiceApi';

// --- Data Constants (Moved outside for clarity) ---

const PROFESSION_OPTIONS = [
  'Software Engineering', 'Data Science & Analytics', 'Digital Marketing',
  'Design & UI/UX', 'Product Management', 'Finance & Accounting',
  'Healthcare & Life Sciences', 'Human Resources', 'Education & Research',
  'Sales & Business Development'
];

const ROLE_SUGGESTIONS = {
  'Software Engineering': ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Software Engineer', 'DevOps Engineer', 'Cloud Engineer'],
  'Data Science & Analytics': ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'Business Intelligence Analyst', 'Data Engineer', 'Research Assistant'],
  'Digital Marketing': ['Digital Marketing Executive', 'SEO Specialist', 'Content Strategist', 'Social Media Manager', 'Performance Marketing Analyst'],
  'Design & UI/UX': ['UI/UX Designer', 'Product Designer', 'Graphic Designer', 'Visual Designer', 'Motion Graphics Designer'],
  'Product Management': ['Product Manager', 'Associate Product Manager', 'Technical Product Manager', 'Product Analyst'],
  'Finance & Accounting': ['Financial Analyst', 'Accountant', 'Investment Analyst', 'Tax Associate', 'Risk Analyst'],
  'Healthcare & Life Sciences': ['Medical Researcher', 'Clinical Data Analyst', 'Healthcare Administrator', 'Lab Technician'],
  'Human Resources': ['HR Executive', 'Talent Acquisition Specialist', 'HR Manager', 'Employee Engagement Specialist'],
  'Education & Research': ['Lecturer', 'Research Assistant', 'Academic Writer', 'Curriculum Developer'],
  'Sales & Business Development': ['Business Development Executive', 'Sales Representative', 'Key Account Manager', 'Inside Sales Executive']
};

const EXPERIENCE_LEVELS = ['Student / Intern', 'Fresher (0–1 yr)', 'Mid-Level (2–5 yrs)', 'Senior (5+ yrs)', 'Executive / Manager'];

const TONE_OPTIONS = [
  { value: 'Professional', description: 'Polished, neutral, and formal.', icon: Briefcase },
  { value: 'Confident', description: 'Strong, assertive, leadership-focused.', icon: BarChart3 },
  { value: 'Enthusiastic', description: 'Energetic and passionate tone.', icon: Sparkles },
  { value: 'Technical', description: 'Factual, detail-oriented, skill-focused.', icon: PenTool },
  { value: 'Impact-driven', description: 'Starts with measurable outcomes and results.', icon: FileText },
];

// --- Helper Components for a Cleaner Structure ---

const StepIndicator = ({ steps, currentStep }) => (
  <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 mb-4 sm:mb-6 px-1">
    {steps.map((step, index) => {
      const isCompleted = index < currentStep;
      const isCurrent = index === currentStep;
      return (
        <React.Fragment key={step.id}>
          <motion.div 
            className="flex flex-col items-center min-w-0"
            initial={false}
            animate={{ scale: isCurrent ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={`
                w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 text-xs sm:text-sm font-semibold shadow-sm
                ${isCompleted ? 'bg-gradient-to-br from-success to-success/80 text-success-foreground shadow-success/20' : ''}
                ${isCurrent ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary/30' : ''}
                ${!isCompleted && !isCurrent ? 'bg-muted/50 border-2 border-border text-muted-foreground' : ''}
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : index + 1}
            </motion.div>
            <p className={`mt-1 sm:mt-2 text-[10px] sm:text-xs text-center font-medium transition-colors duration-200 truncate max-w-[60px] sm:max-w-none ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
              {step.shortTitle}
            </p>
          </motion.div>
          {index < steps.length - 1 && (
            <motion.div 
              className={`flex-1 h-0.5 sm:h-1 rounded-full transition-all duration-300 ${isCompleted ? 'bg-gradient-to-r from-success to-success/60' : 'bg-muted/50'}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const OrSeparator = () => (
  <div className="relative my-4">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-card px-2 text-muted-foreground">Or</span>
    </div>
  </div>
);

// --- Main Dialog Component ---

const ResumeSetupDialog = ({ open, onOpenChange, onComplete, templateFieldDefinition }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [startMode, setStartMode] = useState(null); // 'scratch' or 'import'
  const [importMode, setImportMode] = useState('file'); // 'file' or 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const fileInputRef = useRef(null);
  
  const [setupData, setSetupData] = useState({
    profession_industry: '',
    experience_level: '',
    target_role: '',
    job_description: '',
    tone: ''
  });

  const cards = [
    { id: 'start_mode', title: 'How would you like to start?', shortTitle: 'Start', description: 'Choose your starting point.' },
    { id: 'profession', title: 'Select your professional domain', shortTitle: 'Domain', description: 'This sets the vocabulary for your resume.' },
    { id: 'experience', title: 'Choose your experience level', shortTitle: 'Level', description: 'This adjusts the complexity of achievements.' },
    { id: 'role', title: 'What is your target role?', shortTitle: 'Role', description: 'Your resume will be tailored for this role.' },
    { id: 'job_description', title: 'Paste the job description (optional)', shortTitle: 'Job Desc', description: 'Optimize keywords for Applicant Tracking Systems (ATS).' },
    { id: 'tone', title: 'Choose your resume\'s tone', shortTitle: 'Tone', description: 'This controls the style and voice of your writing.' }
  ];

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      // Complete setup
      const finalData = {
        ...setupData,
        importedResumeData: parsedData
      };
      onComplete(finalData);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleDataChange = (field, value) => {
    setSetupData(prev => ({ ...prev, [field]: value }));
    
    // ✨ IMPROVED: Even faster auto-progress on selection
    const autoProgressFields = ['profession_industry', 'experience_level', 'target_role', 'tone'];
    if (autoProgressFields.includes(field) && value && value.trim() !== '') {
      setTimeout(() => {
        if (currentCard < cards.length - 1) {
          setCurrentCard(currentCard + 1);
        }
      }, 250); // Faster transition for snappier feel
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!resumeParserService.isSupportedFileType(file)) {
        setParseError('Unsupported file type. Please upload PDF, DOCX, DOC, or TXT files.');
        return;
      }
      if (!resumeParserService.isFileSizeValid(file, 10)) {
        setParseError('File size too large. Please upload files smaller than 10MB.');
        return;
      }
      setSelectedFile(file);
      setParseError(null);
    }
  };

  const handleParseResume = async () => {
    setIsParsing(true);
    setParseError(null);
    
    try {
      // Create example schema from template field definitions
      let exampleSchema = null;
      if (templateFieldDefinition && templateFieldDefinition.length > 0) {
        // Import the utility function
        const { initializeFormDataFromDefinitions } = await import('@/utils/EditorUtils');
        const initializedData = initializeFormDataFromDefinitions(templateFieldDefinition, null);
        exampleSchema = initializedData.content || {};
        console.log('📋 Using initial form data as schema:', exampleSchema);
      }
      
      let result;
      
      if (importMode === 'file' && selectedFile) {
        result = await resumeParserService.parseResumeFromFile(selectedFile, exampleSchema);
      } else if (importMode === 'text' && resumeText.trim()) {
        result = await resumeParserService.parseResumeFromText(resumeText, exampleSchema);
      } else {
        setParseError('Please provide a file or text to parse.');
        setIsParsing(false);
        return;
      }
      
      if (result.success && result.data?.parsedResumeData) {
        setParsedData(result.data.parsedResumeData);
        setParseError(null);
        
        console.log('✅ Resume parsed successfully:', result.data.parsedResumeData);
        
        // User can now click "Continue to Editor" button when ready
      } else {
        setParseError(result.error || 'Failed to parse resume. Please try again.');
      }
    } catch (error) {
      console.error('Parse error:', error);
      setParseError('An error occurred while parsing your resume. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSkipToEditor = () => {
    // Skip remaining setup steps and go directly to editor with imported data
    const finalData = {
      profession_industry: setupData.profession_industry || 'General',
      experience_level: setupData.experience_level || 'Mid-Level (2–5 yrs)',
      target_role: setupData.target_role || 'Professional',
      job_description: setupData.job_description || '',
      tone: setupData.tone || 'Professional',
      importedResumeData: parsedData
    };
    console.log('⏭️ Skipping to editor with data:', finalData);
    onComplete(finalData);
  };

  const isCurrentCardValid = () => {
    const field = cards[currentCard].id;
    
    if (field === 'start_mode') {
      if (startMode === 'scratch') return true;
      if (startMode === 'import') {
        // Must have either parsed data or be in the process of importing
        return parsedData !== null;
      }
      return false;
    }
    
    // Map card ID to state key
    const stateKey = {
      profession: 'profession_industry',
      experience: 'experience_level',
      role: 'target_role',
      job_description: 'job_description',
      tone: 'tone'
    }[field];
    
    if (field === 'job_description') return true; // Optional field
    return setupData[stateKey] && setupData[stateKey].trim() !== '';
  };
  
  const renderCardContent = () => {
    const currentCardData = cards[currentCard];
    
    switch (currentCardData.id) {
      case 'start_mode':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 h-full overflow-hidden group ${
                    startMode === 'scratch' 
                      ? 'border-primary ring-2 ring-primary/50 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg shadow-primary/10' 
                      : 'hover:bg-muted/30 hover:shadow-lg hover:border-primary/30'
                  }`}
                  onClick={() => {
                    setStartMode('scratch');
                    setParsedData(null);
                    setTimeout(() => handleNext(), 250);
                  }}
                >
                  <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                      startMode === 'scratch' 
                        ? 'bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20' 
                        : 'bg-primary/10 group-hover:bg-primary/20'
                    }`}>
                      <PenTool className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-200 ${
                        startMode === 'scratch' ? 'text-primary-foreground' : 'text-primary'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Start from Scratch</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Build your resume from the ground up with our guided process
                      </p>
                    </div>
                    {startMode === 'scratch' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2, type: "spring" }}
                      >
                        <Check className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 h-full overflow-hidden group ${
                    startMode === 'import' 
                      ? 'border-accent-purple ring-2 ring-accent-purple/50 bg-gradient-to-br from-accent-purple/10 via-accent-purple/5 to-transparent shadow-lg shadow-accent-purple/10' 
                      : 'hover:bg-muted/30 hover:shadow-lg hover:border-accent-purple/30'
                  }`}
                  onClick={() => setStartMode('import')}
                >
                  <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                      startMode === 'import' 
                        ? 'bg-gradient-to-br from-accent-purple to-accent-purple/80 shadow-lg shadow-accent-purple/20' 
                        : 'bg-accent-purple/10 group-hover:bg-accent-purple/20'
                    }`}>
                      <Upload className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-200 ${
                        startMode === 'import' ? 'text-white' : 'text-accent-purple'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Import Existing Resume</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Upload your current resume and we'll help you improve it
                      </p>
                    </div>
                    {startMode === 'import' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2, type: "spring" }}
                      >
                        <Check className="h-5 w-5 sm:h-6 sm:w-6 text-accent-purple" />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Import Resume Section */}
            <AnimatePresence>
              {startMode === 'import' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 sm:mt-6"
                >
                  <Card className="border-2 border-dashed border-accent-purple/30 bg-gradient-to-br from-accent-purple/5 to-transparent">
                    <CardContent className="p-4 sm:p-6">
                      <Tabs value={importMode} onValueChange={setImportMode}>
                        <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4 h-9 sm:h-10">
                          <TabsTrigger value="file" className="text-xs sm:text-sm">
                            <FileUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Upload File</span>
                            <span className="sm:hidden">File</span>
                          </TabsTrigger>
                          <TabsTrigger value="text" className="text-xs sm:text-sm">
                            <Type className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Paste Text</span>
                            <span className="sm:hidden">Text</span>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="file" className="space-y-3 sm:space-y-4 mt-0">
                          <div>
                            <Label htmlFor="resume-file" className="text-xs sm:text-sm">Upload your resume</Label>
                            <Input
                              id="resume-file"
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,.docx,.doc,.txt"
                              onChange={handleFileChange}
                              className="mt-1 sm:mt-2 text-xs sm:text-sm cursor-pointer"
                            />
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 sm:mt-2">
                              Supported: PDF, DOCX, DOC, TXT (Max 10MB)
                            </p>
                          </div>
                          
                          {selectedFile && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gradient-to-r from-success/10 to-success/5 p-3 rounded-lg border border-success/20"
                            >
                              <p className="text-xs sm:text-sm font-medium text-success flex items-center gap-2">
                                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                                {selectedFile.name}
                              </p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                                {resumeParserService.formatFileSize(selectedFile.size)}
                              </p>
                            </motion.div>
                          )}
                        </TabsContent>

                        <TabsContent value="text" className="space-y-3 sm:space-y-4 mt-0">
                          <div>
                            <Label htmlFor="resume-text" className="text-xs sm:text-sm">Paste your resume content</Label>
                            <Textarea
                              id="resume-text"
                              placeholder="Paste your resume text here..."
                              value={resumeText}
                              onChange={(e) => setResumeText(e.target.value)}
                              className="mt-1 sm:mt-2 min-h-[150px] sm:min-h-[200px] text-xs sm:text-sm resize-none"
                            />
                          </div>
                        </TabsContent>
                      </Tabs>

                      {parseError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Alert variant="destructive" className="mt-3 sm:mt-4">
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            <AlertDescription className="text-xs sm:text-sm">{parseError}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}

                      {parsedData && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Alert className="mt-3 sm:mt-4 bg-gradient-to-r from-success/10 to-success/5 border-success shadow-lg">
                            <Check className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
                            <AlertDescription>
                              <div className="space-y-3">
                                <div className="flex items-start gap-2 sm:gap-3">
                                  <div className="flex-1">
                                    <span className="text-xs sm:text-sm font-semibold text-success block">✅ Resume imported successfully!</span>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                                      Your resume has been parsed and is ready to edit.
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  onClick={handleSkipToEditor}
                                  className="w-full h-10 sm:h-11 bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white shadow-md hover:shadow-lg transition-all"
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Continue to Editor
                                </Button>
                              </div>
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}

                      <Button
                        onClick={handleParseResume}
                        disabled={isParsing || (!selectedFile && !resumeText.trim()) || parsedData !== null}
                        className="w-full mt-3 sm:mt-4 h-10 sm:h-11 text-sm sm:text-base shadow-md"
                      >
                        {isParsing ? (
                          <>
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
                            Parsing Resume...
                          </>
                        ) : parsedData ? (
                          <>
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Resume Imported
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Parse Resume with AI
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 'profession':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {PROFESSION_OPTIONS.map((option) => (
                <motion.div 
                  key={option} 
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-150 h-full overflow-hidden ${
                      setupData.profession_industry === option 
                        ? 'border-primary ring-2 ring-primary/40 bg-gradient-to-r from-primary/10 to-primary/5 shadow-md shadow-primary/10' 
                        : 'hover:bg-muted/40 hover:shadow-md hover:border-primary/20'
                    }`}
                    onClick={() => handleDataChange('profession_industry', option)}
                  >
                    <CardContent className="p-3 sm:p-4 flex items-center justify-between">
                      <span className="font-medium text-xs sm:text-sm">{option}</span>
                      {setupData.profession_industry === option && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.2, type: "spring" }}
                        >
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <OrSeparator />
            <div>
              <Label htmlFor="custom-profession" className="text-xs sm:text-sm font-normal text-muted-foreground">Enter a custom profession</Label>
              <Input
                id="custom-profession"
                placeholder="e.g., Blockchain Development"
                value={!PROFESSION_OPTIONS.includes(setupData.profession_industry) ? setupData.profession_industry : ''}
                onChange={(e) => setSetupData(prev => ({ ...prev, profession_industry: e.target.value }))}
                onBlur={(e) => e.target.value.trim() && handleDataChange('profession_industry', e.target.value.trim())}
                className="mt-1 sm:mt-2"
              />
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {EXPERIENCE_LEVELS.map((level) => (
              <motion.div 
                key={level} 
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-150 overflow-hidden ${
                    setupData.experience_level === level 
                      ? 'border-primary ring-2 ring-primary/40 bg-gradient-to-r from-primary/10 to-primary/5 shadow-md shadow-primary/10' 
                      : 'hover:bg-muted/40 hover:shadow-md hover:border-primary/20'
                  }`}
                  onClick={() => handleDataChange('experience_level', level)}
                >
                  <CardContent className="p-3 sm:p-4 flex items-center justify-between">
                    <span className="font-medium text-sm sm:text-base">{level}</span>
                    {setupData.experience_level === level && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.2, type: "spring" }}
                      >
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        );

      case 'role':
        const suggestions = ROLE_SUGGESTIONS[setupData.profession_industry] || [];
        return (
          <div className="space-y-3">
            {setupData.profession_industry ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {suggestions.map((role) => (
                    <motion.div 
                      key={role} 
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-150 h-full overflow-hidden ${
                          setupData.target_role === role 
                            ? 'border-primary ring-2 ring-primary/40 bg-gradient-to-r from-primary/10 to-primary/5 shadow-md shadow-primary/10' 
                            : 'hover:bg-muted/40 hover:shadow-md hover:border-primary/20'
                        }`}
                        onClick={() => handleDataChange('target_role', role)}
                      >
                        <CardContent className="p-3 sm:p-4 flex items-center justify-between">
                          <span className="font-medium text-xs sm:text-sm">{role}</span>
                          {setupData.target_role === role && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ duration: 0.2, type: "spring" }}
                            >
                              <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                <OrSeparator />
                <div>
                  <Label htmlFor="custom-role" className="text-xs sm:text-sm font-normal text-muted-foreground">Enter a custom role</Label>
                  <Input
                    id="custom-role"
                    placeholder="e.g., Growth Hacker"
                    value={!suggestions.includes(setupData.target_role) ? setupData.target_role : ''}
                    onChange={(e) => setSetupData(prev => ({ ...prev, target_role: e.target.value }))}
                    onBlur={(e) => e.target.value.trim() && handleDataChange('target_role', e.target.value.trim())}
                    className="mt-1 sm:mt-2"
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-6 sm:py-8 text-sm text-muted-foreground">
                Please select your profession first to see role suggestions.
              </div>
            )}
          </div>
        );

      case 'job_description':
        return (
          <div className="space-y-3 sm:space-y-4">
            <Label htmlFor="job-description" className="text-sm sm:text-base">Job Description (Optional)</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here to optimize keywords for ATS..."
              value={setupData.job_description}
              onChange={(e) => handleDataChange('job_description', e.target.value)}
              className="min-h-[120px] sm:min-h-[150px] focus-visible:ring-primary/50 text-sm sm:text-base resize-none"
            />
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                onClick={() => handleNext()}
                className="text-xs sm:text-sm"
              >
                Skip this step →
              </Button>
            </div>
          </div>
        );

      case 'tone':
        return (
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {TONE_OPTIONS.map((tone) => (
              <motion.div 
                key={tone.value} 
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-150 overflow-hidden ${
                    setupData.tone === tone.value 
                      ? 'border-primary ring-2 ring-primary/40 bg-gradient-to-r from-primary/10 to-primary/5 shadow-md shadow-primary/10' 
                      : 'hover:bg-muted/40 hover:shadow-md hover:border-primary/20'
                  }`}
                  onClick={() => handleDataChange('tone', tone.value)}
                >
                  <CardContent className="p-3 sm:p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                        setupData.tone === tone.value 
                          ? 'bg-primary/20' 
                          : 'bg-primary/10'
                      }`}>
                        <tone.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm sm:text-base">{tone.value}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{tone.description}</div>
                      </div>
                    </div>
                    {setupData.tone === tone.value && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.2, type: "spring" }}
                        className="flex-shrink-0"
                      >
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ✨ IMPROVED: Responsive width and flexible height */}
      <DialogContent className="sm:max-w-3xl w-[96vw] sm:w-[90vw] max-h-[92vh] sm:max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="text-center px-4 sm:px-6 pt-5 sm:pt-6 pb-2 sm:pb-3 border-b bg-gradient-to-b from-muted/30 to-transparent">
          <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">
            Let's Personalize Your Resume
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Just a few steps to tailor your resume for success.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden p-4 sm:p-6">
          {/* ✨ Visual Step Indicator */}
          <StepIndicator steps={cards} currentStep={currentCard} />

          {/* Card content area with smooth & fast transitions */}
          <div className="flex-1 overflow-y-auto px-1 -mx-1 pb-3 sm:pb-4 scrollbar-thin">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="bg-gradient-to-br from-card via-card to-muted/10 p-4 sm:p-6 rounded-xl shadow-sm border border-border/50">
                    <h3 className="text-base sm:text-lg font-semibold mb-1">{cards[currentCard].title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">{cards[currentCard].description}</p>
                    {renderCardContent()}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 pt-3 sm:pt-4 mt-auto border-t"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentCard === 0}
              className="flex items-center justify-center gap-2 order-2 sm:order-1 h-10 sm:h-auto"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-sm sm:text-base">Back</span>
            </Button>
            
            <span className="text-xs sm:text-sm text-muted-foreground text-center order-1 sm:order-2 font-medium">
              Step {currentCard + 1} of {cards.length}
            </span>

            <Button
              onClick={handleNext}
              disabled={!isCurrentCardValid()}
              className={`flex items-center justify-center gap-2 order-3 h-10 sm:h-auto transition-all duration-200 ${
                currentCard === cards.length - 1 
                ? 'bg-gradient-to-r from-success to-success/80 text-success-foreground hover:from-success/90 hover:to-success/70 shadow-lg shadow-success/20' 
                : 'shadow-md shadow-primary/10'
              }`}
            >
              {currentCard === cards.length - 1 ? (
                <>
                  <span className="text-sm sm:text-base font-semibold">Complete Setup</span>
                  <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                </>
              ) : (
                <>
                  <span className="text-sm sm:text-base">Next</span>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeSetupDialog;
