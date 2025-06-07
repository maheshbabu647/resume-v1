import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, Clipboard, Check, AlertCircle, Save } from 'lucide-react';
import { generateCoverLetter, saveCoverLetter } from '@/api/coverLetterServiceApi';
import useAuthContext from '@/hooks/useAuth';
import { useCoverLetterContext } from '@/context/CoverLetterContext';

const CoverLetterGenerator = ({ onLetterSaved }) => {
  const { userData } = useAuthContext();
  
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedLetter('');
    try {
      const response = await generateCoverLetter(formData);
      setGeneratedLetter(response.coverLetterContent);
    } catch (err) {
      setError(err.message || 'Failed to generate cover letter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
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
      // Callback to notify parent (DashboardPage) that a letter was saved
      if(onLetterSaved) {
        onLetterSaved();
      }
    } catch (err) {
      setError(err.message || 'Failed to save the cover letter.');
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

  return (
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
            {error && <Alert variant="destructive" className="mt-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
            <div className="flex gap-2 mt-4">
                <Button onClick={handleSave} disabled={!generatedLetter || isSaving} className="flex-1">
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Letter</>}
                </Button>
                <Button variant="outline" onClick={handleCopy} disabled={!generatedLetter || isCopied} className="flex-1">
                {isCopied ? <><Check className="h-4 w-4 mr-2"/>Copied</> : <><Clipboard className="h-4 w-4 mr-2"/>Copy Text</>}
                </Button>
            </div>
            </CardContent>
        </Card>
        </motion.div>
    </div>
  );
};

export default CoverLetterGenerator;
