import React from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // 1. Import useLocation
import { cn } from '@/lib/utils'; // Assuming you have a utility for classnames

import Navbar from '../Common/Navbar/Navbar.jsx';
import Footer from '../Common/Footer/Footer';

const MainLayout = () => {
  // 2. Get the current URL location
  const location = useLocation();

  // Check if the current path is for the resume editor
  const isEditorPage = location.pathname.startsWith('/resume/new/') || location.pathname.startsWith('/resume/edit/');

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 3. Conditionally render the Navbar */}
      {!isEditorPage && <Navbar />}
      
      <main
        // 4. Conditionally apply top padding to avoid a gap on the editor page
        className={cn(
          "flex-grow bg-background text-foreground",
          // !isEditorPage && "pt-16" 
        )}
        role="main"
        id="main-content"
        aria-label="Main Content Area"
        tabIndex={-1}
      >
        <Outlet />
      </main>

      {/* 5. Conditionally render the Footer */}
      {!isEditorPage && <Footer />}

    </div>
  );
};

export default MainLayout;