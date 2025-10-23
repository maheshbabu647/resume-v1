// @/components/ATSCheckerPage/AnalyzingStep.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AnalyzingStep = ({ message }) => {
  return (
    <Card className="border border-border shadow-lg rounded-2xl">
      <CardContent className="p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-16 h-16 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-foreground mt-6 mb-2">
          Analyzing Your Files...
        </h2>
        <p className="text-lg text-muted-foreground animate-pulse">
          {message || 'Please wait a moment'}
        </p>
      </CardContent>
    </Card>
  );
};

export default AnalyzingStep;