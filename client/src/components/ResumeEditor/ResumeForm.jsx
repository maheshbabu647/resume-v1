import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { get } from 'lodash';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  Plus, Trash2, Sparkles, Loader2, User, Briefcase, GraduationCap, 
  Star, Info, CheckCircle2, MessageSquareQuote, Contact, FolderKanban, X,
  BadgeCheck, FileText, HandHeart, Trophy, Languages, Users,
  PlusCircle, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Wand2, RefreshCw, Edit2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { generateAIFieldContent } from '@/api/resumeServiceApi';

// FieldRenderer component can remain unchanged as its logic is sound.
const FieldRenderer = ({ 
  fieldDef, basePath, content, onFormChange, onArrayChange, onAddItem, onRemoveItem, formData, onShowTooltip, resumeSetupData
}) => {
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showContextModal, setShowContextModal] = useState(false);
  const generatedTextareaRef = useRef(null);
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

  if (['text', 'email', 'tel', 'url', 'textarea', 'date', 'number'].includes(fieldDef.type)) { 
    const value = get(formData.content, currentPath, ''); 
    const inputId = currentPath.replace(/\./g, '-'); 
    const InputComponent = fieldDef.type === 'textarea' ? Textarea : Input; 
    
    // Check if AI is enabled for this field
    const aiConfig = fieldDef.aiConfig;
    const isAiEnabled = aiConfig?.enabled === true;
    
    // Collect context fields data if AI is enabled
    const getContextData = () => {
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
    };
    
    const contextData = getContextData();
    const hasRequiredContext = aiConfig?.contextFields ? aiConfig.contextFields.every(fieldName => {
      const contextPath = basePath
        ? `${basePath}.${fieldName}`
        : (fieldDef.section && fieldName !== fieldDef.section)
          ? `${fieldDef.section}.${fieldName}`
          : fieldName;
      const contextValue = get(formData.content, contextPath, '');
      const isFilled = contextValue && contextValue.trim();
      
   
      return isFilled;
    }) : false;
    
    const isAiButtonEnabled = isAiEnabled && hasRequiredContext;
  
    const handleAiGenerate = () => {
      if (!isAiButtonEnabled) {
        // Show context modal to highlight missing fields
        setShowContextModal(true);
        return;
      }
      
      // Open the user notes dialog
      setIsAiDialogOpen(true);
      setUserNotes('');
      setGeneratedContent('');
    };

    const handleGenerateContent = async () => {
      if (!isAiButtonEnabled) return;
      
      setIsGenerating(true);
      
      try {
        // Create the payload with global context, local context, and user notes
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
        
        console.log('AI Generation Payload:', payload);
        
        // Call the AI API
        const content = await generateAIFieldContent(payload);
        setGeneratedContent(content || '');
        // Keep dialog open to allow Accept/Regenerate/Edit
        setTimeout(() => {
          try { generatedTextareaRef.current?.focus(); } catch {}
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

    const handleEditFocus = () => {
      try { generatedTextareaRef.current?.focus(); } catch {}
    };
    
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
        
        {/* AI Generation Dialog */}
        {isAiEnabled && (
          <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
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
                        {(() => {
                          const fieldName = fieldDef.name?.toLowerCase() || '';
                          const fieldLabel = fieldDef.label?.toLowerCase() || '';
                          let examples = [];
                          
                          if (fieldName.includes('summary') || fieldLabel.includes('summary')) {
                            examples = [
                              'Focus on leadership and team management',
                              'Highlight technical expertise and innovation',
                              'Emphasize problem-solving and results',
                              'Show career progression and growth'
                            ];
                          } else if (fieldName.includes('description') || fieldLabel.includes('description')) {
                            examples = [
                              'Use action verbs and quantify achievements',
                              'Focus on impact and outcomes',
                              'Keep it concise and results-oriented',
                              'Highlight relevant technologies used'
                            ];
                          } else if (fieldName.includes('skill') || fieldLabel.includes('skill')) {
                            examples = [
                              'Group by categories (technical, soft skills)',
                              'Prioritize most relevant skills',
                              'Include proficiency levels',
                              'Add certifications if applicable'
                            ];
                          } else {
                            examples = [
                              'Be specific and detailed',
                              'Focus on achievements',
                              'Use professional tone',
                              'Keep it concise'
                            ];
                          }
                          
                          return examples.map((example, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setUserNotes(prev => {
                                  if (prev.trim()) {
                                    return `${prev}\n${example}`;
                                  }
                                  return example;
                                });
                              }}
                              className="group relative px-4 py-2 text-sm rounded-full border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 hover:border-primary/40 transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
                            >
                              <span className="text-primary font-medium">{example}</span>
                            </button>
                          ));
                        })()}
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
                  onClick={() => setIsAiDialogOpen(false)}
                  disabled={isGenerating}
                  className="w-full sm:w-auto order-last sm:order-first"
                >
                  Cancel
                </Button>

                {!generatedContent && (
                  <Button 
                    onClick={handleGenerateContent}
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
                      onClick={handleAcceptGenerated}
                      disabled={isGenerating || !generatedContent}
                      className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-lg"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={handleGenerateContent}
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
                      onClick={handleEditFocus}
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
        )}

        {/* Context Requirements Modal */}
        {isAiEnabled && (
          <Dialog open={showContextModal} onOpenChange={setShowContextModal}>
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
                      {(() => {
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
                        return `${filled} of ${total} completed`;
                      })()}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500 ease-out"
                      style={{ 
                        width: `${(() => {
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
                          return total > 0 ? (filled / total) * 100 : 0;
                        })()}%` 
                      }}
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
                  onClick={() => setShowContextModal(false)}
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setShowContextModal(false);
                    // Scroll to the first missing field if possible
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
                  }}
                  className="w-full sm:w-auto sm:min-w-[140px]"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Go to Fields
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div> 
    ); 
  }
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
  onOpenAddSectionDialog,
  sectionProperties,
  onShowTooltip,
  onSectionAdd, // New prop to handle section addition
  resumeSetupData, // Add resumeSetupData prop
  onGetEnabledSections // Callback to pass enabled sections to parent
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
  
  // Track initially enabled sections (from template setup)
  const initiallyEnabledSections = useRef(null);
  
  // Helper function to check if a section has any data
  const sectionHasData = useCallback((sectionKey) => {
    const sectionFields = allSections[sectionKey]?.fields || [];
    return sectionFields.some(field => {
      // Construct the correct path to check for the field value
      // If field has a section and field.name is not the same as the section, use section.name
      const fieldPath = (field.section && field.name !== field.section) 
        ? `${field.section}.${field.name}` 
        : field.name;
      
      const value = get(content, fieldPath);
      
      // Check if value has actual data (not empty, not placeholder)
      if (Array.isArray(value)) {
        // For arrays, check if any item has any non-empty, non-placeholder value
        return value.some(item => {
          if (typeof item === 'object' && item !== null) {
            return Object.values(item).some(val => val && val !== '' && !/^\[.*\]$/.test(val.toString()));
          }
          return item && item !== '' && !/^\[.*\]$/.test(item.toString());
        });
      }
      
      // For non-arrays, check if value exists and is not empty or placeholder
      return value && value !== '' && !/^\[.*\]$/.test(value.toString());
    });
  }, [allSections, content]);

  const enabledSectionKeys = useMemo(() => {
    // Get sections that are enabled in config (default to true for initial load)
    const configEnabledSections = allSectionKeys.filter(key => 
      get(sectionsConfig, `${key}.enabled`, true)
    );
    
    // Store initially enabled sections on first load
    if (initiallyEnabledSections.current === null) {
      initiallyEnabledSections.current = configEnabledSections;
    }
    
    // Get sections with data (from imported resume)
    const sectionsWithData = allSectionKeys.filter(key => sectionHasData(key));
    
    // Get manually enabled sections (explicitly enabled via Add Section dialog)
    // Only include if there's an EXPLICIT enabled: true in config (not default)
    const manuallyEnabledSections = allSectionKeys.filter(key => {
      const hasExplicitEnabled = sectionsConfig[key]?.enabled === true;
      const wasNotInitial = !initiallyEnabledSections.current.includes(key);
      const hasNoData = !sectionsWithData.includes(key);
      return hasExplicitEnabled && wasNotInitial && hasNoData;
    });
    
    // Combine three sources:
    // 1. Initially enabled sections (from template)
    // 2. Sections with parsed data (from resume parsing)
    // 3. Manually enabled sections (from Add Section dialog)
    const combinedSections = [
      ...initiallyEnabledSections.current,
      ...sectionsWithData.filter(key => !initiallyEnabledSections.current.includes(key)),
      ...manuallyEnabledSections
    ];
    
    // Filter out explicitly disabled sections (when user toggles them off)
    // If a section has enabled: false in config, it should be removed from nav
    const finalSections = allSectionKeys.filter(key => {
      const isInCombined = combinedSections.includes(key);
      const isExplicitlyDisabled = sectionsConfig[key]?.enabled === false;
      return isInCombined && !isExplicitlyDisabled;
    });
    
    return finalSections;
    
  }, [allSectionKeys, sectionsConfig, sectionHasData]);
  
  const [activeSection, setActiveSection] = useState(null);
  const prevEnabledSections = useRef([]);
  const isInitialLoad = useRef(true);
  
  // Effect to ensure we always start with the first section (profile) when template loads
  useEffect(() => {
    if (enabledSectionKeys.length > 0) {
      // Only set to first section on initial load or if current section is no longer enabled
      if (isInitialLoad.current || !enabledSectionKeys.includes(activeSection)) {
        setActiveSection(enabledSectionKeys[0]);
        isInitialLoad.current = false;
      }
    } else {
      setActiveSection(null);
    }
  }, [enabledSectionKeys, activeSection]);

  // Effect to handle new section addition - automatically show the newly added section
  useEffect(() => {
    if (enabledSectionKeys.length > prevEnabledSections.current.length) {
      // A new section was added - find which one
      const newSections = enabledSectionKeys.filter(section => !prevEnabledSections.current.includes(section));
      if (newSections.length > 0) {
        // Only auto-switch to new section if we already have an active section (not initial load)
        if (activeSection !== null) {
          // Get the last added section (which should be at the end of the ordered list)
          const newestSection = newSections[newSections.length - 1];
          setActiveSection(newestSection);
          // Call the parent callback if provided
          if (onSectionAdd) {
            onSectionAdd(newestSection);
          }
        }
      }
    }
    // Update the ref with current enabled sections
    prevEnabledSections.current = [...enabledSectionKeys];
  }, [enabledSectionKeys, onSectionAdd, activeSection]);

  const activeSectionIndex = enabledSectionKeys.indexOf(activeSection);

  const getIsSectionCompleted = (sectionKey) => {
    return allSections[sectionKey].fields.some(field => {
      // Construct the correct path to check for the field value
      // If field has a section and field.name is not the same as the section, use section.name
      const fieldPath = (field.section && field.name !== field.section) 
        ? `${field.section}.${field.name}` 
        : field.name;
      
      const value = get(content, fieldPath);
      
      // Check if value exists and is not a placeholder
      if (Array.isArray(value)) { 
        return value.some(item => {
          if (typeof item === 'object' && item !== null) {
            return Object.values(item).some(val => val && val !== '' && !/^\[.*\]$/.test(val.toString()));
          }
          return item && item !== '' && !/^\[.*\]$/.test(item.toString());
        });
      }
      
      return value && value !== '' && !/^\[.*\]$/.test(value.toString());
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
            onClick={() => {
              if (onGetEnabledSections) onGetEnabledSections(enabledSectionKeys);
              onOpenAddSectionDialog();
            }} 
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
          <Button variant="outline" className="w-full" onClick={() => {
            if (onGetEnabledSections) onGetEnabledSections(enabledSectionKeys);
            onOpenAddSectionDialog();
          }}>
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
                      formData={formData} 
                      onShowTooltip={onShowTooltip}
                      resumeSetupData={resumeSetupData}
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
