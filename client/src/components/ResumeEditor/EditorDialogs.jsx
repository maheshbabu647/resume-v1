import React from 'react';
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
import { CheckCircle2, AlertCircle, PlusCircle } from "lucide-react";
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
export const AddSectionDialog = ({ open, onOpenChange, sectionProperties, editorFormData, onSectionAdd }) => {
  const availableSections = Object.keys(sectionProperties)
    .filter(key => 
      sectionProperties[key].isToggleable && 
      !get(editorFormData, `sectionsConfig.${key}.enabled`, false)
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg font-semibold">
            <PlusCircle className="h-5 w-5 mr-2 text-primary" />
            Add New Section
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Select a section from the list below to add it to your resume.
        </DialogDescription>
        <div className="py-4 max-h-80 overflow-y-auto space-y-2 pr-2">
          {availableSections.length > 0 ? (
            availableSections.map(key => (
              <Button 
                key={key} 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => onSectionAdd(key)}
              >
                {sectionProperties[key].label}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">All available sections have been added.</p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};