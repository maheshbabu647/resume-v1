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

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Sparkles } from "lucide-react";

// const EnhancementDialog = ({ suggestions, onAccept, onOpenChange }) => {
//   if (!suggestions || !suggestions.enhancements) return null;

//   return (
//     <Dialog open={true} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-3xl bg-card">
//         <DialogHeader>
//           <DialogTitle className="flex items-center text-xl font-semibold">
//             <Sparkles className="h-5 w-5 mr-2 text-primary" /> AI Enhancement Suggestions
//           </DialogTitle>
//           <DialogDescription>
//             Here are AI-generated improvements for your resume text. Click one to use it.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
//           {suggestions.enhancements.map((enh, idx) => (
//             <div
//               key={idx}
//               className="p-4 border rounded-md bg-muted/30 shadow-sm"
//             >
//               {/* Original Text */}
//               <p className="text-sm font-semibold mb-1 text-muted-foreground">
//                 Original Text:
//               </p>
//               <p className="text-sm italic mb-3">"{enh.original_text}"</p>

//               {/* Action-Oriented Rewrites */}
//               {enh.action_verb_rewrites?.length > 0 && (
//                 <div className="mb-3">
//                   <h4 className="font-semibold mb-2">
//                     Action-Oriented Rewrites
//                   </h4>
//                   {enh.action_verb_rewrites.map((s, i) => (
//                     <Button
//                       key={i}
//                       variant="outline"
//                       className="w-full justify-start text-left h-auto mb-2"
//                       onClick={() => onAccept(s)}
//                     >
//                       {s}
//                     </Button>
//                   ))}
//                 </div>
//               )}

//               {/* Quantifiable Templates */}
//               {enh.quantification_templates?.length > 0 && (
//                 <div className="mb-3">
//                   <h4 className="font-semibold mb-2">Quantifiable Templates</h4>
//                   {enh.quantification_templates.map((s, i) => (
//                     <Button
//                       key={i}
//                       variant="outline"
//                       className="w-full justify-start text-left h-auto mb-2"
//                       onClick={() => onAccept(s)}
//                     >
//                       {s}
//                     </Button>
//                   ))}
//                 </div>
//               )}

//               {/* Concise Rewrite */}
//               {enh.conciseness_rewrite && (
//                 <div className="mb-3">
//                   <h4 className="font-semibold mb-2">Concise Rewrite</h4>
//                   <Button
//                     variant="outline"
//                     className="w-full justify-start text-left h-auto"
//                     onClick={() => onAccept(enh.conciseness_rewrite)}
//                   >
//                     {enh.conciseness_rewrite}
//                   </Button>
//                 </div>
//               )}

//               {/* Grammar Correction */}
//               {enh.grammar_correction && (
//                 <div className="mt-3">
//                   <h4 className="font-semibold mb-1">Grammar Correction</h4>
//                   <p className="text-sm">
//                     {enh.grammar_correction.has_errors
//                       ? `Corrected: "${enh.grammar_correction.corrected_text}"`
//                       : "No grammar errors found"}
//                   </p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         <DialogFooter>
//           <DialogClose asChild>
//             <Button type="button" variant="ghost">
//               Close
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default EnhancementDialog;
