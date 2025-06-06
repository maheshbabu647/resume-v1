import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../Common/Navbar/Navbar.jsx'; // Path to your Navbar
import Footer from '../Common/Footer/Footer';   // Path to your Footer

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* The main content area will now be directly controlled by the page component rendered via Outlet */}
      {/* Added bg-background and text-foreground here to ensure a themed default for pages */}
      <main
        className="flex-grow bg-background text-foreground"
        role="main"
        id="main-content"
        aria-label="Main Content Area"
        tabIndex={-1} // Allows programmatic focus if needed, e.g., after navigation
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
