import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- UI Components ---
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Loader2, 
  Plus, 
  FileText, 
  Trash2, 
  Edit, 
  AlertCircle, 
  RefreshCw,
  Sparkles,
  Star,
  Zap,
  Heart,
  TrendingUp,
  Target,
  Mail,
  Crown,
  ArrowRight,
  BarChart3,
  Calendar
} from 'lucide-react';

// --- Context & Hooks ---
import useResumeContext from '@/hooks/useResume';
import { useCoverLetterContext } from '@/context/CoverLetterContext';
import ResumeCard from '@/components/Resume/ResumeCard';

const CoverLetterCard = React.lazy(() => import('@/components/CoverLetter/CoverLetterCard'));
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumes');

  // Resume specific state and functions
  const { 
    userResumesList, 
    loadUserResumes, 
    deleteResumeById, 
    isLoadingUserResumes, 
    resumeError 
  } = useResumeContext();

  // Cover Letter specific state and functions
  const { 
    coverLetters, 
    fetchCoverLetters, 
    deleteCoverLetterById, 
    isLoading: isLoadingCoverLetters, 
    error: coverLetterError 
  } = useCoverLetterContext();

  useEffect(() => {
    if (activeTab === 'resumes') {
      loadUserResumes();
    } else if (activeTab === 'cover-letters') {
      fetchCoverLetters();
    }
  }, [activeTab, loadUserResumes, fetchCoverLetters]);

  const handleDeleteResume = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      await deleteResumeById(resumeId);
    }
  };

  const handleDeleteCoverLetter = async (letterId) => {
    if (window.confirm('Are you sure you want to delete this cover letter?')) {
      await deleteCoverLetterById(letterId);
      fetchCoverLetters();
    }
  };

  const handleCreateNew = () => {
    if (activeTab === 'resumes') {
      navigate('/templates');
    } else {
      navigate('/cover-letter/generate');
    }
  };

  // Animation variants
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
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const EmptyState = ({ type, onAction }) => (
    <motion.div 
      className="flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className={`w-24 h-24 bg-gradient-to-br ${
          type === 'resume' ? 'from-blue-500 to-purple-500' : 'from-purple-500 to-pink-500'
        } rounded-full flex items-center justify-center mb-8 shadow-2xl`}
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {type === 'resume' ? 
          <FileText className="w-12 h-12 text-white" /> : 
          <Mail className="w-12 h-12 text-white" />
        }
      </motion.div>
      
      <h3 className="text-3xl font-bold text-slate-800 mb-4">
        {type === 'resume' ? 'Ready to Build Your Resume?' : 'Time for a Cover Letter?'}
      </h3>
      
      <p className="text-slate-600 text-lg max-w-md mx-auto mb-8 leading-relaxed">
        {type === 'resume' 
          ? "Let's forge your first professional resume and unlock new opportunities."
          : "Generate a compelling cover letter in minutes."
        }
      </p>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={onAction}
          className={`bg-gradient-to-r ${
            type === 'resume' ? 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                              : 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
          } text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-bold group`}
        >
          <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
          {type === 'resume' ? 'Create First Resume' : 'Generate Cover Letter'}
          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </motion.div>
    </motion.div>
  );

  const ErrorState = ({ error, onRetry, type }) => (
    <motion.div 
      className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Alert className="max-w-md bg-red-50/80 backdrop-blur-sm border-red-200/50 rounded-2xl shadow-xl">
        <AlertCircle className="h-6 w-6 text-red-600" />
        <AlertTitle className="text-red-800 font-bold text-lg">
          Unable to Load {type === 'resume' ? 'Resumes' : 'Cover Letters'}
        </AlertTitle>
        <AlertDescription className="text-red-700 mt-2 text-base leading-relaxed">
          {error?.message || 'Something went wrong. Please try again.'}
        </AlertDescription>
        <motion.div 
          className="mt-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onRetry} 
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-2 shadow-lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </motion.div>
      </Alert>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Dashboard | CareerForge - Your Career Command Center</title>
        <meta 
          name="description" 
          content="Manage your resumes and cover letters in one place. Track your applications, get career tips, and build professional documents with CareerForge." 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-200/15 to-purple-200/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tr from-indigo-200/10 to-pink-200/10 rounded-full blur-3xl"></div>
          
          {/* Floating Elements */}
          <motion.div 
            className="absolute top-32 right-16 opacity-10"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-10 h-10 text-blue-400" />
          </motion.div>

          <motion.div 
            className="absolute bottom-32 left-16 opacity-10"
            animate={{
              y: [0, -15, 0],
              rotate: [0, -8, 8, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            <Heart className="w-8 h-8 text-pink-400 fill-current" />
          </motion.div>
        </div>

        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full px-6 py-3 mb-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-slate-700">Career Command Center</span>
            </motion.div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-800 mb-6">
              Your Career
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Your career command center. Let's build, tailor, and track your applications.
            </p>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tab Navigation */}
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-2 shadow-xl">
                  <TabsTrigger 
                    value="resumes" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Resumes ({userResumesList?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="cover-letters" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Cover Letters ({coverLetters?.length || 0})
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Resumes Tab Content */}
              <TabsContent value="resumes" className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">
                    All your resumes and cover letters, ready for action.
                  </h2>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={handleCreateNew}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                      Create Resume
                    </Button>
                  </motion.div>
                </div>

                {/* Resume Content */}
                {resumeError ? (
                  <ErrorState 
                    error={resumeError} 
                    onRetry={loadUserResumes} 
                    type="resume"
                  />
                ) : isLoadingUserResumes ? (
                  <div className="flex items-center justify-center py-20">
                    <LoadingSpinner />
                  </div>
                ) : !userResumesList || userResumesList.length === 0 ? (
                  <EmptyState 
                    type="resume" 
                    onAction={handleCreateNew}
                  />
                ) : (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {userResumesList.map((resume) => (
                      <motion.div key={resume._id} variants={itemVariants}>
                        <ResumeCard 
                          resume={resume} 
                          onDelete={handleDeleteResume} 
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              {/* Cover Letters Tab Content */}
              <TabsContent value="cover-letters" className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Professional cover letters that get noticed.
                  </h2>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={handleCreateNew}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                      Generate Cover Letter
                    </Button>
                  </motion.div>
                </div>

                {/* Cover Letters Content */}
                {coverLetterError ? (
                  <ErrorState 
                    error={coverLetterError} 
                    onRetry={fetchCoverLetters} 
                    type="cover letter"
                  />
                ) : isLoadingCoverLetters ? (
                  <div className="flex items-center justify-center py-20">
                    <LoadingSpinner />
                  </div>
                ) : !coverLetters || coverLetters.length === 0 ? (
                  <EmptyState 
                    type="cover-letter" 
                    onAction={handleCreateNew}
                  />
                ) : (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {coverLetters.map((letter) => (
                      <motion.div key={letter._id} variants={itemVariants}>
                        <Suspense fallback={<LoadingSpinner />}>
                          <CoverLetterCard 
                            letter={letter} 
                            onDelete={handleDeleteCoverLetter} 
                          />
                        </Suspense>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;