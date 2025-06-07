import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Trash2 } from 'lucide-react';

const CoverLetterCard = ({ letter, onDelete }) => {
    const navigate = useNavigate();

    if (!letter) return null;

    const handleEdit = () => {
        navigate(`/cover-letter/edit/${letter._id}`);
    };

    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent card click event
        onDelete(letter._id);
    };
    
    const handleCardClick = () => {
        handleEdit(); // Clicking anywhere on the card will navigate to edit
    };

    const formattedDate = new Date(letter.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full h-full cursor-pointer group"
            onClick={handleCardClick}
        >
            <Card className="bg-card text-card-foreground shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4 pb-2">
                    <div className="flex-shrink-0">
                        <div className="bg-primary/10 text-primary p-3 rounded-lg">
                            <FileText className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <CardTitle className="text-lg font-semibold text-foreground truncate" title={letter.jobTitle}>
                            {letter.jobTitle}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground truncate" title={letter.companyName}>
                            For: {letter.companyName}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                     <p className="text-xs text-muted-foreground">
                        Created on: {formattedDate}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                    <Button variant="ghost" size="sm" onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default CoverLetterCard;
