// // import React, { useEffect, useState, useRef } from 'react';
// // import { AnimatePresence, motion } from 'framer-motion';
// // import { Button } from '@/components/ui/button';
// // import { Menu, X, LayoutTemplate, User, LogOut, Home as HomeIcon, ShieldCheck } from 'lucide-react';
// // import { NavLink, useNavigate, Link } from 'react-router-dom';
// // import useAuthContext from '@/hooks/useAuth.js';
// // import ThemeToggle from '../Theme';
// // import { cn } from '@/lib/utils';

// // const Navbar = () => {
// //   const { isAuthenticated, userData, signout } = useAuthContext();
// //   const [mobileOpen, setMobileOpen] = useState(false);
// //   const menuPanelRef = useRef(null); // Ref for the mobile menu panel itself
// //   const hamburgerButtonRef = useRef(null); // Ref for the hamburger button
// //   const navigate = useNavigate();

// //   const toggleMenu = () => setMobileOpen((open) => !open);
// //   const closeMobileMenu = () => setMobileOpen(false);

// //   const handleLogout = async () => {
// //     closeMobileMenu();
// //     await signout();
// //     // Navigate to login page after signout logic is complete
// //     navigate('/'); 
// //   };

// //   useEffect(() => {
// //     const handleKeyDown = (event) => {
// //       if (event.key === "Escape" && mobileOpen) {
// //         closeMobileMenu();
// //       }
// //     };
// //     const handleClickOutside = (event) => {
// //       if (
// //         menuPanelRef.current &&
// //         !menuPanelRef.current.contains(event.target) &&
// //         hamburgerButtonRef.current &&
// //         !hamburgerButtonRef.current.contains(event.target)
// //       ) {
// //         closeMobileMenu();
// //       }
// //     };

// //     if (mobileOpen) {
// //       document.body.style.overflow = "hidden";
// //       document.addEventListener("keydown", handleKeyDown);
// //       document.addEventListener("mousedown", handleClickOutside);
// //     } else {
// //       document.body.style.overflow = "";
// //     }

// //     return () => {
// //       document.body.style.overflow = "";
// //       document.removeEventListener("keydown", handleKeyDown);
// //       document.removeEventListener("mousedown", handleClickOutside);
// //     };
// //   }, [mobileOpen]);

// //   const navLinkBaseClasses = "flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
// //   const getNavLinkClasses = ({ isActive }) =>
// //     cn(
// //       navLinkBaseClasses,
// //       isActive
// //         ? "bg-accent text-accent-foreground shadow-inner"
// //         : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
// //     );

// //   const mobileNavLinkBaseClasses = "flex items-center w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card";
// //   const getMobileNavLinkClasses = ({ isActive }) =>
// //     cn(
// //       mobileNavLinkBaseClasses,
// //       isActive
// //         ? "bg-primary text-primary-foreground"
// //         : "text-foreground hover:bg-accent hover:text-accent-foreground"
// //     );

// //   return (
// //     <nav
// //       className="w-full bg-card text-card-foreground shadow-sm border-b border-border sticky top-0 z-40 backdrop-blur-md bg-card/80 dark:bg-card/85"
// //       aria-label="Main Navigation"
// //     >
// //       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="flex h-16 items-center justify-between">
// //           <div className="flex-shrink-0">
// //             <Link to="/home" aria-label="CareerForge Homepage" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm block py-1">
// //               <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary text-transparent bg-clip-text">
// //                 CareerForge
// //               </span>
// //             </Link>
// //           </div>

// //           <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
// //             <NavLink to="/home" className={getNavLinkClasses}><HomeIcon size={16} className="mr-1.5" />Home</NavLink>
// //             <NavLink to="/templates" className={getNavLinkClasses}><LayoutTemplate size={16} className="mr-1.5" />Templates</NavLink>

// //             {isAuthenticated && (
// //               <>
// //                 <NavLink to="/dashboard" className={getNavLinkClasses}><User size={16} className="mr-1.5" />Dashboard</NavLink>
// //                 {userData?.userRole === 'admin' && (
// //                   <NavLink to="/admin/dashboard" className={getNavLinkClasses}><ShieldCheck size={16} className="mr-1.5" />Admin</NavLink>
// //                 )}
// //               </>
// //             )}
// //           </div>

// //           <div className="hidden md:flex items-center space-x-2">
// //             <ThemeToggle />
// //             {isAuthenticated ? (
// //               <Button
// //                 variant="outline"
// //                 size="sm"
// //                 className="border-border hover:bg-destructive/10 hover:border-destructive hover:text-destructive text-sm px-3 py-1.5 h-auto"
// //                 onClick={handleLogout}
// //               >
// //                 <LogOut size={15} className="mr-1.5" /> Logout
// //               </Button>
// //             ) : (
// //               <>
// //                 <Button variant="ghost" size="sm" asChild className="hover:bg-accent/60 hover:text-accent-foreground text-sm px-3 py-1.5 h-auto">
// //                   <NavLink to="/login">Login</NavLink>
// //                 </Button>
// //                 <Button variant="default" size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm px-3 py-1.5 h-auto">
// //                   <NavLink to="/signup">Sign Up</NavLink>
// //                 </Button>
// //               </>
// //             )}
// //           </div>

// //           <div className="md:hidden flex items-center space-x-1">
// //             <ThemeToggle />
// //             <Button
// //               ref={hamburgerButtonRef}
// //               variant="ghost"
// //               size="icon"
// //               onClick={toggleMenu}
// //               aria-label={mobileOpen ? "Close menu" : "Open menu"}
// //               aria-expanded={mobileOpen}
// //               aria-controls="mobile-menu-panel"
// //               className="rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 h-9 w-9"
// //             >
// //               <motion.div animate={{ rotate: mobileOpen ? 135 : 0, scale: mobileOpen ? 0.9 : 1 }} transition={{ duration: 0.25, ease: "easeOut" }}>
// //                 {mobileOpen ? <X size={22} /> : <Menu size={22} />}
// //               </motion.div>
// //             </Button>
// //           </div>
// //         </div>
// //       </div>

// //       <AnimatePresence>
// //         {mobileOpen && (
// //           <motion.div
// //             id="mobile-menu-panel"
// //             initial={{ opacity: 0, y: -20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             exit={{ opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } }}
// //             transition={{ duration: 0.3, ease: "easeOut" }}
// //             className="md:hidden absolute inset-x-0 top-16 bg-card/80 dark:bg-card/85 backdrop-blur-md shadow-xl border-t border-border z-30 overflow-y-auto max-h-[calc(100vh-4rem)]"
// //             role="dialog"
// //             aria-modal="true"
// //             ref={menuPanelRef}
// //           >
// //             <div className="px-3 pt-3 pb-4 space-y-1.5">
// //               <NavLink to="/home" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><HomeIcon size={18} className="mr-2.5" />Home</NavLink>
// //               {isAuthenticated && (
// //                 <>
// //                   <NavLink to="/templates" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><LayoutTemplate size={18} className="mr-2.5" />Templates</NavLink>
// //                   <NavLink to="/dashboard" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><User size={18} className="mr-2.5" />Dashboard</NavLink>
// //                   {userData?.userRole === 'admin' && (
// //                     <NavLink to="/admin/dashboard" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><ShieldCheck size={18} className="mr-2.5" />Admin Dashboard</NavLink>
// //                   )}
// //                   <div className="pt-2">
// //                     <Button variant="outline" className="w-full justify-start text-base py-3 border-border hover:bg-destructive/10 hover:border-destructive hover:text-destructive" onClick={handleLogout}>
// //                       <LogOut size={18} className="mr-2.5" />Logout
// //                     </Button>
// //                   </div>
// //                 </>
// //               )}
// //               {!isAuthenticated && (
// //                 <>
// //                   <NavLink to="/login" className={getMobileNavLinkClasses} onClick={closeMobileMenu}>Login</NavLink>
// //                   <NavLink to="/signup" className={getMobileNavLinkClasses} onClick={closeMobileMenu}>Sign Up</NavLink>
// //                 </>
// //               )}
// //             </div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </nav>
// //   );
// // };

// // export default Navbar;


// import React, { useEffect, useState, useRef } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { Menu, X, LayoutTemplate, User, LogOut, Home as HomeIcon, ShieldCheck } from 'lucide-react';
// import { NavLink, useNavigate, Link } from 'react-router-dom';
// import useAuthContext from '@/hooks/useAuth.js';
// import ThemeToggle from '../Theme';
// import { cn } from '@/lib/utils';

// const Navbar = () => {
//   const { isAuthenticated, userData, signout } = useAuthContext();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const menuPanelRef = useRef(null);
//   const hamburgerButtonRef = useRef(null);
//   const navigate = useNavigate();

//   const toggleMenu = () => setMobileOpen((open) => !open);
//   const closeMobileMenu = () => setMobileOpen(false);

//   const handleLogout = async () => {
//     closeMobileMenu();
//     await signout();
//     navigate('/');
//   };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.key === "Escape" && mobileOpen) {
//         closeMobileMenu();
//       }
//     };
//     const handleClickOutside = (event) => {
//       if (
//         menuPanelRef.current &&
//         !menuPanelRef.current.contains(event.target) &&
//         hamburgerButtonRef.current &&
//         !hamburgerButtonRef.current.contains(event.target)
//       ) {
//         closeMobileMenu();
//       }
//     };

//     if (mobileOpen) {
//       document.body.style.overflow = "hidden";
//       document.addEventListener("keydown", handleKeyDown);
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.body.style.overflow = "";
//     }

//     return () => {
//       document.body.style.overflow = "";
//       document.removeEventListener("keydown", handleKeyDown);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [mobileOpen]);

//   // Updated styles for a cleaner, more modern look
//   const navLinkBaseClasses = "px-3 py-2 rounded-md text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
//   const getNavLinkClasses = ({ isActive }) =>
//     cn(
//       navLinkBaseClasses,
//       isActive
//         ? "text-primary font-semibold"
//         : "hover:text-foreground"
//     );

//   const mobileNavLinkBaseClasses = "flex items-center w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card";
//   const getMobileNavLinkClasses = ({ isActive }) =>
//     cn(
//       mobileNavLinkBaseClasses,
//       isActive
//         ? "bg-primary text-primary-foreground"
//         : "text-foreground hover:bg-accent hover:text-accent-foreground"
//     );

//   return (
//     <header
//       className="w-full fixed top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border"
//       aria-label="Main Navigation"
//     >
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           <div className="flex-shrink-0">
//             <Link to="/home" aria-label="CareerForge Homepage" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm block py-1">
//               <span className="text-2xl font-bold text-foreground">
//                 Career<span className="text-primary">Forge</span>
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
//             <NavLink to="/home" className={getNavLinkClasses}>Home</NavLink>
//             <NavLink to="/templates" className={getNavLinkClasses}>Templates</NavLink>

//             {isAuthenticated && (
//               <>
//                 <NavLink to="/dashboard" className={getNavLinkClasses}>Dashboard</NavLink>
//                 {userData?.userRole === 'admin' && (
//                   <NavLink to="/admin/dashboard" className={getNavLinkClasses}>Admin</NavLink>
//                 )}
//               </>
//             )}
//           </nav>

//           {/* Desktop Auth Buttons & Theme Toggle */}
//           <div className="hidden md:flex items-center space-x-2">
//             <ThemeToggle />
//             {isAuthenticated ? (
//               <Button variant="ghost" className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout}>
//                 <LogOut size={16} className="mr-2" /> Logout
//               </Button>
//             ) : (
//               <>
//                 <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
//                   <NavLink to="/login">Login</NavLink>
//                 </Button>
//                 <Button asChild>
//                   <NavLink to="/signup">Sign Up</NavLink>
//                 </Button>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Button & Theme Toggle */}
//           <div className="md:hidden flex items-center space-x-1">
//             <ThemeToggle />
//             <Button
//               ref={hamburgerButtonRef}
//               variant="ghost"
//               size="icon"
//               onClick={toggleMenu}
//               aria-label={mobileOpen ? "Close menu" : "Open menu"}
//               aria-expanded={mobileOpen}
//               aria-controls="mobile-menu-panel"
//               className="rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 h-9 w-9"
//             >
//               <motion.div animate={{ rotate: mobileOpen ? 90 : 0, scale: 1 }} transition={{ duration: 0.2, ease: "easeOut" }}>
//                 {mobileOpen ? <X size={22} /> : <Menu size={22} />}
//               </motion.div>
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu Panel */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div
//             id="mobile-menu-panel"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } }}
//             transition={{ duration: 0.3, ease: "easeOut" }}
//             className="md:hidden absolute inset-x-0 top-16 bg-background/80 backdrop-blur-lg shadow-xl border-t border-border z-30 overflow-y-auto max-h-[calc(100vh-4rem)]"
//             role="dialog"
//             aria-modal="true"
//             ref={menuPanelRef}
//           >
//             <div className="px-3 pt-3 pb-4 space-y-1.5">
//               <NavLink to="/home" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><HomeIcon size={18} className="mr-2.5" />Home</NavLink>
//               <NavLink to="/templates" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><LayoutTemplate size={18} className="mr-2.5" />Templates</NavLink>
//               {isAuthenticated && (
//                 <>
//                   <NavLink to="/dashboard" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><User size={18} className="mr-2.5" />Dashboard</NavLink>
//                   {userData?.userRole === 'admin' && (
//                     <NavLink to="/admin/dashboard" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><ShieldCheck size={18} className="mr-2.5" />Admin Dashboard</NavLink>
//                   )}
//                   <div className="pt-4 border-t border-border mx-2"></div>
//                   <Button variant="ghost" className="w-full justify-start text-base py-3 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
//                       <LogOut size={18} className="mr-2.5" />Logout
//                   </Button>
//                 </>
//               )}
//               {!isAuthenticated && (
//                  <div className="pt-4 border-t border-border mx-2 flex flex-col space-y-2">
//                     <Button variant="ghost" asChild className="w-full justify-center text-base py-3">
//                         <NavLink to="/login" onClick={closeMobileMenu}>Login</NavLink>
//                     </Button>
//                     <Button asChild className="w-full text-base py-3">
//                         <NavLink to="/signup" onClick={closeMobileMenu}>Sign Up</NavLink>
//                     </Button>
//                  </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// };

// export default Navbar;

import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, LayoutTemplate, User, LogOut, Home as HomeIcon, ShieldCheck } from 'lucide-react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import useAuthContext from '@/hooks/useAuth.js';
import ThemeToggle from '../Theme';
import { cn } from '@/lib/utils';

// --- MODIFICATION START ---
// Import Avatar and DropdownMenu components from your UI library
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// --- MODIFICATION END ---

const Navbar = () => {
  const { isAuthenticated, userData, signout } = useAuthContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuPanelRef = useRef(null);
  const hamburgerButtonRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMobileOpen((open) => !open);
  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = async () => {
    closeMobileMenu();
    await signout();
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
        !menuPanel_current.contains(event.target) &&
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

  const navLinkBaseClasses = "px-3 py-2 rounded-md text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const getNavLinkClasses = ({ isActive }) =>
    cn(
      navLinkBaseClasses,
      isActive
        ? "text-primary font-semibold"
        : "hover:text-foreground"
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
    <header
      className="w-full fixed top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border"
      aria-label="Main Navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/home" aria-label="CareerForge Homepage" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm block py-1">
              <span className="text-2xl font-bold text-foreground">
                Career<span className="text-primary">Forge</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4">
            <NavLink to="/home" className={getNavLinkClasses}>Home</NavLink>
            <NavLink to="/templates" className={getNavLinkClasses}>Templates</NavLink>
            <NavLink to="/cover-letter/generate" className={getNavLinkClasses}>Cover Letter</NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className={getNavLinkClasses}>Dashboard</NavLink>
                {userData?.userRole === 'admin' && (
                  <NavLink to="/admin/dashboard" className={getNavLinkClasses}>Admin</NavLink>
                )}
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            {isAuthenticated ? (
              // --- MODIFICATION START: Replaced Logout Button with Avatar Dropdown ---
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      {/* You can add an AvatarImage here if you store profile pictures */}
                      {/* <AvatarImage src={userData.avatarUrl} alt={userData.userName} /> */}
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {userData?.userName?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userData?.userName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userData?.userEmail}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              // --- MODIFICATION END ---
            ) : (
              <>
                <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                  <NavLink to="/login">Login</NavLink>
                </Button>
                <Button asChild>
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
              <motion.div animate={{ rotate: mobileOpen ? 90 : 0, scale: 1 }} transition={{ duration: 0.2, ease: "easeOut" }}>
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
            className="md:hidden absolute inset-x-0 top-16 bg-background/80 backdrop-blur-lg shadow-xl border-t border-border z-30 overflow-y-auto max-h-[calc(100vh-4rem)]"
            role="dialog"
            aria-modal="true"
            ref={menuPanelRef}
          >
            <div className="px-3 pt-3 pb-4 space-y-1.5">
              <NavLink to="/home" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><HomeIcon size={18} className="mr-2.5" />Home</NavLink>
              <NavLink to="/templates" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><LayoutTemplate size={18} className="mr-2.5" />Templates</NavLink>
              <NavLink to="/cover-letter/generate" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><LayoutTemplate size={18} className="mr-2.5" />Cover Letter</NavLink>

              {isAuthenticated && (
                <>
                  <NavLink to="/dashboard" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><User size={18} className="mr-2.5" />Dashboard</NavLink>
                  {userData?.userRole === 'admin' && (
                    <NavLink to="/admin/dashboard" className={getMobileNavLinkClasses} onClick={closeMobileMenu}><ShieldCheck size={18} className="mr-2.5" />Admin Dashboard</NavLink>
                  )}
                  <div className="pt-4 border-t border-border mx-2"></div>
                  <Button variant="ghost" className="w-full justify-start text-base py-3 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                      <LogOut size={18} className="mr-2.5" />Logout
                  </Button>
                </>
              )}
              {!isAuthenticated && (
                 <div className="pt-4 border-t border-border mx-2 flex flex-col space-y-2">
                    <Button variant="ghost" asChild className="w-full justify-center text-base py-3">
                        <NavLink to="/login" onClick={closeMobileMenu}>Login</NavLink>
                    </Button>
                    <Button asChild className="w-full text-base py-3">
                        <NavLink to="/signup" onClick={closeMobileMenu}>Sign Up</NavLink>
                    </Button>
                 </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;