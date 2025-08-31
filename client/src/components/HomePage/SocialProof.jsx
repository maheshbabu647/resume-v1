import React from 'react';
import { motion } from 'framer-motion';
import googlelogo from '../../assets/company-logos/google-icn.svg'
import microsoftlogo from '../../assets/company-logos/microsoft-icn.svg'
import amazonlogo from '../../assets/company-logos/amazon-icn.svg'
import deloittelogo from '../../assets/company-logos/deloitte-icn.svg'
import spotifylogo from '../../assets/company-logos/spotify-icn.svg'


// Using a logo service like clearbit is great for placeholders.
// For production, it's best to host these logos yourself.
const logos = [
  { name: 'Google', src: googlelogo },
  { name: 'Microsoft', src: microsoftlogo },
  { name: 'Amazon', src: amazonlogo },
  { name: 'Deloitte', src: deloittelogo },
  { name: 'Spotify', src: spotifylogo },
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
                className="h-5 transition-transform duration-300 hover:scale-110"
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