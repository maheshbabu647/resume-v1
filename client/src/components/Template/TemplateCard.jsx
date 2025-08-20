import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Eye, PenSquare } from 'lucide-react'; // New icons for clarity

const TemplateCard = ({ template }) => {
  if (!template) return null;

  // --- Data setup from your original file ---
  const fallbackImage = 'https://placehold.co/400x566/E2E8F0/4A5568?text=Preview&font=inter';
  const imageURL = template.templateImage || fallbackImage;
  const templateName = template.templateName || 'Unnamed Template';
  const editorLink = template.specificIndustry
    ? `/resume/new/${template._id}?industry=${encodeURIComponent(template.specificIndustry)}`
    : `/resume/new/${template._id}`;

  // --- Animation variants from your original file ---
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={cardVariants}
      layout
      className="group flex flex-col"
      aria-labelledby={`template-name-${template.virtualId}`}
    >
      <div className="relative rounded-lg overflow-hidden border border-border shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
        {/* Image */}
        <img
          src={imageURL}
          alt={`Preview of ${templateName} resume template`}
          className="w-full h-auto"
          loading="lazy"
          onError={e => { e.target.onerror = null; e.target.src = fallbackImage; }}
        />

        {/* Interactive Overlay */}
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <div className="text-center space-y-3 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out delay-100">
            <Button asChild size="lg">
              <Link to={editorLink} aria-label={`Use ${templateName} template`}>
                <PenSquare size={18} className="mr-2" />
                Use Template
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm w-full"
              // Add onClick for a preview modal later
            >
              <Eye size={18} className="mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Template Name Below Card */}
      <div className="pt-4 text-center">
        <h3 id={`template-name-${template.virtualId}`} className="text-base font-semibold text-foreground">
          {templateName}
        </h3>
      </div>
    </motion.div>
  );
};

export default TemplateCard;