import React from 'react';
import { motion } from 'framer-motion';

// Using a logo service like clearbit is great for placeholders.
// For production, it's best to host these logos yourself.
const logos = [
  { name: 'Google', src: 'https://logo.clearbit.com/google.com' },
  { name: 'Microsoft', src: 'https://logo.clearbit.com/microsoft.com' },
  { name: 'Amazon', src: 'https://logo.clearbit.com/amazon.com' },
  { name: 'Deloitte', src: 'https://logo.clearbit.com/deloitte.com' },
  { name: 'Spotify', src: 'https://logo.clearbit.com/spotify.com' },
];

const SocialProof = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Trusted by job seekers at top companies
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 mt-6">
            {logos.map((logo, index) => (
              <img
                key={index}
                src={logo.src}
                alt={logo.name}
                className="h-7 transition-transform duration-300 hover:scale-110"
                // Fallback in case the logo API fails
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://placehold.co/150x40/FAFAFA/CCCCCC?text=${logo.name}`;
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;