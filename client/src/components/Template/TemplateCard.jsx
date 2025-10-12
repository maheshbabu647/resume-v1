
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Make sure AnimatePresence is imported

// --- UI Components ---
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
import { 
  Eye, 
  PenSquare, 
  CheckCircle, 
  SlidersHorizontal, 
  PlusCircle, 
  Sparkles, 
  Star, 
  Zap,
  Crown,
  ArrowRight,
  X
} from 'lucide-react';


const TemplateCard = ({ template }) => {
  const navigate = useNavigate();
  const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [combination, setCombination] = useState({ 
    industry: null, 
    sectionPresetKey: null, 
    stylePackKey: null 
  });

  if (!template) return null;

  const fallbackImage = 'https://placehold.co/400x566/E2E8F0/4A5568?text=Preview&font=inter';
  const imageURL = template.templateImage || fallbackImage;
  const templateName = template.templateName || 'Unnamed Template';

  const industryOptions = useMemo(() => {
    if (!template?.templateFieldDefinition) return [];
    const allIndustries = new Set();
    template.templateFieldDefinition.forEach(field => {
      if (Array.isArray(field.recommendedFor)) {
        field.recommendedFor.forEach(industry => allIndustries.add(industry));
      }
    });
    return Array.from(allIndustries).sort();
  }, [template]);

  const handlePresetSelect = (presetKey) => navigate(`/resume/new/${template._id}`, { state: { presetKey } });
  const handleCombinationSelect = () => {
    const virtualPreset = {
      sectionPresetKey: combination.sectionPresetKey,
      stylePackKey: combination.stylePackKey,
      industry: combination.industry,
    };
    navigate(`/resume/new/${template._id}`, { state: { virtualPreset } });
  };
  const handleSkip = () => navigate(`/resume/new/${template._id}`);
  const isCombinationComplete = useMemo(() => (
    combination.industry && combination.sectionPresetKey && combination.stylePackKey
  ), [combination]);

  const handleCardClick = () => {
    setIsPresetDialogOpen(true);
  };

  return (
    <Dialog open={isPresetDialogOpen} onOpenChange={setIsPresetDialogOpen}>
      <motion.div
        className="group relative border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-card w-full h-full flex flex-col cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={handleCardClick}
      >
        <div className="relative aspect-[3/4] sm:aspect-[3/4] md:aspect-[3/4] lg:aspect-[3/4] xl:aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={imageURL}
            alt={`${templateName} template`}
            className="w-full h-full object-cover object-top lg:group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = fallbackImage; }}
          />
          
          {/* Small preview icon for mobile devices */}
          <div className="absolute top-2 left-2 lg:hidden">
            <Dialog>
              <DialogTrigger asChild>
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button size="sm" variant="outline" className="bg-card/90 backdrop-blur-sm border-border hover:bg-card rounded-lg shadow-lg text-xs px-1.5 py-1.5">
                    <Eye className="w-3 h-3" />
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-2 border-0 bg-transparent shadow-none max-h-[90vh] overflow-y-auto">
                <img src={imageURL} alt={`${templateName} large preview`} className="w-full h-auto rounded-lg shadow-2xl" />
              </DialogContent>
            </Dialog>
          </div>

          {/* Hover overlay for desktop users only */}
          <div className="hidden lg:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-2 sm:gap-3">
            <DialogTrigger asChild>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Button size="sm" className="bg-gradient-to-r from-primary to-accent-purple hover:opacity-90 text-primary-foreground rounded-lg shadow-lg text-xs px-3 py-2">
                  <PenSquare className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Use Template</span>
                  <span className="sm:hidden">Use</span>
                </Button>
              </motion.div>
            </DialogTrigger>
            
            <Dialog>
              <DialogTrigger asChild>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button size="sm" variant="outline" className="bg-card/90 backdrop-blur-sm border-border hover:bg-card rounded-lg shadow-lg text-xs px-3 py-2">
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-2 border-0 bg-transparent shadow-none max-h-[90vh] overflow-y-auto">
                <img src={imageURL} alt={`${templateName} large preview`} className="w-full h-auto rounded-lg shadow-2xl" />
              </DialogContent>
            </Dialog>
          </div>

          <motion.div 
            className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-2 py-1"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-1">
              <Crown className="w-2.5 h-2.5 text-white" />
              <span className="text-xs font-bold text-white">Hot</span>
            </div>
          </motion.div>
        </div>

        <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground truncate lg:group-hover:text-primary transition-colors">
              {templateName}
            </h3>
            <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                <span className="hidden sm:inline">Professional</span>
                <span className="sm:hidden">Pro</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="hidden sm:inline">ATS-Ready</span>
                <span className="sm:hidden">ATS</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl flex flex-col">
          <DialogHeader className="text-center pb-4 flex-shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              Choose a Starting Point
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm sm:text-base">
              Select a recommended preset or build your own combination.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 pt-4">
            <div className="space-y-3">
              {template.presets?.map((preset, index) => (
                <motion.div
                  key={preset.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handlePresetSelect(preset.key)}
                  className="bg-gradient-to-r from-primary/10 to-accent-purple/10 p-3 sm:p-4 rounded-xl border border-primary/20 cursor-pointer hover:border-primary hover:shadow-md transition-all group/preset"
                >
                  <div className="flex items-start sm:items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground group-hover/preset:text-primary transition-colors text-sm sm:text-base">
                        {preset.name}
                      </h4>
                      <p className="text-muted-foreground text-xs sm:text-sm mt-1">Industry: {preset.industry}</p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      {preset.isPrimary && (
                        <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span className="hidden sm:inline">Recommended</span>
                          <span className="sm:hidden">Rec</span>
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover/preset:text-primary group-hover/preset:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3 sm:space-y-4">
              <Button
                onClick={() => setShowBuilder(!showBuilder)}
                variant="outline"
                className="w-full border-2 border-dashed border-border hover:border-primary rounded-xl py-3 sm:py-4 text-secondary-foreground hover:text-primary transition-all duration-300 group/builder"
              >
                <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 group-hover/builder:rotate-180 transition-transform duration-500" />
                <span className="text-sm sm:text-base">
                  {showBuilder ? 'Hide Builder' : 'Or, create your own combination'}
                </span>
              </Button>
              
              {/* --- FIX: Wrapped conditional content in AnimatePresence --- */}
              <AnimatePresence>
                {showBuilder && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: '1rem' }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gradient-to-r from-secondary/80 to-primary/10 rounded-xl border border-border"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-secondary-foreground mb-1.5">Industry</label>
                        <Select value={combination.industry || ""} onValueChange={(value) => setCombination(c => ({...c, industry: value}))}>
                          <SelectTrigger className="rounded-lg border-border focus:border-primary focus:ring-ring h-9 sm:h-10"><SelectValue placeholder="Select Industry" /></SelectTrigger>
                          <SelectContent className="bg-card/95 backdrop-blur-xl rounded-lg">{industryOptions.map(ind => (<SelectItem key={ind} value={ind} className="rounded-md">{ind}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-secondary-foreground mb-1.5">Section Layout</label>
                        <Select value={combination.sectionPresetKey || ""} onValueChange={(value) => setCombination(c => ({...c, sectionPresetKey: value}))}>
                          <SelectTrigger className="rounded-lg border-border focus:border-primary focus:ring-ring h-9 sm:h-10"><SelectValue placeholder="Select Layout" /></SelectTrigger>
                          <SelectContent className="bg-card/95 backdrop-blur-xl rounded-lg">{template.templateComponents?.sectionPresets?.map(sp => (<SelectItem key={sp.key} value={sp.key} className="rounded-md">{sp.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-secondary-foreground mb-1.5">Style</label>
                        <Select value={combination.stylePackKey || ""} onValueChange={(value) => setCombination(c => ({...c, stylePackKey: value}))}>
                          <SelectTrigger className="rounded-lg border-border focus:border-primary focus:ring-ring h-9 sm:h-10"><SelectValue placeholder="Select Style" /></SelectTrigger>
                          <SelectContent className="bg-card/95 backdrop-blur-xl rounded-lg">{template.templateComponents?.stylePacks?.map(sp => (<SelectItem key={sp.key} value={sp.key} className="rounded-md">{sp.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: isCombinationComplete ? 1.02 : 1 }} whileTap={{ scale: isCombinationComplete ? 0.98 : 1 }}>
                      <Button
                        onClick={handleCombinationSelect}
                        disabled={!isCombinationComplete}
                        className="w-full bg-gradient-to-r from-accent-purple to-accent-pink hover:opacity-90 disabled:opacity-50 text-white rounded-lg py-2 sm:py-2.5 font-semibold shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
                      >
                        <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Use this Combination
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

          <DialogFooter className="pt-3 sm:pt-4 flex-shrink-0 border-t border-border/50 mt-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={handleSkip} variant="ghost" className="text-muted-foreground hover:text-primary rounded-lg text-sm sm:text-base py-2 sm:py-2.5">
                Skip & Start with Default
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
};

export default TemplateCard;