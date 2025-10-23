/**
 * @fileoverview Field Renderer Component - Renders form fields based on template definitions
 * @module components/ResumeEditor/FieldRenderer
 * @description Dynamically renders form fields (text, textarea, select, tags, repeatable groups)
 * based on template field definitions. Supports AI-powered content generation.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { get } from 'lodash';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, Trash2, X, CheckCircle2, Loader2, Wand2, 
  RefreshCw, Edit2, Info 
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { generateAIFieldContent } from '@/api/resumeServiceApi';

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

/**
 * AI Generation Dialog Component
 * @private
 * @component
 */
const AIGenerationDialog = ({
  isOpen,
  onOpenChange,
  fieldDef,
  aiConfig,
  contextData,
  userNotes,
  setUserNotes,
  generatedContent,
  setGeneratedContent,
  isGenerating,
  onGenerate,
  onAccept,
  generatedTextareaRef
}) => {
  // Example prompts based on field type
  const getExamples = () => {
    const fieldName = fieldDef.name?.toLowerCase() || '';
    const fieldLabel = fieldDef.label?.toLowerCase() || '';
    
    if (fieldName.includes('summary') || fieldLabel.includes('summary')) {
      return [
        'Focus on leadership and team management',
        'Highlight technical expertise and innovation',
        'Emphasize problem-solving and results',
        'Show career progression and growth'
      ];
    }
    if (fieldName.includes('description') || fieldLabel.includes('description')) {
      return [
        'Use action verbs and quantify achievements',
        'Focus on impact and outcomes',
        'Keep it concise and results-oriented',
        'Highlight relevant technologies used'
      ];
    }
    if (fieldName.includes('skill') || fieldLabel.includes('skill')) {
      return [
        'Group by categories (technical, soft skills)',
        'Prioritize most relevant skills',
        'Include proficiency levels',
        'Add certifications if applicable'
      ];
    }
    return [
      'Be specific and detailed',
      'Focus on achievements',
      'Use professional tone',
      'Keep it concise'
    ];
  };

  const examples = getExamples();

  const handleExampleClick = (example) => {
    setUserNotes(prev => {
      if (prev.trim()) {
        return `${prev}\n${example}`;
      }
      return example;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Gradient Header */}
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <Wand2 className="h-6 w-6 text-primary" />
            </div>
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Generate with AI
            </span>
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            {generatedContent
              ? `✨ Review and customize the generated ${fieldDef.label || fieldDef.name} below.`
              : (aiConfig?.userNotesPrompt || `📝 Provide additional context to help AI generate better ${fieldDef.label || 'content'}.`)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5">
          {!generatedContent && (
            <>
              {/* User Notes Input */}
              <div className="space-y-3">
                <Label htmlFor="user-notes" className="text-sm font-semibold flex items-center gap-2">
                  <span className="text-primary">💡</span>
                  Additional Context (Optional)
                </Label>
                <Textarea
                  id="user-notes"
                  placeholder="E.g., 'Focus on leadership skills' or 'Highlight technical achievements'..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  rows={4}
                  className="mt-1 resize-none border-2 focus:border-primary transition-colors"
                />
              </div>

              {/* Example Prompts */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <span className="text-primary">✨</span>
                  Quick Examples - Click to add
                </Label>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleExampleClick(example)}
                      className="group relative px-4 py-2 text-sm rounded-full border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 hover:border-primary/40 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
                    >
                      <span className="text-primary font-medium">{example}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Context Info Card */}
              <div className="rounded-xl border-2 border-primary/10 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      Context being used:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(contextData).map(([key, value]) => (
                        <div key={key} className="flex flex-col p-2 rounded-lg bg-background/50 border border-primary/10">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wide">{key}</span>
                          <span className="text-sm text-foreground/80 truncate mt-0.5">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {generatedContent && (
            <div className="space-y-3">
              <Label htmlFor="generated-content" className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Generated Content - Edit as needed
              </Label>
              <Textarea
                id="generated-content"
                ref={generatedTextareaRef}
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                rows={8}
                className="resize-none border-2 border-green-500/30 focus:border-green-500 bg-green-50/50 dark:bg-green-950/20 transition-colors"
              />
            </div>
          )}
        </div>
        
        {/* Footer with responsive buttons */}
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
            className="w-full sm:w-auto order-last sm:order-first"
          >
            Cancel
          </Button>

          {!generatedContent && (
            <Button 
              onClick={onGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto min-w-[140px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Now
                </>
              )}
            </Button>
          )}

          {generatedContent && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                onClick={onAccept}
                disabled={isGenerating || !generatedContent}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Accept
              </Button>
              <Button 
                variant="secondary"
                onClick={onGenerate}
                disabled={isGenerating}
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={() => generatedTextareaRef.current?.focus()}
                className="w-full sm:w-auto"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Context Requirements Modal Component
 * @private
 * @component
 */
const ContextRequirementsModal = ({
  isOpen,
  onOpenChange,
  fieldDef,
  aiConfig,
  basePath,
  formData,
  onFillFields
}) => {
  const getFieldStatus = () => {
    let filled = 0;
    let total = aiConfig?.contextFields?.length || 0;
    
    aiConfig?.contextFields?.forEach((fieldName) => {
      const contextPath = basePath
        ? `${basePath}.${fieldName}`
        : (fieldDef.section && fieldName !== fieldDef.section)
          ? `${fieldDef.section}.${fieldName}`
          : fieldName;
      const contextValue = get(formData.content, contextPath, '');
      if (contextValue && contextValue.trim()) {
        filled++;
      }
    });
    
    return { filled, total, percentage: total > 0 ? (filled / total) * 100 : 0 };
  };

  const status = getFieldStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Clean Header */}
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <span>Required Context Fields</span>
          </DialogTitle>
          
          <DialogDescription className="text-sm sm:text-base leading-relaxed">
            To generate AI content for <span className="font-semibold text-foreground">"{fieldDef.label || fieldDef.name}"</span>, 
            please complete the following fields first.
          </DialogDescription>

          {/* Subtle Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {status.filled} of {status.total} completed
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${status.percentage}%` }}
              />
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-3 py-2">
          {/* Cleaner Field Status Cards */}
          {aiConfig?.contextFields?.map((fieldName) => {
            const contextPath = basePath
              ? `${basePath}.${fieldName}`
              : (fieldDef.section && fieldName !== fieldDef.section)
                ? `${fieldDef.section}.${fieldName}`
                : fieldName;
            const contextValue = get(formData.content, contextPath, '');
            const isFilled = contextValue && contextValue.trim();
            
            return (
              <div 
                key={fieldName} 
                className={cn(
                  "rounded-lg border p-3 sm:p-4 transition-all duration-200",
                  isFilled 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-muted/50 border-muted-foreground/20'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={cn(
                    "p-1.5 rounded-md flex-shrink-0",
                    isFilled ? 'bg-primary/10' : 'bg-muted'
                  )}>
                    {isFilled ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Info className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm sm:text-base font-semibold text-foreground">
                        {fieldName}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        isFilled
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      )}>
                        {isFilled ? 'Filled' : 'Required'}
                      </span>
                    </div>
                    
                    {isFilled ? (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                        {contextValue}
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        This field needs to be filled before generating
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Additional Info */}
          {aiConfig?.userNotesPrompt && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-4 mt-4">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground mb-1">
                    Tip: You can provide additional context later
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {aiConfig.userNotesPrompt}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Responsive Footer */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button 
            onClick={onFillFields}
            className="w-full sm:w-auto sm:min-w-[140px]"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Go to Fields
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Field Renderer Component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.fieldDef - Field definition from template
 * @param {string} props.basePath - Base path for nested fields
 * @param {Object} props.content - Current content data
 * @param {Function} props.onFormChange - Handler for simple field changes
 * @param {Function} props.onArrayChange - Handler for array item changes
 * @param {Function} props.onAddItem - Handler for adding array items
 * @param {Function} props.onRemoveItem - Handler for removing array items
 * @param {Object} props.formData - Complete form data
 * @param {Function} props.onShowTooltip - Handler to show tooltip
 * @param {Object} props.resumeSetupData - Resume setup context data
 * @returns {JSX.Element}
 * @description Renders form fields dynamically based on field definitions.
 * Supports text, textarea, select, tags, and repeatable group fields.
 * Includes AI-powered content generation for supported fields.
 */
const FieldRenderer = ({ 
  fieldDef, 
  basePath, 
  content, 
  onFormChange, 
  onArrayChange, 
  onAddItem, 
  onRemoveItem, 
  formData, 
  onShowTooltip, 
  resumeSetupData
}) => {
  // ========================================================================
  // STATE
  // ========================================================================
  
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showContextModal, setShowContextModal] = useState(false);
  const generatedTextareaRef = useRef(null);
  
  // ========================================================================
  // PATH CALCULATION
  // ========================================================================
  
  let currentPath;
  if (basePath) {
    currentPath = `${basePath}.${fieldDef.name}`;
  } else {
    currentPath = (fieldDef.section && fieldDef.name !== fieldDef.section) 
      ? `${fieldDef.section}.${fieldDef.name}` 
      : fieldDef.name;
  }
  const fieldKey = currentPath;

  // ========================================================================
  // HANDLERS
  // ========================================================================
  
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

  // ========================================================================
  // AI GENERATION LOGIC
  // ========================================================================
  
  const aiConfig = fieldDef.aiConfig;
  const isAiEnabled = aiConfig?.enabled === true;
  
  const getContextData = useCallback(() => {
    if (!isAiEnabled || !aiConfig?.contextFields) return {};
    
    const contextData = {};
    aiConfig.contextFields.forEach(fieldName => {
      const contextPath = basePath
        ? `${basePath}.${fieldName}`
        : (fieldDef.section && fieldName !== fieldDef.section)
          ? `${fieldDef.section}.${fieldName}`
          : fieldName;
      const contextValue = get(formData.content, contextPath, '');
      if (contextValue && contextValue.trim()) {
        contextData[fieldName] = contextValue;
      }
    });
    return contextData;
  }, [isAiEnabled, aiConfig, basePath, fieldDef, formData]);
  
  const contextData = getContextData();
  
  const hasRequiredContext = aiConfig?.contextFields ? aiConfig.contextFields.every(fieldName => {
    const contextPath = basePath
      ? `${basePath}.${fieldName}`
      : (fieldDef.section && fieldName !== fieldDef.section)
        ? `${fieldDef.section}.${fieldName}`
        : fieldName;
    const contextValue = get(formData.content, contextPath, '');
    return contextValue && contextValue.trim();
  }) : false;
  
  const isAiButtonEnabled = isAiEnabled && hasRequiredContext;

  const handleAiGenerate = () => {
    if (!isAiButtonEnabled) {
      setShowContextModal(true);
      return;
    }
    setIsAiDialogOpen(true);
    setUserNotes('');
    setGeneratedContent('');
  };

  const handleGenerateContent = async () => {
    if (!isAiButtonEnabled) return;
    
    setIsGenerating(true);
    
    try {
      const payload = {
        fieldName: fieldDef.name,
        fieldLabel: fieldDef.label,
        fieldType: fieldDef.type,
        globalContext: resumeSetupData || {},
        localContext: contextData,
        userNotes: userNotes.trim(),
        userNotesPrompt: aiConfig?.userNotesPrompt || '',
        targetField: currentPath
      };
      
      const content = await generateAIFieldContent(payload);
      setGeneratedContent(content || '');
      setTimeout(() => {
        generatedTextareaRef.current?.focus();
      }, 50);
      
    } catch (error) {
      console.error('AI Generation Error:', error);
      alert(`AI generation failed: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptGenerated = () => {
    if (!generatedContent || isGenerating) return;
    handleChange(null, generatedContent);
    setIsAiDialogOpen(false);
    setUserNotes('');
    setGeneratedContent('');
  };

  const handleFillFields = () => {
    setShowContextModal(false);
    const firstMissingField = aiConfig?.contextFields?.find(fieldName => {
      const contextPath = basePath
        ? `${basePath}.${fieldName}`
        : (fieldDef.section && fieldName !== fieldDef.section)
          ? `${fieldDef.section}.${fieldName}`
          : fieldName;
      const contextValue = get(formData.content, contextPath, '');
      return !contextValue || !contextValue.trim();
    });
    
    if (firstMissingField) {
      const missingPath = basePath ? `${basePath}.${firstMissingField}` : firstMissingField;
      const fieldId = missingPath.replace(/\./g, '-');
      const fieldElement = document.getElementById(fieldId);
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        fieldElement.focus();
      }
    }
  };

  // ========================================================================
  // REPEATABLE GROUP RENDERING
  // ========================================================================
  
  if (fieldDef.type === 'group' && fieldDef.repeatable) {
    const retrievedItems = get(formData.content, currentPath);
    const itemsArray = Array.isArray(retrievedItems) ? retrievedItems : [];
    const [activeTab, setActiveTab] = useState('0');
    
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
      setTimeout(() => {
        setActiveTab((itemsArray.length).toString());
      }, 100);
    };

    const handleRemoveItem = (itemIndex) => {
      onRemoveItem(currentPath, itemIndex);
      const currentActiveIndex = parseInt(activeTab);
      if (currentActiveIndex >= itemIndex) {
        const newActiveTab = Math.max(0, currentActiveIndex - 1);
        setActiveTab(newActiveTab.toString());
      }
    };

    const getItemTitle = (item, index) => {
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
                          formData={formData}
                          onShowTooltip={onShowTooltip}
                          resumeSetupData={resumeSetupData}
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

  // ========================================================================
  // TEXT/TEXTAREA FIELD RENDERING
  // ========================================================================
  
  if (['text', 'email', 'tel', 'url', 'textarea', 'date', 'number'].includes(fieldDef.type)) { 
    const value = get(formData.content, currentPath, ''); 
    const inputId = currentPath.replace(/\./g, '-'); 
    const InputComponent = fieldDef.type === 'textarea' ? Textarea : Input; 
    
    return ( 
      <div key={fieldKey} className="space-y-1.5 pt-2"> 
        <div className="flex items-center justify-between">
          <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {fieldDef.label || fieldDef.name}
            {fieldDef.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <div className="flex items-center gap-2">
            {isAiEnabled && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAiGenerate}
                className={cn(
                  "h-8 px-3 text-xs",
                  isAiButtonEnabled 
                    ? "text-primary border-primary hover:bg-primary hover:text-primary-foreground" 
                    : "text-amber-600 border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                )}
                title={isAiButtonEnabled ? "Generate with AI" : "Click to see required context fields"}
              >
                <Wand2 className="h-3 w-3 mr-1" />
                Generate with AI
              </Button>
            )}
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
          </div>
        </div> 
        <InputComponent 
          id={inputId} 
          placeholder={fieldDef.placeholder || `Enter your ${fieldDef.label.toLowerCase()}`} 
          type={fieldDef.type === 'textarea' ? undefined : fieldDef.type} 
          name={currentPath} 
          value={value} 
          onChange={handleChange} 
          required={fieldDef.required || false} 
          className="bg-background border-input focus:border-primary focus:ring-primary" 
          rows={fieldDef.type === 'textarea' ? (fieldDef.rows || 4) : undefined} 
          {...(fieldDef.props || {})} 
        /> 
        {fieldDef.helperText && <p className="text-xs text-muted-foreground/80 pt-0.5">{fieldDef.helperText}</p>} 
        
        {isAiEnabled && (
          <>
            <AIGenerationDialog
              isOpen={isAiDialogOpen}
              onOpenChange={setIsAiDialogOpen}
              fieldDef={fieldDef}
              aiConfig={aiConfig}
              contextData={contextData}
              userNotes={userNotes}
              setUserNotes={setUserNotes}
              generatedContent={generatedContent}
              setGeneratedContent={setGeneratedContent}
              isGenerating={isGenerating}
              onGenerate={handleGenerateContent}
              onAccept={handleAcceptGenerated}
              generatedTextareaRef={generatedTextareaRef}
            />
            
            <ContextRequirementsModal
              isOpen={showContextModal}
              onOpenChange={setShowContextModal}
              fieldDef={fieldDef}
              aiConfig={aiConfig}
              basePath={basePath}
              formData={formData}
              onFillFields={handleFillFields}
            />
          </>
        )}
      </div> 
    ); 
  }

  // ========================================================================
  // SELECT FIELD RENDERING
  // ========================================================================
  
  if (fieldDef.type === 'select') { 
    const value = get(formData.content, currentPath, ''); 
    const inputId = currentPath.replace(/\./g, '-'); 
    return ( 
      <div key={fieldKey} className="space-y-1.5 pt-2"> 
        <Label htmlFor={inputId} className="text-sm font-medium text-foreground">{fieldDef.label}</Label> 
        <Select value={value} onValueChange={(selectValue) => handleChange(null, selectValue)}>
          <SelectTrigger id={inputId} className="w-full bg-background border-input focus:border-primary focus:ring-primary">
            <SelectValue placeholder={fieldDef.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {(fieldDef.options || []).filter(Boolean).map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select> 
      </div> 
    ); 
  }

  // ========================================================================
  // TAGS FIELD RENDERING
  // ========================================================================
  
  if (fieldDef.type === 'tags') { 
    const value = get(formData.content, currentPath, ''); 
    const tags = value ? value.split(',').map(t => t.trim()).filter(Boolean) : []; 
    const [inputValue, setInputValue] = useState(''); 
    const inputId = currentPath.replace(/\./g, '-'); 
    
    const addTag = () => { 
      if (inputValue && !tags.includes(inputValue)) { 
        const newTags = [...tags, inputValue.trim()]; 
        handleChange(null, newTags.join(', ')); 
      } 
      setInputValue(''); 
    }; 
    
    const removeTag = (tagToRemove) => { 
      const newTags = tags.filter(tag => tag !== tagToRemove); 
      handleChange(null, newTags.join(', ')); 
    }; 
    
    return ( 
      <div key={fieldKey} className="space-y-1.5 pt-2"> 
        <Label htmlFor={inputId} className="text-sm font-medium text-foreground">{fieldDef.label}</Label> 
        <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md bg-background border-input min-h-[40px]"> 
          {tags.map(tag => (
            <div key={tag} className="flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
              <span>{tag}</span>
              <button onClick={() => removeTag(tag)} type="button" className="hover:opacity-75">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))} 
          <Input 
            id={inputId} 
            type="text" 
            value={inputValue} 
            placeholder={fieldDef.placeholder} 
            onChange={(e) => setInputValue(e.target.value)} 
            onKeyDown={(e) => { 
              if (e.key === 'Enter') { 
                e.preventDefault(); 
                addTag(); 
              } 
            }} 
            className="flex-1 bg-transparent border-none focus:ring-0 h-auto p-0" 
          /> 
        </div> 
      </div> 
    ); 
  }

  // ========================================================================
  // UNSUPPORTED FIELD TYPE
  // ========================================================================
  
  return (
    <div key={fieldKey} className="text-sm text-muted-foreground pt-2">
      Unsupported field: "{fieldDef.label || fieldDef.name}"
    </div>
  );
};

export default FieldRenderer;

