/**
 * @fileoverview Enhance Resume Dialog Component - AI-powered resume enhancement UI
 * @module components/ResumeEditor/EnhanceResumeDialog
 * @description Provides a complete UI for AI-powered resume enhancement,
 * including user notes input, generation progress, and diff review interface.
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { enhanceEntireResume as apiEnhanceEntireResume } from '@/api/resumeServiceApi';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Checks if a value is meaningful (not empty/placeholder)
 * @private
 * @function isMeaningful
 */
const isMeaningful = (val) => {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return false;
    if (/^\[.*\]$/.test(trimmed)) return false;
    return true;
  }
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'number') return true;
  if (typeof val === 'boolean') return true;
  if (typeof val === 'object') return Object.keys(val).length > 0;
  return false;
};

/**
 * Recursively prunes empty/placeholder content
 * @private
 * @function pruneContent
 */
const pruneContent = (node) => {
  if (Array.isArray(node)) {
    return node
      .map((item) => pruneContent(item))
      .filter((item) => isMeaningful(item));
  }
  if (node && typeof node === 'object') {
    const result = {};
    Object.entries(node).forEach(([key, value]) => {
      const prunedValue = pruneContent(value);
      if (isMeaningful(prunedValue)) {
        result[key] = prunedValue;
      }
    });
    return result;
  }
  return node;
};

/**
 * Builds diff list between original and enhanced content
 * @private
 * @function buildDiffs
 */
const buildDiffs = (originalNode, enhancedNode, basePath = '') => {
  const diffs = [];
  
  if (Array.isArray(originalNode) && Array.isArray(enhancedNode)) {
    const maxLength = Math.max(originalNode.length, enhancedNode.length);
    for (let i = 0; i < maxLength; i++) {
      const originalItem = originalNode[i];
      const enhancedItem = enhancedNode[i];
      const itemPath = basePath ? `${basePath}.${i}` : `${i}`;
      
      if (originalItem && enhancedItem && typeof originalItem === 'object' && typeof enhancedItem === 'object') {
        diffs.push(...buildDiffs(originalItem, enhancedItem, itemPath));
      } else if (originalItem !== enhancedItem) {
        const beforeStr = typeof originalItem === 'string' ? originalItem : '';
        const afterStr = typeof enhancedItem === 'string' ? enhancedItem : '';
        if (beforeStr || afterStr) {
          diffs.push({ path: itemPath, before: beforeStr, after: afterStr });
        }
      }
    }
  } else if (originalNode && enhancedNode && typeof originalNode === 'object' && typeof enhancedNode === 'object') {
    const allKeys = new Set([...Object.keys(originalNode), ...Object.keys(enhancedNode)]);
    allKeys.forEach((key) => {
      const keyPath = basePath ? `${basePath}.${key}` : key;
      const originalValue = originalNode[key];
      const enhancedValue = enhancedNode[key];
      
      if (originalValue && enhancedValue && typeof originalValue === 'object' && typeof enhancedValue === 'object') {
        diffs.push(...buildDiffs(originalValue, enhancedValue, keyPath));
      } else if (originalValue !== enhancedValue) {
        const beforeStr = typeof originalValue === 'string' ? originalValue : '';
        const afterStr = typeof enhancedValue === 'string' ? enhancedValue : '';
        if (beforeStr || afterStr) {
          diffs.push({ path: keyPath, before: beforeStr, after: afterStr });
        }
      }
    });
  } else if (originalNode !== enhancedNode) {
    const beforeStr = typeof originalNode === 'string' ? originalNode : '';
    const afterStr = typeof enhancedNode === 'string' ? enhancedNode : '';
    if (beforeStr || afterStr) {
      diffs.push({ path: basePath, before: beforeStr, after: afterStr });
    }
  }
  
  return diffs;
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Enhance Resume Dialog Component
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether dialog is open
 * @param {Function} props.onOpenChange - Handler for dialog open state change
 * @param {Object} props.editorFormData - Current resume form data
 * @param {Object} props.resumeSetupData - Resume setup context data
 * @param {Function} props.onApplyChanges - Handler to apply accepted changes
 * @returns {JSX.Element}
 */
const EnhanceResumeDialog = ({
  isOpen,
  onOpenChange,
  editorFormData,
  resumeSetupData,
  onApplyChanges
}) => {
  // ========================================================================
  // STATE
  // ========================================================================
  
  const [userNotes, setUserNotes] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [enhancedData, setEnhancedData] = useState(null);
  const [diffs, setDiffs] = useState([]);
  const [decisions, setDecisions] = useState({});
  const [currentSection, setCurrentSection] = useState(0);

  // ========================================================================
  // HANDLERS
  // ========================================================================
  
  const handleGenerate = useCallback(async () => {
    try {
      setIsEnhancing(true);
      
      const rawContent = editorFormData?.content || {};
      const cleanedContent = pruneContent(rawContent);

      const payload = {
        resumeData: cleanedContent,
        globalContext: resumeSetupData || {},
        userNotes: (userNotes || '').trim()
      };

      const enhanced = await apiEnhanceEntireResume(payload);
      setEnhancedData(enhanced);
      
      const originalContent = editorFormData?.content || {};
      const diffList = buildDiffs(originalContent, enhanced || {});
      
      setDiffs(diffList);
      setCurrentSection(0);
      setIsReviewOpen(true);
      onOpenChange(false);
      
    } catch (error) {
      console.error('[Enhance] Failed:', error);
      alert(`Enhancement failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsEnhancing(false);
    }
  }, [editorFormData, resumeSetupData, userNotes, onOpenChange]);

  const handleAccept = useCallback((path, value) => {
    onApplyChanges(path, value || '');
    setDecisions(prev => ({ ...prev, [path]: 'accepted' }));
  }, [onApplyChanges]);

  const handleReject = useCallback((path) => {
    setDecisions(prev => ({ ...prev, [path]: 'rejected' }));
  }, []);

  const handleUndoDecision = useCallback((path) => {
    setDecisions(prev => {
      const copy = { ...prev };
      delete copy[path];
      return copy;
    });
  }, []);

  const handleClose = useCallback(() => {
    setUserNotes('');
    setIsEnhancing(false);
    setIsReviewOpen(false);
    setEnhancedData(null);
    setDiffs([]);
    setDecisions({});
    setCurrentSection(0);
    onOpenChange(false);
  }, [onOpenChange]);

  // ========================================================================
  // RENDER - INPUT DIALOG
  // ========================================================================
  
  // Example prompts for enhancement
  const enhanceExamples = [
    'Make it more professional and impactful',
    'Focus on quantifiable achievements',
    'Use stronger action verbs',
    'Optimize for ATS systems',
    'Emphasize leadership skills',
    'Highlight technical expertise'
  ];

  const handleExampleClick = (example) => {
    setUserNotes(prev => {
      if (prev.trim()) {
        return `${prev}\n${example}`;
      }
      return example;
    });
  };

  return (
    <>
      <Dialog open={isOpen && !isReviewOpen} onOpenChange={(open) => { if (!isEnhancing) onOpenChange(open); }}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Enhanced Header */}
          <DialogHeader className="space-y-3 pb-4">
            <DialogTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Enhance Entire Resume
              </span>
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base leading-relaxed">
              ✨ AI will analyze and improve your entire resume. Provide optional guidance to customize the enhancements.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5">
            {/* User Notes Input */}
            <div className="space-y-3">
              <Label htmlFor="enhance-notes" className="text-sm font-semibold flex items-center gap-2">
                <span className="text-primary">💡</span>
                Enhancement Guidance (Optional)
              </Label>
              <Textarea
                id="enhance-notes"
                placeholder="E.g., 'Focus on leadership' or 'Emphasize technical skills'..."
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                rows={4}
                className="resize-none border-2 focus:border-primary transition-colors"
                disabled={isEnhancing}
              />
            </div>

            {/* Example Prompts */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <span className="text-primary">✨</span>
                Quick Suggestions - Click to add
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {enhanceExamples.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleExampleClick(example)}
                    disabled={isEnhancing}
                    className="px-3 py-2 text-xs sm:text-sm rounded-lg border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 hover:border-primary/40 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  >
                    <span className="text-primary font-medium">{example}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="rounded-xl border-2 border-primary/10 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-3 sm:p-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-primary/10 flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    What will be enhanced?
                  </p>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                    <li>• Improved wording and impact</li>
                    <li>• Better action verbs and phrasing</li>
                    <li>• Enhanced professional tone</li>
                    <li>• Optimized content structure</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Responsive Footer */}
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isEnhancing} className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleGenerate} 
              disabled={isEnhancing}
              className="w-full sm:w-auto sm:min-w-[140px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Enhance Resume
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REVIEW DIALOG - Enhanced */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="space-y-3 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span>Review AI Enhancements</span>
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Review suggested changes field by field. Accept or reject each enhancement as you see fit.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4">
            {diffs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-primary/10 mb-4">
                  <CheckCircle2 className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
                </div>
                <p className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  No Changes Suggested
                </p>
                <p className="text-sm text-muted-foreground">
                  Your resume is already well-optimized!
                </p>
              </div>
            )}
            
            {diffs.length > 0 && (() => {
              const sections = Object.entries(
                diffs.reduce((acc, diff) => {
                  const section = diff.path.split('.')[0];
                  if (!acc[section]) acc[section] = [];
                  acc[section].push(diff);
                  return acc;
                }, {})
              ).filter(([, sectionDiffs]) => sectionDiffs.length > 0);
              
              if (sections.length === 0) {
                return (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No changes suggested.</p>
                  </div>
                );
              }
              
              const [sectionName, sectionDiffs] = sections[currentSection] || [];
              
              if (!sectionName) {
                return (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No more sections to review.</p>
                  </div>
                );
              }

              const acceptedCount = sectionDiffs.filter(d => decisions[d.path] === 'accepted').length;
              const rejectedCount = sectionDiffs.filter(d => decisions[d.path] === 'rejected').length;
              const pendingCount = sectionDiffs.length - acceptedCount - rejectedCount;
              
              return (
                <div className="space-y-4">
                  {/* Navigation & Progress */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-lg bg-muted/50">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        Section {currentSection + 1} of {sections.length}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="text-muted-foreground">
                          {acceptedCount} accepted
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {rejectedCount} rejected
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          {pendingCount} pending
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                        disabled={currentSection === 0}
                        className="flex-1 sm:flex-none"
                      >
                        ← Previous
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                        disabled={currentSection === sections.length - 1}
                        className="flex-1 sm:flex-none"
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                  
                  {/* Section Header */}
                  <div className="p-4 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold capitalize">
                          {sectionName}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {sectionDiffs.length} change{sectionDiffs.length !== 1 ? 's' : ''} suggested
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Changes List */}
                  <div className="space-y-3">
                    {sectionDiffs.map(({ path, before, after }) => {
                      const decision = decisions[path];
                      const isAccepted = decision === 'accepted';
                      const isRejected = decision === 'rejected';
                      
                      return (
                        <div 
                          key={path} 
                          className={`rounded-xl border-2 p-3 sm:p-4 transition-all ${
                            isAccepted 
                              ? 'border-green-500/30 bg-green-50/50 dark:bg-green-950/20' 
                              : isRejected 
                              ? 'border-red-500/30 bg-red-50/50 dark:bg-red-950/20'
                              : 'border-border bg-card'
                          }`}
                        >
                          <div className="text-xs font-medium text-muted-foreground mb-3 font-mono">
                            {path}
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
                            {/* Before */}
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold flex items-center gap-1">
                                <span className="text-red-600 dark:text-red-400">−</span> Before
                              </Label>
                              <div className="text-xs sm:text-sm whitespace-pre-wrap bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-2 sm:p-3 min-h-[60px]">
                                {typeof before === 'string' ? before : (before ? JSON.stringify(before, null, 2) : '—')}
                              </div>
                            </div>
                            
                            {/* After */}
                            <div className="space-y-2">
                              <Label className="text-xs font-semibold flex items-center gap-1">
                                <span className="text-green-600 dark:text-green-400">+</span> After
                              </Label>
                              <div className="text-xs sm:text-sm whitespace-pre-wrap bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-2 sm:p-3 min-h-[60px]">
                                {typeof after === 'string' ? after : (after ? JSON.stringify(after, null, 2) : '—')}
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            {!isAccepted && !isRejected && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleAccept(path, after)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(path)}
                                  className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {isAccepted && (
                              <>
                                <Badge className="bg-green-600 text-white">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Accepted
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleUndoDecision(path)}
                                  className="text-xs"
                                >
                                  Undo
                                </Button>
                              </>
                            )}
                            {isRejected && (
                              <>
                                <Badge variant="destructive">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Rejected
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleUndoDecision(path)}
                                  className="text-xs"
                                >
                                  Undo
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
            <div className="flex-1 text-xs sm:text-sm text-muted-foreground">
              💡 Changes are applied in real-time as you accept them
            </div>
            <Button type="button" onClick={handleClose} className="w-full sm:w-auto sm:min-w-[120px]">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhanceResumeDialog;

