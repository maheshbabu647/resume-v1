import React from 'react';
import { Helmet } from 'react-helmet-async';

// Import the new section components
import HeroSection from '../components/HomePage/HeroSection.jsx';
import FeaturesSection from '../components/HomePage/FeaturesSection.jsx';
import CtaSection from '@/components/HomePage/ctaSection.jsx';

// import StructuredData from '@/components/StructuredData'; // Keep if you plan to use it

// Your schema data (can be moved to a separate file if it gets large)
const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CareerForge",
  "url": "https://careerforge.pro", // Replace with your actual domain
  "logo": "https://careerforge.pro/logo.png", // Replace with your actual logo URL
  "sameAs": [
    // Add your social media links here
    // "https://twitter.com/yourprofile",
    // "https://linkedin.com/company/yourcompany"
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+1-555-010-0000", // Replace with your contact
      "contactType": "customer support",
      "areaServed": "US", // Adjust as needed
      "availableLanguage": ["English"]
    }
  ]
};

const HomePage = () => {
  return (
    <>
      {/* <StructuredData data={schema} /> */}
      <Helmet>
        <title>CareerForge | AI-Powered Resumes & Career Tools</title>
        <meta
          name="description"
          content="Build professional, ATS-friendly resumes and cover letters with CareerForge's AI-powered tools. Get AI mock interviews and land your dream job faster."
        />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://careerforge.pro/" /> {/* Replace with your actual domain */}
        <meta property="og:title" content="CareerForge | AI-Powered Resumes & Career Tools" />
        <meta property="og:description" content="Build professional, ATS-friendly resumes and cover letters with CareerForge's AI-powered tools." />
        <meta property="og:image" content="https://careerforge.pro/og-image-homepage.jpg" /> {/* Replace with your actual OG image URL */}

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://careerforge.pro/" /> {/* Replace with your actual domain */}
        <meta property="twitter:title" content="CareerForge | AI-Powered Resumes & Career Tools" />
        <meta property="twitter:description" content="Build professional, ATS-friendly resumes and cover letters with CareerForge's AI-powered tools." />
        <meta property="twitter:image" content="https://careerforge.pro/twitter-image-homepage.jpg" /> {/* Replace with your actual Twitter image URL */}

        <link rel="canonical" href="https://careerforge.pro/" /> {/* Replace with your actual domain */}
      </Helmet>

      <main className="flex flex-col items-center justify-center bg-background">
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
      </main>
    </>
  );
};

export default HomePage;
