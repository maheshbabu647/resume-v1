import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  Mail, 
  Twitter, 
  Linkedin, 
  Github, 
  Users,
  ArrowUp,
  Rocket,
  Check
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');


  const brevoFormActionUrl = import.meta.env.VITE_STAY_UPDATED_FORM_ACTION_URL;

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from redirecting
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError('');
    
    const formData = new FormData();
    formData.append('EMAIL', email);
    formData.append('email_address_check', '');
    formData.append('locale', 'en');

    try {
      // Send the data in 'no-cors' mode to prevent cross-origin errors
      await fetch(brevoFormActionUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });
      
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting email:', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-blue-400" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-600" },
    { icon: Github, href: "#", label: "GitHub", color: "hover:text-slate-400" },
    { icon: Mail, href: "mailto:hello@careerforge.com", label: "Email", color: "hover:text-purple-500" },
  ];

  const footerSections = [
    {
      title: "Product",
      icon: Sparkles,
      links: [
        { name: "Resume Builder", href: "/templates" },
        { name: "Cover Letter AI", href: "/cover-letter/generate" },
        { name: "Our Vision", href: "#our-vision", onClick: () => scrollToSection('our-vision') },
      ]
    },
    {
      title: "Company",
      icon: Users,
      links: [
        { name: "About Us", href: "/about" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Contact", href: "/contact" }
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <motion.div 
          className="container mx-auto px-4 sm:px-6 pt-20 pb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            
            <motion.div className="md:col-span-2 lg:col-span-2" variants={itemVariants}>
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    CareerForge
                  </h3>
                  <p className="text-sm text-blue-200">Your Future Career Copilot</p>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-8 max-w-sm">
                Our mission is to build intelligent tools that empower you at every step of your career. Start today by creating a world-class resume and cover letter.
              </p>

              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-slate-300 ${social.color} border border-white/20 transition-all duration-300 hover:bg-white/20 hover:shadow-lg`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {footerSections.map((section, sectionIndex) => (
                <motion.div key={sectionIndex} variants={itemVariants}>
                  <div className="flex items-center gap-2 mb-6">
                    <section.icon className="w-5 h-5 text-blue-400" />
                    <h4 className="text-lg font-bold text-white">{section.title}</h4>
                  </div>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                        <motion.li key={linkIndex}>
                          <Link
                            to={link.href}
                            onClick={(e) => {
                              if (link.onClick) {
                                e.preventDefault();
                                link.onClick();
                              }
                            }}
                            className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors duration-300 group py-2 px-3 rounded-xl hover:bg-white/5"
                          >
                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                              {link.name}
                            </span>
                          </Link>
                        </motion.li>
                      ))}
                  </ul>
                </motion.div>
              ))}
          </div>

          <motion.div 
            className="mt-16 p-6 sm:p-8 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl border border-white/20 min-h-[220px] flex flex-col justify-center"
            variants={itemVariants}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h4 className="text-xl font-bold text-white mb-2 flex items-center justify-center lg:justify-start gap-2">
                  <Rocket className="w-5 h-5 text-yellow-400" />
                  Get Notified About Updates
                </h4>
                <p className="text-slate-300 max-w-lg">
                  Be the first to know about new features and our upcoming AI tools. No spam, ever.
                </p>
              </div>
              
              <div className="flex-shrink-0 w-full lg:w-auto">
                {isSubmitted ? (
                   <motion.div
                    className="text-center lg:text-right"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto lg:ml-auto lg:mr-0 mb-3">
                      <Check className="w-6 h-6 text-green-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-white">Welcome aboard!</h4>
                    <p className="text-white/70">Keep an eye on your inbox.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      disabled={isSubmitting}
                      className="w-full sm:w-auto sm:flex-grow px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    />
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !email}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                      whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                    >
                       {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        'Notify Me'
                      )}
                    </motion.button>
                  </form>
                )}
                {error && <p className="text-red-400 text-sm mt-2 text-center lg:text-right">{error}</p>}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="border-t border-white/10 py-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-400 text-center lg:text-left">
                <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
                <span className="text-sm">
                  © {currentYear} CareerForge. Made with love for job seekers.
                </span>
              </div>
              
              <motion.button
                onClick={scrollToTop}
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

