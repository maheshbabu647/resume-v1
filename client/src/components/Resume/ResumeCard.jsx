import React from 'react';
import { motion } from 'framer-motion';
import { Download, Edit3, Trash2, Loader2, Calendar, Star, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { downloadResume as apiDownloadResume, getById as apiGetById } from '@/api/resumeServiceApi';
import generateResumeHtml from '@/utils/generateResumeHtml';

const ResumeCard = ({ resume, onDelete }) => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const navigate = useNavigate();

  if (!resume) return null;

  const {
    _id,
    resumeName,
    templateId,
    updatedAt,
  } = resume;

  const displayName = resumeName || 'Untitled Resume';
  const templateImageURL = templateId?.templateImage || 'https://placehold.co/600x800/E2E8F0/4A5568?text=Template&font=inter';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const lastUpdatedDate = formatDate(updatedAt);

  const handleEdit = (e) => { 
    e.stopPropagation(); 
    navigate(`/resume/edit/${_id}`); 
  };

  const handlePreview = () => navigate(`/resume/saved/view/${_id}`);

  const handleDeleteClick = (e) => { 
    e.stopPropagation(); 
    if (onDelete) onDelete(_id, displayName); 
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    setIsDownloading(true);

    try {
      const fullResumeData = await apiGetById(_id);

      if (!fullResumeData?.templateId?.templateComponents || !fullResumeData.resumeData) {
        throw new Error('Missing essential template components or resume data for download.');
      }

      const { baseCss, sections, stylePacks } = fullResumeData.templateId.templateComponents;
      const {
        resumeData: currentFormData,
        spacingMultiplier,
        stylePackKey,
        sectionOrder
      } = fullResumeData;

      const htmlContent = generateResumeHtml(
        null,
        baseCss,
        sections,
        stylePacks,
        stylePackKey,
        sectionOrder,
        currentFormData,
        spacingMultiplier
      );

      await apiDownloadResume(htmlContent);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('An error occurred while trying to download your resume. Please ensure the template data is complete.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <Card 
        className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
        onClick={handlePreview}
      >
        {/* Header with Image */}
        <div className="relative h-48 overflow-hidden rounded-t-3xl bg-gradient-to-br from-blue-50 to-purple-50">
          <img
            src={templateImageURL}
            alt={`${displayName} template`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/600x800/E2E8F0/4A5568?text=Preview+Error&font=inter';
            }}
          />
          
          {/* Overlay with Status */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-4 right-4">
              <motion.div 
                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </motion.div>
            </div>
          </div>

          {/* Floating Success Badge */}
          <motion.div 
            className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-white fill-current" />
              <span className="text-xs font-bold text-white">Ready</span>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <CardTitle className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {displayName}
          </CardTitle>

          {/* Last Updated */}
          <CardDescription className="flex items-center gap-2 text-slate-600 mb-6">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Updated: {lastUpdatedDate}</span>
          </CardDescription>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {/* Primary Actions */}
            <div className="flex gap-2">
              <motion.div className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleEdit}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                >
                  <Edit3 className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                  Edit
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 px-6"
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Secondary Action */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleDeleteClick}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-2xl transition-all duration-300 group/delete"
              >
                <Trash2 className="w-4 h-4 mr-2 group-hover/delete:rotate-12 transition-transform" />
                Delete
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Sparkles className="w-8 h-8 text-blue-500" />
        </div>
        
        {/* Corner Gradient */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </Card>
    </motion.div>
  );
};

export default ResumeCard;