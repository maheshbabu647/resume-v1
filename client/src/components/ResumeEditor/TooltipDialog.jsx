import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from 'lucide-react';

export const TooltipDialog = ({ open, onOpenChange, title, message }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg font-semibold">
            <Info className="h-5 w-5 mr-3 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-sm text-muted-foreground whitespace-pre-line">
          {message}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};