// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

// // Role suggestions based on profession industry
// const ROLE_SUGGESTIONS = {
//   'Software Engineering': [
//     'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 
//     'Software Engineer', 'DevOps Engineer', 'Mobile App Developer', 
//     'Cloud Engineer', 'AI Engineer', 'Automation Engineer'
//   ],
//   'Data Science & Analytics': [
//     'Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 
//     'Business Intelligence Analyst', 'AI Researcher', 'NLP Engineer', 
//     'Data Engineer', 'Research Assistant'
//   ],
//   'Digital Marketing': [
//     'Digital Marketing Executive', 'SEO Specialist', 'Content Strategist', 
//     'Social Media Manager', 'Performance Marketing Analyst', 
//     'Email Marketing Specialist', 'Brand Strategist'
//   ],
//   'Design & UI/UX': [
//     'UI/UX Designer', 'Product Designer', 'Graphic Designer', 
//     'Visual Designer', 'Motion Graphics Designer', 'Creative Director'
//   ],
//   'Product Management': [
//     'Product Manager', 'Associate Product Manager', 'Technical Product Manager', 
//     'Product Analyst', 'Growth Product Manager'
//   ],
//   'Finance & Accounting': [
//     'Financial Analyst', 'Accountant', 'Investment Analyst', 
//     'Tax Associate', 'Risk Analyst', 'Finance Executive'
//   ],
//   'Healthcare & Life Sciences': [
//     'Medical Researcher', 'Clinical Data Analyst', 'Healthcare Administrator', 
//     'Lab Technician', 'Biostatistician'
//   ],
//   'Human Resources': [
//     'HR Executive', 'Talent Acquisition Specialist', 'HR Manager', 
//     'Learning & Development Officer', 'Employee Engagement Specialist'
//   ],
//   'Education & Research': [
//     'Lecturer', 'Research Assistant', 'Academic Writer', 
//     'Curriculum Developer', 'Education Consultant'
//   ],
//   'Sales & Business Development': [
//     'Business Development Executive', 'Sales Representative', 'Key Account Manager', 
//     'Inside Sales Executive', 'Territory Sales Manager'
//   ]
// };

// const PROFESSION_OPTIONS = [
//   'Software Engineering', 'Data Science & Analytics', 'Digital Marketing',
//   'Design & UI/UX', 'Product Management', 'Finance & Accounting',
//   'Healthcare & Life Sciences', 'Human Resources', 'Education & Research',
//   'Sales & Business Development'
// ];

// const EXPERIENCE_LEVELS = [
//   'Student / Intern', 'Fresher (0–1 yr)', 'Mid-Level (2–5 yrs)', 
//   'Senior (5+ yrs)', 'Executive / Manager'
// ];

// const TONE_OPTIONS = [
//   'Professional – Polished, neutral, and formal.',
//   'Confident – Strong, assertive, leadership-focused.',
//   'Enthusiastic – Energetic and passionate tone.',
//   'Technical – Factual, detail-oriented, skill-focused.',
//   'Impact-driven – Starts with measurable outcomes and results.',
//   'Creative – Expressive, original, and personality-rich.'
// ];

// const ResumeSetupDialog = ({ open, onOpenChange, onComplete }) => {
//   const [currentCard, setCurrentCard] = useState(0);
//   const [setupData, setSetupData] = useState({
//     profession_industry: '',
//     experience_level: '',
//     target_role: '',
//     job_description: '',
//     tone: ''
//   });

//   const cards = [
//     {
//       id: 'profession',
//       title: 'Select your professional domain',
//       description: 'This sets the domain and overall vocabulary used in your resume.',
//       component: 'profession'
//     },
//     {
//       id: 'experience',
//       title: 'Choose your experience level',
//       description: 'This controls the complexity and responsibility level of your achievements.',
//       component: 'experience'
//     },
//     {
//       id: 'role',
//       title: 'Select your target role',
//       description: 'The centerpiece of your resume — all sections will be tailored for this role.',
//       component: 'role'
//     },
//     {
//       id: 'job_description',
//       title: 'Paste the job description (optional)',
//       description: 'This helps optimize keywords for ATS and tailor achievements accordingly.',
//       component: 'job_description'
//     },
//     {
//       id: 'tone',
//       title: 'Choose how your resume should sound',
//       description: 'Controls the style and emotional tone of your writing.',
//       component: 'tone'
//     }
//   ];

//   const handleNext = () => {
//     if (currentCard < cards.length - 1) {
//       setCurrentCard(currentCard + 1);
//     } else {
//       // All cards completed, submit data
//       onComplete(setupData);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentCard > 0) {
//       setCurrentCard(currentCard - 1);
//     }
//   };

//   const handleDataChange = (field, value) => {
//     setSetupData(prev => ({
//       ...prev,
//       [field]: value
//     }));
    
//     // Auto-progress to next card for single-select cards (except job_description and tone)
//     if (field !== 'job_description' && field !== 'tone' && value && value.trim() !== '') {
//       setTimeout(() => {
//         if (currentCard < cards.length - 1) {
//           setCurrentCard(currentCard + 1);
//         }
//       }, 800); // Slightly longer delay for better UX
//     }
//   };

//   const isCurrentCardValid = () => {
//     const currentCardData = cards[currentCard];
//     const field = currentCardData.id === 'job_description' ? 'job_description' : 
//                  currentCardData.id === 'role' ? 'target_role' :
//                  currentCardData.id === 'profession' ? 'profession_industry' :
//                  currentCardData.id === 'experience' ? 'experience_level' : 'tone';
    
//     // job_description is optional
//     if (field === 'job_description') return true;
    
//     return setupData[field] && setupData[field].trim() !== '';
//   };

//   const renderCardContent = () => {
//     const currentCardData = cards[currentCard];
    
//     switch (currentCardData.component) {
//       case 'profession':
//         return (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {PROFESSION_OPTIONS.map((option) => (
//                 <Card 
//                   key={option}
//                   className={`cursor-pointer transition-all hover:shadow-md ${
//                     setupData.profession_industry === option 
//                       ? 'ring-2 ring-primary bg-primary/5' 
//                       : 'hover:bg-muted/50'
//                   }`}
//                   onClick={() => handleDataChange('profession_industry', option)}
//                 >
//                   <CardContent className="p-4">
//                     <div className="flex items-center justify-between">
//                       <span className="font-medium">{option}</span>
//                       {setupData.profession_industry === option && (
//                         <Check className="h-5 w-5 text-primary" />
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
            
//             {/* Custom profession input */}
//             <div className="space-y-2">
//               <Label htmlFor="custom-profession">Or enter your own profession</Label>
//               <Input
//                 id="custom-profession"
//                 placeholder="Enter your profession..."
//                 value={setupData.profession_industry && !PROFESSION_OPTIONS.includes(setupData.profession_industry) ? setupData.profession_industry : ''}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   setSetupData(prev => ({
//                     ...prev,
//                     profession_industry: value
//                   }));
//                 }}
//                 onBlur={(e) => {
//                   const value = e.target.value.trim();
//                   if (value) {
//                     handleDataChange('profession_industry', value);
//                   }
//                 }}
//               />
//             </div>
//           </div>
//         );

//       case 'experience':
//         return (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 gap-3">
//               {EXPERIENCE_LEVELS.map((level) => (
//                 <Card 
//                   key={level}
//                   className={`cursor-pointer transition-all hover:shadow-md ${
//                     setupData.experience_level === level 
//                       ? 'ring-2 ring-primary bg-primary/5' 
//                       : 'hover:bg-muted/50'
//                   }`}
//                   onClick={() => handleDataChange('experience_level', level)}
//                 >
//                   <CardContent className="p-4">
//                     <div className="flex items-center justify-between">
//                       <span className="font-medium">{level}</span>
//                       {setupData.experience_level === level && (
//                         <Check className="h-5 w-5 text-primary" />
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         );

//       case 'role':
//         return (
//           <div className="space-y-4">
//             {setupData.profession_industry && ROLE_SUGGESTIONS[setupData.profession_industry] ? (
//               <>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {ROLE_SUGGESTIONS[setupData.profession_industry].map((role) => (
//                     <Card 
//                       key={role}
//                       className={`cursor-pointer transition-all hover:shadow-md ${
//                         setupData.target_role === role 
//                           ? 'ring-2 ring-primary bg-primary/5' 
//                           : 'hover:bg-muted/50'
//                       }`}
//                       onClick={() => handleDataChange('target_role', role)}
//                     >
//                       <CardContent className="p-4">
//                         <div className="flex items-center justify-between">
//                           <span className="font-medium">{role}</span>
//                           {setupData.target_role === role && (
//                             <Check className="h-5 w-5 text-primary" />
//                           )}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
                
//                 {/* Custom role input */}
//                 <div className="space-y-2">
//                   <Label htmlFor="custom-role">Or enter your own role</Label>
//                   <Input
//                     id="custom-role"
//                     placeholder="Enter your target role..."
//                     value={setupData.target_role && !ROLE_SUGGESTIONS[setupData.profession_industry]?.includes(setupData.target_role) ? setupData.target_role : ''}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       setSetupData(prev => ({
//                         ...prev,
//                         target_role: value
//                       }));
//                     }}
//                     onBlur={(e) => {
//                       const value = e.target.value.trim();
//                       if (value) {
//                         handleDataChange('target_role', value);
//                       }
//                     }}
//                   />
//                 </div>
//               </>
//             ) : (
//               <div className="text-center py-8 text-muted-foreground">
//                 Please select your profession first to see relevant roles.
//               </div>
//             )}
//           </div>
//         );

//       case 'job_description':
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="job-description">Job Description (Optional)</Label>
//               <Textarea
//                 id="job-description"
//                 placeholder="Paste the job description here to help optimize your resume..."
//                 value={setupData.job_description}
//                 onChange={(e) => handleDataChange('job_description', e.target.value)}
//                 className="min-h-[120px]"
//               />
//             </div>
//             <p className="text-sm text-muted-foreground">
//               This helps us optimize keywords for ATS and tailor your achievements accordingly.
//             </p>
//             <div className="flex justify-end">
//               <Button
//                 variant="outline"
//                 onClick={() => handleDataChange('job_description', '')}
//                 className="text-sm"
//               >
//                 Skip this step
//               </Button>
//             </div>
//           </div>
//         );

//       case 'tone':
//         return (
//           <div className="space-y-4">
//             <div className="grid grid-cols-1 gap-3">
//               {TONE_OPTIONS.map((tone) => (
//                 <Card 
//                   key={tone}
//                   className={`cursor-pointer transition-all hover:shadow-md ${
//                     setupData.tone === tone 
//                       ? 'ring-2 ring-primary bg-primary/5' 
//                       : 'hover:bg-muted/50'
//                   }`}
//                   onClick={() => handleDataChange('tone', tone)}
//                 >
//                   <CardContent className="p-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="font-medium">{tone.split(' – ')[0]}</div>
//                         <div className="text-sm text-muted-foreground">{tone.split(' – ')[1]}</div>
//                       </div>
//                       {setupData.tone === tone && (
//                         <Check className="h-5 w-5 text-primary" />
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-2xl h-[80vh] flex flex-col">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold">
//             Let's personalize your resume
//           </DialogTitle>
//           <DialogDescription>
//             Answer a few questions to help us create the perfect resume for you.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="flex flex-col h-full">
//           {/* Progress indicator */}
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex space-x-2">
//               {cards.map((_, index) => (
//                 <div
//                   key={index}
//                   className={`h-2 w-8 rounded-full transition-colors ${
//                     index <= currentCard ? 'bg-primary' : 'bg-muted'
//                   }`}
//                 />
//               ))}
//             </div>
//             <span className="text-sm text-muted-foreground">
//               {currentCard + 1} of {cards.length}
//             </span>
//           </div>

//           {/* Card content - scrollable area */}
//           <div className="flex-1 overflow-y-auto mb-4">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={currentCard}
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-lg">
//                       {cards[currentCard].title}
//                     </CardTitle>
//                     <CardDescription>
//                       {cards[currentCard].description}
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {renderCardContent()}
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           {/* Navigation buttons - always visible at bottom */}
//           <div className="flex justify-between pt-4 border-t bg-background">
//             <Button
//               variant="outline"
//               onClick={handlePrevious}
//               disabled={currentCard === 0}
//               className="flex items-center gap-2"
//             >
//               <ChevronLeft className="h-4 w-4" />
//               Previous
//             </Button>

//             <Button
//               onClick={handleNext}
//               disabled={!isCurrentCardValid()}
//               className="flex items-center gap-2"
//             >
//               {currentCard === cards.length - 1 ? (
//                 <>
//                   Complete Setup
//                   <Check className="h-4 w-4" />
//                 </>
//               ) : (
//                 <>
//                   Next
//                   <ChevronRight className="h-4 w-4" />
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ResumeSetupDialog;


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Briefcase, 
  BarChart3, 
  Sparkles, 
  FileText, 
  PenTool 
} from 'lucide-react';

// --- Data Constants (Moved outside for clarity) ---

const PROFESSION_OPTIONS = [
  'Software Engineering', 'Data Science & Analytics', 'Digital Marketing',
  'Design & UI/UX', 'Product Management', 'Finance & Accounting',
  'Healthcare & Life Sciences', 'Human Resources', 'Education & Research',
  'Sales & Business Development'
];

const ROLE_SUGGESTIONS = {
  'Software Engineering': ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Software Engineer', 'DevOps Engineer', 'Cloud Engineer'],
  'Data Science & Analytics': ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'Business Intelligence Analyst', 'Data Engineer', 'Research Assistant'],
  'Digital Marketing': ['Digital Marketing Executive', 'SEO Specialist', 'Content Strategist', 'Social Media Manager', 'Performance Marketing Analyst'],
  'Design & UI/UX': ['UI/UX Designer', 'Product Designer', 'Graphic Designer', 'Visual Designer', 'Motion Graphics Designer'],
  'Product Management': ['Product Manager', 'Associate Product Manager', 'Technical Product Manager', 'Product Analyst'],
  'Finance & Accounting': ['Financial Analyst', 'Accountant', 'Investment Analyst', 'Tax Associate', 'Risk Analyst'],
  'Healthcare & Life Sciences': ['Medical Researcher', 'Clinical Data Analyst', 'Healthcare Administrator', 'Lab Technician'],
  'Human Resources': ['HR Executive', 'Talent Acquisition Specialist', 'HR Manager', 'Employee Engagement Specialist'],
  'Education & Research': ['Lecturer', 'Research Assistant', 'Academic Writer', 'Curriculum Developer'],
  'Sales & Business Development': ['Business Development Executive', 'Sales Representative', 'Key Account Manager', 'Inside Sales Executive']
};

const EXPERIENCE_LEVELS = ['Student / Intern', 'Fresher (0–1 yr)', 'Mid-Level (2–5 yrs)', 'Senior (5+ yrs)', 'Executive / Manager'];

const TONE_OPTIONS = [
  { value: 'Professional', description: 'Polished, neutral, and formal.', icon: Briefcase },
  { value: 'Confident', description: 'Strong, assertive, leadership-focused.', icon: BarChart3 },
  { value: 'Enthusiastic', description: 'Energetic and passionate tone.', icon: Sparkles },
  { value: 'Technical', description: 'Factual, detail-oriented, skill-focused.', icon: PenTool },
  { value: 'Impact-driven', description: 'Starts with measurable outcomes and results.', icon: FileText },
];

// --- Helper Components for a Cleaner Structure ---

const StepIndicator = ({ steps, currentStep }) => (
  <div className="flex items-center space-x-2 md:space-x-4 mb-6">
    {steps.map((step, index) => {
      const isCompleted = index < currentStep;
      const isCurrent = index === currentStep;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                ${isCompleted ? 'bg-success text-success-foreground' : ''}
                ${isCurrent ? 'bg-primary text-primary-foreground' : ''}
                ${!isCompleted && !isCurrent ? 'bg-muted border-2' : ''}
              `}
            >
              {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <p className={`mt-2 text-xs text-center font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
              {step.title.split(' ')[2]} {/* Extracts the main keyword like 'domain', 'level', etc. */}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-1 rounded-full ${isCompleted ? 'bg-success' : 'bg-muted'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const OrSeparator = () => (
  <div className="relative my-4">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-card px-2 text-muted-foreground">Or</span>
    </div>
  </div>
);

// --- Main Dialog Component ---

const ResumeSetupDialog = ({ open, onOpenChange, onComplete }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [setupData, setSetupData] = useState({
    profession_industry: '',
    experience_level: '',
    target_role: '',
    job_description: '',
    tone: ''
  });

  const cards = [
    { id: 'profession', title: 'Select your professional domain', description: 'This sets the vocabulary for your resume.' },
    { id: 'experience', title: 'Choose your experience level', description: 'This adjusts the complexity of achievements.' },
    { id: 'role', title: 'What is your target role?', description: 'Your resume will be tailored for this role.' },
    { id: 'job_description', title: 'Paste the job description (optional)', description: 'Optimize keywords for Applicant Tracking Systems (ATS).' },
    { id: 'tone', title: 'Choose your resume\'s tone', description: 'This controls the style and voice of your writing.' }
  ];

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      onComplete(setupData);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleDataChange = (field, value) => {
    setSetupData(prev => ({ ...prev, [field]: value }));
    
    // ✨ IMPROVED: Snappier auto-progress on selection
    const autoProgressFields = ['profession_industry', 'experience_level', 'target_role', 'tone'];
    if (autoProgressFields.includes(field) && value && value.trim() !== '') {
      setTimeout(() => {
        if (currentCard < cards.length - 1) {
          setCurrentCard(currentCard + 1);
        }
      }, 400); // Reduced delay for a faster feel
    }
  };

  const isCurrentCardValid = () => {
    const field = cards[currentCard].id;
    // Map card ID to state key
    const stateKey = {
      profession: 'profession_industry',
      experience: 'experience_level',
      role: 'target_role',
      job_description: 'job_description',
      tone: 'tone'
    }[field];
    
    if (field === 'job_description') return true; // Optional field
    return setupData[stateKey] && setupData[stateKey].trim() !== '';
  };
  
  const renderCardContent = () => {
    const currentCardData = cards[currentCard];
    
    switch (currentCardData.id) {
      case 'profession':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROFESSION_OPTIONS.map((option) => (
                <motion.div key={option} whileTap={{ scale: 0.98 }}>
                  <Card 
                    className={`cursor-pointer transition-all duration-200 h-full ${
                      setupData.profession_industry === option 
                        ? 'border-primary ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50 hover:shadow-md'
                    }`}
                    onClick={() => handleDataChange('profession_industry', option)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <span className="font-medium text-sm">{option}</span>
                      {setupData.profession_industry === option && <Check className="h-5 w-5 text-primary" />}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <OrSeparator />
            <div>
              <Label htmlFor="custom-profession" className="font-normal text-muted-foreground">Enter a custom profession</Label>
              <Input
                id="custom-profession"
                placeholder="e.g., Blockchain Development"
                value={!PROFESSION_OPTIONS.includes(setupData.profession_industry) ? setupData.profession_industry : ''}
                onChange={(e) => setSetupData(prev => ({ ...prev, profession_industry: e.target.value }))}
                onBlur={(e) => e.target.value.trim() && handleDataChange('profession_industry', e.target.value.trim())}
              />
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="grid grid-cols-1 gap-3">
            {EXPERIENCE_LEVELS.map((level) => (
              <motion.div key={level} whileTap={{ scale: 0.98 }}>
                <Card 
                  className={`cursor-pointer transition-all duration-200 ${
                    setupData.experience_level === level 
                      ? 'border-primary ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50 hover:shadow-md'
                  }`}
                  onClick={() => handleDataChange('experience_level', level)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="font-medium">{level}</span>
                    {setupData.experience_level === level && <Check className="h-5 w-5 text-primary" />}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        );

      case 'role':
        const suggestions = ROLE_SUGGESTIONS[setupData.profession_industry] || [];
        return (
          <div className="space-y-3">
            {setupData.profession_industry ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestions.map((role) => (
                    <motion.div key={role} whileTap={{ scale: 0.98 }}>
                      <Card 
                        className={`cursor-pointer transition-all duration-200 h-full ${
                          setupData.target_role === role 
                            ? 'border-primary ring-2 ring-primary bg-primary/5' 
                            : 'hover:bg-muted/50 hover:shadow-md'
                        }`}
                        onClick={() => handleDataChange('target_role', role)}
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <span className="font-medium text-sm">{role}</span>
                          {setupData.target_role === role && <Check className="h-5 w-5 text-primary" />}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                <OrSeparator />
                <div>
                  <Label htmlFor="custom-role" className="font-normal text-muted-foreground">Enter a custom role</Label>
                  <Input
                    id="custom-role"
                    placeholder="e.g., Growth Hacker"
                    value={!suggestions.includes(setupData.target_role) ? setupData.target_role : ''}
                    onChange={(e) => setSetupData(prev => ({ ...prev, target_role: e.target.value }))}
                    onBlur={(e) => e.target.value.trim() && handleDataChange('target_role', e.target.value.trim())}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Please select your profession first to see role suggestions.
              </div>
            )}
          </div>
        );

      case 'job_description':
        return (
          <div className="space-y-4">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here..."
              value={setupData.job_description}
              onChange={(e) => handleDataChange('job_description', e.target.value)}
              className="min-h-[150px] focus-visible:ring-primary/50"
            />
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => handleNext()}>
                Skip this step
              </Button>
            </div>
          </div>
        );

      case 'tone':
        return (
          <div className="grid grid-cols-1 gap-3">
            {TONE_OPTIONS.map((tone) => (
              <motion.div key={tone.value} whileTap={{ scale: 0.98 }}>
                <Card 
                  className={`cursor-pointer transition-all duration-200 ${
                    setupData.tone === tone.value 
                      ? 'border-primary ring-2 ring-primary bg-primary/5' 
                      : 'hover:bg-muted/50 hover:shadow-md'
                  }`}
                  onClick={() => handleDataChange('tone', tone.value)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <tone.icon className="h-6 w-6 text-primary" />
                      <div>
                        <div className="font-medium">{tone.value}</div>
                        <div className="text-sm text-muted-foreground">{tone.description}</div>
                      </div>
                    </div>
                    {setupData.tone === tone.value && <Check className="h-5 w-5 text-primary" />}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ✨ IMPROVED: Responsive width and flexible height */}
      <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Let's Personalize Your Resume
          </DialogTitle>
          <DialogDescription>
            Just a few steps to tailor your resume for success.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden pt-2">
          {/* ✨ NEW: Visual Step Indicator */}
          <StepIndicator steps={cards} currentStep={currentCard} />

          {/* Card content area with smooth transitions */}
          <div className="flex-1 overflow-y-auto px-1 -mx-1 pb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, type: 'tween' }}
              >
                <div className="bg-card p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-1">{cards[currentCard].title}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{cards[currentCard].description}</p>
                    {renderCardContent()}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center pt-4 mt-auto border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentCard === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Step {currentCard + 1} of {cards.length}
            </span>

            <Button
              onClick={handleNext}
              disabled={!isCurrentCardValid()}
              // ✨ IMPROVED: Final button has a more prominent style
              className={`flex items-center gap-2 ${
                currentCard === cards.length - 1 
                ? 'bg-success text-success-foreground hover:bg-success/90' 
                : ''
              }`}
            >
              {currentCard === cards.length - 1 ? (
                <>
                  Complete Setup
                  <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeSetupDialog;