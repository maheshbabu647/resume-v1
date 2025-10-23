import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, Clipboard, Check, AlertCircle, Save, Download, LogIn } from 'lucide-react';
import { generateCoverLetter, saveCoverLetter } from '@/api/coverLetterServiceApi';
import useAuthContext from '@/hooks/useAuth';
import { useCoverLetterContext } from '@/context/CoverLetterContext';
import AuthDialog from '@/components/Auth/AuthDialog';

const CoverLetterGenerator = ({ onLetterSaved }) => {
  const { userData, isAuthenticated } = useAuthContext();
  
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
      if(onLetterSaved) {
        onLetterSaved();
      }
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
      ? `${formData.companyName} - ${formData.jobTitle} - Cover Letter.txt`
      : 'Cover Letter.txt';
    
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Card>
            <CardHeader>
            <CardTitle>1. Provide Job Details</CardTitle>
            <CardDescription>Fill out the form to generate your letter.</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="userName">Your Full Name</Label>
                    <Input id="userName" name="userName" value={formData.userName} onChange={handleChange} required />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required placeholder="e.g., Google" />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required placeholder="e.g., Software Engineer" />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="userSkills">Your Top Skills</Label>
                    <Input id="userSkills" name="userSkills" value={formData.userSkills} onChange={handleChange} required placeholder="e.g., Project Management, React, SQL"/>
                    <p className="text-xs text-muted-foreground">Provide a comma-separated list of your most relevant skills.</p>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea id="jobDescription" name="jobDescription" value={formData.jobDescription} onChange={handleChange} required rows={8} placeholder="Paste the full job description here..."/>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="mr-2 h-4 w-4" />Generate Letter</>}
                </Button>
            </form>
            </CardContent>
        </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-24">
        <Card>
            <CardHeader>
            <CardTitle>2. Review & Save Your Letter</CardTitle>
            <CardDescription>Edit the generated text here before saving.</CardDescription>
            </CardHeader>
            <CardContent>
            <Textarea 
                value={generatedLetter} 
                onChange={(e) => setGeneratedLetter(e.target.value)}
                className="bg-muted/50 min-h-[400px] text-sm leading-relaxed"
                rows={20}
                placeholder="Your AI-generated cover letter will appear here."
            />
            {error && (
              <Alert variant={error.includes('sign in') ? 'default' : 'destructive'} className={error.includes('sign in') ? 'mt-4 border-primary/50 bg-primary/5' : 'mt-4'}>
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
            <div className="flex flex-col gap-2 mt-4">
                <Button onClick={handleSave} disabled={!generatedLetter || isSaving} className="w-full">
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Letter</>}
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDownload} disabled={!generatedLetter} className="flex-1">
                        <Download className="h-4 w-4 mr-2"/>Download TXT
                    </Button>
                    <Button variant="outline" onClick={handleCopy} disabled={!generatedLetter || isCopied} className="flex-1">
                    {isCopied ? <><Check className="h-4 w-4 mr-2"/>Copied</> : <><Clipboard className="h-4 w-4 mr-2"/>Copy Text</>}
                    </Button>
                </div>
            </div>
            </CardContent>
        </Card>
        </motion.div>
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

export default CoverLetterGenerator;
