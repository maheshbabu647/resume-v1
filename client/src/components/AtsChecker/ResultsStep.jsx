// @/components/ATSCheckerPage/ResultsStep.jsx

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Target,
  CheckCircle,
  AlertCircle,
  Award,
  Loader2,
  FileText,
} from 'lucide-react';
import TemplateCard from '@/components/Template/TemplateCard';
import { getAllTemplates } from '@/api/templateServiceApi.js';
import atsScoreService from '@/api/atsScoreServiceApi.js';
import { cn } from '@/lib/utils';
import useAuthContext from '@/hooks/useAuth';
import AuthDialog from '@/components/Auth/AuthDialog';
import LimitReachedAlert from '@/components/Common/LimitReachedAlert';

// Re-usable component for the keyword/skill lists
const MatchList = ({ title, score, matched, missing, icon: Icon, color }) => (
  <Card className="border border-border">
    <CardHeader className="p-4 sm:p-6">
      <CardTitle className="text-base sm:text-lg flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 min-w-0">
          <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0', color)} />
          <span className="truncate">{title}</span>
        </span>
        <Badge variant="outline" className="text-sm sm:text-base font-bold flex-shrink-0">
          {score}%
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 p-4 sm:p-6">
      {missing.length > 0 && (
        <div>
          <h4 className="text-sm sm:text-base font-semibold text-destructive mb-2 flex items-center gap-2">
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            Missing ({missing.length})
          </h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {missing.slice(0, 15).map((item, index) => (
              <Badge key={index} variant="destructive" className="text-xs sm:text-sm">
                {item}
              </Badge>
            ))}
            {missing.length > 15 && (
              <Badge variant="outline" className="text-xs sm:text-sm">+{missing.length - 15} more</Badge>
            )}
          </div>
        </div>
      )}
      {matched.length > 0 && (
        <div>
          <h4 className="text-sm sm:text-base font-semibold text-success mb-2 flex items-center gap-2">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            Matched ({matched.length})
          </h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {matched.slice(0, 10).map((item, index) => (
              <Badge key={index} variant="success" className="text-xs sm:text-sm">
                {item}
              </Badge>
            ))}
            {matched.length > 10 && (
              <Badge variant="outline" className="text-xs sm:text-sm">+{matched.length - 10} more</Badge>
            )}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

// Re-usable component for suggestions/strengths/etc.
const FeedbackList = ({ title, items, icon: Icon, color }) => (
  <Card className="border border-border">
    <CardHeader className="p-4 sm:p-6">
      <CardTitle className={cn('text-sm sm:text-base font-semibold flex items-center gap-2', color)}>
        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 sm:p-6">
      <ul className="space-y-2">
        {items.slice(0, 5).map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
            <ChevronRight className={cn('w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0', color)} />
            <span className="text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const ResultsStep = ({ results, onReset, resumeFile, jobDescriptionFile, resumeText, jobDescriptionText }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [limitError, setLimitError] = useState(null); // For displaying limit errors
  const { atsScore, scoreInterpretation, keywordMatch, skillsMatch, suggestions, strengths, improvements } = results;

  const sortedTemplates = useMemo(() => {
    if (!Array.isArray(templates)) return [];
    return [...templates].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateA - dateB; // oldest first
    });
  }, [templates]);

  const handleGetOptimizedResume = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      console.log('User not authenticated, showing auth dialog');
      setShowAuthDialog(true);
      return;
    }

    // User is authenticated, proceed with loading templates
    console.log('User authenticated, loading templates');
    loadTemplatesAndProceed();
  };

  const loadTemplatesAndProceed = async () => {
    setShowTemplateSelection(true);
    setIsLoadingTemplates(true);
    try {
      const response = await getAllTemplates();
      const templatesList = Array.isArray(response) ? response : (response.templates || response.data || []);
      setTemplates(templatesList);
      if (templatesList.length === 0) {
        alert('No templates available. Please contact support.');
        setShowTemplateSelection(false);
      }
    } catch (error) {
      alert(`Failed to load templates: ${error.message || 'Unknown error'}.`);
      setShowTemplateSelection(false);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const handleAuthSuccess = async () => {
    console.log('Authentication successful, proceeding with optimization');
    setShowAuthDialog(false);
    // After successful authentication, load templates and proceed
    loadTemplatesAndProceed();
  };

  const handleSaveDataBeforeOAuth = () => {
    // Save ATS data to localStorage before OAuth redirect
    try {
      const atsDataToSave = {
        resumeText,
        jobDescriptionText,
        atsResults: results,
        resumeFileName: resumeFile?.name,
        jobDescFileName: jobDescriptionFile?.name,
        timestamp: Date.now()
      };
      console.log('💾 Saving ATS data before OAuth redirect:', atsDataToSave);
      localStorage.setItem('ats_optimization_data', JSON.stringify(atsDataToSave));
      console.log('✅ ATS data saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save ATS data to localStorage:', error);
    }
  };

  const handleTemplateSelect = async (template) => {
    setIsOptimizing(true);
    try {
      if (!resumeText || !jobDescriptionText || !results) {
        throw new Error('Missing required data. Please run the analysis again.');
      }

      const optimizationResult = await atsScoreService.generateOptimizedResume(
        resumeText,
        jobDescriptionText,
        results,
        template.templateFieldDefinition
      );

      if (optimizationResult.success && optimizationResult.data) {
        // Clear saved ATS data from localStorage since we're proceeding to editor
        console.log('🧹 Clearing saved ATS data from localStorage');
        localStorage.removeItem('ats_optimization_data');
        
        navigate(`/resume/new/${template._id}`, {
          state: {
            mode: 'ats-optimize',
            optimizedResumeData: { content: optimizationResult.data, sectionsConfig: {} },
            atsResults: results,
            jobDescription: jobDescriptionText,
            skipSetupDialog: true,
            resumeText: resumeText
          }
        });
      } else {
        // Check if it's a limit error
        if (optimizationResult.isLimitError && optimizationResult.limitError) {
          setLimitError(optimizationResult.limitError);
        } else {
          throw new Error(optimizationResult.error || 'Failed to generate optimized resume');
        }
      }
    } catch (error) {
      // Check if error has limit error data
      if (error.isLimitError && error.limitError) {
        setLimitError(error.limitError);
      } else {
        alert(`Failed to optimize resume: ${error.message}. Please try again.`);
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Limit Error Alert */}
        {limitError && (
          <LimitReachedAlert
            limitError={limitError}
            onSignUp={() => {
              setLimitError(null);
              setShowAuthDialog(true);
            }}
            onClose={() => setLimitError(null)}
          />
        )}

        {/* Files Info Card */}
        <Card className="bg-muted/30 border border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              {/* File names - responsive layout */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm min-w-0 flex-1">
                <span className="font-medium text-foreground truncate">
                  📄 {resumeFile.name}
                </span>
                <span className="text-muted-foreground hidden sm:inline">vs</span>
                <span className="font-medium text-foreground truncate">
                  🎯 {jobDescriptionFile.name}
                </span>
              </div>
              {/* Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onReset}
                className="w-full sm:w-auto flex-shrink-0"
              >
                Start New Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

      {/* Tabbed Results Interface */}
      <Tabs defaultValue="score" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="score" className="text-xs sm:text-sm">
            <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Score & Optimize</span>
            <span className="sm:hidden">Score</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="text-xs sm:text-sm">
            <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Detailed Analysis</span>
            <span className="sm:hidden">Details</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SCORE & OPTIMIZE (The Default View) */}
        <TabsContent value="score" className="pt-6">
          <Card className="border-2 border-border shadow-xl rounded-2xl">
            <CardContent className="text-center space-y-6 p-6 sm:p-10">
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold text-muted-foreground">Your ATS Score</h3>
                <div className="text-6xl sm:text-7xl lg:text-8xl font-black text-primary drop-shadow-lg">
                  {atsScore}
                  <span className="text-3xl sm:text-4xl lg:text-5xl text-muted-foreground">/100</span>
                </div>
                <Badge
                  className={`text-sm sm:text-lg font-bold px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border-2 ${scoreInterpretation.bgColor} ${scoreInterpretation.textColor} ${scoreInterpretation.borderColor}`}
                >
                  {scoreInterpretation.level}
                </Badge>
                <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto pt-2 px-4">
                  {scoreInterpretation.description}
                </p>
              </div>

              <div className="max-w-md mx-auto px-4">
                <Progress value={atsScore} className="h-2 sm:h-3" />
              </div>

              {/* CTA & Template Selection - This is the key flow */}
              <AnimatePresence>
                {isOptimizing ? (
                  <motion.div
                    key="optimizing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium">Optimizing your resume with AI...</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This may take a moment...
                    </p>
                  </motion.div>
                ) : showTemplateSelection ? (
                  <motion.div
                    key="templates"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 pt-6"
                  >
                    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
                      <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-xl sm:text-2xl text-center flex items-center justify-center gap-2 sm:gap-3">
                          <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
                          Choose Your Template
                        </CardTitle>
                        <CardDescription className="text-center text-sm sm:text-base px-2">
                          We'll automatically fill it with your optimized resume
                          content.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6">
                        {isLoadingTemplates ? (
                          <div className="text-center py-12">
                            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                            <p className="text-lg font-medium">Loading templates...</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full">
                            {sortedTemplates.map((template, index) => (
                              <motion.div key={template._id} whileHover={{ y: -5 }} layout className="w-full">
                                <TemplateCard template={template} isFirstTemplate={index === 0} onSelect={handleTemplateSelect} />
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cta"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="pt-4 sm:pt-6"
                  >
                    <div className="bg-gradient-to-r from-primary to-accent-purple p-6 sm:p-8 rounded-2xl shadow-2xl">
                      <Award className="w-12 h-12 sm:w-16 sm:h-16 text-white mx-auto mb-3 sm:mb-4" />
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Let's Fix That!
                      </h3>
                      <p className="text-white/90 mb-4 sm:mb-6 text-base sm:text-lg">
                        Get an ATS-optimized resume in one click.
                      </p>
                      <Button
                        onClick={handleGetOptimizedResume}
                        size="lg"
                        variant="secondary"
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 text-sm sm:text-base font-bold rounded-xl shadow-xl hover:scale-105 transition-transform"
                      >
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span className="hidden sm:inline">Get Your Optimized Resume</span>
                        <span className="sm:hidden">Get Optimized Resume</span>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: DETAILED ANALYSIS (Hidden by Default) */}
        <TabsContent value="details" className="pt-4 sm:pt-6 space-y-4 sm:space-y-6">
          {/* Keyword & Skills Match */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <MatchList
              title="Keyword Match"
              score={keywordMatch.score}
              matched={keywordMatch.matchedKeywords}
              missing={keywordMatch.missingKeywords}
              icon={Target}
              color="text-primary"
            />
            <MatchList
              title="Skills Match"
              score={skillsMatch.score}
              matched={skillsMatch.matchedSkills}
              missing={skillsMatch.missingSkills}
              icon={Sparkles}
              color="text-accent-purple"
            />
          </div>

          {/* Suggestions, Strengths, and Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <FeedbackList
              title="Suggestions"
              items={suggestions}
              icon={Sparkles}
              color="text-blue-500"
            />
            <FeedbackList
              title="Strengths"
              items={strengths}
              icon={CheckCircle}
              color="text-success"
            />
            <FeedbackList
              title="Improvements"
              items={improvements}
              icon={AlertCircle}
              color="text-destructive"
            />
          </div>
        </TabsContent>
      </Tabs>
      </div>

      {/* Authentication Dialog */}
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        onSuccess={handleAuthSuccess}
        onSaveFormData={handleSaveDataBeforeOAuth}
      />
    </>
  );
};

export default ResultsStep;