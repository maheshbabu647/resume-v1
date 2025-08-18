// import React from 'react';
// import { get } from 'lodash';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from "@/components/ui/textarea";
// import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch"; 

// // Helper function to safely get nested values from the content object
// const getValueFromPath = (dataObject, pathString) => {
//   return get(dataObject, pathString, '');
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
// }) => {
//   const content = formData?.content || {};
//   const sectionsConfig = formData?.sectionsConfig || {};

//   if (!Array.isArray(templateFieldDefinition) || templateFieldDefinition.length === 0) {
//     return (
//       <div className="p-6 bg-card rounded-lg shadow text-muted-foreground" role="alert" aria-live="polite">
//         <p className="text-center">No form fields defined for this template.</p>
//       </div>
//     );
//   }

//   // Group all field definitions by their "section" property
//   const sections = templateFieldDefinition.reduce((acc, fieldDef) => {
//     const sectionName = fieldDef.section || 'generalInfo';
//     if (!acc[sectionName]) {
//       acc[sectionName] = {
//         label: fieldDef.sectionLabel || sectionName.charAt(0).toUpperCase() + sectionName.slice(1).replace(/([A-Z])/g, ' $1').trim(),
//         description: fieldDef.sectionDescription || null,
//         fields: []
//       };
//     }
//     acc[sectionName].fields.push(fieldDef);
//     return acc;
//   }, {});

//   const sectionKeys = Object.keys(sections);

//   // --- **NEW**: Create a filtered list of keys for visible tabs ---
//   // A tab is visible if it's not toggleable OR if it is toggleable and enabled.
//   const visibleSectionKeys = sectionKeys.filter(key => {
//     const isToggleable = sectionsConfig[key] !== undefined;
//     return !isToggleable || sectionsConfig[key].enabled;
//   });

//   // --- **MODIFIED**: Default to the first VISIBLE tab ---
//   const defaultTab = visibleSectionKeys.length > 0 ? visibleSectionKeys[0] : '';


//   return (
//     <div className="w-full p-1 md:p-2">
//       <Tabs defaultValue={defaultTab} className="w-full lg:flex lg:gap-6" orientation="vertical">
//         <TabsList
//           className="flex lg:flex-col h-auto items-stretch lg:items-start justify-start p-1 space-x-1 lg:space-x-0 lg:space-y-1 bg-muted/30 dark:bg-muted/20 rounded-lg border border-border lg:w-48 lg:sticky lg:top-24 self-start"
//           aria-label="Resume Form Sections"
//         >
//           {/* --- **MODIFIED**: Map over the visible keys to render only active tabs --- */}
//           {visibleSectionKeys.map((sectionKey) => (
//             <TabsTrigger
//               key={`tab-${sectionKey}`}
//               value={sectionKey}
//               className="w-full justify-start text-left px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md"
//               aria-label={`${sections[sectionKey].label} section`}
//             >
//               {sections[sectionKey].label}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         <div className="flex-1 mt-4 lg:mt-0">
//           {/* --- **MODIFIED**: Also map over the original keys here to render all content panes --- */}
//           {sectionKeys.map((sectionKey) => {
//             const isToggleable = sectionsConfig[sectionKey] !== undefined;
//             const isEnabled = isToggleable ? sectionsConfig[sectionKey].enabled : true;

//             return (
//               <TabsContent
//                 key={`content-${sectionKey}`}
//                 value={sectionKey}
//                 className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
//                 role="tabpanel"
//                 aria-labelledby={`tab-${sectionKey}`}
//               >
//                 <Card className="bg-card border border-border shadow-lg rounded-xl">
//                   <CardHeader className="px-5 py-4 sm:px-6 sm:py-5 border-b border-border">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">
//                           {sections[sectionKey].label}
//                         </CardTitle>
//                         {sections[sectionKey].description && (
//                           <CardDescription className="text-sm text-muted-foreground mt-1">
//                             {sections[sectionKey].description}
//                           </CardDescription>
//                         )}
//                       </div>
//                       {isToggleable && (
//                         <div className="flex items-center space-x-3">
//                             <Label htmlFor={`toggle-${sectionKey}`} className="text-sm text-muted-foreground pr-1">
//                                 {isEnabled ? "Enabled" : "Disabled"}
//                             </Label>
//                             <Switch
//                                 id={`toggle-${sectionKey}`}
//                                 checked={isEnabled}
//                                 onCheckedChange={() => onSectionToggle(sectionKey)}
//                                 aria-label={`Toggle ${sections[sectionKey].label} section`}
//                             />
//                         </div>
//                       )}
//                     </div>
//                   </CardHeader>
                  
//                   {isEnabled && (
//                     <CardContent className="p-5 sm:p-6 space-y-6">
//                       {sections[sectionKey].fields.map((fieldDef) => {
//                         const fieldKey = `${sectionKey}-${fieldDef.name}`;

//                         if (fieldDef.type === 'group' && fieldDef.repeatable) {
//                           const itemsArray = get(content, fieldDef.name, []);
//                           return (
//                             <fieldset key={fieldKey} className="space-y-5 pt-2" aria-labelledby={`legend-${fieldDef.name}`}>
//                               <div className="flex justify-between items-center">
//                                 <legend id={`legend-${fieldDef.name}`} className="text-lg font-semibold text-primary">
//                                   {fieldDef.label || fieldDef.name}
//                                 </legend>
//                                 <Button onClick={() => onAddItem(fieldDef.name, fieldDef.defaultItem || {})} type="button" variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
//                                   <Plus className="w-4 h-4 mr-2" /> Add {fieldDef.singularLabel || 'Item'}
//                                 </Button>
//                               </div>
//                               {itemsArray.length === 0 && <p className="text-sm text-muted-foreground italic pl-1">No {fieldDef.pluralLabel || 'items'} added.</p>}
//                               <div className="space-y-4">
//                                 {itemsArray.map((item, itemIndex) => (
//                                   <Card key={`${fieldDef.name}-item-${itemIndex}`} className="bg-muted/30 dark:bg-muted/20 border-border shadow-sm relative group p-4">
//                                     <CardContent className="p-0 space-y-4">
//                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
//                                         {Array.isArray(fieldDef.subFields) && fieldDef.subFields.map((subFieldDef) => {
//                                           const subId = `${fieldDef.name}-${itemIndex}-${subFieldDef.name}`.replace(/\./g, '-');
//                                           const InputComponent = subFieldDef.type === 'textarea' ? Textarea : Input;
//                                           return (
//                                             <div key={subId} className={`space-y-1.5 relative ${subFieldDef.colSpan === 2 ? 'md:col-span-2' : ''}`}>
//                                               <Label htmlFor={subId} className="text-sm font-medium text-muted-foreground">{subFieldDef.label || subFieldDef.name}{subFieldDef.required && <span className="text-destructive ml-1">*</span>}</Label>
//                                               <InputComponent id={subId} placeholder={subFieldDef.placeholder || `Enter ${subFieldDef.label.toLowerCase()}`} type={subFieldDef.type === 'textarea' ? undefined : subFieldDef.type} name={`${fieldDef.name}.${itemIndex}.${subFieldDef.name}`} value={item[subFieldDef.name] || ''} onChange={(e) => onArrayChange(fieldDef.name, itemIndex, subFieldDef.name, e.target.value)} required={subFieldDef.required || false} className="bg-background border-input focus:border-primary focus:ring-primary" rows={subFieldDef.type === 'textarea' ? (subFieldDef.rows || 3) : undefined} {...(subFieldDef.props || {})} />
                                              
//                                               {subFieldDef.type === 'textarea' && onEnhanceField && (
//                                                 <Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-2 h-7 w-7 text-primary hover:bg-primary/10 hover:text-primary"
//                                                     onClick={() => {
//                                                         const fieldPath = `${fieldDef.name}[${itemIndex}].${subFieldDef.name}`;
//                                                         const textToEnhance = item[subFieldDef.name] || '';
//                                                         const jobContext = item.jobTitle || item.title || 'this role'; 
//                                                         onEnhanceField(fieldPath, textToEnhance, jobContext);
//                                                     }}
//                                                     disabled={isEnhancing} aria-label="Enhance with AI"
//                                                 >
//                                                     {isEnhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
//                                                 </Button>
//                                               )}
//                                               {subFieldDef.helperText && <p className="text-xs text-muted-foreground/80 pt-0.5">{subFieldDef.helperText}</p>}
//                                             </div>
//                                           );
//                                         })}
//                                       </div>
//                                     </CardContent>
//                                     <Button onClick={() => onRemoveItem(fieldDef.name, itemIndex)} type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-60 group-hover:opacity-100 transition-opacity h-7 w-7" aria-label={`Remove ${fieldDef.singularLabel || 'Item'} ${itemIndex + 1}`}><Trash2 className="w-4 h-4" /></Button>
//                                   </Card>
//                                 ))}
//                               </div>
//                             </fieldset>
//                           );
//                         }

//                         if (['text', 'email', 'tel', 'url', 'textarea', 'date', 'number'].includes(fieldDef.type)) {
//                           const fieldPath = fieldDef.name;
//                           const value = getValueFromPath(content, fieldPath);
//                           const inputId = fieldPath.replace(/\./g, '-');
//                           const InputComponent = fieldDef.type === 'textarea' ? Textarea : Input;
//                           return (
//                             <div key={fieldKey} className="space-y-1.5 pt-2 relative">
//                               <Label htmlFor={inputId} className="text-sm font-medium text-muted-foreground">{fieldDef.label || fieldDef.name}{fieldDef.required && <span className="text-destructive ml-1">*</span>}</Label>
//                               <InputComponent id={inputId} placeholder={fieldDef.placeholder || `Enter your ${fieldDef.label.toLowerCase()}`} type={fieldDef.type === 'textarea' ? undefined : fieldDef.type} name={fieldPath} value={value} onChange={(e) => onFormChange(fieldPath, e.target.value)} required={fieldDef.required || false} className="bg-background border-input focus:border-primary focus:ring-primary" rows={fieldDef.type === 'textarea' ? (fieldDef.rows || 4) : undefined} {...(fieldDef.props || {})} />
                              
//                               {fieldDef.type === 'textarea' && onEnhanceField && (
//                                 <Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-2 h-7 w-7 text-primary hover:bg-primary/10 hover:text-primary"
//                                     onClick={() => {
//                                         const jobContext = get(content, 'profile.title', 'Professional');
//                                         onEnhanceField(fieldPath, value, jobContext);
//                                     }}
//                                     disabled={isEnhancing} aria-label="Enhance with AI"
//                                 >
//                                     {isEnhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
//                                 </Button>
//                               )}
//                               {fieldDef.helperText && <p className="text-xs text-muted-foreground/80 pt-0.5">{fieldDef.helperText}</p>}
//                             </div>
//                           );
//                         }
//                         return <div key={fieldKey} className="text-sm text-muted-foreground pt-2">Unsupported field: "{fieldDef.label || fieldDef.name}"</div>;
//                       })}
//                     </CardContent>
//                   )}
//                 </Card>
//               </TabsContent>
//             )
//           })}
//         </div>
//       </Tabs>
//     </div>
//   );
// };

// export default ResumeForm;

// import React, { useRef } from 'react'; // 1. Import useRef
// import { get } from 'lodash';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from "@/components/ui/textarea";
// import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch"; 

// // Helper function remains the same
// const getValueFromPath = (dataObject, pathString) => {
//   return get(dataObject, pathString, '');
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
// }) => {
//   const content = formData?.content || {};
//   const sectionsConfig = formData?.sectionsConfig || {};

//   if (!Array.isArray(templateFieldDefinition) || templateFieldDefinition.length === 0) {
//     return (
//       <div className="p-6 bg-card rounded-lg shadow text-muted-foreground" role="alert" aria-live="polite">
//         <p className="text-center">No form fields defined for this template.</p>
//       </div>
//     );
//   }

//   const sections = templateFieldDefinition.reduce((acc, fieldDef) => {
//     const sectionName = fieldDef.section || 'generalInfo';
//     if (!acc[sectionName]) {
//       acc[sectionName] = {
//         label: fieldDef.sectionLabel || sectionName.charAt(0).toUpperCase() + sectionName.slice(1).replace(/([A-Z])/g, ' $1').trim(),
//         description: fieldDef.sectionDescription || null,
//         fields: []
//       };
//     }
//     acc[sectionName].fields.push(fieldDef);
//     return acc;
//   }, {});

//   const allSectionKeys = Object.keys(sections);

//   // 2. Use a ref to store the list of tabs that should be visible.
//   // This captures the initial state set by the industry filter and prevents it from changing later.
//   const visibleTabKeysRef = useRef(null);
//   if (visibleTabKeysRef.current === null) {
//       visibleTabKeysRef.current = allSectionKeys.filter(key => {
//           const isToggleable = sectionsConfig[key] !== undefined;
//           // A tab is rendered if it's a non-toggleable core section, OR if it was enabled initially.
//           return !isToggleable || (sectionsConfig[key] && sectionsConfig[key].enabled);
//       });
//   }

//   // 3. Use the persistent list from the ref to set the default tab and render the UI.
//   const defaultTab = visibleTabKeysRef.current.length > 0 ? visibleTabKeysRef.current[0] : '';

//   return (
//     <div className="w-full p-1 md:p-2">
//       <Tabs defaultValue={defaultTab} className="w-full lg:flex lg:gap-6" orientation="vertical">
//         <TabsList
//           className="flex lg:flex-col h-auto items-stretch lg:items-start justify-start p-1 space-x-1 lg:space-x-0 lg:space-y-1 bg-muted/30 dark:bg-muted/20 rounded-lg border border-border lg:w-48 lg:sticky lg:top-24 self-start"
//           aria-label="Resume Form Sections"
//         >
//           {/* 4. Map over the persistent list in the ref to render the tabs. */}
//           {visibleTabKeysRef.current.map((sectionKey) => (
//             <TabsTrigger
//               key={`tab-${sectionKey}`}
//               value={sectionKey}
//               className="w-full justify-start text-left px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md"
//               aria-label={`${sections[sectionKey].label} section`}
//             >
//               {sections[sectionKey].label}
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         <div className="flex-1 mt-4 lg:mt-0">
//           {/* 5. Also map over the persistent list to render the content panels. */}
//           {visibleTabKeysRef.current.map((sectionKey) => {
//             const isToggleable = sectionsConfig[sectionKey] !== undefined;
//             // The isEnabled check now correctly reads the *current* state of the toggle
//             const isEnabled = isToggleable ? sectionsConfig[sectionKey].enabled : true;

//             return (
//               <TabsContent
//                 key={`content-${sectionKey}`}
//                 value={sectionKey}
//                 className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
//                 role="tabpanel"
//                 aria-labelledby={`tab-${sectionKey}`}
//               >
//                 <Card className="bg-card border border-border shadow-lg rounded-xl">
//                   <CardHeader className="px-5 py-4 sm:px-6 sm:py-5 border-b border-border">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground">
//                           {sections[sectionKey].label}
//                         </CardTitle>
//                         {sections[sectionKey].description && (
//                           <CardDescription className="text-sm text-muted-foreground mt-1">
//                             {sections[sectionKey].description}
//                           </CardDescription>
//                         )}
//                       </div>
//                       {isToggleable && (
//                         <div className="flex items-center space-x-3">
//                             <Label htmlFor={`toggle-${sectionKey}`} className="text-sm text-muted-foreground pr-1">
//                                 {isEnabled ? "Enabled" : "Disabled"}
//                             </Label>
//                             <Switch
//                                 id={`toggle-${sectionKey}`}
//                                 checked={isEnabled}
//                                 onCheckedChange={() => onSectionToggle(sectionKey)}
//                                 aria-label={`Toggle ${sections[sectionKey].label} section`}
//                             />
//                         </div>
//                       )}
//                     </div>
//                   </CardHeader>
                  
//                   {/* This logic remains the same and works correctly. */}
//                   {isEnabled && (
//                     <CardContent className="p-5 sm:p-6 space-y-6">
//                       {sections[sectionKey].fields.map((fieldDef) => {
//                         const fieldKey = `${sectionKey}-${fieldDef.name}`;

//                         if (fieldDef.type === 'group' && fieldDef.repeatable) {
//                           const itemsArray = get(content, fieldDef.name, []);
//                           return (
//                             <fieldset key={fieldKey} className="space-y-5 pt-2" aria-labelledby={`legend-${fieldDef.name}`}>
//                               <div className="flex justify-between items-center">
//                                 <legend id={`legend-${fieldDef.name}`} className="text-lg font-semibold text-primary">
//                                   {fieldDef.label || fieldDef.name}
//                                 </legend>
//                                 <Button onClick={() => onAddItem(fieldDef.name, fieldDef.defaultItem || {})} type="button" variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
//                                   <Plus className="w-4 h-4 mr-2" /> Add {fieldDef.singularLabel || 'Item'}
//                                 </Button>
//                               </div>
//                               {itemsArray.length === 0 && <p className="text-sm text-muted-foreground italic pl-1">No {fieldDef.pluralLabel || 'items'} added.</p>}
//                               <div className="space-y-4">
//                                 {itemsArray.map((item, itemIndex) => (
//                                   <Card key={`${fieldDef.name}-item-${itemIndex}`} className="bg-muted/30 dark:bg-muted/20 border-border shadow-sm relative group p-4">
//                                     <CardContent className="p-0 space-y-4">
//                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
//                                         {Array.isArray(fieldDef.subFields) && fieldDef.subFields.map((subFieldDef) => {
//                                           const subId = `${fieldDef.name}-${itemIndex}-${subFieldDef.name}`.replace(/\./g, '-');
//                                           const InputComponent = subFieldDef.type === 'textarea' ? Textarea : Input;
//                                           return (
//                                             <div key={subId} className={`space-y-1.5 relative ${subFieldDef.colSpan === 2 ? 'md:col-span-2' : ''}`}>
//                                               <Label htmlFor={subId} className="text-sm font-medium text-muted-foreground">{subFieldDef.label || subFieldDef.name}{subFieldDef.required && <span className="text-destructive ml-1">*</span>}</Label>
//                                               <InputComponent id={subId} placeholder={subFieldDef.placeholder || `Enter ${subFieldDef.label.toLowerCase()}`} type={subFieldDef.type === 'textarea' ? undefined : subFieldDef.type} name={`${fieldDef.name}.${itemIndex}.${subFieldDef.name}`} value={item[subFieldDef.name] || ''} onChange={(e) => onArrayChange(fieldDef.name, itemIndex, subFieldDef.name, e.target.value)} required={subFieldDef.required || false} className="bg-background border-input focus:border-primary focus:ring-primary" rows={subFieldDef.type === 'textarea' ? (subFieldDef.rows || 3) : undefined} {...(subFieldDef.props || {})} />
                                              
//                                               {subFieldDef.type === 'textarea' && onEnhanceField && (
//                                                 <Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-2 h-7 w-7 text-primary hover:bg-primary/10 hover:text-primary"
//                                                     onClick={() => {
//                                                         const fieldPath = `${fieldDef.name}[${itemIndex}].${subFieldDef.name}`;
//                                                         const textToEnhance = item[subFieldDef.name] || '';
//                                                         const jobContext = item.jobTitle || item.title || 'this role'; 
//                                                         onEnhanceField(fieldPath, textToEnhance, jobContext);
//                                                     }}
//                                                     disabled={isEnhancing} aria-label="Enhance with AI"
//                                                 >
//                                                     {isEnhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
//                                                 </Button>
//                                               )}
//                                               {subFieldDef.helperText && <p className="text-xs text-muted-foreground/80 pt-0.5">{subFieldDef.helperText}</p>}
//                                             </div>
//                                           );
//                                         })}
//                                       </div>
//                                     </CardContent>
//                                     <Button onClick={() => onRemoveItem(fieldDef.name, itemIndex)} type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-60 group-hover:opacity-100 transition-opacity h-7 w-7" aria-label={`Remove ${fieldDef.singularLabel || 'Item'} ${itemIndex + 1}`}><Trash2 className="w-4 h-4" /></Button>
//                                   </Card>
//                                 ))}
//                               </div>
//                             </fieldset>
//                           );
//                         }

//                         if (['text', 'email', 'tel', 'url', 'textarea', 'date', 'number'].includes(fieldDef.type)) {
//                           const fieldPath = fieldDef.name;
//                           const value = getValueFromPath(content, fieldPath);
//                           const inputId = fieldPath.replace(/\./g, '-');
//                           const InputComponent = fieldDef.type === 'textarea' ? Textarea : Input;
//                           return (
//                             <div key={fieldKey} className="space-y-1.5 pt-2 relative">
//                               <Label htmlFor={inputId} className="text-sm font-medium text-muted-foreground">{fieldDef.label || fieldDef.name}{fieldDef.required && <span className="text-destructive ml-1">*</span>}</Label>
//                               <InputComponent id={inputId} placeholder={fieldDef.placeholder || `Enter your ${fieldDef.label.toLowerCase()}`} type={fieldDef.type === 'textarea' ? undefined : fieldDef.type} name={fieldPath} value={value} onChange={(e) => onFormChange(fieldPath, e.target.value)} required={fieldDef.required || false} className="bg-background border-input focus:border-primary focus:ring-primary" rows={fieldDef.type === 'textarea' ? (fieldDef.rows || 4) : undefined} {...(fieldDef.props || {})} />
                              
//                               {fieldDef.type === 'textarea' && onEnhanceField && (
//                                 <Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-2 h-7 w-7 text-primary hover:bg-primary/10 hover:text-primary"
//                                     onClick={() => {
//                                         const jobContext = get(content, 'profile.title', 'Professional');
//                                         onEnhanceField(fieldPath, value, jobContext);
//                                     }}
//                                     disabled={isEnhancing} aria-label="Enhance with AI"
//                                 >
//                                     {isEnhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
//                                 </Button>
//                               )}
//                               {fieldDef.helperText && <p className="text-xs text-muted-foreground/80 pt-0.5">{fieldDef.helperText}</p>}
//                             </div>
//                           );
//                         }
//                         return <div key={fieldKey} className="text-sm text-muted-foreground pt-2">Unsupported field: "{fieldDef.label || fieldDef.name}"</div>;
//                       })}
//                     </CardContent>
//                   )}
//                 </Card>
//               </TabsContent>
//             )
//           })}
//         </div>
//       </Tabs>
//     </div>
//   );
// };

// export default ResumeForm;

import React, { useState, useRef } from 'react';
import { get } from 'lodash';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Sparkles, Loader2, User, Briefcase, GraduationCap, Star, Info, CheckCircle2, MessageSquareQuote, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Helper function to safely get nested values
const getValueFromPath = (dataObject, pathString) => {
  return get(dataObject, pathString, '');
};

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
}) => {
  const content = formData?.content || {};
  const sectionsConfig = formData?.sectionsConfig || {};
  
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  if (!Array.isArray(templateFieldDefinition) || templateFieldDefinition.length === 0) {
    return (
      <div className="p-6 bg-card rounded-lg shadow text-muted-foreground" role="alert" aria-live="polite">
        <p className="text-center">No form fields defined for this template.</p>
      </div>
    );
  }

  const sections = templateFieldDefinition.reduce((acc, fieldDef) => {
    const sectionName = fieldDef.section || 'generalInfo';
    if (!acc[sectionName]) {
      const iconMap = {
        profile: <User className="h-4 w-4" />,
        contact: <Info className="h-4 w-4" />,
        experience: <Briefcase className="h-4 w-4" />,
        education: <GraduationCap className="h-4 w-4" />,
        skills: <Star className="h-4 w-4" />,
        summary: <MessageSquareQuote className="h-4 w-4" />
      };
      acc[sectionName] = {
        label: fieldDef.sectionLabel || sectionName.charAt(0).toUpperCase() + sectionName.slice(1).replace(/([A-Z])/g, ' $1').trim(),
        description: fieldDef.sectionDescription || null,
        fields: [],
        icon: iconMap[sectionName] || <Info className="h-4 w-4" />,
      };
    }
    acc[sectionName].fields.push(fieldDef);
    return acc;
  }, {});

  const allSectionKeys = Object.keys(sections);

  const visibleNavKeysRef = useRef(null);
  if (visibleNavKeysRef.current === null) {
      visibleNavKeysRef.current = allSectionKeys.filter(key => {
          const isToggleable = sectionsConfig[key] !== undefined;
          return !isToggleable || (sectionsConfig[key] && sectionsConfig[key].enabled);
      });
  }

  const [activeSection, setActiveSection] = useState(
    visibleNavKeysRef.current.length > 0 ? visibleNavKeysRef.current[0] : null
  );

  return (
    // Restored to a simple flex container
    <div className="w-full p-1 md:p-2 flex flex-col lg:flex-row lg:gap-6">
      <TooltipProvider delayDuration={0}>
        {/* --- All fixed/sticky positioning has been REMOVED --- */}
        <nav className={cn(
            "bg-muted/30 dark:bg-muted/20 rounded-lg border border-border self-start flex flex-col p-2 transition-all duration-300 ease-in-out mb-4 lg:mb-0",
            isNavCollapsed ? "lg:w-20" : "lg:w-56"
        )}>
            <div className="flex-grow">
                <div className={cn(
                    "flex items-center pb-2 border-b border-border",
                    isNavCollapsed ? 'justify-center' : 'justify-between pr-2'
                )}>
                    <h3 className={cn(
                        "px-3 text-sm font-semibold text-foreground",
                        isNavCollapsed && "hidden"
                    )}>
                        Resume Sections
                    </h3>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsNavCollapsed(!isNavCollapsed)} aria-label={isNavCollapsed ? "Expand navigation" : "Collapse navigation"}>
                        {isNavCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
                    </Button>
                </div>

                <div className="mt-2 space-y-1">
                    {visibleNavKeysRef.current.map((sectionKey) => {
                        const isCompleted = sections[sectionKey].fields.some(field => {
                           const value = get(content, field.name);
                           return Array.isArray(value) ? value.length > 0 : (typeof value === 'string' && value.trim() !== '');
                        });

                        return (
                            <Tooltip key={sectionKey}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={activeSection === sectionKey ? "secondary" : "ghost"}
                                        onClick={() => {
                                          setActiveSection(sectionKey);
                                          setIsNavCollapsed(true);
                                        }}
                                        className={cn(
                                            "w-full h-auto py-2",
                                            isNavCollapsed ? "px-2 justify-center" : "px-3 justify-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex items-center gap-3",
                                            isNavCollapsed && "justify-center"
                                        )}>
                                            {isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" /> : <div className="h-5 w-5 flex items-center justify-center flex-shrink-0">{sections[sectionKey].icon}</div>}
                                            <span className={cn("text-sm font-medium text-left", activeSection === sectionKey ? 'text-primary' : '', isNavCollapsed && "lg:hidden")}>{sections[sectionKey].label}</span>
                                        </div>
                                    </Button>
                                </TooltipTrigger>
                                {isNavCollapsed && (
                                    <TooltipContent side="right">
                                        {sections[sectionKey].label}
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        );
                    })}
                </div>
            </div>
        </nav>
      </TooltipProvider>

      {/* --- Margin-left is no longer needed as the nav is in the normal flow --- */}
      <div className="flex-1">
        {allSectionKeys.map((sectionKey) => {
          const isToggleable = sectionsConfig[sectionKey] !== undefined;
          const isEnabled = isToggleable ? sectionsConfig[sectionKey].enabled : true;

          return (
            <div
              key={`content-${sectionKey}`}
              className={cn(activeSection === sectionKey ? 'block' : 'hidden')}
              role="tabpanel"
              aria-labelledby={`nav-${sectionKey}`}
            >
              <Card className="bg-card border border-border shadow-lg rounded-xl">
                <CardHeader className="px-5 py-4 sm:px-6 sm:py-5 border-b border-border">
                   <div className="flex justify-between items-center">
                      <CardTitle className="text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-3">
                        {sections[sectionKey].icon}
                        {sections[sectionKey].label}
                      </CardTitle>
                    {isToggleable && (
                      <div className="flex items-center space-x-3">
                          <Label htmlFor={`toggle-${sectionKey}`} className="text-sm text-muted-foreground pr-1">
                              {isEnabled ? "Enabled" : "Disabled"}
                          </Label>
                           <Switch
                              id={`toggle-${sectionKey}`}
                              checked={isEnabled}
                              onCheckedChange={() => onSectionToggle(sectionKey)}
                              aria-label={`Toggle ${sections[sectionKey].label} section`}
                           />
                      </div>
                    )}
                  </div>
                   {isEnabled && sections[sectionKey].description && (
                      <div className="mt-3 p-3 bg-muted/50 border rounded-lg">
                          <p className="text-sm text-muted-foreground">{sections[sectionKey].description}</p>
                      </div>
                  )}
                </CardHeader>
                
                {isEnabled && (
                  <CardContent className="p-5 sm:p-6 space-y-6">
                    {sections[sectionKey].fields.map((fieldDef) => {
                      const fieldKey = `${sectionKey}-${fieldDef.name}`;

                      if (fieldDef.type === 'group' && fieldDef.repeatable) {
                        const itemsArray = get(content, fieldDef.name, []);
                        return (
                          <fieldset key={fieldKey} className="space-y-5 pt-2" aria-labelledby={`legend-${fieldDef.name}`}>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                              <legend id={`legend-${fieldDef.name}`} className="text-lg font-semibold text-primary">
                                {fieldDef.label || fieldDef.name}
                              </legend>
                              <Button onClick={() => onAddItem(fieldDef.name, fieldDef.defaultItem || {})} type="button" variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto">
                                <Plus className="w-4 h-4 mr-2" /> Add {fieldDef.singularLabel || 'Item'}
                              </Button>
                            </div>
                            {itemsArray.length === 0 && <p className="text-sm text-muted-foreground italic pl-1">No {fieldDef.pluralLabel || 'items'} added yet.</p>}
                            <div className="space-y-4">
                              {itemsArray.map((item, itemIndex) => (
                                <Card key={`${fieldDef.name}-item-${itemIndex}`} className="bg-muted/30 dark:bg-muted/20 border-border shadow-sm relative group p-4">
                                  <CardContent className="p-0 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-y-4">
                                      {Array.isArray(fieldDef.subFields) && fieldDef.subFields.map((subFieldDef) => {
                                        const subId = `${fieldDef.name}-${itemIndex}-${subFieldDef.name}`.replace(/\./g, '-');
                                        const InputComponent = subFieldDef.type === 'textarea' ? Textarea : Input;
                                        return (
                                          <div key={subId} className={`space-y-1.5 relative`}>
                                            <Label htmlFor={subId} className="text-sm font-medium text-foreground">{subFieldDef.label || subFieldDef.name}{subFieldDef.required && <span className="text-destructive ml-1">*</span>}</Label>
                                            <InputComponent id={subId} placeholder={subFieldDef.placeholder || `Enter ${subFieldDef.label.toLowerCase()}`} type={subFieldDef.type === 'textarea' ? undefined : subFieldDef.type} name={`${fieldDef.name}.${itemIndex}.${subFieldDef.name}`} value={item[subFieldDef.name] || ''} onChange={(e) => onArrayChange(fieldDef.name, itemIndex, subFieldDef.name, e.target.value)} required={subFieldDef.required || false} className="bg-background border-input focus:border-primary focus:ring-primary" rows={subFieldDef.type === 'textarea' ? (subFieldDef.rows || 3) : undefined} {...(subFieldDef.props || {})} />
                                            {subFieldDef.type === 'textarea' && onEnhanceField && (
                                              <Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-2 h-7 w-7 text-primary hover:bg-primary/10 hover:text-primary" onClick={() => {
                                                  const fieldPath = `${fieldDef.name}[${itemIndex}].${subFieldDef.name}`;
                                                  const textToEnhance = item[subFieldDef.name] || '';
                                                  const jobContext = item.jobTitle || item.title || 'this role';
                                                  onEnhanceField(fieldPath, textToEnhance, jobContext);
                                              }} disabled={isEnhancing} aria-label="Enhance with AI">
                                                  {isEnhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                              </Button>
                                            )}
                                            {subFieldDef.helperText && <p className="text-xs text-muted-foreground/80 pt-0.5">{subFieldDef.helperText}</p>}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </CardContent>
                                  <Button onClick={() => onRemoveItem(fieldDef.name, itemIndex)} type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-60 group-hover:opacity-100 transition-opacity h-7 w-7" aria-label={`Remove ${fieldDef.singularLabel || 'Item'} ${itemIndex + 1}`}><Trash2 className="w-4 h-4" /></Button>
                                </Card>
                              ))}
                            </div>
                          </fieldset>
                        );
                      }

                      if (['text', 'email', 'tel', 'url', 'textarea', 'date', 'number'].includes(fieldDef.type)) {
                        const fieldPath = fieldDef.name;
                        const value = getValueFromPath(content, fieldPath);
                        const inputId = fieldPath.replace(/\./g, '-');
                        const InputComponent = fieldDef.type === 'textarea' ? Textarea : Input;
                        return (
                          <div key={fieldKey} className="space-y-1.5 pt-2 relative">
                            <Label htmlFor={inputId} className="text-sm font-medium text-foreground">{fieldDef.label || fieldDef.name}{fieldDef.required && <span className="text-destructive ml-1">*</span>}</Label>
                            <InputComponent id={inputId} placeholder={fieldDef.placeholder || `Enter your ${fieldDef.label.toLowerCase()}`} type={fieldDef.type === 'textarea' ? undefined : fieldDef.type} name={fieldPath} value={value} onChange={(e) => onFormChange(fieldPath, e.target.value)} required={fieldDef.required || false} className="bg-background border-input focus:border-primary focus:ring-primary" rows={fieldDef.type === 'textarea' ? (fieldDef.rows || 4) : undefined} {...(fieldDef.props || {})} />
                            {fieldDef.type === 'textarea' && onEnhanceField && (
                              <Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-2 h-7 w-7 text-primary hover:bg-primary/10 hover:text-primary" onClick={() => {
                                  const jobContext = get(content, 'profile.title', 'Professional');
                                  onEnhanceField(fieldPath, value, jobContext);
                              }} disabled={isEnhancing} aria-label="Enhance with AI">
                                  {isEnhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                              </Button>
                            )}
                            {fieldDef.helperText && <p className="text-xs text-muted-foreground/80 pt-0.5">{fieldDef.helperText}</p>}
                          </div>
                        );
                      }
                      return <div key={fieldKey} className="text-sm text-muted-foreground pt-2">Unsupported field: "{fieldDef.label || fieldDef.name}"</div>;
                    })}
                  </CardContent>
                )}

                {!isEnabled && (
                    <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                        <p className="text-muted-foreground font-medium">This section is currently disabled.</p>
                        <p className="text-sm text-muted-foreground/80 mt-1">Enable it using the toggle in the header to add content.</p>
                    </CardContent>
                )}
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default ResumeForm;