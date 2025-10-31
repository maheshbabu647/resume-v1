import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, LayoutTemplate, User, LogOut, Home as HomeIcon, ShieldCheck, Sparkles, Zap, Star, Settings, BarChart3, Users, Crown, Upload } from 'lucide-react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import useAuthContext from '@/hooks/useAuth.js';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { isAuthenticated, userData, signout } = useAuthContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuPanelRef = useRef(null);
  const hamburgerButtonRef = useRef(null);
  const navigate = useNavigate();

  // Component logic remains the same
  const toggleMenu = () => setMobileOpen((open) => !open);
  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = async () => {
    closeMobileMenu();
    await signout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
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


  // NavLink classes updated to use semantic theme colors
  const navLinkBaseClasses = "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative overflow-hidden group";

  const getNavLinkClasses = ({ isActive }) =>
    cn(
      navLinkBaseClasses,
      isActive
        ? "text-primary bg-primary/10 backdrop-blur-sm shadow-lg"
        : "text-secondary-foreground hover:text-primary hover:bg-card/80 hover:backdrop-blur-sm hover:shadow-md"
    );

  const mobileNavLinkBaseClasses = "flex items-center w-full text-left px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group";

  const getMobileNavLinkClasses = ({ isActive }) =>
    cn(
      mobileNavLinkBaseClasses,
      isActive
        ? "bg-gradient-to-r from-primary to-accent-purple text-primary-foreground shadow-xl"
        : "text-secondary-foreground hover:bg-card/80 hover:backdrop-blur-sm hover:shadow-lg"
    );

  return (
    <motion.header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 ease-in-out",
        isScrolled 
          ? "bg-card/80 backdrop-blur-xl shadow-xl border-b border-border" 
          : "bg-card/60 backdrop-blur-md shadow-lg border-b border-border/50"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-card/20 to-accent-purple/5 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex h-16 items-center justify-between">
          
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img src="/logo.JPG" alt="CareerForge" className="w-10 h-10 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 object-cover" />
              </div>

              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-secondary-foreground bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent-purple transition-all duration-300">
                  CareerForge
                </h1>
                <p className="text-xs text-muted-foreground -mt-1 group-hover:text-secondary-foreground transition-colors">
                  Resume Builder
                </p>
              </div>
            </Link>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-2">
            <NavLink to="/" className={getNavLinkClasses}>
              <span className="flex items-center gap-2"><HomeIcon className="w-4 h-4" />Home</span>
            </NavLink>
            
            <NavLink to="/templates" className={getNavLinkClasses}>
              <span className="flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4" />
                Resume Builder
                <motion.div
                  className="ml-1 px-2 py-0.5 bg-success rounded-full text-xs text-success-foreground font-bold shadow-md"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  FREE
                </motion.div>
              </span>
            </NavLink>

            <NavLink to="/cover-letter/generate" className={getNavLinkClasses}>
              <span className="flex items-center gap-2"><Zap className="w-4 h-4" />Cover Letters</span>
            </NavLink>

            <NavLink to="/ats-checker" className={getNavLinkClasses}>
              <span className="flex items-center gap-2"><Upload className="w-4 h-4" />ATS Checker</span>
            </NavLink>

            {/* Dashboard Navigation - Only show for authenticated users */}
            {isAuthenticated && (
              <NavLink to="/dashboard" className={getNavLinkClasses}>
                <span className="flex items-center gap-2"><Star className="w-4 h-4" />My Dashboard</span>
              </NavLink>
            )}

            {/* Admin Navigation - Only show for admin users */}
            {isAuthenticated && userData?.userRole === 'admin' && (
              <NavLink to="/admin" className={getNavLinkClasses}>
                <span className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Admin
                  <motion.div
                    className="ml-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs text-white font-bold shadow-md"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ADMIN
                  </motion.div>
                </span>
              </NavLink>
            )}

            {/* <NavLink to="/templates" className={getNavLinkClasses}>
              <span className="flex items-center gap-2"><Star className="w-4 h-4" />Templates</span>
            </NavLink> */}
          </nav>

          <div className="flex items-center gap-4">

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-primary/10">
                      <Avatar className="h-10 w-10 border-2 border-card/50 shadow-lg">
                        <AvatarImage src={userData?.profilePicture} alt={userData?.userName || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent-purple text-primary-foreground font-bold">
                          {userData?.userName?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card shadow-md">
                        <div className="w-full h-full rounded-full bg-success animate-pulse"></div>
                      </div>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  className="w-64 bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-2" 
                  align="end"
                >
                  <DropdownMenuLabel className="px-4 py-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-foreground">{userData?.userName || "User"}</p>
                      <p className="text-xs text-muted-foreground">{userData?.userEmail}</p>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator className="bg-border" />
                  
                  <DropdownMenuItem className="px-4 py-3 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer">
                    <User className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="text-secondary-foreground font-medium">Profile</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="px-4 py-3 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer">
                    <ShieldCheck className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span className="text-secondary-foreground font-medium">Privacy</span>
                  </DropdownMenuItem>
                  
                  {/* Admin Options - Only show for admin users */}
                  {userData?.userRole === 'admin' && (
                    <>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem 
                        onClick={() => navigate('/admin')}
                        className="px-4 py-3 rounded-xl hover:bg-amber-50/80 transition-colors cursor-pointer"
                      >
                        <Crown className="mr-3 h-4 w-4 text-amber-600" />
                        <span className="text-amber-700 font-medium">Admin Panel</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate('/admin/analytics/overview')}
                        className="px-4 py-3 rounded-xl hover:bg-blue-50/80 transition-colors cursor-pointer"
                      >
                        <BarChart3 className="mr-3 h-4 w-4 text-blue-600" />
                        <span className="text-blue-700 font-medium">Analytics</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate('/admin/templates')}
                        className="px-4 py-3 rounded-xl hover:bg-purple-50/80 transition-colors cursor-pointer"
                      >
                        <Settings className="mr-3 h-4 w-4 text-purple-600" />
                        <span className="text-purple-700 font-medium">Manage Templates</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator className="bg-border" />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive hover:!text-destructive/90 transition-colors cursor-pointer"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Button variant="ghost" size="sm" className="text-secondary-foreground hover:text-primary hover:bg-primary/10 rounded-xl font-semibold transition-all duration-300" asChild>
                  <NavLink to="/login">Sign In</NavLink>
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" className="bg-gradient-to-r from-primary to-accent-purple hover:opacity-90 text-primary-foreground px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold" asChild>
                    <NavLink to="/signup" className="flex items-center gap-2">Start Free<Sparkles className="w-4 h-4" /></NavLink>
                  </Button>
                </motion.div>
              </div>
            )}

            <motion.button
              ref={hamburgerButtonRef}
              onClick={toggleMenu}
              className="lg:hidden relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              aria-label="Toggle mobile menu"
            >
              <motion.div animate={mobileOpen ? "open" : "closed"} variants={{ open: { rotate: 180 }, closed: { rotate: 0 }}} transition={{ duration: 0.3 }}>
                {mobileOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-foreground" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-foreground" />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 bg-secondary-foreground/20 backdrop-blur-sm z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
            <motion.div
              ref={menuPanelRef}
              className="fixed top-[4.5rem] right-2 left-2 sm:right-4 sm:left-4 bg-card/95 backdrop-blur-xl border border-border rounded-2xl sm:rounded-3xl shadow-2xl z-50 lg:hidden overflow-hidden max-h-[calc(100vh-6rem)] overflow-y-auto"
              initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Mobile Menu Header with Close Button */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border/50">
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Menu</h2>
                <motion.button
                  onClick={closeMobileMenu}
                  className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.button>
              </div>
              
              <div className="p-4 sm:p-6 space-y-1 sm:space-y-2">
                <NavLink to="/" onClick={closeMobileMenu} className={getMobileNavLinkClasses}><HomeIcon className="w-5 h-5 mr-3" />Home</NavLink>
                <NavLink to="/templates" onClick={closeMobileMenu} className={getMobileNavLinkClasses}>
                  <LayoutTemplate className="w-5 h-5 mr-3" />
                  Resume Builder
                  <motion.div className="ml-auto px-3 py-1 bg-success rounded-full text-xs text-success-foreground font-bold shadow-md" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>FREE</motion.div>
                </NavLink>
                <NavLink to="/cover-letter/generate" onClick={closeMobileMenu} className={getMobileNavLinkClasses}><Zap className="w-5 h-5 mr-3" />Cover Letters</NavLink>
                <NavLink to="/ats-checker" onClick={closeMobileMenu} className={getMobileNavLinkClasses}><Upload className="w-5 h-5 mr-3" />ATS Checker</NavLink>
               
                
                {/* Dashboard Navigation for Mobile - Only show for authenticated users */}
                {isAuthenticated && (
                  <NavLink to="/dashboard" onClick={closeMobileMenu} className={getMobileNavLinkClasses}>
                    <Star className="w-5 h-5 mr-3" />
                    My Dashboard
                  </NavLink>
                )}
                
                {/* Admin Navigation for Mobile - Only show for admin users */}
                {isAuthenticated && userData?.userRole === 'admin' && (
                  <NavLink to="/admin" onClick={closeMobileMenu} className={getMobileNavLinkClasses}>
                    <Crown className="w-5 h-5 mr-3" />
                    Admin Panel
                    <motion.div
                      className="ml-auto px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs text-white font-bold shadow-md"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ADMIN
                    </motion.div>
                  </NavLink>
                )}

                {!isAuthenticated && (
                  <>
                    <div className="border-t border-border my-4"></div>
                    <NavLink to="/login" onClick={closeMobileMenu} className={getMobileNavLinkClasses}><User className="w-5 h-5 mr-3" />Sign In</NavLink>
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <NavLink to="/signup" onClick={closeMobileMenu} className="flex items-center w-full text-left px-6 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-primary to-accent-purple text-primary-foreground shadow-xl group transition-all duration-300">
                        <Sparkles className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                        Start Free Today
                        <motion.div className="ml-auto" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}><Zap className="w-5 h-5" /></motion.div>
                      </NavLink>
                    </motion.div>
                  </>
                )}

                {isAuthenticated && (
                  <>
                    <div className="border-t border-border my-4"></div>
                    <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary/10 to-accent-purple/10 rounded-2xl">
                      <Avatar className="h-12 w-12 border-2 border-card/50 shadow-lg">
                        <AvatarImage src={userData?.profilePicture} alt={userData?.userName || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent-purple text-primary-foreground font-bold">{userData?.userName?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{userData?.userName || "User"}</p>
                        <p className="text-sm text-muted-foreground">{userData?.userEmail}</p>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center w-full text-left px-6 py-4 rounded-2xl text-base font-semibold text-destructive hover:bg-destructive/10 transition-colors group">
                      <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />Sign Out
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;