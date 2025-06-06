import React from 'react';
import { Link } from 'react-router-dom'; // If you want to use client-side routing for these links
import { Heart } from 'lucide-react'; // Optional icon

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-card text-card-foreground border-t border-border"
      role="contentinfo"
      aria-label="Site Footer"
    >
      <div className="container mx-auto px-6 py-8 md:py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          {/* Left Side: Copyright and Brand */}
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear}{' '}
              <Link to="/" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                CareerForge
              </Link>
              . All rights reserved.
            </p>
            {/* Optional: "Made with love" or similar */}
            {/* <p className="text-xs text-muted-foreground/70 mt-1 flex items-center justify-center md:justify-start">
              Made with <Heart size={12} className="mx-1 text-destructive fill-destructive" /> in YourCity
            </p> */}
          </div>

          {/* Right Side: Navigation Links */}
          <nav
            className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2"
            aria-label="Footer navigation"
          >
            {/* Replace # with actual paths or use Link component from react-router-dom */}
            <a
              href="/privacy-policy" // Example path
              className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm"
              aria-label="Read our Privacy Policy"
              // target="_blank" rel="noopener noreferrer" // If external
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service" // Example path
              className="text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm"
              aria-label="Read our Terms of Service"
              // target="_blank" rel="noopener noreferrer" // If external
            >
              Terms of Service
            </a>
            {/* Add more links as needed, e.g., Contact, About Us */}
            {/* <a
              href="/contact"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              aria-label="Contact Us"
            >
              Contact
            </a> */}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
