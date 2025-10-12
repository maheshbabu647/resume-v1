import React, { useState, useMemo, useEffect, useRef } from 'react';
import { get } from 'lodash';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Trash2, Sparkles, Loader2, User, Briefcase, GraduationCap, 
  Star, Info, CheckCircle2, MessageSquareQuote, Contact, FolderKanban, X,
  BadgeCheck, FileText, HandHeart, Trophy, Languages, Users,
  PlusCircle, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// FieldRenderer component can remain unchanged as its logic is sound.
const FieldRenderer = ({ 
  fieldDef, basePath, content, onFormChange, onArrayChange, onAddItem, onRemoveItem, onEnhanceField, isEnhancing, formData, onShowTooltip
}) => {
  let currentPath;
  
  // CORRECTED PATH LOGIC
  if (basePath) { // For fields inside a repeatable item
    currentPath = `${basePath}.${fieldDef.name}`;
  } else { // For top-level fields
    currentPath = (fieldDef.section && fieldDef.name !== fieldDef.section) ? `${fieldDef.section}.${fieldDef.name}` : fieldDef.name;
  }
  const fieldKey = currentPath;

  const handleChange = (e, customValue) => {
    const value = customValue !== undefined ? customValue : e.target.value;
    const pathParts = basePath.split('.');
    const lastPartIsIndex = !isNaN(parseInt(pathParts[pathParts.length - 1], 10));

    if (lastPartIsIndex) {
      const arrayPath = pathParts.slice(0, -1).join('.');
      const index = parseInt(pathParts[pathParts.length - 1], 10);
      onArrayChange(arrayPath, index, fieldDef.name, value);
    } else {
      onFormChange(currentPath, value);
    }
  };

  if (fieldDef.type === 'group' && fieldDef.repeatable) {
    const retrievedItems = get(formData.content, currentPath);
    const itemsArray = Array.isArray(retrievedItems) ? retrievedItems : [];
    const [activeTab, setActiveTab] = useState('0');
    
    // Update active tab when items array changes
    useEffect(() => {
      const currentActiveIndex = parseInt(activeTab);
      if (currentActiveIndex >= itemsArray.length && itemsArray.length > 0) {
        setActiveTab((itemsArray.length - 1).toString());
      } else if (itemsArray.length === 0) {
        setActiveTab('0');
      }
    }, [itemsArray.length, activeTab]);
    
    const createNewItem = () => {
      return fieldDef.subFields.reduce((acc, f) => {
        if (f.defaultValue) {
          acc[f.name] = f.defaultValue;
        } else if (f.type === 'group' && f.repeatable) {
          acc[f.name] = [];
        } else {
          acc[f.name] = '';
        }
        return acc;
      }, {});
    };

    const handleAddItem = () => {
      const newItem = createNewItem();
      onAddItem(currentPath, newItem);
      // Set the new item as active tab after a short delay to ensure state is updated
      setTimeout(() => {
        setActiveTab((itemsArray.length).toString());
      }, 100);
    };

    const handleRemoveItem = (itemIndex) => {
      onRemoveItem(currentPath, itemIndex);
      // Adjust active tab if needed
      const currentActiveIndex = parseInt(activeTab);
      if (currentActiveIndex >= itemIndex) {
        const newActiveTab = Math.max(0, currentActiveIndex - 1);
        setActiveTab(newActiveTab.toString());
      }
    };

    const getItemTitle = (item, index) => {
      // Try to find a meaningful title from the item data
      const titleFields = ['title', 'company', 'school', 'name', 'position', 'degree'];
      for (const field of titleFields) {
        const value = item[field];
        if (value && value.trim()) {
          return value.trim();
        }
      }
      return `${fieldDef.singularLabel || 'Item'} ${index + 1}`;
    };

    return (
      <fieldset key={fieldKey} className="space-y-5 pt-2" aria-labelledby={`legend-${fieldDef.name}`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <legend id={`legend-${fieldDef.name}`} className="text-lg font-semibold text-primary">
            {fieldDef.label || fieldDef.name}
          </legend>
          <Button 
            onClick={handleAddItem} 
            type="button" 
            variant="outline" 
            size="sm" 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> 
            Add {fieldDef.singularLabel || 'Item'}
          </Button>
        </div>

        {itemsArray.length === 0 && (
          <p className="text-sm text-muted-foreground italic pl-1">
            No {fieldDef.pluralLabel || 'items'} added yet.
          </p>
        )}

        {itemsArray.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 h-auto p-1">
              {itemsArray.map((item, itemIndex) => (
                <TabsTrigger 
                  key={`tab-${itemIndex}`}
                  value={itemIndex.toString()}
                  className="flex items-center gap-2 text-xs px-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <span className="truncate max-w-[120px]" title={getItemTitle(item, itemIndex)}>
                    {getItemTitle(item, itemIndex)}
                  </span>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(itemIndex);
                    }}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 text-muted-foreground hover:text-destructive opacity-60 hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${fieldDef.singularLabel || 'Item'} ${itemIndex + 1}`}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </TabsTrigger>
              ))}
            </TabsList>

            {itemsArray.map((item, itemIndex) => (
              <TabsContent 
                key={`content-${itemIndex}`}
                value={itemIndex.toString()} 
                className="mt-4"
              >
                <Card className="bg-muted/30 border-border shadow-sm p-4">
                  <CardContent className="p-0 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-y-4">
                      {Array.isArray(fieldDef.subFields) && fieldDef.subFields.map((subFieldDef) => (
                        <FieldRenderer 
                          key={`${currentPath}-${itemIndex}-${subFieldDef.name}`}
                          fieldDef={subFieldDef}
                          basePath={`${currentPath}.${itemIndex}`}
                          content={item}
                          onFormChange={onFormChange}
                          onArrayChange={onArrayChange}
                          onAddItem={onAddItem}
                          onRemoveItem={onRemoveItem}
                          onEnhanceField={onEnhanceField}
                          isEnhancing={isEnhancing}
                          formData={formData}
                          onShowTooltip={onShowTooltip}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </fieldset>
    );
  }

  if (['text', 'email', 'tel', 'url', 'textarea', 'date', 'number'].includes(fieldDef.type)) { const value = get(formData.content, currentPath, ''); const inputId = currentPath.replace(/\./g, '-'); const InputComponent = fieldDef.type === 'textarea' ? Textarea : Input; return ( <div key={fieldKey} className="space-y-1.5 pt-2 relative"> <div className="flex items-center justify-between">
          <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {fieldDef.label || fieldDef.name}
            {fieldDef.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {fieldDef.tooltip && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-primary"
              onClick={() => onShowTooltip(fieldDef.label, fieldDef.tooltip)}
              aria-label={`More information about ${fieldDef.label}`}
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
        </div> <InputComponent id={inputId} placeholder={fieldDef.placeholder || `Enter your ${fieldDef.label.toLowerCase()}`} type={fieldDef.type === 'textarea' ? undefined : fieldDef.type} name={currentPath} value={value} onChange={handleChange} required={fieldDef.required || false} className="bg-background border-input focus:border-primary focus:ring-primary" rows={fieldDef.type === 'textarea' ? (fieldDef.rows || 4) : undefined} {...(fieldDef.props || {})} /> {fieldDef.type === 'textarea' && onEnhanceField && (<Button type="button" variant="ghost" size="icon" className="absolute bottom-2 right-2 h-7 w-7 text-primary hover:bg-primary/10 hover:text-primary" onClick={() => { const jobContext = get(formData, 'content.experience[0].roles[0].jobTitle', get(formData, 'content.profile.title', 'this role')); onEnhanceField(currentPath, value, jobContext); }} disabled={isEnhancing} aria-label="Enhance with AI">{isEnhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 animate-pulse" />}</Button>)} {fieldDef.helperText && <p className="text-xs text-muted-foreground/80 pt-0.5">{fieldDef.helperText}</p>} </div> ); }
  if (fieldDef.type === 'select') { const value = get(formData.content, currentPath, ''); const inputId = currentPath.replace(/\./g, '-'); return ( <div key={fieldKey} className="space-y-1.5 pt-2"> <Label htmlFor={inputId} className="text-sm font-medium text-foreground">{fieldDef.label}</Label> <Select value={value} onValueChange={(selectValue) => handleChange(null, selectValue)}><SelectTrigger id={inputId} className="w-full bg-background border-input focus:border-primary focus:ring-primary"><SelectValue placeholder={fieldDef.placeholder || "Select an option"} /></SelectTrigger><SelectContent>{(fieldDef.options || []).filter(Boolean).map(option => (<SelectItem key={option} value={option}>{option}</SelectItem>))}</SelectContent></Select> </div> ); }
  if (fieldDef.type === 'tags') { const value = get(formData.content, currentPath, ''); const tags = value ? value.split(',').map(t => t.trim()).filter(Boolean) : []; const [inputValue, setInputValue] = useState(''); const inputId = currentPath.replace(/\./g, '-'); const addTag = () => { if (inputValue && !tags.includes(inputValue)) { const newTags = [...tags, inputValue.trim()]; handleChange(null, newTags.join(', ')); } setInputValue(''); }; const removeTag = (tagToRemove) => { const newTags = tags.filter(tag => tag !== tagToRemove); handleChange(null, newTags.join(', ')); }; return ( <div key={fieldKey} className="space-y-1.5 pt-2"> <Label htmlFor={inputId} className="text-sm font-medium text-foreground">{fieldDef.label}</Label> <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md bg-background border-input min-h-[40px]"> {tags.map(tag => (<div key={tag} className="flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full"><span>{tag}</span><button onClick={() => removeTag(tag)} type="button" className="hover:opacity-75"><X className="w-3 h-3" /></button></div>))} <Input id={inputId} type="text" value={inputValue} placeholder={fieldDef.placeholder} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} className="flex-1 bg-transparent border-none focus:ring-0 h-auto p-0" /> </div> </div> ); }
  return <div key={fieldKey} className="text-sm text-muted-foreground pt-2">Unsupported field: "{fieldDef.label || fieldDef.name}"</div>;
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
  onOpenAddSectionDialog,
  sectionProperties,
  onShowTooltip,
  onSectionAdd // New prop to handle section addition
}) => {
  const content = formData?.content || {};
  const sectionsConfig = formData?.sectionsConfig || {};
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

  // Define the preferred order for sections
  const sectionOrder = ['profile', 'contact', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'publications', 'volunteering', 'awards', 'languages', 'memberships', 'custom'];
  
  const allSectionKeys = useMemo(() => {
    const keys = Object.keys(allSections);
    // Sort sections according to the preferred order, with any unlisted sections at the end
    return keys.sort((a, b) => {
      const aIndex = sectionOrder.indexOf(a);
      const bIndex = sectionOrder.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b); // Both unlisted, sort alphabetically
      if (aIndex === -1) return 1; // a is unlisted, put it at the end
      if (bIndex === -1) return -1; // b is unlisted, put it at the end
      return aIndex - bIndex; // Both listed, sort by order
    });
  }, [allSections, sectionOrder]);
  
  const enabledSectionKeys = useMemo(() => allSectionKeys.filter(key => get(sectionsConfig, `${key}.enabled`, true)), [allSectionKeys, sectionsConfig]);
  
  const [activeSection, setActiveSection] = useState(enabledSectionKeys.length > 0 ? enabledSectionKeys[0] : null);
  const prevEnabledSections = useRef([]);
  
  useEffect(() => {
    if (enabledSectionKeys.length > 0 && !enabledSectionKeys.includes(activeSection)) {
      setActiveSection(enabledSectionKeys[0]);
    } else if (enabledSectionKeys.length > 0 && activeSection === null) {
      setActiveSection(enabledSectionKeys[0]);
    } else if (enabledSectionKeys.length === 0) {
      setActiveSection(null);
    }
  }, [enabledSectionKeys, activeSection]);

  // Effect to handle new section addition - automatically show the newly added section
  useEffect(() => {
    if (enabledSectionKeys.length > prevEnabledSections.current.length) {
      // A new section was added - find which one
      const newSections = enabledSectionKeys.filter(section => !prevEnabledSections.current.includes(section));
      if (newSections.length > 0) {
        // Get the last added section (which should be at the end of the ordered list)
        const newestSection = newSections[newSections.length - 1];
        setActiveSection(newestSection);
        // Call the parent callback if provided
        if (onSectionAdd) {
          onSectionAdd(newestSection);
        }
      }
    }
    // Update the ref with current enabled sections
    prevEnabledSections.current = [...enabledSectionKeys];
  }, [enabledSectionKeys, onSectionAdd]);

  const activeSectionIndex = enabledSectionKeys.indexOf(activeSection);

  const getIsSectionCompleted = (sectionKey) => {
    return allSections[sectionKey].fields.some(field => {
      const value = get(content, field.name);
      if (Array.isArray(value)) { return value.some(item => Object.values(item).some(val => val && !/\[.*\]/.test(val.toString()))); }
      return value && !/\[.*\]/.test(value.toString());
    });
  };

  return (
    <div className="w-full p-2 md:p-4 flex flex-col lg:flex-row lg:gap-6">
      
      {/* --- Mobile Section Navigator (Horizontal Chips) --- */}
      <div className="lg:hidden pb-4 mb-4 border-b">
        <div className="flex items-center overflow-x-auto pb-2 -mb-2 gap-1 sm:gap-2">
          {enabledSectionKeys.map((sectionKey) => (
            <Button
              key={sectionKey}
              variant={activeSection === sectionKey ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection(sectionKey)}
              // FIX: Changed rounded-full to rounded-md
              className="flex-shrink-0 h-8 sm:h-9 rounded-md text-xs sm:text-sm"
            >
              {getIsSectionCompleted(sectionKey) ? (
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-500" />
              ) : (
                <div className="mr-1 sm:mr-2">{allSections[sectionKey].icon}</div>
              )}
              <span className="hidden sm:inline">{allSections[sectionKey].label}</span>
              <span className="sm:hidden">{allSections[sectionKey].label.split(' ')[0]}</span>
            </Button>
          ))}
          {/* FIX: Changed button to include text and match styling */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenAddSectionDialog} 
            className="flex-shrink-0 h-8 sm:h-9 rounded-md ml-1 sm:ml-2 text-xs sm:text-sm"
          >
             <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
             <span className="hidden sm:inline">Add Section</span>
             <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* --- Desktop Navigation (Hidden on Mobile) --- */}
      <nav 
        className={cn(
            "hidden lg:flex bg-muted/30 rounded-lg border border-border self-start flex-col p-2 mb-4 lg:mb-0 transition-all duration-300 ease-in-out relative group cursor-pointer",
            isNavCollapsed ? "lg:w-20 hover:bg-muted/40" : "lg:w-56"
        )}
        onMouseEnter={() => setIsNavCollapsed(false)}
        onMouseLeave={() => setIsNavCollapsed(true)}
      >
        {/* Hover indicator for collapsed state */}
        {isNavCollapsed && (
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
            Hover to expand sections
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-primary"></div>
          </div>
        )}
        
        {/* Subtle expand indicator */}
        {isNavCollapsed && (
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary/60 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200"></div>
        )}
        
        <div className="flex-grow">
          <h3 className={cn("px-3 text-sm font-semibold text-foreground whitespace-nowrap pb-2 border-b border-border h-9 flex items-center transition-opacity", isNavCollapsed && "lg:opacity-0")}>
            Resume Sections
          </h3>
          <div className="mt-2 space-y-1">
            {enabledSectionKeys.map((sectionKey) => (
                <div key={sectionKey} className="relative group/section">
                  <Button 
                    variant={activeSection === sectionKey ? "secondary" : "ghost"} 
                    onClick={() => setActiveSection(sectionKey)} 
                    className={cn("w-full h-auto py-2 justify-start", isNavCollapsed ? "lg:justify-center" : "lg:justify-start")}
                  >
                    <div className={cn("flex items-center gap-3", isNavCollapsed && "lg:gap-0")}>
                      {getIsSectionCompleted(sectionKey) ? <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" /> : <div className="h-5 w-5 flex items-center justify-center flex-shrink-0">{allSections[sectionKey].icon}</div>}
                      <span className={cn("text-sm font-medium text-left", activeSection === sectionKey ? 'text-primary' : '', isNavCollapsed && "lg:hidden")}>{allSections[sectionKey].label}</span>
                    </div>
                  </Button>
                  
                  {/* Tooltip for collapsed state */}
                  {isNavCollapsed && (
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-foreground text-background text-xs px-2 py-1 rounded-md shadow-lg opacity-0 group-hover/section:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {allSections[sectionKey].label}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-foreground"></div>
                    </div>
                  )}
                </div>
            ))}
          </div>
        </div>
        <div className="pt-2 mt-2 border-t border-border relative group/add-section">
          <Button variant="outline" className="w-full" onClick={onOpenAddSectionDialog}>
            <PlusCircle className={cn("h-4 w-4", !isNavCollapsed && "mr-2")} />
            <span className={cn(isNavCollapsed && "lg:hidden")}>Add Section</span>
          </Button>
          
          {/* Tooltip for Add Section button when collapsed */}
          {isNavCollapsed && (
            <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-foreground text-background text-xs px-2 py-1 rounded-md shadow-lg opacity-0 group-hover/add-section:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
              Add new section
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-foreground"></div>
            </div>
          )}
        </div>
      </nav>

      {/* --- FORM CONTENT AREA (No changes needed here) --- */}
      <div className="flex-1">
        {allSectionKeys.map((sectionKey) => {
          const isEnabled = get(sectionsConfig, `${sectionKey}.enabled`, true);
          const isCoreSection = sectionProperties[sectionKey]?.isCore || false;
          if (!isEnabled) return null;

          return (
            <div key={`content-${sectionKey}`} className={cn(activeSection === sectionKey ? 'block' : 'hidden')} role="tabpanel">
              <Card className="bg-card border border-border shadow-lg rounded-xl">
                <CardHeader className="px-4 py-3 sm:px-6 sm:py-5 border-b border-border">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground flex items-center gap-2 sm:gap-3">{allSections[sectionKey].icon} {allSections[sectionKey].label}</CardTitle>
                    {!isCoreSection && (
                      <div className="flex items-center space-x-3">
                        <Label htmlFor={`toggle-${sectionKey}`} className="text-sm text-muted-foreground pr-1">Enabled</Label>
                        <Switch id={`toggle-${sectionKey}`} checked={isEnabled} onCheckedChange={() => onSectionToggle(sectionKey)} aria-label={`Toggle ${allSections[sectionKey].label} section`} />
                      </div>
                    )}
                  </div>
                  {allSections[sectionKey].description && (<div className="mt-3 p-3 bg-muted/50 border rounded-lg"><p className="text-sm text-muted-foreground">{allSections[sectionKey].description}</p></div>)}
                </CardHeader>
                
                <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-6">
                  {allSections[sectionKey].fields.map((fieldDef) => (
                    <FieldRenderer 
                      key={fieldDef.name} 
                      fieldDef={fieldDef} 
                      basePath="" 
                      content={content} 
                      onFormChange={onFormChange} 
                      onArrayChange={onArrayChange} 
                      onAddItem={onAddItem} 
                      onRemoveItem={onRemoveItem} 
                      onEnhanceField={onEnhanceField} 
                      isEnhancing={isEnhancing} 
                      formData={formData} 
                      onShowTooltip={onShowTooltip}
                    />
                  ))}
                </CardContent>

                <CardFooter className="flex justify-between p-3 sm:p-4 border-t">
                    <Button variant="outline" onClick={() => setActiveSection(enabledSectionKeys[activeSectionIndex - 1])} disabled={activeSectionIndex === 0} className="text-sm">
                        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Previous</span><span className="sm:hidden">Prev</span>
                    </Button>
                    <Button onClick={() => setActiveSection(enabledSectionKeys[activeSectionIndex + 1])} disabled={activeSectionIndex === enabledSectionKeys.length - 1} className="text-sm">
                        <span className="hidden sm:inline">Next</span><span className="sm:hidden">Next</span> <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
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
