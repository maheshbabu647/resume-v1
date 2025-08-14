import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const EnhancementDialog = ({ suggestions, originalText, onAccept, onOpenChange }) => {
    if (!suggestions) return null;

    return (
        <Dialog open={true} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-card">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-xl font-semibold">
                        <Sparkles className="h-5 w-5 mr-2 text-primary" /> AI Enhancement Suggestions
                    </DialogTitle>
                    <DialogDescription>
                        Here are some suggestions to improve your text. Click one to use it.
                    </DialogDescription>
                </DialogHeader>

                <div className="my-4 p-3 bg-muted/50 border rounded-md">
                    <p className="text-sm font-semibold mb-1 text-muted-foreground">Your Original Text:</p>
                    <p className="text-sm italic">"{originalText}"</p>
                </div>

                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                    {suggestions.action_verb_rewrites?.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Action-Oriented Rewrites</h4>
                            {suggestions.action_verb_rewrites.map((s, i) => (
                                <Button key={i} variant="outline" className="w-full justify-start text-left h-auto mb-2" onClick={() => onAccept(s)}>
                                    {s}
                                </Button>
                            ))}
                        </div>
                    )}
                     {suggestions.quantification_templates?.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">Quantifiable Templates</h4>
                            {suggestions.quantification_templates.map((s, i) => (
                                <Button key={i} variant="outline" className="w-full justify-start text-left h-auto mb-2" onClick={() => onAccept(s)}>
                                    {s}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
                
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="ghost">Close</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default EnhancementDialog