import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Palette, Layers, Briefcase } from "lucide-react";

/**
 * A reusable panel for customizing resume properties like spacing, style, section order, and industry focus.
 * It receives all necessary state and handlers as props from its parent component.
 */
const CustomizePanel = ({
  spacingMultiplier,
  fontSizeMultiplier,
  selectedStylePackKey,
  selectedPresetKey,
  selectedIndustry,
  currentTemplateForEditor,
  industryOptions,
  onSpacingChange,
  onFontSizeChange,
  onStylePackChange,
  onPresetChange,
  onIndustryChange,
}) => {
  return (
    <div className="grid gap-3 sm:gap-4 pt-2">
      {/* Spacing Control */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="spacing-slider-control" className="text-xs sm:text-sm font-medium">Spacing</Label>
          <span className="text-xs sm:text-sm font-mono text-muted-foreground">{spacingMultiplier.toFixed(2)}x</span>
        </div>
        <Slider id="spacing-slider-control" min={0.8} max={1.5} step={0.05} value={[spacingMultiplier]} onValueChange={onSpacingChange} />
      </div>

      {/* Font Size Control */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="font-size-slider-control" className="text-xs sm:text-sm font-medium">Font Size</Label>
          <span className="text-xs sm:text-sm font-mono text-muted-foreground">{fontSizeMultiplier.toFixed(2)}x</span>
        </div>
        <Slider id="font-size-slider-control" min={0.8} max={1.5} step={0.05} value={[fontSizeMultiplier]} onValueChange={onFontSizeChange} />
      </div>

      {/* Style Pack Selector */}
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="style-pack-selector-control" className="flex items-center text-xs sm:text-sm font-medium"><Palette size={12} className="mr-1.5 sm:mr-2"/> Style / Theme</Label>
        <Select value={selectedStylePackKey || ''} onValueChange={onStylePackChange}>
          <SelectTrigger id="style-pack-selector-control" className="h-8 sm:h-10"><SelectValue placeholder="Select a style..." /></SelectTrigger>
          <SelectContent>
            {currentTemplateForEditor?.templateComponents?.stylePacks?.map(pack => (
              <SelectItem key={pack.key} value={pack.key}>{pack.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Section Order Preset Selector */}
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="preset-selector-control" className="flex items-center text-xs sm:text-sm font-medium"><Layers size={12} className="mr-1.5 sm:mr-2"/> Section Order</Label>
        <Select value={selectedPresetKey || ''} onValueChange={onPresetChange}>
          <SelectTrigger id="preset-selector-control" className="h-8 sm:h-10"><SelectValue placeholder="Select an order..." /></SelectTrigger>
          <SelectContent>
            {currentTemplateForEditor?.templateComponents?.sectionPresets?.map(preset => (
              <SelectItem key={preset.key} value={preset.key}>{preset.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Industry Selector */}
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="industry-selector-control" className="flex items-center text-xs sm:text-sm font-medium"><Briefcase size={12} className="mr-1.5 sm:mr-2"/> Industry</Label>
        <Select value={selectedIndustry || ''} onValueChange={onIndustryChange} disabled={industryOptions.length === 0}>
          <SelectTrigger id="industry-selector-control" className="h-8 sm:h-10"><SelectValue placeholder="Select industry..." /></SelectTrigger>
          <SelectContent>
            {industryOptions.length > 0 ? industryOptions.map(industry => (
              <SelectItem key={industry} value={industry}>{industry}</SelectItem>
            )) : <div className="px-2 py-1.5 text-xs sm:text-sm text-muted-foreground">No industries defined</div>}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CustomizePanel;