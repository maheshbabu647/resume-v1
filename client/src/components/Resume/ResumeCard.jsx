import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Edit3, Trash2, CalendarDays, Clock3, Eye, Loader2 } from 'lucide-react'; // Added Clock3, Eye, Loader2
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // For potential future use (e.g., tags)
import { useNavigate } from 'react-router-dom';
import { downloadResume as apiDownloadResume, getById as apiGetResumeById } from '@/api/resumeServiceApi';
import generateResumeHtml from '@/utils/generateResumeHtml';

const ResumeCard = ({ resume, onDelete }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  if (!resume) return null;

  const {
    _id,
    resumeName,
    templateId,
    updatedAt,
    createdAt,
  } = resume;

  const displayName = resumeName || 'Untitled Resume';
  const templateImageURL = templateId?.templateImage || 'https://placehold.co/400x225/E2E8F0/4A5568?text=Preview&font=inter';
  const templateDisplayName = templateId?.templateName || 'Unknown Template';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const createdDate = formatDate(createdAt);
  const lastUpdatedDate = formatDate(updatedAt || createdAt);

  const handleEdit = () => navigate(`/resume/edit/${_id}`);
  const handlePreview = () => navigate(`/resume/saved/view/${_id}`);
  const handleDeleteClick = () => { if (onDelete) onDelete(_id, displayName); };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const fullResumeData = await apiGetResumeById(_id);
      if (fullResumeData && fullResumeData.templateId && fullResumeData.templateId.templateCode && fullResumeData.resumeData) {
        const htmlContent = generateResumeHtml(fullResumeData.templateId.templateCode, fullResumeData.resumeData);
        await apiDownloadResume(htmlContent);
      } else {
        console.error('Download failed: Missing necessary resume data or template code.');
        alert('Download failed. Essential data is missing.');
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('An error occurred while trying to download your resume. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.03, boxShadow: "0 12px 25px -8px hsl(var(--primary) / 0.2)" }}
      className="h-full" // Ensures motion div takes full height for card
    >
      <Card 
        className="bg-card text-card-foreground rounded-xl border border-border shadow-lg hover:border-primary/40 transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
        aria-labelledby={`resume-name-${_id}`}
        tabIndex={0}
      >
        <div
          className="relative w-full bg-muted group overflow-hidden aspect-w-16 aspect-h-9 cursor-pointer"
          onClick={handlePreview}
          onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePreview(); }}
          role="button"
          aria-label={`Preview resume: ${displayName}`}
        >
          <img
            src={templateImageURL}
            alt={`Visual preview of the ${templateDisplayName} template used for ${displayName}`}
            className="w-full h-full object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
            loading="lazy"
            onError={e => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x225/E2E8F0/4A5568?text=Preview+Error&font=inter';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end items-start p-4">
            <h3 className="text-sm font-semibold text-white drop-shadow-sm flex items-center">
              <Eye size={16} className="mr-1.5" /> View Details
            </h3>
          </div>
        </div>

        <CardHeader className="px-5 pt-4 pb-2">
          <CardTitle id={`resume-name-${_id}`} className="text-lg font-semibold text-primary hover:underline cursor-pointer" onClick={handleEdit} title={`Edit ${displayName}`}>
            {displayName}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Using template: {templateDisplayName}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 py-3 flex-grow space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays size={14} className="mr-2 opacity-80" />
            <span>Created: {createdDate}</span>
          </div>
          <div className="flex items-center">
            <Clock3 size={14} className="mr-2 opacity-80" />
            <span>Updated: {lastUpdatedDate}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 border-t border-border/60 bg-muted/30 dark:bg-muted/20">
          <div className="grid grid-cols-3 gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-offset-card text-xs sm:text-sm"
              onClick={handleEdit}
              aria-label={`Edit ${displayName}`}
            >
              <Edit3 size={14} className="mr-1.5" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-offset-card text-xs sm:text-sm"
              onClick={handleDownload}
              disabled={isDownloading}
              aria-label={`Download ${displayName}`}
            >
              {isDownloading ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Download size={14} className="mr-1.5" />}
              {isDownloading ? '...' : 'Download'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="bg-destructive/90 hover:bg-destructive text-destructive-foreground focus-visible:ring-offset-card text-xs sm:text-sm"
              onClick={handleDeleteClick}
              aria-label={`Delete ${displayName}`}
            >
              <Trash2 size={14} className="mr-1.5" /> Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.article>
  );
};

export default ResumeCard;
