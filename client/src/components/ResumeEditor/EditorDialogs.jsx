import React, { useState } from 'react';
import { get } from 'lodash';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { CheckCircle2, AlertCircle, PlusCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Feedback Dialog ---
export const FeedbackDialog = ({ open, onOpenChange, title, message, type = 'success' }) => {
  const isSuccess = type === 'success';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className={cn(
            "flex items-center text-lg font-semibold",
            isSuccess ? "text-green-600" : "text-destructive"
          )}>
            {isSuccess ? <CheckCircle2 className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="py-4 text-muted-foreground">{message}</DialogDescription>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild><Button type="button">Close</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


// --- Placeholder Warning Dialog ---
export const PlaceholderWarningDialog = ({ open, onOpenChange, onConfirm, onCancel }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg font-semibold text-amber-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            Placeholder Text Detected
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="py-4 text-muted-foreground">
          It looks like you may have left some placeholder text (like "[Your Name]") in your resume. Are you sure you want to continue?
        </DialogDescription>
        <DialogFooter className="sm:justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onCancel}>
              Go Back and Edit
            </Button>
          </DialogClose>
          <Button type="button" onClick={onConfirm}>
            Continue Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


// --- Add Section Dialog ---
export const AddSectionDialog = ({ open, onOpenChange, sectionProperties, editorFormData, onSectionAdd, currentlyVisibleSections = [] }) => {
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [addedInSession, setAddedInSession] = useState([]);

  const availableSections = Object.keys(sectionProperties)
    .filter(key => {
      // Filter out sections that are:
      // 1. Not toggleable (core sections)
      // 2. Already visible in the navigation
      // 3. Added in this dialog session
      return sectionProperties[key].isToggleable && 
             !currentlyVisibleSections.includes(key) &&
             !addedInSession.includes(key);
    });

  const handleSectionClick = (key) => {
    onSectionAdd(key);
    // Add to session tracking so it's removed from the list immediately
    setAddedInSession(prev => [...prev, key]);
    // Add to recently added list for animation
    setRecentlyAdded(prev => [...prev, key]);
    // Remove from recently added after animation (but keep in addedInSession)
    setTimeout(() => {
      setRecentlyAdded(prev => prev.filter(k => k !== key));
    }, 600);
  };

  // Reset both tracking states when dialog closes
  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setRecentlyAdded([]);
      setAddedInSession([]);
    }
    onOpenChange(isOpen);
  };

  const addedSectionsCount = currentlyVisibleSections.filter(key => 
    sectionProperties[key]?.isToggleable
  ).length + addedInSession.length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with gradient */}
        <DialogHeader className="space-y-3 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <span>Add Sections to Your Resume</span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Click on any section below to add it to your resume. You can add multiple sections at once!
          </DialogDescription>
          
          {/* Stats bar */}
          {availableSections.length > 0 && (
            <div className="flex items-center justify-between text-xs sm:text-sm bg-muted/50 rounded-lg p-2 sm:p-3">
              <span className="text-muted-foreground">
                {addedSectionsCount} section{addedSectionsCount !== 1 ? 's' : ''} added
              </span>
              <span className="text-foreground font-medium">
                {availableSections.length} available
              </span>
            </div>
          )}
        </DialogHeader>
        
        {/* Sections Grid */}
        <div className="flex-1 overflow-y-auto py-4 pr-2">
          {availableSections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableSections.map(key => {
                const section = sectionProperties[key];
                const isRecentlyAdded = recentlyAdded.includes(key);
                
                return (
                  <button
                    key={key}
                    onClick={() => handleSectionClick(key)}
                    className={cn(
                      "group relative flex items-start gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all duration-500",
                      "hover:border-primary hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                      "bg-card text-left",
                      isRecentlyAdded 
                        ? "border-primary bg-primary/5 opacity-0 scale-95" 
                        : "border-border hover:bg-primary/5 opacity-100 scale-100"
                    )}
                  >
                    {/* Icon Container */}
                    <div className={cn(
                      "p-2 sm:p-2.5 rounded-lg flex-shrink-0 transition-colors duration-300",
                      isRecentlyAdded 
                        ? "bg-primary/20" 
                        : "bg-primary/10 group-hover:bg-primary/20"
                    )}>
                      {section.icon || <PlusCircle className="h-5 w-5 text-primary" />}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1">
                        {section.label}
                      </h3>
                      {section.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                          {section.description}
                        </p>
                      )}
                    </div>

                    {/* Success indicator */}
                    {isRecentlyAdded && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 animate-bounce">
                        <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                    )}

                    {/* Hover effect */}
                    <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-primary/10 mb-4">
                <CheckCircle2 className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
              </div>
              <p className="text-base sm:text-lg font-semibold text-foreground mb-2">
                All Sections Added! 🎉
              </p>
              <p className="text-sm text-muted-foreground max-w-sm">
                You've added all available optional sections to your resume. You can manage them from the sidebar.
              </p>
            </div>
          )}
        </div>
        
        {/* Footer with helpful tip */}
        <DialogFooter className="flex-col sm:flex-row gap-3 pt-4 border-t">
          <div className="flex-1 text-xs sm:text-sm text-muted-foreground">
            💡 Tip: You can remove sections later from the sidebar
          </div>
          <DialogClose asChild>
            <Button className="w-full sm:w-auto sm:min-w-[120px]">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};