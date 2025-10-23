import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, Clipboard, Check, AlertCircle, Save, ArrowLeft, Download, FileText, Target, Zap, LogIn } from 'lucide-react';
import { generateCoverLetter, saveCoverLetter } from '@/api/coverLetterServiceApi';
import useAuthContext from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AuthDialog from '@/components/Auth/AuthDialog';

const CoverLetterGeneratorPage = () => {
  const { userData, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    userName: userData?.userName || '',
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    userSkills: '',
  });
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      console.log('User not authenticated, showing auth dialog');
      setShowAuthDialog(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedLetter('');
    
    try {
      const response = await generateCoverLetter(formData);
      setGeneratedLetter(response.coverLetterContent);
    } catch (err) {
      console.error('Cover letter generation error:', err);
      
      // Check if it's an authentication error
      if (err.response?.status === 401 || err.message?.includes('authorization') || err.message?.includes('token')) {
        console.log('Authentication error detected, showing auth dialog');
        setShowAuthDialog(true);
        setError('Please sign in to generate cover letters.');
      } else {
        setError(err.message || 'Failed to generate cover letter. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      console.log('User not authenticated, showing auth dialog');
      setShowAuthDialog(true);
      return;
    }

    setIsSaving(true);
    setError(null);
    
    try {
      const payload = {
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        coverLetterContent: generatedLetter,
        originalInputs: {
          jobDescription: formData.jobDescription,
          userSkills: formData.userSkills,
        }
      };
      await saveCoverLetter(payload);
      navigate('/dashboard'); // Redirect to the dashboard after saving
    } catch (err) {
      console.error('Cover letter save error:', err);
      
      // Check if it's an authentication error
      if (err.response?.status === 401 || err.message?.includes('authorization') || err.message?.includes('token')) {
        console.log('Authentication error detected, showing auth dialog');
        setShowAuthDialog(true);
        setError('Please sign in to save cover letters.');
      } else {
        setError(err.message || 'Failed to save the cover letter.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    const textArea = document.createElement('textarea');
    textArea.value = generatedLetter;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  };

  const handleDownload = () => {
    if (!generatedLetter) return;
    
    // Create filename with company and job title
    const fileName = formData.companyName && formData.jobTitle
      ? `${formData.companyName}_${formData.jobTitle}_Cover_Letter.txt`.replace(/\s+/g, '_')
      : 'Cover_Letter.txt';
    
    // Create blob and download
    const blob = new Blob([generatedLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveFormDataBeforeOAuth = () => {
    // Save form data to localStorage before OAuth redirect
    try {
      const formDataToSave = {
        ...formData,
        timestamp: Date.now()
      };
      console.log('💾 Saving cover letter form data before OAuth redirect:', formDataToSave);
      localStorage.setItem('cover_letter_form_data', JSON.stringify(formDataToSave));
      console.log('✅ Form data saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save form data to localStorage:', error);
    }
  };

  const handleAuthSuccess = () => {
    console.log('Authentication successful');
    setShowAuthDialog(false);
    setError(null);
    // User can now retry the action
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

  // Restore form data after OAuth redirect
  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem('cover_letter_form_data');
      if (savedData) {
        console.log('🔄 Found saved form data, restoring...');
        const parsedData = JSON.parse(savedData);
        
        // Check if data is not too old (within 1 hour)
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - parsedData.timestamp < oneHour) {
          console.log('✅ Restoring form data:', parsedData);
          
          // Restore the form data (excluding timestamp)
          const { timestamp, ...restoredFormData } = parsedData;
          setFormData(prevData => ({
            ...prevData,
            ...restoredFormData
          }));
          
          console.log('✅ Form data restored successfully');
          
          // Clear the saved data after restoring
          localStorage.removeItem('cover_letter_form_data');
        } else {
          console.log('⏰ Saved data is too old, removing...');
          localStorage.removeItem('cover_letter_form_data');
        }
      }
    } catch (error) {
      console.error('❌ Failed to restore form data:', error);
      localStorage.removeItem('cover_letter_form_data');
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>AI Cover Letter Generator | CareerForge</title>
      </Helmet>
      
      {/* Standardized section padding */}
      <div className="min-h-screen bg-background py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="text-center space-y-6">
              {/* Back Button */}
              <div className="flex justify-start">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/dashboard')} 
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </div>

              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2"
                whileHover={{ scale: 1.05 }}
              >
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  AI-Powered Cover Letters
                </span>
              </motion.div>

              {/* Standardized H1 */}
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Create Your Perfect
                <span className="block bg-gradient-to-r from-primary via-accent-purple to-accent-pink bg-clip-text text-transparent">
                  Cover Letter in Minutes
                </span>
              </h1>

              {/* Standardized Lead Paragraph */}
              <p className="text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto">
                Stand out from the crowd with a professionally crafted, AI-generated cover letter 
                tailored to your dream job.
              </p>

              {/* Value Props */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4">
                <Card className="bg-card border border-border">
                  <CardContent className="p-6 text-center">
                    <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-1">AI-Generated</h3>
                    <p className="text-sm text-muted-foreground">
                      Intelligent content tailored to each job
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-8 h-8 text-accent-purple mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-1">Lightning Fast</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate in seconds, not hours
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card border border-border">
                  <CardContent className="p-6 text-center">
                    <Target className="w-8 h-8 text-success mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-1">Job-Specific</h3>
                    <p className="text-sm text-muted-foreground">
                      Matched to your target position
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Left Column - Input Form */}
              <motion.div variants={itemVariants}>
                <Card className="border-2 border-border shadow-lg">
                  <CardHeader className="space-y-2 p-4 sm:p-6">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        1
                      </div>
                      <CardTitle className="text-xl sm:text-2xl">Provide Job Details</CardTitle>
                    </div>
                    <CardDescription className="text-sm sm:text-base">
                      Fill out the form below to generate your personalized cover letter.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <form onSubmit={handleGenerate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="userName" className="text-sm font-medium">
                          Your Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="userName" 
                          name="userName" 
                          value={formData.userName} 
                          onChange={handleChange} 
                          required 
                          placeholder="John Doe"
                          className="h-10"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName" className="text-sm font-medium">
                            Company Name <span className="text-destructive">*</span>
                          </Label>
                          <Input 
                            id="companyName" 
                            name="companyName" 
                            value={formData.companyName} 
                            onChange={handleChange} 
                            required 
                            placeholder="Google"
                            className="h-10"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="jobTitle" className="text-sm font-medium">
                            Job Title <span className="text-destructive">*</span>
                          </Label>
                          <Input 
                            id="jobTitle" 
                            name="jobTitle" 
                            value={formData.jobTitle} 
                            onChange={handleChange} 
                            required 
                            placeholder="Software Engineer"
                            className="h-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="userSkills" className="text-sm font-medium">
                          Your Top Skills <span className="text-destructive">*</span>
                        </Label>
                        <Input 
                          id="userSkills" 
                          name="userSkills" 
                          value={formData.userSkills} 
                          onChange={handleChange} 
                          required 
                          placeholder="React, Node.js, Python, Leadership"
                          className="h-10"
                        />
                        <p className="text-xs text-muted-foreground">
                          Comma-separated list of your most relevant skills
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="jobDescription" className="text-sm font-medium">
                          Job Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea 
                          id="jobDescription" 
                          name="jobDescription" 
                          value={formData.jobDescription} 
                          onChange={handleChange} 
                          required 
                          rows={8}
                          placeholder="Paste the complete job description here..."
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          Include responsibilities, requirements, and desired qualifications
                        </p>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full h-11 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Generating Your Letter...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Generate Cover Letter
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right Column - Generated Letter */}
              <motion.div 
                variants={itemVariants}
                className="lg:sticky lg:top-24"
              >
                <Card className="border-2 border-border shadow-lg">
                  <CardHeader className="space-y-2 p-4 sm:p-6">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        2
                      </div>
                      <CardTitle className="text-xl sm:text-2xl">Review & Export</CardTitle>
                    </div>
                    <CardDescription className="text-sm sm:text-base">
                      Edit your cover letter and export when ready.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                    {/* Generated Letter Textarea */}
                    <Textarea 
                      value={generatedLetter} 
                      onChange={(e) => setGeneratedLetter(e.target.value)}
                      className="bg-muted/50 min-h-[400px] sm:min-h-[500px] text-sm leading-relaxed font-mono resize-none"
                      placeholder="Your AI-generated cover letter will appear here. You can edit it before downloading or saving."
                    />

                    {/* Error Alert */}
                    {error && (
                      <Alert variant={error.includes('sign in') ? 'default' : 'destructive'} className={error.includes('sign in') ? 'border-primary/50 bg-primary/5' : ''}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{error.includes('sign in') ? 'Authentication Required' : 'Error'}</AlertTitle>
                        <AlertDescription className="flex items-center justify-between gap-2">
                          <span>{error}</span>
                          {error.includes('sign in') && (
                            <Button 
                              size="sm" 
                              onClick={() => setShowAuthDialog(true)}
                              className="ml-2"
                            >
                              <LogIn className="h-3 w-3 mr-1" />
                              Sign In
                            </Button>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      {/* Primary Actions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button 
                          onClick={handleSave} 
                          disabled={!generatedLetter || isSaving} 
                          className="h-11"
                          size="lg"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save to Dashboard
                            </>
                          )}
                        </Button>

                        <Button 
                          variant="outline" 
                          onClick={handleDownload} 
                          disabled={!generatedLetter}
                          className="h-11 border-2"
                          size="lg"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download TXT
                        </Button>
                      </div>

                      {/* Secondary Action */}
                      <Button 
                        variant="outline" 
                        onClick={handleCopy} 
                        disabled={!generatedLetter || isCopied}
                        className="h-11 w-full border-2"
                        size="lg"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-4 w-4 mr-2 text-success" />
                            Copied to Clipboard!
                          </>
                        ) : (
                          <>
                            <Clipboard className="h-4 w-4 mr-2" />
                            Copy to Clipboard
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Helper Text */}
                    {generatedLetter && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        {generatedLetter.length} characters • {Math.ceil(generatedLetter.split(' ').length / 200)} min read
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Authentication Dialog */}
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        onSuccess={handleAuthSuccess}
        onSaveFormData={handleSaveFormDataBeforeOAuth}
      />
    </>
  );
};

export default CoverLetterGeneratorPage;
