import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-muted/30 text-muted-foreground border-t border-border"
      role="contentinfo"
      aria-label="Site Footer"
    >
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left Side: Brand & Copyright */}
          <div className="text-center md:text-left">
             <Link to="/home" className="text-lg font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm">
                Career<span className="text-primary">Forge</span>
             </Link>
            <p className="text-sm mt-2">
              &copy; {currentYear} CareerForge. All rights reserved.
            </p>
          </div>

          {/* Right Side: Navigation Links */}
          <nav
            className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2"
            aria-label="Footer navigation"
          >
            <Link
              to="/privacy-policy"
              className="text-sm hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-sm hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
             <Link
              to="/contact"
              className="text-sm hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
