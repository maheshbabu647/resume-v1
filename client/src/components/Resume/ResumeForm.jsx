// import React, { useState, useMemo, useEffect } from 'react';
// import { get } from 'lodash';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { 
//   Plus, Trash2, Sparkles, Loader2, User, Briefcase, GraduationCap, 
//   Star, Info, CheckCircle2, MessageSquareQuote, Contact, FolderKanban, X,
//   BadgeCheck, FileText, HandHeart, Trophy, Languages, Users, Gavel, 
//   FileCheck2, Stethoscope, Banknote, Presentation, ShieldCheck, CalendarDays 
// } from 'lucide-react';import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { cn } from "@/lib/utils";

// const FieldRenderer = ({ 
//   fieldDef, 
//   basePath, 
//   content, 
//   onFormChange, 
//   onArrayChange, 
//   onAddItem, 
//   onRemoveItem, 
//   onEnhanceField,
//   isEnhancing,
//   formData
// }) => {
//   const fieldKey = `${basePath}-${fieldDef.name}`;
//   const currentPath = basePath ? `${basePath}.${fieldDef.name}` : fieldDef.name;
  
//   const handleChange = (e, customValue) => {
//       const value = customValue !== undefined ? customValue : e.target.value;
//       const pathParts = basePath.split('.');
//       const lastPartIsIndex = !isNaN(parseInt(pathParts[pathParts.length - 1], 10));

//       if (lastPartIsIndex) {
//           const arrayPath = pathParts.slice(0, -1).join('.');
//           const index = parseInt(pathParts[pathParts.length - 1], 10);
//           onArrayChange(arrayPath, index, fieldDef.name, value);
//       } else {
//            onFormChange(currentPath, value);
//       }
//   };

//   if (fieldDef.type === 'group' && fieldDef.repeatable) {
//     const retrievedItems = get(content, fieldDef.name);
//     const itemsArray = Array.isArray(retrievedItems) ? retrievedItems : [];
    
//     const createNewItem = () => {
//         return fieldDef.subFields.reduce((acc, f) => {
//             if (f.defaultValue) {
//                 acc[f.name] = f.defaultValue;
//             } else if (f.type === 'group' && f.repeatable) {
//                 acc[f.name] = [];
//             } else {
//                 acc[f.name] = f.livePreviewPlaceholder || '';
//             }
//             return acc;
//         }, {});
//     };

//     return (
//       <fieldset key={fieldKey} className="space-y-5 pt-2" aria-labelledby={`legend-${fieldDef.name}`}>
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
//           <legend id={`legend-${fieldDef.name}`} className="text-lg font-semibold text-primary">
//             {fieldDef.label || fieldDef.name}
//           </legend>
//           <Button onClick={() => onAddItem(currentPath, createNewItem())} type="button" variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto">
//             <Plus className="w-4 h-4 mr-2" /> Add {fieldDef.singularLabel || 'Item'}
//           </Button>
//         </div>
//         {itemsArray.length === 0 && <p className="text-sm text-muted-foreground italic pl-1">No {fieldDef.pluralLabel || 'items'} added yet.</p>}
//         <div className="space-y-4">
//           {itemsArray.map((item, itemIndex) => (
//             <Card key={`${currentPath}-item-${itemIndex}`} className="bg-muted/30 dark:bg-muted/20 border-border shadow-sm relative group p-4">
//               <CardContent className="p-0 space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-1 gap-y-4">
//                   {Array.isArray(fieldDef.subFields) && fieldDef.subFields.map((subFieldDef) => (
//                     <FieldRenderer
//                       key={`${currentPath}-${itemIndex}-${subFieldDef.name}`}
//                       fieldDef={subFieldDef}
//                       basePath={`${currentPath}.${itemIndex}`}
//                       content={item}
//                       onFormChange={onFormChange}
//                       onArrayChange={onArrayChange}
//                       onAddItem={onAddItem}
//                       onRemoveItem={onRemoveItem}
//                       onEnhanceField={onEnhanceField}
//                       isEnhancing={isEnhancing}
//                       formData={formData}
//                     />
//                   ))}
//                 </div>
//               </CardContent>
//               <Button onClick={() => onRemoveItem(currentPath, itemIndex)} type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-60 group-hover:opacity-100 transition-opacity h-7 w-7" aria-label={`Remove ${fieldDef.singularLabel || 'Item'} ${itemIndex + 1}`}><Trash2 className="w-4 h-4" /></Button>
//             </Card>
//           ))}
//         </div>
//       </fieldset>
//     );
//   }

//   if (['text', 'email', 'tel', 'url', 'textarea', 'date', 'number'].includes(fieldDef.type)) {
//     const value = get(content, fieldDef.name, '');
//     const inputId = currentPath.replace(/\./g, '-');
//     const InputComponent = fieldDef.type === 'textarea' ? Textarea : Input;

//     return (
//       <div key={fieldKey} className="space-y-1.5 pt-2 relative">
//         <Label htmlFor={inputId} className="text-sm font-medium text-foreground">{fieldDef.label || fieldDef.name}{fieldDef.required && <span className="text-destructive ml-1">*</span>}</Label>
//         <InputComponent 
//           id={inputId} 
//           placeholder={fieldDef.placeholder || `Enter your ${fieldDef.label.toLowerCase()}`} 
//           type={fieldDef.type === 'textarea' ? undefined : fieldDef.type} 
//           name={currentPath} 
//           value={value} 
//           onChange={handleChange}
//           required={fieldDef.required || false} 
//           className="bg-background border-input focus:border-primary focus:ring-primary" 
//           rows={fieldDef.type === 'textarea' ? (fieldDef.rows || 4) : undefined} 
//           {...(fieldDef.props || {})} 
//         />
//         {fieldDef.type === 'textarea' && onEnhanceField && (
//             <Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-2 h-7 w-7 text-primary hover:bg-primary/10 hover:text-primary" onClick={() => {
//                 const jobContext = get(formData, 'content.experience[0].roles[0].jobTitle', get(formData, 'content.profile.title', 'this role'));
//                 onEnhanceField(currentPath, value, jobContext);
//             }} disabled={isEnhancing} aria-label="Enhance with AI">
//                 {isEnhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 animate-pulse" />}
//             </Button>
//         )}
//         {fieldDef.helperText && <p className="text-xs text-muted-foreground/80 pt-0.5">{fieldDef.helperText}</p>}
//       </div>
//     );
//   }
  
//   if (fieldDef.type === 'select') {
//     const value = get(content, fieldDef.name, '');
//     const inputId = currentPath.replace(/\./g, '-');
//     return (
//         <div key={fieldKey} className="space-y-1.5 pt-2">
//             <Label htmlFor={inputId} className="text-sm font-medium text-foreground">{fieldDef.label}</Label>
//             <Select value={value} onValueChange={(selectValue) => handleChange(null, selectValue)}>
//                 <SelectTrigger id={inputId} className="w-full bg-background border-input focus:border-primary focus:ring-primary">
//                     <SelectValue placeholder={fieldDef.placeholder || "Select an option"} />
//                 </SelectTrigger>
//                 <SelectContent>
//                     {(fieldDef.options || []).filter(Boolean).map(option => (
//                         <SelectItem key={option} value={option}>{option}</SelectItem>
//                     ))}
//                 </SelectContent>
//             </Select>
//         </div>
//     );
//   }

//    if (fieldDef.type === 'tags') {
//     const value = get(content, fieldDef.name, '');
//     const tags = value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];
//     const [inputValue, setInputValue] = useState('');
//     const inputId = currentPath.replace(/\./g, '-');

//     const addTag = () => {
//         if (inputValue && !tags.includes(inputValue)) {
//             const newTags = [...tags, inputValue.trim()];
//             handleChange(null, newTags.join(', '));
//         }
//         setInputValue('');
//     };

//     const removeTag = (tagToRemove) => {
//         const newTags = tags.filter(tag => tag !== tagToRemove);
//         handleChange(null, newTags.join(', '));
//     };

//     return (
//       <div key={fieldKey} className="space-y-1.5 pt-2">
//         <Label htmlFor={inputId} className="text-sm font-medium text-foreground">{fieldDef.label}</Label>
//         <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md bg-background border-input min-h-[40px]">
//           {tags.map(tag => (
//             <div key={tag} className="flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
//               <span>{tag}</span>
//               <button onClick={() => removeTag(tag)} type="button" className="hover:opacity-75"><X className="w-3 h-3" /></button>
//             </div>
//           ))}
//           <Input
//             id={inputId}
//             type="text"
//             value={inputValue}
//             placeholder={fieldDef.placeholder}
//             onChange={(e) => setInputValue(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') {
//                 e.preventDefault();
//                 addTag();
//               }
//             }}
//             className="flex-1 bg-transparent border-none focus:ring-0 h-auto p-0"
//           />
//         </div>
//       </div>
//     );
//   }
  
//   return <div key={fieldKey} className="text-sm text-muted-foreground pt-2">Unsupported field: "{fieldDef.label || fieldDef.name}"</div>;
// };

// const ResumeForm = ({
//   templateFieldDefinition,
//   formData,
//   onFormChange,
//   onArrayChange,
//   onAddItem,
//   onRemoveItem,
//   onSectionToggle,
//   onEnhanceField,
//   isEnhancing,
//   selectedIndustry,
// }) => {
//   const content = formData?.content || {};
//   const sectionsConfig = formData?.sectionsConfig || {};
  
//   const [isNavCollapsed, setIsNavCollapsed] = useState(true);

//   if (!Array.isArray(templateFieldDefinition) || templateFieldDefinition.length === 0) {
//     return (
//       <div className="p-6 bg-card rounded-lg shadow text-muted-foreground" role="alert" aria-live="polite">
//         <p className="text-center">No form fields defined for this template.</p>
//       </div>
//     );
//   }

//   const sections = useMemo(() => templateFieldDefinition.reduce((acc, fieldDef) => {
//     const sectionName = fieldDef.section || 'generalInfo';
//     if (!acc[sectionName]) {
//       const iconMap = {
//         profile: <User className="h-4 w-4" />,
//         contact: <Contact className="h-4 w-4" />,
//         experience: <Briefcase className="h-4 w-4" />,
//         education: <GraduationCap className="h-4 w-4" />,
//         skills: <Star className="h-4 w-4" />,
//         summary: <MessageSquareQuote className="h-4 w-4" />,
//         projects: <FolderKanban className="h-4 w-4" />,
//         certifications: <BadgeCheck className="h-4 w-4" />,
//         publications: <FileText className="h-4 w-4" />,
//         volunteering: <HandHeart className="h-4 w-4" />,
//         awards: <Trophy className="h-4 w-4" />,
//         languages: <Languages className="h-4 w-4" />,
//         memberships: <Users className="h-4 w-4" />,
//         barAdmissions: <Gavel className="h-4 w-4" />,
//         licensure: <FileCheck2 className="h-4 w-4" />,
//         clinicalExperience: <Stethoscope className="h-4 w-4" />,
//         grants: <Banknote className="h-4 w-4" />,
//         teachingExperience: <Presentation className="h-4 w-4" />,
//         securityClearance: <ShieldCheck className="h-4 w-4" />,
//         events: <CalendarDays className="h-4 w-4" />,
//         custom: <Sparkles className="h-4 w-4" />
//       };
//       acc[sectionName] = {
//         label: fieldDef.sectionLabel || sectionName.charAt(0).toUpperCase() + sectionName.slice(1).replace(/([A-Z])/g, ' $1').trim(),
//         description: fieldDef.sectionDescription || null,
//         fields: [],
//         icon: iconMap[sectionName] || <Info className="h-4 w-4" />,
//         isCore: fieldDef.isCore,
//         recommendedFor: fieldDef.recommendedFor,
//       };
//     }
//     acc[sectionName].fields.push(fieldDef);
//     return acc;
//   }, {}), [templateFieldDefinition]);

//   const allSectionKeys = useMemo(() => Object.keys(sections), [sections]);

//   const visibleSectionKeys = useMemo(() => {
//     if (!selectedIndustry || selectedIndustry === 'All') {
//       return allSectionKeys;
//     }
//     return allSectionKeys.filter(key => {
//       const props = sections[key];
//       return props.isCore || props.recommendedFor?.includes(selectedIndustry);
//     });
//   }, [allSectionKeys, selectedIndustry, sections]);

//   const [activeSection, setActiveSection] = useState(
//     visibleSectionKeys.length > 0 ? visibleSectionKeys[0] : null
//   );
  
//   useEffect(() => {
//     if (visibleSectionKeys.length > 0 && !visibleSectionKeys.includes(activeSection)) {
//       setActiveSection(visibleSectionKeys[0]);
//     } else if (visibleSectionKeys.length > 0 && activeSection === null) {
//       setActiveSection(visibleSectionKeys[0]);
//     }
//   }, [visibleSectionKeys, activeSection]);

//   return (
//     <div className="w-full p-1 md:p-2 flex flex-col lg:flex-row lg:gap-6">
//       <nav 
//           onMouseEnter={() => setIsNavCollapsed(false)}
//           onMouseLeave={() => setIsNavCollapsed(true)}
//           className={cn(
//             "bg-muted/30 dark:bg-muted/20 rounded-lg border border-border self-start flex flex-col p-2 transition-all duration-300 ease-in-out mb-4 lg:mb-0",
//             isNavCollapsed ? "lg:w-20" : "lg:w-56"
//       )}>
//           <div className="flex-grow">
//               <div className="flex items-center pb-2 border-b border-border h-9">
//                   <h3 className={cn(
//                       "px-3 text-sm font-semibold text-foreground whitespace-nowrap",
//                       isNavCollapsed && "hidden"
//                   )}>
//                       Resume Sections
//                   </h3>
//               </div>
//               <div className="mt-2 space-y-1">
//                   {visibleSectionKeys.map((sectionKey) => {
//                       const isCompleted = sections[sectionKey].fields.some(field => {
//                          const value = get(content, field.name);
//                          const hasRealValue = (val) => {
//                              if (typeof val !== 'string' && !Array.isArray(val)) return false;
//                              if(Array.isArray(val)) return val.length > 0;
//                              const cleanedText = val.replace(/<[^>]*>?/gm, '').trim();
//                              if (cleanedText === '') return false;
//                              const isPlaceholder = cleanedText.startsWith('[') && cleanedText.endsWith(']');
//                              return !isPlaceholder;
//                          };
//                          if (Array.isArray(value)) {
//                              return value.some(item => 
//                                  Object.values(item).some(hasRealValue)
//                              );
//                          }                           
//                          return hasRealValue(value);
//                       });

//                       return (
//                           <Button
//                               key={sectionKey}
//                               variant={activeSection === sectionKey ? "secondary" : "ghost"}
//                               onClick={() => setActiveSection(sectionKey)}
//                               className={cn(
//                                   "w-full h-auto py-2",
//                                   isNavCollapsed ? "px-2 justify-center" : "px-3 justify-start"
//                               )}
//                           >
//                               <div className={cn(
//                                   "flex items-center gap-3",
//                                   isNavCollapsed && "justify-center"
//                               )}>
//                                   {isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" /> : <div className="h-5 w-5 flex items-center justify-center flex-shrink-0">{sections[sectionKey].icon}</div>}
//                                   <span className={cn("text-sm font-medium text-left", activeSection === sectionKey ? 'text-primary' : '', isNavCollapsed && "lg:hidden")}>{sections[sectionKey].label}</span>
//                               </div>
//                           </Button>
//                       );
//                   })}
//               </div>
//           </div>
//       </nav>

//       <div className="flex-1">
//         {visibleSectionKeys.map((sectionKey) => {
//           const isToggleable = sectionsConfig[sectionKey] !== undefined;
//           const isEnabled = isToggleable ? sectionsConfig[sectionKey].enabled : true;

//           return (
//             <div
//               key={`content-${sectionKey}`}
//               className={cn(activeSection === sectionKey ? 'block' : 'hidden')}
//               role="tabpanel"
//               aria-labelledby={`nav-${sectionKey}`}
//             >
//               <Card className="bg-card border border-border shadow-lg rounded-xl">
//                 <CardHeader className="px-5 py-4 sm:px-6 sm:py-5 border-b border-border">
//                    <div className="flex justify-between items-center">
//                       <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-3">
//                         {sections[sectionKey].icon}
//                         {sections[sectionKey].label}
//                       </CardTitle>
//                     {isToggleable && (
//                       <div className="flex items-center space-x-3">
//                           <Label htmlFor={`toggle-${sectionKey}`} className="text-sm text-muted-foreground pr-1">
//                               {isEnabled ? "Enabled" : "Disabled"}
//                           </Label>
//                            <Switch
//                               id={`toggle-${sectionKey}`}
//                               checked={isEnabled}
//                               onCheckedChange={() => onSectionToggle(sectionKey)}
//                               aria-label={`Toggle ${sections[sectionKey].label} section`}
//                            />
//                       </div>
//                     )}
//                   </div>
//                    {isEnabled && sections[sectionKey].description && (
//                       <div className="mt-3 p-3 bg-muted/50 border rounded-lg">
//                           <p className="text-sm text-muted-foreground">{sections[sectionKey].description}</p>
//                       </div>
//                   )}
//                 </CardHeader>
                
//                 {isEnabled && (
//                   <CardContent className="p-5 sm:p-6 space-y-6">
//                     {sections[sectionKey].fields.map((fieldDef) => (
//                       <FieldRenderer
//                         key={fieldDef.name}
//                         fieldDef={fieldDef}
//                         basePath="" // <-- This is the corrected line
//                         content={content}
//                         onFormChange={onFormChange}
//                         onArrayChange={onArrayChange}
//                         onAddItem={onAddItem}
//                         onRemoveItem={onRemoveItem}
//                         onEnhanceField={onEnhanceField}
//                         isEnhancing={isEnhancing}
//                         formData={formData}
//                       />
//                     ))}
//                   </CardContent>
//                 )}

//                 {!isEnabled && (
//                     <CardContent className="p-10 flex flex-col items-center justify-center text-center">
//                         <p className="text-muted-foreground font-medium">This section is currently disabled.</p>
//                         <p className="text-sm text-muted-foreground/80 mt-1">Enable it using the toggle in the header to add content.</p>
//                     </CardContent>
//                 )}
//               </Card>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   );
// };

// export default ResumeForm;

import React, { useState, useMemo, useEffect } from 'react';
import { get } from 'lodash';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Trash2, Sparkles, Loader2, User, Briefcase, GraduationCap, 
  Star, Info, CheckCircle2, MessageSquareQuote, Contact, FolderKanban, X,
  BadgeCheck, FileText, HandHeart, Trophy, Languages, Users, Gavel, 
  FileCheck2, Stethoscope, Banknote, Presentation, ShieldCheck, CalendarDays,
  PlusCircle, ArrowLeft, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// FieldRenderer component remains unchanged.
const FieldRenderer = ({ 
  fieldDef, 
  basePath, 
  content, 
  onFormChange, 
  onArrayChange, 
  onAddItem, 
  onRemoveItem, 
  onEnhanceField,
  isEnhancing,
  formData
}) => {
  const fieldKey = `${basePath}-${fieldDef.name}`;
  const currentPath = basePath ? `${basePath}.${fieldDef.name}` : fieldDef.name;
  const handleChange = (e, customValue) => { const value = customValue !== undefined ? customValue : e.target.value; const pathParts = basePath.split('.'); const lastPartIsIndex = !isNaN(parseInt(pathParts[pathParts.length - 1], 10)); if (lastPartIsIndex) { const arrayPath = pathParts.slice(0, -1).join('.'); const index = parseInt(pathParts[pathParts.length - 1], 10); onArrayChange(arrayPath, index, fieldDef.name, value); } else { onFormChange(currentPath, value); } };
  if (fieldDef.type === 'group' && fieldDef.repeatable) { const retrievedItems = get(content, fieldDef.name); const itemsArray = Array.isArray(retrievedItems) ? retrievedItems : []; const createNewItem = () => { return fieldDef.subFields.reduce((acc, f) => { if (f.defaultValue) { acc[f.name] = f.defaultValue; } else if (f.type === 'group' && f.repeatable) { acc[f.name] = []; } else { acc[f.name] = f.livePreviewPlaceholder || ''; } return acc; }, {}); }; return ( <fieldset key={fieldKey} className="space-y-5 pt-2" aria-labelledby={`legend-${fieldDef.name}`}> <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"> <legend id={`legend-${fieldDef.name}`} className="text-lg font-semibold text-primary">{fieldDef.label || fieldDef.name}</legend> <Button onClick={() => onAddItem(currentPath, createNewItem())} type="button" variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto"><Plus className="w-4 h-4 mr-2" /> Add {fieldDef.singularLabel || 'Item'}</Button> </div> {itemsArray.length === 0 && <p className="text-sm text-muted-foreground italic pl-1">No {fieldDef.pluralLabel || 'items'} added yet.</p>} <div className="space-y-4"> {itemsArray.map((item, itemIndex) => ( <Card key={`${currentPath}-item-${itemIndex}`} className="bg-muted/30 dark:bg-muted/20 border-border shadow-sm relative group p-4"> <CardContent className="p-0 space-y-4"> <div className="grid grid-cols-1 md:grid-cols-1 gap-y-4"> {Array.isArray(fieldDef.subFields) && fieldDef.subFields.map((subFieldDef) => ( <FieldRenderer key={`${currentPath}-${itemIndex}-${subFieldDef.name}`} fieldDef={subFieldDef} basePath={`${currentPath}.${itemIndex}`} content={item} onFormChange={onFormChange} onArrayChange={onArrayChange} onAddItem={onAddItem} onRemoveItem={onRemoveItem} onEnhanceField={onEnhanceField} isEnhancing={isEnhancing} formData={formData} /> ))} </div> </CardContent> <Button onClick={() => onRemoveItem(currentPath, itemIndex)} type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-60 group-hover:opacity-100 transition-opacity h-7 w-7" aria-label={`Remove ${fieldDef.singularLabel || 'Item'} ${itemIndex + 1}`}><Trash2 className="w-4 h-4" /></Button> </Card> ))} </div> </fieldset> ); }
  if (['text', 'email', 'tel', 'url', 'textarea', 'date', 'number'].includes(fieldDef.type)) { const value = get(content, fieldDef.name, ''); const inputId = currentPath.replace(/\./g, '-'); const InputComponent = fieldDef.type === 'textarea' ? Textarea : Input; return ( <div key={fieldKey} className="space-y-1.5 pt-2 relative"> <Label htmlFor={inputId} className="text-sm font-medium text-foreground">{fieldDef.label || fieldDef.name}{fieldDef.required && <span className="text-destructive ml-1">*</span>}</Label> <InputComponent id={inputId} placeholder={fieldDef.placeholder || `Enter your ${fieldDef.label.toLowerCase()}`} type={fieldDef.type === 'textarea' ? undefined : fieldDef.type} name={currentPath} value={value} onChange={handleChange} required={fieldDef.required || false} className="bg-background border-input focus:border-primary focus:ring-primary" rows={fieldDef.type === 'textarea' ? (fieldDef.rows || 4) : undefined} {...(fieldDef.props || {})} /> {fieldDef.type === 'textarea' && onEnhanceField && (<Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-2 h-7 w-7 text-primary hover:bg-primary/10 hover:text-primary" onClick={() => { const jobContext = get(formData, 'content.experience[0].roles[0].jobTitle', get(formData, 'content.profile.title', 'this role')); onEnhanceField(currentPath, value, jobContext); }} disabled={isEnhancing} aria-label="Enhance with AI">{isEnhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 animate-pulse" />}</Button>)} {fieldDef.helperText && <p className="text-xs text-muted-foreground/80 pt-0.5">{fieldDef.helperText}</p>} </div> ); }
  if (fieldDef.type === 'select') { const value = get(content, fieldDef.name, ''); const inputId = currentPath.replace(/\./g, '-'); return ( <div key={fieldKey} className="space-y-1.5 pt-2"> <Label htmlFor={inputId} className="text-sm font-medium text-foreground">{fieldDef.label}</Label> <Select value={value} onValueChange={(selectValue) => handleChange(null, selectValue)}><SelectTrigger id={inputId} className="w-full bg-background border-input focus:border-primary focus:ring-primary"><SelectValue placeholder={fieldDef.placeholder || "Select an option"} /></SelectTrigger><SelectContent>{(fieldDef.options || []).filter(Boolean).map(option => (<SelectItem key={option} value={option}>{option}</SelectItem>))}</SelectContent></Select> </div> ); }
  if (fieldDef.type === 'tags') { const value = get(content, fieldDef.name, ''); const tags = value ? value.split(',').map(t => t.trim()).filter(Boolean) : []; const [inputValue, setInputValue] = useState(''); const inputId = currentPath.replace(/\./g, '-'); const addTag = () => { if (inputValue && !tags.includes(inputValue)) { const newTags = [...tags, inputValue.trim()]; handleChange(null, newTags.join(', ')); } setInputValue(''); }; const removeTag = (tagToRemove) => { const newTags = tags.filter(tag => tag !== tagToRemove); handleChange(null, newTags.join(', ')); }; return ( <div key={fieldKey} className="space-y-1.5 pt-2"> <Label htmlFor={inputId} className="text-sm font-medium text-foreground">{fieldDef.label}</Label> <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md bg-background border-input min-h-[40px]"> {tags.map(tag => (<div key={tag} className="flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full"><span>{tag}</span><button onClick={() => removeTag(tag)} type="button" className="hover:opacity-75"><X className="w-3 h-3" /></button></div>))} <Input id={inputId} type="text" value={inputValue} placeholder={fieldDef.placeholder} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} className="flex-1 bg-transparent border-none focus:ring-0 h-auto p-0" /> </div> </div> ); }
  return <div key={fieldKey} className="text-sm text-muted-foreground pt-2">Unsupported field: "{fieldDef.label || fieldDef.name}"</div>;
};


// --- Main ResumeForm Component ---
const ResumeForm = ({
  templateFieldDefinition,
  formData,
  onFormChange,
  onArrayChange,
  onAddItem,
  onRemoveItem,
  onSectionToggle,
  onEnhanceField,
  isEnhancing,
  onOpenAddSectionDialog,
  sectionProperties, // NEW PROP: Pass sectionProperties to know which sections are core
}) => {
  const content = formData?.content || {};
  const sectionsConfig = formData?.sectionsConfig || {};

  // NEW: State to manage the collapsible navigation
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  if (!Array.isArray(templateFieldDefinition) || templateFieldDefinition.length === 0) {
    return (<div className="p-6 bg-card rounded-lg shadow text-muted-foreground" role="alert"><p className="text-center">No form fields defined for this template.</p></div>);
  }

  const allSections = useMemo(() => templateFieldDefinition.reduce((acc, fieldDef) => {
    const sectionName = fieldDef.section || 'generalInfo';
    if (!acc[sectionName]) {
      const iconMap = { profile: <User className="h-4 w-4" />, contact: <Contact className="h-4 w-4" />, experience: <Briefcase className="h-4 w-4" />, education: <GraduationCap className="h-4 w-4" />, skills: <Star className="h-4 w-4" />, summary: <MessageSquareQuote className="h-4 w-4" />, projects: <FolderKanban className="h-4 w-4" />, certifications: <BadgeCheck className="h-4 w-4" />, publications: <FileText className="h-4 w-4" />, volunteering: <HandHeart className="h-4 w-4" />, awards: <Trophy className="h-4 w-4" />, languages: <Languages className="h-4 w-4" />, memberships: <Users className="h-4 w-4" />, custom: <Sparkles className="h-4 w-4" /> };
      acc[sectionName] = { label: fieldDef.sectionLabel || sectionName.charAt(0).toUpperCase() + sectionName.slice(1).replace(/([A-Z])/g, ' $1').trim(), description: fieldDef.sectionDescription || null, fields: [], icon: iconMap[sectionName] || <Info className="h-4 w-4" /> };
    }
    acc[sectionName].fields.push(fieldDef);
    return acc;
  }, {}), [templateFieldDefinition]);

  const allSectionKeys = useMemo(() => Object.keys(allSections), [allSections]);
  const enabledSectionKeys = useMemo(() => allSectionKeys.filter(key => get(sectionsConfig, `${key}.enabled`, true)), [allSectionKeys, sectionsConfig]);
  
  const [activeSection, setActiveSection] = useState(enabledSectionKeys.length > 0 ? enabledSectionKeys[0] : null);
  
  useEffect(() => {
    if (enabledSectionKeys.length > 0 && !enabledSectionKeys.includes(activeSection)) {
      setActiveSection(enabledSectionKeys[0]);
    } else if (enabledSectionKeys.length > 0 && activeSection === null) {
      setActiveSection(enabledSectionKeys[0]);
    } else if (enabledSectionKeys.length === 0) {
      setActiveSection(null);
    }
  }, [enabledSectionKeys, activeSection]);

  const activeSectionIndex = enabledSectionKeys.indexOf(activeSection);

  return (
    <div className="w-full p-1 md:p-2 flex flex-col lg:flex-row lg:gap-6">
      {/* --- UPDATED: Collapsible Navigation on Hover --- */}
      <nav 
        className={cn(
            "bg-muted/30 dark:bg-muted/20 rounded-lg border border-border self-start flex flex-col p-2 mb-4 lg:mb-0 transition-all duration-300 ease-in-out",
            isNavCollapsed ? "lg:w-20" : "lg:w-56"
        )}
        onMouseEnter={() => setIsNavCollapsed(false)}
        onMouseLeave={() => setIsNavCollapsed(true)}
      >
        <div className="flex-grow">
          <h3 className={cn("px-3 text-sm font-semibold text-foreground whitespace-nowrap pb-2 border-b border-border h-9 flex items-center transition-opacity", isNavCollapsed && "lg:opacity-0")}>
            Resume Sections
          </h3>
          <div className="mt-2 space-y-1">
            {enabledSectionKeys.map((sectionKey) => {
              const isCompleted = allSections[sectionKey].fields.some(field => {
                const value = get(content, field.name);
                if (Array.isArray(value)) { return value.some(item => Object.values(item).some(val => val && !/\[.*\]/.test(val.toString()))); }
                return value && !/\[.*\]/.test(value.toString());
              });

              return (
                <Button key={sectionKey} variant={activeSection === sectionKey ? "secondary" : "ghost"} onClick={() => setActiveSection(sectionKey)} className={cn("w-full h-auto py-2 justify-start", isNavCollapsed ? "lg:justify-center" : "lg:justify-start")}>
                  <div className={cn("flex items-center gap-3", isNavCollapsed && "lg:gap-0")}>
                    {isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" /> : <div className="h-5 w-5 flex items-center justify-center flex-shrink-0">{allSections[sectionKey].icon}</div>}
                    <span className={cn("text-sm font-medium text-left", activeSection === sectionKey ? 'text-primary' : '', isNavCollapsed && "lg:hidden")}>{allSections[sectionKey].label}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
        <div className="pt-2 mt-2 border-t border-border">
          <Button variant="outline" className="w-full" onClick={onOpenAddSectionDialog}>
            <PlusCircle className={cn("h-4 w-4", !isNavCollapsed && "mr-2")} />
            <span className={cn(isNavCollapsed && "lg:hidden")}>Add Section</span>
          </Button>
        </div>
      </nav>

      {/* --- FORM CONTENT AREA --- */}
      <div className="flex-1">
        {allSectionKeys.map((sectionKey) => {
          const isEnabled = get(sectionsConfig, `${sectionKey}.enabled`, true);
          // NEW: Check if the section is core/mandatory
          const isCoreSection = sectionProperties[sectionKey]?.isCore || false;
          
          if (!isEnabled) return null;

          return (
            <div key={`content-${sectionKey}`} className={cn(activeSection === sectionKey ? 'block' : 'hidden')} role="tabpanel">
              <Card className="bg-card border border-border shadow-lg rounded-xl">
                <CardHeader className="px-5 py-4 sm:px-6 sm:py-5 border-b border-border">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-3">{allSections[sectionKey].icon} {allSections[sectionKey].label}</CardTitle>
                    {/* --- UPDATED: Only show toggle for non-mandatory sections --- */}
                    {!isCoreSection && (
                      <div className="flex items-center space-x-3">
                        <Label htmlFor={`toggle-${sectionKey}`} className="text-sm text-muted-foreground pr-1">Enabled</Label>
                        <Switch id={`toggle-${sectionKey}`} checked={isEnabled} onCheckedChange={() => onSectionToggle(sectionKey)} aria-label={`Toggle ${allSections[sectionKey].label} section`} />
                      </div>
                    )}
                  </div>
                  {allSections[sectionKey].description && (<div className="mt-3 p-3 bg-muted/50 border rounded-lg"><p className="text-sm text-muted-foreground">{allSections[sectionKey].description}</p></div>)}
                </CardHeader>
                
                <CardContent className="p-5 sm:p-6 space-y-6">
                  {allSections[sectionKey].fields.map((fieldDef) => (
                    <FieldRenderer key={fieldDef.name} fieldDef={fieldDef} basePath="" content={content} onFormChange={onFormChange} onArrayChange={onArrayChange} onAddItem={onAddItem} onRemoveItem={onRemoveItem} onEnhanceField={onEnhanceField} isEnhancing={isEnhancing} formData={formData} />
                  ))}
                </CardContent>

                <CardFooter className="flex justify-between p-4 border-t">
                    <Button variant="outline" onClick={() => setActiveSection(enabledSectionKeys[activeSectionIndex - 1])} disabled={activeSectionIndex === 0}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                    </Button>
                    <Button onClick={() => setActiveSection(enabledSectionKeys[activeSectionIndex + 1])} disabled={activeSectionIndex === enabledSectionKeys.length - 1}>
                        Next <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </CardFooter>

              </Card>
            </div>
          )
        })}
        {activeSection === null && (
            <div className="p-10 flex flex-col items-center justify-center text-center bg-card border rounded-xl">
                <p className="text-muted-foreground font-medium">No sections are currently enabled.</p>
                <p className="text-sm text-muted-foreground/80 mt-1">Click "Add Section" to get started.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;