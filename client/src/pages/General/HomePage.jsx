import React from 'react';
import { Helmet } from 'react-helmet-async';


import HeroSection from '@/components/HomePage/HeroSection.jsx';
import SocialProof from '@/components/HomePage/SocialProof.jsx';
import FeaturesSection from '@/components/HomePage/FeaturesSection.jsx';
import Testimonials from '@/components/HomePage/Testimonials.jsx';
import OurVision from '@/components/HomePage/OurVision.jsx';
import CtaSection from '@/components/HomePage/ctaSection.jsx';


const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>CareerForge | AI-Powered Resume Builder - Transform Your Career Story</title>
        <meta 
          name="description" 
          content="Create professional resumes and cover letters with AI-powered CareerForge. Join 50,000+ success stories. Get 3x more interviews with ATS-friendly templates. Start free!" 
        />
        <meta 
          name="keywords" 
          content="resume builder, AI resume, cover letter generator, job application, career tools, ATS-friendly, professional resume templates" 
        />
        <meta name="author" content="CareerForge" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://careerforge.com/" />
        <meta property="og:title" content="CareerForge | AI-Powered Resume Builder - Transform Your Career Story" />
        <meta property="og:description" content="Create professional resumes and cover letters with AI-powered CareerForge. Join 50,000+ success stories. Get 3x more interviews with ATS-friendly templates. Start free!" />
        <meta property="og:image" content="https://careerforge.com/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://careerforge.com/" />
        <meta property="twitter:title" content="CareerForge | AI-Powered Resume Builder - Transform Your Career Story" />
        <meta property="twitter:description" content="Create professional resumes and cover letters with AI-powered CareerForge. Join 50,000+ success stories. Get 3x more interviews with ATS-friendly templates. Start free!" />
        <meta property="twitter:image" content="https://careerforge.com/twitter-image.jpg" />
        
        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://careerforge.com/" />
        
        {/* Schema markup for better SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "CareerForge",
            "description": "AI-powered resume and cover letter builder that helps professionals create compelling job applications",
            "url": "https://careerforge.com",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free resume builder with premium features"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "50000",
              "bestRating": "5",
              "worstRating": "1"
            }
          })}
        </script>
      </Helmet>

      {/* Modern, artistic homepage sections with calm and motivating design */}
      <main className="min-h-screen">
        {/* Hero Section - Main landing area with compelling headline and CTA */}
        <HeroSection />
        
        {/* Social Proof - Build trust with company logos and stats */}
        {/* <SocialProof /> */}
        
        {/* Features Section - Showcase main product features */}
        <FeaturesSection />
        
        {/* Testimonials - Real user success stories */}
        {/* <Testimonials /> */}
        
        {/* Our Vision - Our vision for the future */}
        <OurVision />
        
        {/* Final CTA - Convert visitors to users */}
        <CtaSection />
      </main>
    </>
  );
};

export default HomePage;