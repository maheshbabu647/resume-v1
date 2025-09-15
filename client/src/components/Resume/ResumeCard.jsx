// import React from 'react';
// import { motion } from 'framer-motion';
// import { Download, Edit3, Trash2, Loader2 } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import { Card, CardDescription, CardTitle } from "@/components/ui/card";
// import { useNavigate } from 'react-router-dom';
// import { downloadResume as apiDownloadResume, getById as apiGetById } from '@/api/resumeServiceApi';
// import generateResumeHtml from '@/utils/generateResumeHtml';

// const ResumeCard = ({ resume, onDelete }) => {
//   const [isDownloading, setIsDownloading] = React.useState(false);
//   const navigate = useNavigate();

//   if (!resume) return null;

//   const {
//     _id,
//     resumeName,
//     templateId,
//     updatedAt,
//   } = resume;

//   const displayName = resumeName || 'Untitled Resume';
//   const templateImageURL = templateId?.templateImage || 'https://placehold.co/600x800/E2E8F0/4A5568?text=Template&font=inter';

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleString('en-US', {
//       year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
//     });
//   };
//   const lastUpdatedDate = formatDate(updatedAt);

//   const handleEdit = (e) => { e.stopPropagation(); navigate(`/resume/edit/${_id}`); };
//   const handlePreview = () => navigate(`/resume/saved/view/${_id}`);
//   const handleDeleteClick = (e) => { e.stopPropagation(); if (onDelete) onDelete(_id, displayName); };

//   const handleDownload = async (e) => {
//     e.stopPropagation();
//     setIsDownloading(true);
//     try {
//       // FIXED: Expect the resume object directly from the API service, aligning with the context.
//       const fullResumeData = await apiGetById(_id);
      
//       if (!fullResumeData?.templateId?.templateComponents || !fullResumeData.resumeData) {
//           throw new Error('Missing essential template components or resume data for download.');
//       }

//       const { baseCss, sections, stylePacks } = fullResumeData.templateId.templateComponents;
//       const { 
//           resumeData: currentFormData, 
//           spacingMultiplier, 
//           stylePackKey, 
//           sectionOrder 
//       } = fullResumeData;

//       const htmlContent = generateResumeHtml(
//           null,
//           baseCss,
//           sections,
//           stylePacks,
//           stylePackKey,
//           sectionOrder,
//           currentFormData,
//           spacingMultiplier
//       );
      
//       await apiDownloadResume(htmlContent);

//     } catch (error) {
//       console.error('Error downloading resume:', error);
//       alert('An error occurred while trying to download your resume. Please ensure the template data is complete.');
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   return (
//     <motion.article
//       layout
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       transition={{ duration: 0.3, ease: "easeOut" }}
//       className="h-full group"
//       tabIndex={0}
//     >
//       <Card
//         className="bg-card text-card-foreground rounded-lg border shadow-md hover:border-primary/60 hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden relative cursor-pointer"
//         onClick={handlePreview}
//         aria-labelledby={`resume-name-${_id}`}
//       >
//         <div className="w-full bg-muted/50 aspect-[3/4] overflow-hidden">
//           <img
//             src={templateImageURL}
//             alt={`Template preview for ${displayName}`}
//             className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
//             loading="lazy"
//             onError={e => {
//               e.target.onerror = null;
//               e.target.src = 'https://placehold.co/600x800/E2E8F0/4A5568?text=Preview+Error&font=inter';
//             }}
//           />
//         </div>

//         <div className="p-4 border-t flex-grow">
//             <CardTitle id={`resume-name-${_id}`} className="text-base font-semibold text-foreground mb-1 line-clamp-2">
//                 {displayName}
//             </CardTitle>
//             <CardDescription className="text-xs">
//                 Updated: {lastUpdatedDate}
//             </CardDescription>
//         </div>

//         <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
//             <div className="flex flex-col gap-2 w-full max-w-[180px]">
//                 <Button onClick={handleEdit} aria-label={`Edit ${displayName}`} className="w-full">
//                     <Edit3 size={16} className="mr-2" /> Edit
//                 </Button>
//                 <Button variant="secondary" onClick={handleDownload} disabled={isDownloading} aria-label={`Download ${displayName}`} className="w-full">
//                     {isDownloading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Download size={16} className="mr-2" />}
//                     {isDownloading ? '...' : 'Download'}
//                 </Button>
//                 <Button variant="destructive" onClick={handleDeleteClick} aria-label={`Delete ${displayName}`} className="w-full">
//                     <Trash2 size={16} className="mr-2" /> Delete
//                 </Button>
//             </div>
//         </div>
//       </Card>
//     </motion.article>
//   );
// };

// export default ResumeCard;

import React from 'react';
import { motion } from 'framer-motion';
// NEW: Imported MoreVertical icon and DropdownMenu components
import { Download, Edit3, Trash2, Loader2, MoreVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { downloadResume as apiDownloadResume, getById as apiGetById } from '@/api/resumeServiceApi';
import generateResumeHtml from '@/utils/generateResumeHtml';
import { cn } from "@/lib/utils"; // Ensure cn is imported

const ResumeCard = ({ resume, onDelete }) => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const navigate = useNavigate();

  if (!resume) return null;

  const { _id, resumeName, templateId, updatedAt } = resume;

  const displayName = resumeName || 'Untitled Resume';
  const templateImageURL = templateId?.templateImage || 'https://placehold.co/600x800/E2E8F0/4A5568?text=Template&font=inter';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };
  const lastUpdatedDate = formatDate(updatedAt);

  const handleEdit = (e) => { e.stopPropagation(); navigate(`/resume/edit/${_id}`); };
  const handlePreview = () => navigate(`/resume/saved/view/${_id}`);
  const handleDeleteClick = (e) => { e.stopPropagation(); if (onDelete) onDelete(_id, displayName); };

  const handleDownload = async (e) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      const fullResumeData = await apiGetById(_id);
      
      if (!fullResumeData?.templateId?.templateComponents || !fullResumeData.resumeData) {
          throw new Error('Missing essential template components or resume data for download.');
      }

      const { baseCss, sections, stylePacks } = fullResumeData.templateId.templateComponents;
      const { resumeData: currentFormData, spacingMultiplier, stylePackKey, sectionOrder } = fullResumeData;

      const htmlContent = generateResumeHtml(
          null, baseCss, sections, stylePacks, stylePackKey, sectionOrder, currentFormData, spacingMultiplier
      );
      
      await apiDownloadResume(htmlContent);

    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('An error occurred while trying to download your resume.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full group"
      tabIndex={0}
    >
      <Card
        className="bg-card text-card-foreground rounded-lg border shadow-md hover:border-primary/60 hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden relative cursor-pointer"
        onClick={handlePreview}
        aria-labelledby={`resume-name-${_id}`}
      >
        <div className="w-full bg-muted/50 aspect-[3/4] overflow-hidden">
          <img
            src={templateImageURL}
            alt={`Template preview for ${displayName}`}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={e => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/600x800/E2E8F0/4A5568?text=Preview+Error&font=inter';
            }}
          />
        </div>

        <div className="p-4 border-t flex-grow">
            <CardTitle id={`resume-name-${_id}`} className="text-base font-semibold text-foreground mb-1 line-clamp-2">
                {displayName}
            </CardTitle>
            <CardDescription className="text-xs">
                Updated: {lastUpdatedDate}
            </CardDescription>
        </div>

        {/* --- UPDATED: Hover overlay for DESKTOP ONLY --- */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex flex-col items-center justify-center p-4">
            <div className="flex flex-col gap-2 w-full max-w-[180px]">
                <Button onClick={handleEdit} aria-label={`Edit ${displayName}`} className="w-full">
                    <Edit3 size={16} className="mr-2" /> Edit
                </Button>
                <Button variant="secondary" onClick={handleDownload} disabled={isDownloading} aria-label={`Download ${displayName}`} className="w-full">
                    {isDownloading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Download size={16} className="mr-2" />}
                    {isDownloading ? '...' : 'Download'}
                </Button>
                <Button variant="destructive" onClick={handleDeleteClick} aria-label={`Delete ${displayName}`} className="w-full">
                    <Trash2 size={16} className="mr-2" /> Delete
                </Button>
            </div>
        </div>
        
        {/* --- NEW: Dropdown menu for MOBILE ONLY --- */}
        <div className="absolute top-2 right-2 lg:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" onClick={e => e.stopPropagation()} className="h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm">
                        <MoreVertical size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                    <DropdownMenuItem onClick={handleEdit}>
                        <Edit3 size={16} className="mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownload} disabled={isDownloading}>
                        {isDownloading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Download size={16} className="mr-2" />}
                        {isDownloading ? 'Downloading...' : 'Download'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 size={16} className="mr-2" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </Card>
    </motion.article>
  );
};

export default ResumeCard;