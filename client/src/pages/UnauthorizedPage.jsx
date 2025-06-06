import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const UnauthorizedPage = () => {
  return (
    <>
      <Helmet>
        <title>403 - Access Denied | CareerForge</title>
        <meta name="description" content="You do not have permission to access this page on CareerForge." />
      </Helmet>
      <main
        className="flex min-h-[calc(100vh-128px)] flex-col items-center justify-center bg-background text-foreground p-6 text-center"
        aria-labelledby="unauthorized-heading"
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-lg w-full"
        >
          <div className="mb-8">
            <ShieldAlert
              className="mx-auto h-20 w-20 text-destructive"
              strokeWidth={1.5}
            />
          </div>
          <h1 id="unauthorized-heading" className="text-5xl sm:text-6xl font-bold text-primary tracking-tight mb-4">
            403
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">
            Access Denied
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-10">
            You do not have the necessary permissions to access this page. If you believe this is an error, please contact support.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
            >
              <Link to="/dashboard" aria-label="Go to Dashboard">
                <Home className="mr-2 h-5 w-5" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default UnauthorizedPage;
