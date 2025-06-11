import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, LayoutTemplate, User, LogOut, Home as HomeIcon, ShieldCheck } from 'lucide-react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import useAuthContext from '@/hooks/useAuth.js';
import ThemeToggle from '../Theme';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { isAuthenticated, userData, signout } = useAuthContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuPanelRef = useRef(null); // Ref for the mobile menu panel itself
  const hamburgerButtonRef = useRef(null); // Ref for the hamburger button
  const navigate = useNavigate();

  const toggleMenu = () => setMobileOpen((open) => !open);
  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = async () => {
    closeMobileMenu();
    await signout();
    // Navigate to login page after signout logic is complete
    navigate('/'); 
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && mobileOpen) {
        closeMobileMenu();
      }
    };
    const handleClickOutside = (event) => {
      if (
        menuPanelRef.current &&
        !menuPanelRef.current.contains(event.target) &&
        hamburgerButtonRef.current &&
        !hamburgerButtonRef.current.contains(event.target)
      ) {
        closeMobileMenu();
      }
    };

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen]);

  const navLinkBaseClasses = "flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const getNavLinkClasses = ({ isActive }) =>
    cn(
      navLinkBaseClasses,
      isActive
        ? "bg-accent text-accent-foreground shadow-inner"
        : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
    );

  const mobileNavLinkBaseClasses = "flex items-center w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card";
  const getMobileNavLinkClasses = ({ isActive }) =>
    cn(
      mobileNavLinkBaseClasses,
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-foreground hover:bg-accent hover:text-accent-foreground"
    );

  return (
    <nav
      className="w-full bg-card text-card-foreground shadow-sm border-b border-border sticky top-0 z-40 backdrop-blur-md bg-card/80 dark:bg-card/85"
      aria-label="Main Navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/home" aria-label="CareerForge Homepage" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm block py-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text">
                CareerForge
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
            <NavLink to="/home" className={getNavLinkClasses}><HomeIcon size={16} className="mr-1.5" />Home</NavLink>
            <NavLink to="/templates" className={getNavLinkClasses}><LayoutTemplate size={16} className="mr-1.5" />Templates</NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className={getNavLinkClasses}><User size={16} className="mr-1.5" />Dashboard</NavLink>
                {userData?.userRole === 'admin' && (
                  <NavLink to="/admin/dashboard" className={getNavLinkClasses}><ShieldCheck size={16} className="mr-1.5" />Admin</NavLink>
                )}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:bg-destructive/10 hover:border-destructive hover:text-destructive text-sm px-3 py-1.5 h-auto"
                onClick={handleLogout}
              >
                <LogOut size={15} className="mr-1.5" /> Logout
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hover:bg-accent/60 hover:text-accent-foreground text-sm px-3 py-1.5 h-auto">
                  <NavLink to="/login">Login</NavLink>
                </Button>
                <Button variant="default" size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm px-3 py-1.5 h-auto">
                  <NavLink to="/signup">Sign Up</NavLink>
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-1">
            <ThemeToggle />
            <Button
              ref={hamburgerButtonRef}
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu-panel"
              className="rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 h-9 w-9"
            >
              <motion.div animate={{ rotate: mobileOpen ? 135 : 0, scale: mobileOpen ? 0.9 : 1 }} transition={{ duration: 0.25, ease: "easeOut" }}>
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.div>
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden absolute inset-x-0 top-16 bg-card/80 dark:bg-card/85 backdrop-blur-md shadow-xl border-t border-border z-30 overflow-y-auto max-h-[calc(100vh-4rem)]"
            role="dialog"
            aria-modal="true"
            ref={menuPanelRef}
          >
            <div className="px-3 pt-3 pb-4 space-y-1.5">
              <NavLink to="/home" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><HomeIcon size={18} className="mr-2.5" />Home</NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/templates" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><LayoutTemplate size={18} className="mr-2.5" />Templates</NavLink>
                  <NavLink to="/dashboard" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><User size={18} className="mr-2.5" />Dashboard</NavLink>
                  {userData?.userRole === 'admin' && (
                    <NavLink to="/admin/dashboard" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><ShieldCheck size={18} className="mr-2.5" />Admin Dashboard</NavLink>
                  )}
                  <div className="pt-2">
                    <Button variant="outline" className="w-full justify-start text-base py-3 border-border hover:bg-destructive/10 hover:border-destructive hover:text-destructive" onClick={handleLogout}>
                      <LogOut size={18} className="mr-2.5" />Logout
                    </Button>
                  </div>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <NavLink to="/login" className={getMobileNavLinkClasses} onClick={closeMobileMenu}>Login</NavLink>
                  <NavLink to="/signup" className={getMobileNavLinkClasses} onClick={closeMobileMenu}>Sign Up</NavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
