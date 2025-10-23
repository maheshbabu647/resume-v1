// import React from 'react';
// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { FileText, MessageSquareText, Video, Sparkles, Zap } from "lucide-react"; // Added Zap as an alternative
// import { NavLink } from "react-router-dom";

// const iconMap = {
//   resume: <FileText className="h-7 w-7 text-primary" aria-hidden="true" />,
//   cover: <MessageSquareText className="h-7 w-7 text-primary" aria-hidden="true" />,
//   mock: <Video className="h-7 w-7 text-primary" aria-hidden="true" />,
//   default: <Sparkles className="h-7 w-7 text-primary" aria-hidden="true" />,
// };

// const FeatureCard = ({
//   title,
//   description,
//   icon, // e.g., "resume", "cover", "mock"
//   status = 'coming', // "available" or "coming"
//   linkTo = "/templates", // Default link for available features
//   actionText = "Get Started",
// }) => {
//   const SelectedIcon = iconMap[icon] || iconMap.default;

//   return (
//     <motion.div
//       whileHover={{ y: -6, boxShadow: "0px 10px 20px -5px hsl(var(--primary) / 0.15)" }}
//       transition={{ type: 'spring', stiffness: 300, damping: 15 }}
//       className="h-full" // Ensures motion div takes full height for consistent card sizing in a grid
//       role="region"
//       aria-label={`${title} Feature Card`}
//     >
//       <Card className="bg-card text-card-foreground border-border shadow-lg rounded-xl flex flex-col h-full p-6 hover:border-primary/50 transition-colors duration-200">
//         <CardHeader className="flex flex-row items-start gap-4 p-0 mb-4">
//           <div className="bg-primary/10 p-3 rounded-lg">
//             {SelectedIcon}
//           </div>
//           <div className="flex-1">
//             <CardTitle className="text-xl font-semibold text-foreground leading-tight">
//               {title}
//             </CardTitle>
//           </div>
//         </CardHeader>

//         <CardContent className="p-0 flex-grow">
//           <p className="text-sm text-muted-foreground leading-relaxed">
//             {description}
//           </p>
//         </CardContent>

//         <div className="mt-auto pt-5"> {/* Pushes button/badge to the bottom */}
//           {status === 'available' ? (
//             <Button
//               className="w-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring"
//               asChild
//               aria-label={`${actionText} for ${title}`}
//             >
//               <NavLink to={linkTo}>
//                 {actionText} <span aria-hidden="true" className="ml-1.5">→</span>
//               </NavLink>
//             </Button>
//           ) : (
//             <Badge variant="outline" className="w-full justify-center py-2 text-sm border-dashed border-border text-muted-foreground">
//               Coming Soon
//             </Badge>
//           )}
//         </div>
//       </Card>
//     </motion.div>
//   );
// };

// export default FeatureCard;


import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquareText, Video, Sparkles, Zap, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

// Standardized icon size to h-6 w-6
const iconMap = {
  resume: <FileText className="h-6 w-6 text-primary" aria-hidden="true" />,
  cover: <MessageSquareText className="h-6 w-6 text-primary" aria-hidden="true" />,
  mock: <Video className="h-6 w-6 text-primary" aria-hidden="true" />,
  default: <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />,
  ats: <Zap className="h-6 w-6 text-primary" aria-hidden="true" />,
};

const FeatureCard = ({
  title,
  description,
  icon, // e.g., "resume", "cover", "mock", "ats"
  status = 'coming', // "available" or "coming"
  linkTo = "/templates",
  actionText = "Get Started",
}) => {
  const SelectedIcon = iconMap[icon] || iconMap.default;

  return (
    <motion.div
      // Kept your excellent hover effect
      whileHover={{ y: -6, boxShadow: "0px 10px 20px -5px hsl(var(--primary) / 0.15)" }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className="h-full"
      role="region"
      aria-label={`${title} Feature Card`}
    >
      {/* Card uses rounded-xl, which is perfect for a nested component.
        Standardized internal padding to p-6 for consistency.
      */}
      <Card className="bg-card text-card-foreground border-border shadow-lg rounded-xl flex flex-col h-full p-6 hover:border-primary/50 transition-colors duration-200">
        <CardHeader className="flex flex-row items-start gap-4 p-0 mb-4">
          {/* Icon container uses rounded-lg (one step down from card) */}
          <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
            {SelectedIcon}
          </div>
          <div className="flex-1">
            {/* Standardized typography: text-lg for nested card titles */}
            <CardTitle className="text-lg font-semibold text-foreground leading-tight">
              {title}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-grow">
          {/* Description text-sm is perfect */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>

        <div className="mt-auto pt-6"> {/* Standardized top padding */}
          {status === 'available' ? (
            <Button
              // Standardized Button: rounded-xl
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring rounded-xl group"
              asChild
              aria-label={`${actionText} for ${title}`}
            >
              <NavLink to={linkTo} className="flex items-center justify-center gap-2">
                {actionText}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </NavLink>
            </Button>
          ) : (
            // Standardized Badge: rounded-xl
            <Badge 
              variant="outline" 
              className="w-full justify-center py-2 text-sm border-dashed border-border text-muted-foreground rounded-xl"
            >
              Coming Soon
            </Badge>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
