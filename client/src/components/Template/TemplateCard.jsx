import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Eye, CheckCircle, SlidersHorizontal, PlusCircle } from 'lucide-react';

const TemplateCard = ({ template }) => {
  const navigate = useNavigate();
  const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [combination, setCombination] = useState({ industry: null, sectionPresetKey: null, stylePackKey: null });

  if (!template) return null;
  const fallbackImage = 'https://placehold.co/400x566/E2E8F0/4A5568?text=Preview&font=inter';
  const imageURL = template.templateImage || fallbackImage;
  const templateName = template.templateName || 'Unnamed Template';

  // --- Memoized logic & Event Handlers (unchanged) ---
  const industryOptions = useMemo(() => {
    if (!template?.templateFieldDefinition) return [];
    const allIndustries = new Set(template.templateFieldDefinition.flatMap(field => field.recommendedFor || []));
    return Array.from(allIndustries).sort();
  }, [template]);

  const isCombinationComplete = useMemo(() => (combination.industry && combination.sectionPresetKey && combination.stylePackKey), [combination]);
  const handlePresetSelect = (presetKey) => navigate(`/resume/new/${template._id}`, { state: { presetKey } });
  const handleCombinationSelect = () => {
    const virtualPreset = { sectionPresetKey: combination.sectionPresetKey, stylePackKey: combination.stylePackKey, industry: combination.industry };
    navigate(`/resume/new/${template._id}`, { state: { virtualPreset } });
  };
  const handleSkip = () => navigate(`/resume/new/${template._id}`);
  
  return (
    <Dialog open={isPresetDialogOpen} onOpenChange={setIsPresetDialogOpen}>
      {/* --- CHANGE: Added transition and hover effect to this container --- */}
      <motion.div 
        layout 
        className="w-full transition-transform duration-300 ease-in-out hover:scale-105 hover:z-10"
      >
        <div className="relative group">
          <DialogTrigger asChild>
            <div className="aspect-[3/4] overflow-hidden cursor-pointer transition-shadow hover:shadow-xl">
              <img 
                src={imageURL} 
                alt={`Preview of ${templateName}`} 
                className="w-full h-full object-cover" 
                loading="lazy" 
                onError={e => { e.target.src = fallbackImage; }} 
              />
            </div>
          </DialogTrigger>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/60 backdrop-blur-sm transition-transform hover:scale-110"
                aria-label="Preview Template"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-auto bg-transparent border-none shadow-none p-0">
              <img src={imageURL} alt={`Enlarged preview of ${templateName}`} className="max-w-[80vw] max-h-[90vh] object-contain rounded-lg shadow-2xl" />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="text-center pt-3">
          <h3 className="text-base font-semibold text-foreground">{templateName}</h3>
        </div>
      </motion.div>
      
      <DialogContent className="max-w-5xl w-11/12 h-[85vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">Choose a Starting Point</DialogTitle>
          <DialogDescription>Select a recommended preset or build your own combination.</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {template.presets?.map((preset) => ( <div key={preset.key} onClick={() => handlePresetSelect(preset.key)} className="bg-card p-5 rounded-lg border cursor-pointer hover:border-primary hover:shadow-lg transition-all group"><h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{preset.name}</h3><p className="text-sm text-muted-foreground mt-1">Industry: {preset.industry}</p>{preset.isPrimary && <div className="inline-flex items-center text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full mt-3"><CheckCircle className="w-3.5 h-3.5 mr-1.5"/>Recommended Start</div>}</div>))}
            </div>
            <Separator className="my-8"/>
            <div className="text-center">
                <Button variant="ghost" onClick={() => setShowBuilder(!showBuilder)}><SlidersHorizontal className="mr-2 h-4 w-4" />{showBuilder ? 'Hide Builder' : 'Or, create your own combination'}</Button>
                {showBuilder && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 text-left max-w-2xl mx-auto space-y-4">
                        <Select onValueChange={(value) => setCombination(c => ({...c, industry: value}))}><SelectTrigger><SelectValue placeholder="1. Select an Industry" /></SelectTrigger><SelectContent>{industryOptions.map(ind => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}</SelectContent></Select>
                        <Select onValueChange={(value) => setCombination(c => ({...c, sectionPresetKey: value}))}><SelectTrigger><SelectValue placeholder="2. Select a Section Order" /></SelectTrigger><SelectContent>{template.templateComponents?.sectionPresets?.map(sp => <SelectItem key={sp.key} value={sp.key}>{sp.name}</SelectItem>)}</SelectContent></Select>
                        <Select onValueChange={(value) => setCombination(c => ({...c, stylePackKey: value}))}><SelectTrigger><SelectValue placeholder="3. Select a Visual Style" /></SelectTrigger><SelectContent>{template.templateComponents?.stylePacks?.map(sp => <SelectItem key={sp.key} value={sp.key}>{sp.name}</SelectItem>)}</SelectContent></Select>
                        <Button size="lg" className="w-full mt-4" disabled={!isCombinationComplete} onClick={handleCombinationSelect}><PlusCircle className="mr-2 h-5 w-5"/> Use this Combination</Button>
                    </motion.div>
                )}
            </div>
        </div>
        <DialogFooter className="p-6 border-t bg-background"><Button size="lg" variant="outline" onClick={handleSkip}>Skip & Start with Default</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateCard;
