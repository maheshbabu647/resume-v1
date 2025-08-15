import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const TemplateCard = ({ template }) => {
  if (!template) return null;

  const fallbackImage = 'https://placehold.co/300x400/E2E8F0/4A5568?text=Preview&font=inter';
  const imageURL = template.templateImage || fallbackImage;
  const templateName = template.templateName || 'Unnamed Template';
  const templateDescription = template.description || "A professionally designed template to help you stand out. Click 'Use This Template' to get started.";

  const editorLink = template.specificIndustry
    ? `/resume/new/${template._id}?industry=${encodeURIComponent(template.specificIndustry)}`
    : `/resume/new/${template._id}`;

  return (
    <motion.article
      whileHover={{ y: -5, boxShadow: "0 10px 20px -5px hsl(var(--primary) / 0.2)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-card text-card-foreground rounded-xl border border-border shadow-lg overflow-hidden flex flex-col h-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
      aria-labelledby={`template-name-${template.virtualId}`}
      tabIndex={0}
    >
      <div className="relative w-full bg-muted group overflow-hidden aspect-w-3 aspect-h-4">
        <img
          src={imageURL}
          alt={`Preview of ${templateName} resume template`}
          className="w-full h-full object-cover object-top transition-transform duration-300 ease-in-out group-hover:scale-105"
          loading="lazy"
          onError={e => { e.target.onerror = null; e.target.src = fallbackImage; }}
        />
      </div>
      
      {/* This inner div is a flex column that will grow to fill the available space */}
      <div className="p-5 flex flex-col flex-grow">
        <header className="mb-3">
          <h3
            id={`template-name-${template.virtualId}`}
            className="text-lg font-semibold text-primary truncate"
            title={templateName}
          >
            {templateName}
          </h3>
        </header>
        
        {/* --- MODIFIED: Removed 'flex-grow' from this paragraph --- */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 min-h-[60px]">
          {templateDescription.length > 100 ? `${templateDescription.substring(0, 97)}...` : templateDescription}
        </p>
        
        {/* 'mt-auto' will now reliably push the button to the very bottom of the card */}
        <div className="mt-auto pt-4 border-t border-border/20">
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            asChild
          >
            <Link to={editorLink} aria-label={`Use ${templateName} template`}>
              <FileText size={16} className="mr-2" />
              Use This Template
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
};

export default TemplateCard;