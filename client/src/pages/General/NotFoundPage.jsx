import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle, Mail } from 'lucide-react'; // Added Mail icon
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | CareerForge</title>
        <meta name="description" content="The page you are looking for could not be found on CareerForge." />
      </Helmet>

      <main
        className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-6 sm:p-8 text-center"
        aria-labelledby="notfound-heading"
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full"
        >
          <div className="mb-8">
            <AlertTriangle
              className="mx-auto h-20 w-20 text-destructive animate-pulse" // Pulsing animation for attention
              strokeWidth={1.5}
            />
          </div>

          <h1 id="notfound-heading" className="text-6xl sm:text-7xl font-bold text-primary tracking-tight mb-4">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">
            Oops! Page Not Found.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-10">
            It seems the page you were looking for doesn't exist, might have been removed, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
            >
              <Link to="/home" aria-label="Go to Homepage">
                <Home className="mr-2 h-5 w-5" />
                Go to Homepage
              </Link>
            </Button>
            {/* <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md transition-all"
              onClick={() => window.location.href = 'mailto:support@careerforge.pro'} // Example mailto link
              aria-label="Contact Support"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact Support
            </Button> */}
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default NotFoundPage;
