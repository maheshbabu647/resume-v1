// import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { get, set, cloneDeep } from 'lodash';
// import { getTemplateById, createTemplate, updateTemplate } from '@/api/templateServiceApi';

// // UI Components
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
// import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
// import { ArrowLeft, Save, Loader2, AlertCircle, RefreshCw, CheckCircle2, FileJson, Code2, Eye, X, Tags, LayoutTemplate, Palette, Puzzle, FileCode, ListOrdered, PlusCircle } from 'lucide-react';
// import { cn } from "@/lib/utils";

// const ResumePreview = React.lazy(() => import('@/components/Resume/ResumePreview'));

// // --- Default values for the modular schema ---
// // Now using JS objects directly
// const defaultLayoutSlots = ["main_column"];
// const defaultHtmlShell = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Resume</title>
// </head>
// <body>
//   <div class="resume__wrapper">
//     <div class="resume__container" id="resume">
//       {{{main_column}}}
//     </div>
//   </div>
// </body>
// </html>`;
// const defaultBaseCss = `html, body { margin: 0; padding: 0; background: transparent; font-family: Inter, sans-serif; }
// .resume__container { width: 794px; height: 1123px; background: #fff; padding: 40px; }
// /* Add more base styles */`;
// const defaultSections = [
//     { key: "experience", name: "Work Experience", html: "<section><h3>Work Experience</h3>{{#each content.experience}}<div><h4>{{this.jobTitle}} at {{this.company}}</h4><p>{{this.description}}</p></div>{{/each}}</section>" }
// ];
// const defaultStylePacks = [
//     { key: "default-light", name: "Default Light", css: "body { color: #333; } h3 { color: #1a73e8; }" }
// ];
// const defaultSectionPresets = [
//     { key: "default-order", name: "Default Order", order: { main_column: ["experience"] } }
// ];
// const defaultFieldDefinition = [
//   { name: "name", label: "Full Name", type: "text", section: "Personal" },
//   { name: "experience", label: "Experience", type: "group", repeatable: true, section: "Experience", subFields: [ { name: "jobTitle", label: "Job Title" }, { name: "company", label: "Company" }, { name: "description", label: "Description" } ], defaultItem: { jobTitle: "Lead Developer", company: "Innovate Inc.", description: "Led a team to build amazing things."} }
// ];

// // Helper to generate mock data for the preview
// const generateMockData = (definitions) => {
//     const mockData = { content: {}, sectionsConfig: {} };
//     if (!Array.isArray(definitions)) return mockData;
//     definitions.forEach(field => {
//         if (field.section) {
//             mockData.sectionsConfig[field.section] = { enabled: true };
//         }
//         let value = field.type === 'group' && field.repeatable
//             ? (field.defaultItem ? [cloneDeep(field.defaultItem)] : [])
//             : (field.placeholder || `[${field.label}]`);
//         set(mockData.content, field.name, value);
//     });
//     return mockData;
// };

// const AdminTemplateEditPage = () => {
//   const { templateId } = useParams();
//   const navigate = useNavigate();
//   const mode = templateId ? 'edit' : 'create';

//   // State restructured to use objects/arrays directly
//   const [templateData, setTemplateData] = useState({
//     templateName: '',
//     layoutSlots: defaultLayoutSlots,
//     htmlShell: defaultHtmlShell,
//     baseCss: defaultBaseCss,
//     sections: cloneDeep(defaultSections),
//     stylePacks: cloneDeep(defaultStylePacks),
//     sectionPresets: cloneDeep(defaultSectionPresets),
//     templateFieldDefinition: cloneDeep(defaultFieldDefinition),
//     tags: { style: '', level: '', industry: '' }
//   });

//   // Local state for raw string editing of JSON textareas
//   const [sectionPresetsString, setSectionPresetsString] = useState(JSON.stringify(defaultSectionPresets, null, 2));
//   const [fieldDefinitionString, setFieldDefinitionString] = useState(JSON.stringify(defaultFieldDefinition, null, 2));
//   const [jsonErrors, setJsonErrors] = useState({ sectionPresets: null, templateFieldDefinition: null });

//   const [templateImageFile, setTemplateImageFile] = useState(null);
//   const [currentImageUrl, setCurrentImageUrl] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [pageLoadError, setPageLoadError] = useState(null);
//   const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
//   const [feedbackDetails, setFeedbackDetails] = useState({ title: '', message: '', type: 'success' });
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);

//   const mockDataForPreview = useMemo(() => {
//     return generateMockData(templateData.templateFieldDefinition);
//   }, [templateData.templateFieldDefinition]);

//   const previewData = useMemo(() => {
//     return {
//         htmlShell: templateData.htmlShell,
//         baseCss: templateData.baseCss,
//         sections: templateData.sections,
//         stylePacks: templateData.stylePacks,
//         defaultStyleKey: templateData.stylePacks?.[0]?.key || null,
//         defaultOrder: templateData.sectionPresets?.[0]?.order || null,
//     };
//   }, [templateData.htmlShell, templateData.baseCss, templateData.sections, templateData.stylePacks, templateData.sectionPresets]);

//   const fetchAndSetTemplate = useCallback(async () => {
//     setIsLoading(true);
//     setPageLoadError(null);
//     setJsonErrors({ sectionPresets: null, templateFieldDefinition: null });
//     try {
//         if (mode === 'edit') {
//             const data = await getTemplateById(templateId);
//             if (!data) throw new Error("Template not found.");
            
//             setTemplateData({
//                 templateName: data.templateName || '',
//                 layoutSlots: data.layoutSlots || defaultLayoutSlots,
//                 htmlShell: data.templateComponents?.htmlShell || defaultHtmlShell,
//                 baseCss: data.templateComponents?.baseCss || defaultBaseCss,
//                 sections: data.templateComponents?.sections || cloneDeep(defaultSections),
//                 stylePacks: data.templateComponents?.stylePacks || cloneDeep(defaultStylePacks),
//                 sectionPresets: data.templateComponents?.sectionPresets || cloneDeep(defaultSectionPresets),
//                 templateFieldDefinition: data.templateFieldDefinition || cloneDeep(defaultFieldDefinition),
//                 tags: {
//                     style: data.tags?.style || '',
//                     level: Array.isArray(data.tags?.level) ? data.tags.level.join(', ') : '',
//                     industry: Array.isArray(data.tags?.industry) ? data.tags.industry.join(', ') : ''
//                 }
//             });
//             // Initialize string states from fetched data
//             setSectionPresetsString(JSON.stringify(data.templateComponents?.sectionPresets || defaultSectionPresets, null, 2));
//             setFieldDefinitionString(JSON.stringify(data.templateFieldDefinition || defaultFieldDefinition, null, 2));
//             setCurrentImageUrl(data.templateImage || null);
//         } else {
//              setTemplateData({
//               templateName: '',
//               layoutSlots: defaultLayoutSlots,
//               htmlShell: defaultHtmlShell,
//               baseCss: defaultBaseCss,
//               sections: cloneDeep(defaultSections),
//               stylePacks: cloneDeep(defaultStylePacks),
//               sectionPresets: cloneDeep(defaultSectionPresets),
//               templateFieldDefinition: cloneDeep(defaultFieldDefinition),
//               tags: { style: '', level: '', industry: '' }
//             });
//             // Initialize string states with defaults for create mode
//             setSectionPresetsString(JSON.stringify(defaultSectionPresets, null, 2));
//             setFieldDefinitionString(JSON.stringify(defaultFieldDefinition, null, 2));
//         }
//     } catch (err) {
//         setPageLoadError(err.message || 'Failed to load template data.');
//     } finally {
//         setIsLoading(false);
//     }
//   }, [mode, templateId]);

//   useEffect(() => {
//     fetchAndSetTemplate();
//   }, [fetchAndSetTemplate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith('tags.')) {
//         const tagName = name.split('.')[1];
//         setTemplateData(prev => ({ ...prev, tags: { ...prev.tags, [tagName]: value } }));
//     } else {
//         setTemplateData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//         setTemplateImageFile(file);
//         setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleJsonBlur = (fieldName, stringValue) => {
//     try {
//       const parsedValue = JSON.parse(stringValue);
//       setTemplateData(prev => ({ ...prev, [fieldName]: parsedValue }));
//       setJsonErrors(prev => ({ ...prev, [fieldName]: null }));
//     } catch (err) {
//       setJsonErrors(prev => ({ ...prev, [fieldName]: `Invalid JSON: ${err.message}` }));
//     }
//   };

//   // --- Generic handlers for array state management ---
//   const handleArrayItemChange = (arrayName, index, field, value) => {
//     setTemplateData(prev => {
//         const newArray = [...prev[arrayName]];
//         newArray[index] = { ...newArray[index], [field]: value };
//         return { ...prev, [arrayName]: newArray };
//     });
//   };

//   const addArrayItem = (arrayName, newItem) => {
//     setTemplateData(prev => ({
//         ...prev,
//         [arrayName]: [...prev[arrayName], newItem]
//     }));
//   };

//   const removeArrayItem = (arrayName, index) => {
//     setTemplateData(prev => ({
//         ...prev,
//         [arrayName]: prev[arrayName].filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);
    
//     // Final validation check before submitting
//     if (jsonErrors.sectionPresets || jsonErrors.templateFieldDefinition) {
//         setFeedbackDetails({ title: 'Validation Error', message: "Please fix the invalid JSON fields before saving.", type: 'error' });
//         setShowFeedbackDialog(true);
//         setIsSaving(false);
//         return;
//     }

//     const formDataPayload = new FormData();
//     formDataPayload.append('templateName', templateData.templateName);
    
//     const processedTags = {
//         style: templateData.tags.style || '',
//         level: templateData.tags.level ? templateData.tags.level.split(',').map(item => item.trim()).filter(Boolean) : [],
//         industry: templateData.tags.industry ? templateData.tags.industry.split(',').map(item => item.trim()).filter(Boolean) : [],
//     };
//     formDataPayload.append('tags', JSON.stringify(processedTags));

//     formDataPayload.append('layoutSlots', JSON.stringify(templateData.layoutSlots));
//     formDataPayload.append('templateFieldDefinition', JSON.stringify(templateData.templateFieldDefinition));
    
//     const templateComponents = {
//         htmlShell: templateData.htmlShell,
//         baseCss: templateData.baseCss,
//         sections: templateData.sections,
//         stylePacks: templateData.stylePacks,
//         sectionPresets: templateData.sectionPresets,
//     };
//     formDataPayload.append('templateComponents', JSON.stringify(templateComponents));

//     if (templateImageFile) {
//         formDataPayload.append('templateImageFile', templateImageFile);
//     }
    
//     if (mode === 'create' && !templateImageFile) {
//         setFeedbackDetails({ title: 'Validation Error', message: "A preview image is required for new templates.", type: 'error' });
//         setShowFeedbackDialog(true); setIsSaving(false); return;
//     }

//     try {
//       const response = mode === 'create' ? await createTemplate(formDataPayload) : await updateTemplate(templateId, formDataPayload);
//       setFeedbackDetails({ title: 'Success!', message: response.message || `Template successfully ${mode}d!`, type: 'success' });
//       setShowFeedbackDialog(true);
//     } catch (err) {
//       const apiErrorMessage = err.message || `Failed to ${mode} template.`;
//       setFeedbackDetails({ title: 'Operation Failed', message: apiErrorMessage, type: 'error' });
//       setShowFeedbackDialog(true);
//     } finally {
//       setIsSaving(false);
//     }
//   };
  
//   const handleDialogClose = (isOpen) => {
//     if (!isOpen) {
//         setShowFeedbackDialog(false);
//         if (feedbackDetails.type === 'success') {
//             setTimeout(() => navigate('/admin/templates'), 300);
//         }
//     }
//   };
  
//   if (isLoading) return <div className="flex items-center justify-center min-h-screen"><LoadingSpinner size="large" label="Loading Editor..." /></div>;
//   if (pageLoadError) return <div className="container mx-auto p-8 text-center"><Alert variant="destructive"><AlertCircle className="h-5 w-5" /><AlertTitle>Error</AlertTitle><AlertDescription>{pageLoadError}</AlertDescription><Button variant="outline" onClick={fetchAndSetTemplate} className="mt-6"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button></Alert></div>;

//   return (
//     <>
//       <Helmet><title>{mode === 'create' ? 'Add New Template' : `Edit: ${templateData.templateName || 'Template'}`} | Admin</title></Helmet>
//       <div className="flex flex-col min-h-screen bg-muted/20">
//         <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b px-4 py-3">
//             <div className="container mx-auto flex items-center justify-between gap-4">
//                  <div className="flex items-center gap-3">
//                     <Button variant="outline" size="icon" onClick={() => navigate('/admin/templates')} aria-label="Back"><ArrowLeft size={18} /></Button>
//                     <h1 className="text-xl font-bold text-primary">{mode === 'create' ? 'Create New Template' : 'Edit Template'}</h1>
//                  </div>
//                  <div className="flex items-center gap-2">
//                     <Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="hidden sm:inline-flex"><Eye className="mr-2 h-4 w-4" /> Full Preview</Button>
//                     <Button onClick={handleSubmit} disabled={isSaving} className="w-28">
//                         {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save size={16} className="mr-2" />{mode === 'create' ? 'Save' : 'Update'}</>}
//                     </Button>
//                  </div>
//             </div>
//         </header>

//         <main className="flex-grow container mx-auto px-4 py-6">
//             <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
//                 {/* --- LEFT COLUMN --- */}
//                 <div className="space-y-6">
//                     <Card><CardHeader><CardTitle>Configuration</CardTitle><CardDescription>Basic details and preview image.</CardDescription></CardHeader><CardContent className="space-y-4">
//                         <div><Label htmlFor="templateName">Template Name</Label><Input id="templateName" name="templateName" value={templateData.templateName} onChange={handleChange} required /></div>
//                         <div><Label htmlFor="templateImageFile">Preview Image</Label><Input id="templateImageFile" name="templateImageFile" type="file" onChange={handleImageChange} accept="image/*" />
//                         {(imagePreview || currentImageUrl) && <img src={imagePreview || currentImageUrl} alt="Preview" className="mt-2 rounded-md border p-1 max-h-40" />}</div>
//                     </CardContent></Card>
                    
//                     <Card><CardHeader><CardTitle className="flex items-center"><Tags size={16} className="mr-2"/>Tags & Metadata</CardTitle><CardDescription>Categorize the template for filtering.</CardDescription></CardHeader><CardContent className="space-y-4">
//                         <div><Label htmlFor="tags.style">Style</Label><Input id="tags.style" name="tags.style" value={templateData.tags.style} onChange={handleChange} placeholder="e.g., Modern, Minimalist" /></div>
//                         <div><Label htmlFor="tags.level">Experience Level (comma-separated)</Label><Input id="tags.level" name="tags.level" value={templateData.tags.level} onChange={handleChange} placeholder="e.g., Entry-Level, Senior" /></div>
//                         <div><Label htmlFor="tags.industry">Industry (comma-separated)</Label><Input id="tags.industry" name="tags.industry" value={templateData.tags.industry} onChange={handleChange} placeholder="e.g., Tech, Healthcare" /></div>
//                     </CardContent></Card>
                    
//                     <Card><CardHeader><CardTitle className="flex items-center"><FileCode size={16} className="mr-2"/>HTML Shell</CardTitle><CardDescription>The main HTML document structure.</CardDescription></CardHeader><CardContent>
//                         <Textarea id="htmlShell" name="htmlShell" value={templateData.htmlShell} onChange={handleChange} required rows={15} className="font-mono text-xs"/>
//                     </CardContent></Card>
                    
//                     <Card><CardHeader><CardTitle className="flex items-center"><Palette size={16} className="mr-2"/>Base CSS</CardTitle><CardDescription>The core CSS styles for this template.</CardDescription></CardHeader><CardContent>
//                         <Textarea id="baseCss" name="baseCss" value={templateData.baseCss} onChange={handleChange} required rows={15} className="font-mono text-xs"/>
//                     </CardContent></Card>

//                     <Card>
//                         <CardHeader><CardTitle className="flex items-center"><LayoutTemplate size={16} className="mr-2"/>Layout Slots</CardTitle><CardDescription>Define injection points (comma-separated).</CardDescription></CardHeader>
//                         <CardContent>
//                             <Input id="layoutSlots" name="layoutSlots" value={Array.isArray(templateData.layoutSlots) ? templateData.layoutSlots.join(', ') : ''} onChange={(e) => setTemplateData(p => ({...p, layoutSlots: e.target.value.split(',').map(s => s.trim())}))} required />
//                         </CardContent>
//                     </Card>

//                 </div>

//                 {/* --- RIGHT COLUMN --- */}
//                 <div className="space-y-6">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="flex items-center justify-between">
//                                 <div className="flex items-center"><Puzzle size={16} className="mr-2"/>Sections</div>
//                                 <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('sections', { key: '', name: '', html: '' })}><PlusCircle size={14} className="mr-2" />Add Section</Button>
//                             </CardTitle>
//                             <CardDescription>The array of modular HTML section components.</CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                             {templateData.sections.map((section, index) => (
//                                 <div key={index} className="space-y-3 rounded-md border p-4 relative">
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <Input value={section.key} onChange={(e) => handleArrayItemChange('sections', index, 'key', e.target.value)} placeholder="Key (e.g., experience)" />
//                                         <Input value={section.name} onChange={(e) => handleArrayItemChange('sections', index, 'name', e.target.value)} placeholder="Name (e.g., Work Experience)" />
//                                     </div>
//                                     <Textarea value={section.html} onChange={(e) => handleArrayItemChange('sections', index, 'html', e.target.value)} placeholder="HTML for this section..." required rows={8} className="font-mono text-xs" />
//                                     <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removeArrayItem('sections', index)}><X size={14} /></Button>
//                                 </div>
//                             ))}
//                         </CardContent>
//                     </Card>

//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="flex items-center justify-between">
//                                 <div className="flex items-center"><Palette size={16} className="mr-2"/>Style Packs</div>
//                                 <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('stylePacks', { key: '', name: '', css: '' })}><PlusCircle size={14} className="mr-2" />Add Style Pack</Button>
//                             </CardTitle>
//                             <CardDescription>The array of CSS override themes.</CardDescription>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                              {templateData.stylePacks.map((pack, index) => (
//                                 <div key={index} className="space-y-3 rounded-md border p-4 relative">
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <Input value={pack.key} onChange={(e) => handleArrayItemChange('stylePacks', index, 'key', e.target.value)} placeholder="Key (e.g., modern-dark)" />
//                                         <Input value={pack.name} onChange={(e) => handleArrayItemChange('stylePacks', index, 'name', e.target.value)} placeholder="Name (e.g., Modern Dark)" />
//                                     </div>
//                                     <Textarea value={pack.css} onChange={(e) => handleArrayItemChange('stylePacks', index, 'css', e.target.value)} placeholder="CSS for this style pack..." required rows={8} className="font-mono text-xs" />
//                                     <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removeArrayItem('stylePacks', index)}><X size={14} /></Button>
//                                 </div>
//                             ))}
//                         </CardContent>
//                     </Card>
                    
//                     <Card><CardHeader><CardTitle className="flex items-center"><ListOrdered size={16} className="mr-2"/>Section Order Presets (JSON)</CardTitle><CardDescription>Edit as raw JSON. Data is saved when you click away.</CardDescription></CardHeader><CardContent>
//                         <Textarea 
//                             value={sectionPresetsString} 
//                             onChange={(e) => setSectionPresetsString(e.target.value)} 
//                             onBlur={() => handleJsonBlur('sectionPresets', sectionPresetsString)}
//                             required 
//                             rows={10} 
//                             className={cn("font-mono text-xs", jsonErrors.sectionPresets && "border-destructive focus-visible:ring-destructive")}
//                         />
//                         {jsonErrors.sectionPresets && <p className="text-sm text-destructive mt-2">{jsonErrors.sectionPresets}</p>}
//                     </CardContent></Card>

//                     <Card><CardHeader><CardTitle className="flex items-center"><FileJson size={16} className="mr-2"/>Field Definitions (JSON)</CardTitle><CardDescription>Edit as raw JSON. Data is saved when you click away.</CardDescription></CardHeader><CardContent>
//                          <Textarea 
//                             value={fieldDefinitionString} 
//                             onChange={(e) => setFieldDefinitionString(e.target.value)} 
//                             onBlur={() => handleJsonBlur('templateFieldDefinition', fieldDefinitionString)}
//                             required 
//                             rows={20} 
//                             className={cn("font-mono text-xs", jsonErrors.templateFieldDefinition && "border-destructive focus-visible:ring-destructive")}
//                         />
//                          {jsonErrors.templateFieldDefinition && <p className="text-sm text-destructive mt-2">{jsonErrors.templateFieldDefinition}</p>}
//                     </CardContent></Card>

//                 </div>
//             </form>
//         </main>
//       </div>
      
//       <Dialog open={showFeedbackDialog} onOpenChange={handleDialogClose}>
//         <DialogContent>
//             <DialogHeader>
//             <DialogTitle className={cn("flex items-center", feedbackDetails.type === 'success' ? "text-green-600" : "text-destructive")}>
//                 {feedbackDetails.type === 'success'
//                 ? <CheckCircle2 className="h-5 w-5 mr-2" />
//                 : <AlertCircle className="h-5 w-5 mr-2" />}
//                 {feedbackDetails.title}
//             </DialogTitle>
//             </DialogHeader>

//             <DialogDescription className="py-4">
//             {feedbackDetails.message}
//             </DialogDescription>

//             <DialogFooter>
//             <DialogClose asChild>
//                 <Button type="button">Close</Button>
//             </DialogClose>
//             </DialogFooter>
//         </DialogContent>
//       </Dialog>

      
//       <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
//         <DialogContent className="max-w-[95vw] w-full h-[95vh] p-2 sm:p-4 bg-muted/80 backdrop-blur-sm border-0 flex items-start justify-center overflow-y-auto">
//             <DialogHeader className="sr-only"><DialogTitle>Template Live Preview</DialogTitle></DialogHeader>
//             <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><LoadingSpinner size="xlarge" label="Loading Preview..."/></div>}>
//                 {previewData ? (
//                     <ResumePreview
//                         htmlShell={previewData.htmlShell}
//                         baseCss={previewData.baseCss}
//                         sections={previewData.sections}
//                         stylePacks={previewData.stylePacks}
//                         selectedStylePackKey={previewData.defaultStyleKey}
//                         sectionOrder={previewData.defaultOrder}
//                         currentFormData={mockDataForPreview}
//                         spacingMultiplier={1}
//                     />
//                 ) : (
//                     <div className="m-auto text-center bg-card p-8 rounded-lg shadow-xl">
//                         <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
//                         <h3 className="mt-4 text-lg font-medium text-destructive">Could not render preview</h3>
//                         <p className="mt-1 text-sm text-muted-foreground">There might be an issue with the template data.</p>
//                     </div>
//                 )}
//             </Suspense>
//             <DialogClose className="absolute right-4 top-4 rounded-full p-2 bg-card/50 hover:bg-card/80 transition-opacity z-10"><X className="h-5 w-5" /><span className="sr-only">Close</span></DialogClose>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default AdminTemplateEditPage;


import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cloneDeep } from 'lodash';
import { getTemplateById, createTemplate, updateTemplate } from '@/api/templateServiceApi';

// --- UI Component Imports ---
// Make sure to have these components in your project
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch"; // For the new boolean field
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // For the new presets
import { Checkbox } from "@/components/ui/checkbox"; // For the 'isPrimary' flag in presets
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import { ArrowLeft, Save, Loader2, AlertCircle, RefreshCw, CheckCircle2, FileJson, Code2, Eye, X, Tags, LayoutTemplate, Palette, Puzzle, FileCode, ListOrdered, PlusCircle, Star } from 'lucide-react';
import { cn } from "@/lib/utils";

const ResumePreview = React.lazy(() => import('@/components/Resume/ResumePreview'));

// --- Default values for the modular schema ---
const defaultLayoutSlots = ["main_column"];
const defaultHtmlShell = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Resume</title></head><body><div class="resume__wrapper"><div class="resume__container" id="resume">{{{main_column}}}</div></div></body></html>`;
const defaultBaseCss = `html, body { margin: 0; padding: 0; background: transparent; font-family: Inter, sans-serif; }.resume__container { width: 794px; height: 1123px; background: #fff; padding: 40px; }`;
const defaultSections = [{ key: "experience", name: "Work Experience", html: "<section><h3>Work Experience</h3></section>" }];
const defaultStylePacks = [{ key: "default-light", name: "Default Light", css: "body { color: #333; }" }];
const defaultSectionPresets = [{ key: "default-order", name: "Default Order", order: { main_column: ["experience"] } }];
const defaultFieldDefinition = [{ name: "name", label: "Full Name", type: "text", section: "Personal" }];
const defaultPresets = []; // --- NEW: Default for the new presets array ---

// Helper to generate mock data for the preview
const generateMockData = (definitions) => {
    const mockData = { content: {}, sectionsConfig: {} };
    if (!Array.isArray(definitions)) return mockData;
    definitions.forEach(field => {
        if (field.section) mockData.sectionsConfig[field.section] = { enabled: true };
        let value = field.type === 'group' && field.repeatable ? (field.defaultItem ? [cloneDeep(field.defaultItem)] : []) : (field.placeholder || `[${field.label}]`);
        Object.assign(mockData.content, { [field.name]: value });
    });
    return mockData;
};

const AdminTemplateEditPage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const mode = templateId ? 'edit' : 'create';

  // --- STATE MANAGEMENT ---
  // Add new fields to the main state object
  const [templateData, setTemplateData] = useState({
    templateName: '',
    isAtsRecommended: false, // --- NEW ---
    presets: cloneDeep(defaultPresets), // --- NEW ---
    layoutSlots: defaultLayoutSlots,
    htmlShell: defaultHtmlShell,
    baseCss: defaultBaseCss,
    sections: cloneDeep(defaultSections),
    stylePacks: cloneDeep(defaultStylePacks),
    sectionPresets: cloneDeep(defaultSectionPresets),
    templateFieldDefinition: cloneDeep(defaultFieldDefinition),
    tags: { style: '', level: '', industry: '' }
  });

  // Local state for raw string editing of JSON textareas
  const [sectionPresetsString, setSectionPresetsString] = useState(JSON.stringify(defaultSectionPresets, null, 2));
  const [fieldDefinitionString, setFieldDefinitionString] = useState(JSON.stringify(defaultFieldDefinition, null, 2));
  const [jsonErrors, setJsonErrors] = useState({ sectionPresets: null, templateFieldDefinition: null });

  // Other component state
  const [templateImageFile, setTemplateImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageLoadError, setPageLoadError] = useState(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackDetails, setFeedbackDetails] = useState({ title: '', message: '', type: 'success' });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Memoized data for the live preview
  const mockDataForPreview = useMemo(() => generateMockData(templateData.templateFieldDefinition), [templateData.templateFieldDefinition]);
  const previewData = useMemo(() => ({
    htmlShell: templateData.htmlShell,
    baseCss: templateData.baseCss,
    sections: templateData.sections,
    stylePacks: templateData.stylePacks,
    defaultStyleKey: templateData.stylePacks?.[0]?.key || null,
    defaultOrder: templateData.sectionPresets?.[0]?.order || null,
  }), [templateData]);

  // --- DATA FETCHING ---
  // Updated to fetch and set the new fields
  const fetchAndSetTemplate = useCallback(async () => {
    setIsLoading(true);
    setPageLoadError(null);
    setJsonErrors({ sectionPresets: null, templateFieldDefinition: null });
    try {
        if (mode === 'edit') {
            const data = await getTemplateById(templateId);
            if (!data) throw new Error("Template not found.");
            
            setTemplateData({
                templateName: data.templateName || '',
                isAtsRecommended: data.isAtsRecommended || false, // --- NEW ---
                presets: data.presets || cloneDeep(defaultPresets), // --- NEW ---
                layoutSlots: data.layoutSlots || defaultLayoutSlots,
                htmlShell: data.templateComponents?.htmlShell || defaultHtmlShell,
                baseCss: data.templateComponents?.baseCss || defaultBaseCss,
                sections: data.templateComponents?.sections || cloneDeep(defaultSections),
                stylePacks: data.templateComponents?.stylePacks || cloneDeep(defaultStylePacks),
                sectionPresets: data.templateComponents?.sectionPresets || cloneDeep(defaultSectionPresets),
                templateFieldDefinition: data.templateFieldDefinition || cloneDeep(defaultFieldDefinition),
                tags: {
                    style: data.tags?.style || '',
                    level: Array.isArray(data.tags?.level) ? data.tags.level.join(', ') : '',
                    industry: Array.isArray(data.tags?.industry) ? data.tags.industry.join(', ') : ''
                }
            });
            setSectionPresetsString(JSON.stringify(data.templateComponents?.sectionPresets || defaultSectionPresets, null, 2));
            setFieldDefinitionString(JSON.stringify(data.templateFieldDefinition || defaultFieldDefinition, null, 2));
            setCurrentImageUrl(data.templateImage || null);
        } else {
             setTemplateData({
              templateName: '',
              isAtsRecommended: false, // --- NEW ---
              presets: cloneDeep(defaultPresets), // --- NEW ---
              layoutSlots: defaultLayoutSlots,
              htmlShell: defaultHtmlShell,
              baseCss: defaultBaseCss,
              sections: cloneDeep(defaultSections),
              stylePacks: cloneDeep(defaultStylePacks),
              sectionPresets: cloneDeep(defaultSectionPresets),
              templateFieldDefinition: cloneDeep(defaultFieldDefinition),
              tags: { style: '', level: '', industry: '' }
            });
            setSectionPresetsString(JSON.stringify(defaultSectionPresets, null, 2));
            setFieldDefinitionString(JSON.stringify(defaultFieldDefinition, null, 2));
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

  // --- EVENT HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('tags.')) {
        const tagName = name.split('.')[1];
        setTemplateData(prev => ({ ...prev, tags: { ...prev.tags, [tagName]: value } }));
    } else {
        setTemplateData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setTemplateImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleJsonBlur = (fieldName, stringValue) => {
    try {
      const parsedValue = JSON.parse(stringValue);
      setTemplateData(prev => ({ ...prev, [fieldName]: parsedValue }));
      setJsonErrors(prev => ({ ...prev, [fieldName]: null }));
    } catch (err) {
      setJsonErrors(prev => ({ ...prev, [fieldName]: `Invalid JSON: ${err.message}` }));
    }
  };

  const handleArrayItemChange = (arrayName, index, field, value) => {
    setTemplateData(prev => {
        const newArray = [...prev[arrayName]];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayItem = (arrayName, newItem) => {
    setTemplateData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], newItem] }));
  };

  const removeArrayItem = (arrayName, index) => {
    setTemplateData(prev => ({ ...prev, [arrayName]: prev[arrayName].filter((_, i) => i !== index) }));
  };

  // --- FORM SUBMISSION ---
  // Updated to append the new fields to the FormData payload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    if (jsonErrors.sectionPresets || jsonErrors.templateFieldDefinition) {
        setFeedbackDetails({ title: 'Validation Error', message: "Please fix invalid JSON fields.", type: 'error' });
        setShowFeedbackDialog(true); setIsSaving(false); return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append('templateName', templateData.templateName);
    
    // --- NEW: Append new fields ---
    formDataPayload.append('isAtsRecommended', templateData.isAtsRecommended);
    formDataPayload.append('presets', JSON.stringify(templateData.presets));
    
    const processedTags = {
        style: templateData.tags.style || '',
        level: templateData.tags.level ? templateData.tags.level.split(',').map(item => item.trim()).filter(Boolean) : [],
        industry: templateData.tags.industry ? templateData.tags.industry.split(',').map(item => item.trim()).filter(Boolean) : [],
    };
    formDataPayload.append('tags', JSON.stringify(processedTags));
    formDataPayload.append('layoutSlots', JSON.stringify(templateData.layoutSlots));
    formDataPayload.append('templateFieldDefinition', JSON.stringify(templateData.templateFieldDefinition));
    
    const templateComponents = {
        htmlShell: templateData.htmlShell,
        baseCss: templateData.baseCss,
        sections: templateData.sections,
        stylePacks: templateData.stylePacks,
        sectionPresets: templateData.sectionPresets,
    };
    formDataPayload.append('templateComponents', JSON.stringify(templateComponents));

    if (templateImageFile) {
        formDataPayload.append('templateImageFile', templateImageFile);
    }
    
    if (mode === 'create' && !templateImageFile) {
        setFeedbackDetails({ title: 'Validation Error', message: "A preview image is required.", type: 'error' });
        setShowFeedbackDialog(true); setIsSaving(false); return;
    }

    try {
      const response = mode === 'create' ? await createTemplate(formDataPayload) : await updateTemplate(templateId, formDataPayload);
      setFeedbackDetails({ title: 'Success!', message: response.message || `Template successfully ${mode}d!`, type: 'success' });
      setShowFeedbackDialog(true);
    } catch (err) {
      setFeedbackDetails({ title: 'Operation Failed', message: err.message || `Failed to ${mode} template.`, type: 'error' });
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
  
  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><LoadingSpinner size="large" label="Loading Editor..." /></div>;
  if (pageLoadError) return <div className="container mx-auto p-8 text-center"><Alert variant="destructive"><AlertCircle className="h-5 w-5" /><AlertTitle>Error</AlertTitle><AlertDescription>{pageLoadError}</AlertDescription><Button variant="outline" onClick={fetchAndSetTemplate} className="mt-6"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button></Alert></div>;

  // --- RENDER METHOD (JSX) ---
  return (
    <>
      <Helmet><title>{mode === 'create' ? 'Add Template' : `Edit: ${templateData.templateName || 'Template'}`} | Admin</title></Helmet>
      <div className="flex flex-col min-h-screen bg-muted/20">
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b px-4 py-3">
            <div className="container mx-auto flex items-center justify-between gap-4">
                 <div className="flex items-center gap-3"><Button variant="outline" size="icon" onClick={() => navigate('/admin/templates')} aria-label="Back"><ArrowLeft size={18} /></Button><h1 className="text-xl font-bold text-primary">{mode === 'create' ? 'Create New Template' : 'Edit Template'}</h1></div>
                 <div className="flex items-center gap-2"><Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="hidden sm:inline-flex"><Eye className="mr-2 h-4 w-4" /> Full Preview</Button><Button onClick={handleSubmit} disabled={isSaving} className="w-28">{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save size={16} className="mr-2" />{mode === 'create' ? 'Save' : 'Update'}</>}</Button></div>
            </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* --- LEFT COLUMN --- */}
                <div className="space-y-6">
                    <Card><CardHeader><CardTitle>Configuration</CardTitle><CardDescription>Basic details and preview image.</CardDescription></CardHeader><CardContent className="space-y-4">
                        <div><Label htmlFor="templateName">Template Name</Label><Input id="templateName" name="templateName" value={templateData.templateName} onChange={handleChange} required /></div>
                        {/* --- NEW: isAtsRecommended Switch --- */}
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><Label htmlFor="isAtsRecommended" className="text-base">Recommended for ATS</Label><p className="text-sm text-muted-foreground">Enable this for simple, parser-friendly templates.</p></div><Switch id="isAtsRecommended" checked={templateData.isAtsRecommended} onCheckedChange={(checked) => setTemplateData(p => ({...p, isAtsRecommended: checked}))} /></div>
                        <div><Label htmlFor="templateImageFile">Preview Image</Label><Input id="templateImageFile" name="templateImageFile" type="file" onChange={handleImageChange} accept="image/*" />{(imagePreview || currentImageUrl) && <img src={imagePreview || currentImageUrl} alt="Preview" className="mt-2 rounded-md border p-1 max-h-40" />}</div>
                    </CardContent></Card>
                    
                    <Card><CardHeader><CardTitle className="flex items-center"><Tags size={16} className="mr-2"/>Tags & Metadata</CardTitle></CardHeader><CardContent className="space-y-4">
                        <div><Label htmlFor="tags.style">Style</Label><Input id="tags.style" name="tags.style" value={templateData.tags.style} onChange={handleChange} placeholder="e.g., Modern, Minimalist" /></div>
                        <div><Label htmlFor="tags.level">Experience Level (comma-separated)</Label><Input id="tags.level" name="tags.level" value={templateData.tags.level} onChange={handleChange} placeholder="e.g., Entry-Level, Senior" /></div>
                        <div><Label htmlFor="tags.industry">Industry (comma-separated)</Label><Input id="tags.industry" name="tags.industry" value={templateData.tags.industry} onChange={handleChange} placeholder="e.g., Tech, Healthcare" /></div>
                    </CardContent></Card>
                    
                    <Card><CardHeader><CardTitle className="flex items-center"><FileCode size={16} className="mr-2"/>HTML Shell</CardTitle></CardHeader><CardContent><Textarea id="htmlShell" name="htmlShell" value={templateData.htmlShell} onChange={handleChange} required rows={15} className="font-mono text-xs"/></CardContent></Card>
                    <Card><CardHeader><CardTitle className="flex items-center"><Palette size={16} className="mr-2"/>Base CSS</CardTitle></CardHeader><CardContent><Textarea id="baseCss" name="baseCss" value={templateData.baseCss} onChange={handleChange} required rows={15} className="font-mono text-xs"/></CardContent></Card>
                    <Card><CardHeader><CardTitle className="flex items-center"><LayoutTemplate size={16} className="mr-2"/>Layout Slots</CardTitle></CardHeader><CardContent><Input id="layoutSlots" name="layoutSlots" value={Array.isArray(templateData.layoutSlots) ? templateData.layoutSlots.join(', ') : ''} onChange={(e) => setTemplateData(p => ({...p, layoutSlots: e.target.value.split(',').map(s => s.trim())}))} required /></CardContent></Card>
                </div>

                {/* --- RIGHT COLUMN --- */}
                <div className="space-y-6">
                    {/* --- NEW: Configured Presets Management UI --- */}
                    <Card>
                        <CardHeader><CardTitle className="flex items-center justify-between"><div className="flex items-center"><Star size={16} className="mr-2"/>Configured Presets</div><Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('presets', { key: '', name: '', industry: '', sectionPresetKey: '', stylePackKey: '', isPrimary: false })}><PlusCircle size={14} className="mr-2" />Add Preset</Button></CardTitle><CardDescription>Define pre-packaged combinations for users.</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            {templateData.presets.map((preset, index) => (
                                <div key={index} className="space-y-3 rounded-md border p-4 relative bg-muted/30">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input value={preset.name} onChange={(e) => handleArrayItemChange('presets', index, 'name', e.target.value)} placeholder="Preset Name (e.g., Tech Graduate)" />
                                        <Input value={preset.key} onChange={(e) => handleArrayItemChange('presets', index, 'key', e.target.value)} placeholder="Unique Key (e.g., tech-grad)" />
                                    </div>
                                    <Input value={preset.industry} onChange={(e) => handleArrayItemChange('presets', index, 'industry', e.target.value)} placeholder="Target Industry (e.g., Technology)" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select value={preset.sectionPresetKey} onValueChange={(value) => handleArrayItemChange('presets', index, 'sectionPresetKey', value)}>
                                            <SelectTrigger><SelectValue placeholder="Select a Section Order" /></SelectTrigger>
                                            <SelectContent>{templateData.sectionPresets.map(sp => <SelectItem key={sp.key} value={sp.key}>{sp.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <Select value={preset.stylePackKey} onValueChange={(value) => handleArrayItemChange('presets', index, 'stylePackKey', value)}>
                                            <SelectTrigger><SelectValue placeholder="Select a Style Pack" /></SelectTrigger>
                                            <SelectContent>{templateData.stylePacks.map(sp => <SelectItem key={sp.key} value={sp.key}>{sp.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center space-x-2 pt-2"><Checkbox id={`isPrimary-${index}`} checked={preset.isPrimary} onCheckedChange={(checked) => handleArrayItemChange('presets', index, 'isPrimary', checked)} /><label htmlFor={`isPrimary-${index}`} className="text-sm font-medium leading-none">Is Primary?</label></div>
                                    <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removeArrayItem('presets', index)}><X size={14} /></Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card><CardHeader><CardTitle className="flex items-center justify-between"><div className="flex items-center"><Puzzle size={16} className="mr-2"/>Sections</div><Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('sections', { key: '', name: '', html: '' })}><PlusCircle size={14} className="mr-2" />Add</Button></CardTitle></CardHeader><CardContent className="space-y-4">{templateData.sections.map((section, index) => (<div key={index} className="space-y-3 rounded-md border p-4 relative"><div className="grid grid-cols-2 gap-4"><Input value={section.key} onChange={(e) => handleArrayItemChange('sections', index, 'key', e.target.value)} placeholder="Key" /><Input value={section.name} onChange={(e) => handleArrayItemChange('sections', index, 'name', e.target.value)} placeholder="Name" /></div><Textarea value={section.html} onChange={(e) => handleArrayItemChange('sections', index, 'html', e.target.value)} placeholder="HTML..." required rows={8} className="font-mono text-xs" /><Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removeArrayItem('sections', index)}><X size={14} /></Button></div>))}</CardContent></Card>
                    <Card><CardHeader><CardTitle className="flex items-center justify-between"><div className="flex items-center"><Palette size={16} className="mr-2"/>Style Packs</div><Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('stylePacks', { key: '', name: '', css: '' })}><PlusCircle size={14} className="mr-2" />Add</Button></CardTitle></CardHeader><CardContent className="space-y-4">{templateData.stylePacks.map((pack, index) => (<div key={index} className="space-y-3 rounded-md border p-4 relative"><div className="grid grid-cols-2 gap-4"><Input value={pack.key} onChange={(e) => handleArrayItemChange('stylePacks', index, 'key', e.target.value)} placeholder="Key" /><Input value={pack.name} onChange={(e) => handleArrayItemChange('stylePacks', index, 'name', e.target.value)} placeholder="Name" /></div><Textarea value={pack.css} onChange={(e) => handleArrayItemChange('stylePacks', index, 'css', e.target.value)} placeholder="CSS..." required rows={8} className="font-mono text-xs" /><Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => removeArrayItem('stylePacks', index)}><X size={14} /></Button></div>))}</CardContent></Card>
                    <Card><CardHeader><CardTitle className="flex items-center"><ListOrdered size={16} className="mr-2"/>Section Order Presets (JSON)</CardTitle></CardHeader><CardContent><Textarea value={sectionPresetsString} onChange={(e) => setSectionPresetsString(e.target.value)} onBlur={() => handleJsonBlur('sectionPresets', sectionPresetsString)} required rows={10} className={cn("font-mono text-xs", jsonErrors.sectionPresets && "border-destructive focus-visible:ring-destructive")} />{jsonErrors.sectionPresets && <p className="text-sm text-destructive mt-2">{jsonErrors.sectionPresets}</p>}</CardContent></Card>
                    <Card><CardHeader><CardTitle className="flex items-center"><FileJson size={16} className="mr-2"/>Field Definitions (JSON)</CardTitle></CardHeader><CardContent><Textarea value={fieldDefinitionString} onChange={(e) => setFieldDefinitionString(e.target.value)} onBlur={() => handleJsonBlur('templateFieldDefinition', fieldDefinitionString)} required rows={20} className={cn("font-mono text-xs", jsonErrors.templateFieldDefinition && "border-destructive focus-visible:ring-destructive")} />{jsonErrors.templateFieldDefinition && <p className="text-sm text-destructive mt-2">{jsonErrors.templateFieldDefinition}</p>}</CardContent></Card>
                </div>
            </form>
        </main>
      </div>
      
      {/* --- DIALOGS (No changes needed here) --- */}
      <Dialog open={showFeedbackDialog} onOpenChange={handleDialogClose}><DialogContent><DialogHeader><DialogTitle className={cn("flex items-center", feedbackDetails.type === 'success' ? "text-green-600" : "text-destructive")}>{feedbackDetails.type === 'success' ? <CheckCircle2 className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}{feedbackDetails.title}</DialogTitle></DialogHeader><DialogDescription className="py-4">{feedbackDetails.message}</DialogDescription><DialogFooter><DialogClose asChild><Button type="button">Close</Button></DialogClose></DialogFooter></DialogContent></Dialog>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}><DialogContent className="max-w-[95vw] w-full h-[95vh] p-2 sm:p-4"><DialogHeader className="sr-only"><DialogTitle>Template Live Preview</DialogTitle></DialogHeader><Suspense fallback={<div className="h-full w-full flex items-center justify-center"><LoadingSpinner size="xlarge" label="Loading Preview..."/></div>}>{previewData ? (<ResumePreview htmlShell={previewData.htmlShell} baseCss={previewData.baseCss} sections={previewData.sections} stylePacks={previewData.stylePacks} selectedStylePackKey={previewData.defaultStyleKey} sectionOrder={previewData.defaultOrder} currentFormData={mockDataForPreview} spacingMultiplier={1} />) : (<div className="m-auto text-center"><AlertCircle className="mx-auto h-12 w-12 text-destructive" /><h3 className="mt-4">Could not render preview</h3></div>)}</Suspense><DialogClose className="absolute right-4 top-4 rounded-full p-2 bg-card/50 hover:bg-card/80 transition-opacity z-10"><X className="h-5 w-5" /><span className="sr-only">Close</span></DialogClose></DialogContent></Dialog>
    </>
  );
};

export default AdminTemplateEditPage;