import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, FileText, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

const AdminTemplateCard = ({ template, onDelete }) => {
  const navigate = useNavigate();

  if (!template) return null;

  const fallbackImage = 'https://placehold.co/400x520/E2E8F0/4A5568?text=Preview&font=inter';
  const imageURL = template.templateImage || fallbackImage;

  const handleEdit = () => navigate(`/admin/templates/edit/${template._id}`);
  const handlePreview = () => navigate(`/resume/view/${template._id}`);
  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(template._id, template.templateName);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="bg-card text-card-foreground rounded-xl border border-border shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden">
        <CardHeader className="p-4 border-b border-border/60">
          <CardTitle className="text-base font-semibold text-foreground truncate" title={template.templateName}>
            {template.templateName}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 flex-grow relative group cursor-pointer" onClick={handlePreview}>
          <img
            src={imageURL}
            alt={`Preview of ${template.templateName}`}
            className="w-full h-full object-cover object-top transition-transform duration-300 ease-in-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Eye className="h-10 w-10 text-white" />
          </div>
        </CardContent>

        <CardFooter className="p-3 border-t border-border/60 bg-muted/20 dark:bg-muted/10">
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="outline" size="sm" onClick={handleEdit} className="text-xs">
              <Edit size={14} className="mr-1.5" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteClick} className="text-xs">
              <Trash2 size={14} className="mr-1.5" /> Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.article>
  );
};

export default AdminTemplateCard;
