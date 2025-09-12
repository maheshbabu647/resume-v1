

import React from 'react';
import { Helmet } from 'react-helmet-async';

// Import the section components
import HeroSection from '../components/HomePage/HeroSection.jsx';
// import SocialProof from '../components/HomePage/SocialProof.jsx';
import FeaturesSection from '../components/HomePage/FeaturesSection.jsx';
// import Testimonials from '../components/HomePage/Testimonials.jsx'; // <-- Import the new component
import CtaSection from '@/components/HomePage/ctaSection.jsx';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>CareerForge | AI-Powered Resumes & Career Tools</title>
        <meta
          name="description"
          content="Build professional, ATS-friendly resumes and cover letters with CareerForge's AI-powered tools. Get AI mock interviews and land your dream job faster."
        />
        {/* Keep all other meta tags as they are */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://careerforge.pro/" />
        <meta property="og:title" content="CareerForge | AI-Powered Resumes & Career Tools" />
        <meta property="og:description" content="Build professional, ATS-friendly resumes and cover letters with CareerForge's AI-powered tools." />
        <meta property="og:image" content="https://careerforge.pro/og-image-homepage.jpg" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://careerforge.pro/" />
        <meta property="twitter:title" content="CareerForge | AI-Powered Resumes & Career Tools" />
        <meta property="twitter:description" content="Build professional, ATS-friendly resumes and cover letters with CareerForge's AI-powered tools." />
        <meta property="twitter:image" content="https://careerforge.pro/twitter-image-homepage.jpg" />
        <link rel="canonical" href="https://careerforge.pro/" />
      </Helmet>

      <main>
        <HeroSection />
        {/* <SocialProof /> */}
        <FeaturesSection />
        {/* <Testimonials />  */}
        <CtaSection />
      </main>
    </>
  );
};

export default HomePage;