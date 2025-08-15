import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { get, set, cloneDeep } from 'lodash';
import { getTemplateById, createTemplate, updateTemplate } from '@/api/templateServiceApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import { ArrowLeft, Save, Loader2, AlertCircle, RefreshCw, CheckCircle2, FileJson, Code2, Eye, X, Tags } from 'lucide-react';
import { cn } from "@/lib/utils";

const ResumePreview = React.lazy(() => import('@/components/Resume/ResumePreview'));

const defaultTemplateCode = `
<div style="font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; background-color: #fff; padding: 40px; width: 794px; min-height:1123px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
  <header style="text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px;">
    <h1 style="font-size: 2.5em; margin: 0 0 5px 0; color: #2c3e50;">{{personalDetails.fullName}}</h1>
    <p style="font-size: 1.1em; margin: 0; color: #555;">{{personalDetails.jobTitle}}</p>
    <div style="font-size: 0.9em; color: #777; margin-top: 10px;">
      <span>{{personalDetails.email}}</span> | <span>{{personalDetails.phone}}</span> | <span>{{personalDetails.linkedin}}</span>
    </div>
  </header>
  {{#if professionalProfile.summary}}
  <section style="margin-bottom: 30px;">
    <h2 style="font-size: 1.4em; color: #3498db; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">Professional Summary</h2>
    <p style="font-size: 1em; color: #555; white-space: pre-wrap;">{{professionalProfile.summary}}</p>
  </section>
  {{/if}}
  {{#if experience}}
  <section style="margin-bottom: 30px;">
    <h2 style="font-size: 1.4em; color: #3498db; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">Work Experience</h2>
    {{#each experience}}
    <div style="margin-bottom: 20px;">
      <h3 style="font-size: 1.2em; color: #2c3e50; margin:0 0 3px 0;">{{this.jobTitle}} <span style="font-size: 0.9em; color: #777; font-weight:normal;">at {{this.companyName}}</span></h3>
      <p style="font-size: 0.9em; color: #777; margin:0 0 8px 0;">{{this.startDate}} – {{this.endDate}} | {{this.location}}</p>
      <ul style="font-size: 1em; color: #555; padding-left: 20px; margin:0;">
        {{#each this.responsibilities}}
        <li style="margin-bottom: 5px;">{{this.description}}</li>
        {{/each}}
      </ul>
    </div>
    {{/each}}
  </section>
  {{/if}}
</div>
`;

const defaultFieldDefinition = JSON.stringify([
  { "name": "personalDetails.fullName", "label": "Full Name", "type": "text", "section": "Personal Info", "placeholder": "e.g., Jane Doe" },
  { "name": "personalDetails.jobTitle", "label": "Job Title", "type": "text", "section": "Personal Info", "placeholder": "e.g., Senior Product Manager" },
  { "name": "personalDetails.email", "label": "Email", "type": "email", "section": "Personal Info", "placeholder": "e.g., jane.doe@email.com" },
  { "name": "personalDetails.phone", "label": "Phone", "type": "tel", "section": "Personal Info", "placeholder": "e.g., (555) 123-4567" },
  { "name": "personalDetails.linkedin", "label": "LinkedIn", "type": "url", "section": "Personal Info", "placeholder": "linkedin.com/in/janedoe" },
  { "name": "professionalProfile.summary", "label": "Summary", "type": "textarea", "section": "Summary", "placeholder": "Dynamic and results-oriented professional..." },
  { 
    "name": "experience", "label": "Experience", "type": "group", "repeatable": true, "defaultItem": { "jobTitle": "Lead Developer", "companyName": "TechCorp", "startDate": "Jan 2022", "endDate": "Present", "location": "San Francisco, CA", "responsibilities": [{"description": "Led a team in developing scalable web applications."}] } 
  },
], null, 2);

const generateMockData = (definitions) => {
    const mockData = {};
    if (!Array.isArray(definitions)) return mockData;

    definitions.forEach(field => {
        let value;
        if (field.type === 'group' && field.repeatable) {
            value = field.defaultItem ? [cloneDeep(field.defaultItem)] : [];
        } else {
            value = field.placeholder || `[${field.label}]`;
        }
        set(mockData, field.name, value);
    });
    return mockData;
};

const AdminTemplateEditPage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const mode = templateId ? 'edit' : 'create';

  const [templateData, setTemplateData] = useState({
    templateName: '',
    templateCode: '',
    templateFieldDefinition: '',
    tags: {
        style: '',
        level: '',
        industry: ''
    }
  });
  const [templateImageFile, setTemplateImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageLoadError, setPageLoadError] = useState(null);
  const [fieldDefError, setFieldDefError] = useState('');
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackDetails, setFeedbackDetails] = useState({ title: '', message: '', type: 'success' });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const mockDataForPreview = useMemo(() => {
    if (fieldDefError) return {};
    try {
        const parsedDefs = JSON.parse(templateData.templateFieldDefinition);
        return generateMockData(parsedDefs);
    } catch (e) {
        return {};
    }
  }, [templateData.templateFieldDefinition, fieldDefError]);

  const fetchAndSetTemplate = useCallback(async () => {
    setIsLoading(true);
    setPageLoadError(null);
    try {
        if (mode === 'edit') {
            const data = await getTemplateById(templateId);
            if (!data) throw new Error("Template not found.");
            setTemplateData({
                templateName: data.templateName || '',
                templateCode: data.templateCode || defaultTemplateCode,
                templateFieldDefinition: data.templateFieldDefinition ? JSON.stringify(data.templateFieldDefinition, null, 2) : defaultFieldDefinition,
                tags: {
                    style: data.tags?.style || '',
                    level: Array.isArray(data.tags?.level) ? data.tags.level.join(', ') : '',
                    industry: Array.isArray(data.tags?.industry) ? data.tags.industry.join(', ') : ''
                }
            });
            setCurrentImageUrl(data.templateImage || null);
        } else {
            setTemplateData({
                templateName: '',
                templateCode: defaultTemplateCode,
                templateFieldDefinition: defaultFieldDefinition,
                tags: { style: '', level: '', industry: '' }
            });
            setCurrentImageUrl(null);
        }
    } catch (err) {
        setPageLoadError(err.message || 'Failed to load template data.');
    } finally {
        setIsLoading(false);
    }
  }, [mode, templateId]);

  useEffect(() => {
    fetchAndSetTemplate();
  }, [fetchAndSetTemplate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('tags.')) {
        const tagName = name.split('.')[1];
        setTemplateData(prev => ({
            ...prev,
            tags: { ...prev.tags, [tagName]: value }
        }));
        return;
    }

    setTemplateData(prev => ({ ...prev, [name]: value }));

    if (name === 'templateFieldDefinition') {
        try { 
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed)) setFieldDefError('Field Definitions must be a valid JSON array.');
            else setFieldDefError('');
        }
        catch (jsonError) { 
            setFieldDefError('Invalid JSON format.'); 
        }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setTemplateImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    } else {
        setTemplateImageFile(null);
        setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setPageLoadError(null);
    if (fieldDefError) {
        setIsSaving(false);
        return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append('templateName', templateData.templateName);
    formDataPayload.append('templateCode', templateData.templateCode);
    
    try {
      const parsedFieldDefs = JSON.parse(templateData.templateFieldDefinition);
      formDataPayload.append('templateFieldDefinition', JSON.stringify(parsedFieldDefs));
    } catch (jsonError) {
      setFieldDefError('Invalid JSON format for Field Definitions.');
      setIsSaving(false);
      return;
    }

    // Process and append tags
    const processedTags = {
        style: templateData.tags.style || '',
        level: templateData.tags.level ? templateData.tags.level.split(',').map(item => item.trim()).filter(Boolean) : [],
        industry: templateData.tags.industry ? templateData.tags.industry.split(',').map(item => item.trim()).filter(Boolean) : [],
    };
    formDataPayload.append('tags', JSON.stringify(processedTags));

    if (templateImageFile) {
        formDataPayload.append('templateImageFile', templateImageFile);
    }
    
    if (mode === 'create' && !templateImageFile) {
        setFeedbackDetails({ title: 'Validation Error', message: "A template preview image is required for new templates.", type: 'error' });
        setShowFeedbackDialog(true);
        setIsSaving(false);
        return;
    }

    try {
      let response;
      if (mode === 'create') {
        response = await createTemplate(formDataPayload);
      } else {
        response = await updateTemplate(templateId, formDataPayload);
      }
      setFeedbackDetails({ title: 'Success!', message: response.message || `Template successfully ${mode === 'create' ? 'created' : 'updated'}!`, type: 'success' });
      setShowFeedbackDialog(true);
    } catch (err) {
      const apiErrorMessage = err.message || (err.errors && Array.isArray(err.errors) ? err.errors.map(e => e.msg || e.message).join(', ') : `Failed to ${mode} template.`);
      setFeedbackDetails({ title: 'Operation Failed', message: apiErrorMessage, type: 'error' });
      setShowFeedbackDialog(true);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDialogClose = (isOpen) => {
    if (!isOpen) {
        setShowFeedbackDialog(false);
        if (feedbackDetails.type === 'success') {
            setTimeout(() => navigate('/admin/templates'), 300);
        }
    }
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-150px)] bg-background"><LoadingSpinner size="large" label="Loading Template Editor..." /></div>;
  }
  
  if (pageLoadError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>{pageLoadError}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={fetchAndSetTemplate} className="mt-6">
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>{mode === 'create' ? 'Add New Template' : `Edit: ${templateData.templateName || 'Template'}`} | Admin</title></Helmet>
      <div className="flex flex-col min-h-screen bg-muted/20 dark:bg-background">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border shadow-sm px-4 py-3">
            <div className="container mx-auto flex items-center justify-between gap-4">
                 <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => navigate('/admin/templates')} aria-label="Back to templates"><ArrowLeft size={18} /></Button>
                    <h1 className="text-xl font-bold text-primary tracking-tight">{mode === 'create' ? 'Create New Template' : 'Edit Template'}</h1>
                 </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="hidden sm:inline-flex">
                        <Eye className="mr-2 h-4 w-4" /> Full Preview
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSaving || !!fieldDefError} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save size={16} className="mr-2" />{mode === 'create' ? 'Save' : 'Update'}</>}
                    </Button>
                 </div>
            </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 gap-6 items-start max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuration</CardTitle>
                                <CardDescription>Basic details and preview image.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="templateName">Template Name</Label>
                                    <Input id="templateName" name="templateName" value={templateData.templateName} onChange={handleChange} required />
                                </div>
                                <div>
                                    <Label htmlFor="templateImageFile">Preview Image</Label>
                                    <Input id="templateImageFile" name="templateImageFile" type="file" onChange={handleImageChange} accept="image/*" />
                                    {(imagePreview || currentImageUrl) && <img src={imagePreview || currentImageUrl} alt="Preview" className="mt-2 rounded-md border p-1 max-h-40" />}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center"><Tags size={16} className="mr-2"/>Tags & Metadata</CardTitle>
                                <CardDescription>Categorize the template for better filtering and discovery.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="tags.style">Style</Label>
                                    <Input id="tags.style" name="tags.style" value={templateData.tags.style} onChange={handleChange} placeholder="e.g., Modern, Minimalist, Classic" />
                                </div>
                                <div>
                                    <Label htmlFor="tags.level">Experience Level</Label>
                                    <Input id="tags.level" name="tags.level" value={templateData.tags.level} onChange={handleChange} placeholder="e.g., Entry-Level, Mid-Career, Senior" />
                                    <p className="text-xs text-muted-foreground mt-1">Enter comma-separated values.</p>
                                </div>
                                <div>
                                    <Label htmlFor="tags.industry">Industry</Label>
                                    <Input id="tags.industry" name="tags.industry" value={templateData.tags.industry} onChange={handleChange} placeholder="e.g., Tech, Healthcare, Finance" />
                                    <p className="text-xs text-muted-foreground mt-1">Enter comma-separated values.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center"><Code2 size={16} className="mr-2"/>Template Code</CardTitle>
                                <CardDescription>The HTML and Handlebars-style markup for the template.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea id="templateCode" name="templateCode" value={templateData.templateCode} onChange={handleChange} required rows={20} className="font-mono text-xs"/>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center"><FileJson size={16} className="mr-2"/>Field Definitions (JSON)</CardTitle>
                                <CardDescription>The JSON array that defines the form fields for this template.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea id="templateFieldDefinition" name="templateFieldDefinition" value={templateData.templateFieldDefinition} onChange={handleChange} required rows={20} className={`font-mono text-xs ${fieldDefError ? 'border-destructive' : ''}`}/>
                                {fieldDefError && <p className="text-xs text-destructive mt-1.5">{fieldDefError}</p>}
                            </CardContent>
                        </Card>
                    </form>
                </motion.div>
            </div>
        </main>
      </div>
      
      <Dialog open={showFeedbackDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader><DialogTitle className={cn("flex items-center text-lg font-semibold", feedbackDetails.type === 'success' ? "text-green-600" : "text-destructive")}>
              {feedbackDetails.type === 'success' ? <CheckCircle2 className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
              {feedbackDetails.title}
          </DialogTitle></DialogHeader>
          <DialogDescription className="py-4 text-muted-foreground">{feedbackDetails.message}</DialogDescription>
          <DialogFooter className="sm:justify-end"><DialogClose asChild><Button type="button">Close</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] p-2 sm:p-4 bg-muted/80 backdrop-blur-sm border-0 flex items-start justify-center overflow-y-auto">
            <DialogHeader className="sr-only">
              <DialogTitle>Template Live Preview</DialogTitle>
              <DialogDescription>
                This is a live preview of the template.
              </DialogDescription>
            </DialogHeader>
            <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><LoadingSpinner size="xlarge" label="Loading Preview..."/></div>}>
                <ResumePreview
                    templateCode={templateData.templateCode}
                    currentFormData={mockDataForPreview}
                />
            </Suspense>
            <DialogClose className="absolute right-4 top-4 rounded-full p-2 bg-card/50 hover:bg-card/80 text-foreground transition-opacity z-10">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
            </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminTemplateEditPage;