import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit3, Trash2 } from 'lucide-react';

const CoverLetterCard = ({ letter, onDelete }) => {
    const navigate = useNavigate();

    if (!letter) return null;

    // Navigate to the preview page
    const handleCardClick = () => {
        navigate(`/cover-letter/preview/${letter._id}`, { state: { letter } });
    };
    
    // Navigate to the edit page
    const handleEdit = (e) => {
        e.stopPropagation(); // Prevent the card's click event
        navigate(`/cover-letter/edit/${letter._id}`, { state: { letter } });
    };

    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent card click
        onDelete(letter._id);
    };

    const formattedDate = new Date(letter.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full group"
            tabIndex={0}
        >
            <Card 
                className="bg-card text-card-foreground rounded-lg border shadow-md hover:border-primary/60 hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden relative cursor-pointer"
                onClick={handleCardClick}
                aria-labelledby={`cl-title-${letter._id}`}
            >
                {/* --- NEW: Redesigned Card Body --- */}
                <div className="flex flex-col items-start justify-between p-5 flex-grow">
                    {/* A visually appealing icon container */}
                    <div className="mb-4 bg-gradient-to-br from-primary/20 to-primary/5 p-3 rounded-lg">
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                    
                    {/* Main content */}
                    <div className="flex-grow">
                        <CardTitle id={`cl-title-${letter._id}`} className="text-base font-semibold text-foreground mb-1 line-clamp-2" title={letter.jobTitle}>
                            {letter.jobTitle || 'Untitled Cover Letter'}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground line-clamp-1" title={letter.companyName}>
                           For: {letter.companyName}
                        </CardDescription>
                    </div>
                    
                    {/* Secondary metadata */}
                    <p className="text-xs text-muted-foreground mt-4 w-full">
                        Created on: {formattedDate}
                    </p>
                </div>

                {/* --- NEW: On-Hover Actions, consistent with ResumeCard --- */}
                <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                    <div className="flex flex-col gap-2 w-full max-w-[180px]">
                        <Button onClick={handleEdit} aria-label={`Edit ${letter.jobTitle}`} className="w-full">
                            <Edit3 size={16} className="mr-2" /> Edit
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} aria-label={`Delete ${letter.jobTitle}`} className="w-full">
                            <Trash2 size={16} className="mr-2" /> Delete
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default CoverLetterCard;