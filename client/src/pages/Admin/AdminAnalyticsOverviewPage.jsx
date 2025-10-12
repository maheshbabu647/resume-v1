import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getAnalyticsOverview } from '@/api/adminServiceApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText as FileTextIcon,
  DownloadCloud,
  LayoutGrid,
  TrendingUp,
  UserCheck,
  AlertCircle,
  RefreshCw,
  BarChart3,
  List,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Sub-component for individual stat cards
const StatCard = ({ title, value, todayValue, icon: Icon, colorClassName = "text-primary" }) => (
  <Card className="bg-card border-border shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-200 ease-in-out rounded-xl overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 px-5">
      <CardTitle className="text-[0.9rem] font-medium text-muted-foreground">{title}</CardTitle>
      {Icon && <Icon className={cn("h-5 w-5", colorClassName)} strokeWidth={1.75} />}
    </CardHeader>
    <CardContent className="px-5 pb-5">
      <div className="text-3xl font-bold text-foreground">{value ?? 'N/A'}</div>
      {todayValue !== undefined && (
        <p className="text-xs text-muted-foreground pt-1">
          <span className={cn("font-semibold", todayValue > 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500")}>
            {todayValue > 0 ? `+${todayValue}` : todayValue === 0 ? '0' : todayValue}
          </span>
          &nbsp;today
        </p>
      )}
    </CardContent>
  </Card>
);

// Sub-component for list-based cards (Top Templates/Users)
const ListItemCard = ({ title, items, icon: Icon, itemKey = "_id", itemNameKey = "_id", itemCountKey = "count", itemLinkPrefix = null, itemLinkSuffix = "" }) => (
  <Card className="bg-card border-border shadow-lg col-span-1 hover:shadow-xl hover:border-primary/30 transition-all duration-300 ease-in-out rounded-xl flex flex-col">
    <CardHeader className="pb-3 pt-5 px-5">
      <CardTitle className="text-lg font-semibold text-foreground flex items-center">
        {Icon && <Icon className="h-6 w-6 mr-2.5 text-primary" strokeWidth={1.75} />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-5 pb-5 flex-grow">
      {items && items.length > 0 ? (
        <div className="max-h-80 overflow-y-auto pr-1"> {/* Scrollable list */}
          <ul className="space-y-2.5">
            {items.slice(0, 10).map((item, index) => ( // Show top 10
              <li key={item[itemKey] || index} className="flex justify-between items-center text-sm border-b border-border/30 pb-2 last:border-b-0 last:pb-0">
                <span className="text-muted-foreground truncate pr-2 max-w-[calc(100%-4rem)]">
                  {itemLinkPrefix ? (
                    <Link to={`${itemLinkPrefix}${item[itemKey]}${itemLinkSuffix}`} className="hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline focus-visible:outline-none rounded-sm focus-visible:ring-1 focus-visible:ring-ring">
                      {item[itemNameKey] || item[itemKey] || 'Unknown Item'}
                    </Link>
                  ) : (
                    item[itemNameKey] || item[itemKey] || 'Unknown Item'
                  )}
                </span>
                <span className="font-medium text-foreground bg-muted/50 px-2.5 py-1 rounded-md text-xs">{item[itemCountKey]}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic py-4 text-center">No data available for this list.</p>
      )}
    </CardContent>
  </Card>
);


const AdminAnalyticsOverviewPage = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const data = await getAnalyticsOverview();
      setOverviewData(data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics overview.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-[calc(100vh-10rem)]"><LoadingSpinner size="xlarge" label="Loading Analytics Overview..." colorClassName="text-primary"/></div>;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto text-center py-10">
        <Alert variant="destructive" className="mb-6 shadow-lg rounded-lg"><AlertCircle className="h-6 w-6" /><AlertTitle className="text-lg font-semibold">Error Loading Analytics</AlertTitle><AlertDescription className="mt-1">{error}</AlertDescription></Alert>
        <Button onClick={fetchOverview} variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"><RefreshCw className="mr-2 h-5 w-5" /> Try Again</Button>
      </div>
    );
  }

  if (!overviewData) {
    return (
      <div className="max-w-3xl mx-auto text-center py-10">
        <Alert className="bg-card border-border shadow rounded-lg"><BarChart3 className="h-6 w-6 text-muted-foreground" /><AlertTitle className="text-lg font-semibold">No Data Available</AlertTitle><AlertDescription className="mt-1">Analytics overview data is not available yet.</AlertDescription></Alert>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Admin: Analytics Overview | CareerForge</title></Helmet>
      <div className="max-w-full"> {/* This page is now rendered inside AdminLayout's <main> */}
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 md:mb-10">
          <div className="flex items-center gap-3.5 mb-1.5">
            <BarChart3 className="h-8 w-8 text-primary" strokeWidth={2}/>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">Analytics Overview</h1>
          </div>
           <p className="text-muted-foreground text-sm sm:text-base">A snapshot of key platform metrics and user engagement trends.</p>
        </motion.header>

        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 }}}}>
          <div className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-8 md:mb-10">
            <motion.div variants={{hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 }}}><StatCard title="Total Users" value={overviewData.totalUsers} todayValue={overviewData.newUsersToday} icon={Users} colorClassName="text-blue-500 dark:text-blue-400" /></motion.div>
            <motion.div variants={{hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 }}}><StatCard title="Total Resumes" value={overviewData.totalResumes} todayValue={overviewData.newResumesToday} icon={FileTextIcon} colorClassName="text-green-500 dark:text-green-400" /></motion.div>
            <motion.div variants={{hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 }}}><StatCard title="Total Downloads" value={overviewData.totalDownloads} todayValue={overviewData.downloadsToday} icon={DownloadCloud} colorClassName="text-indigo-500 dark:text-indigo-400" /></motion.div>
            <motion.div variants={{hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 }}}><StatCard title="Total Templates" value={overviewData.totalTemplates} todayValue={overviewData.templateCreationsToday} icon={LayoutGrid} colorClassName="text-purple-500 dark:text-purple-400" /></motion.div>
          </div>

          <div className="grid gap-6 md:gap-8 md:grid-cols-1 xl:grid-cols-2"> {/* Adjusted grid for list items */}
             <motion.div variants={{hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 }}}>
                <ListItemCard 
                title="Top Templates (by Usage)" 
                items={overviewData.topTemplates} 
                icon={TrendingUp}
                itemNameKey="templateName" // Assuming API populates templateName
                itemLinkPrefix="/admin/templates/edit/" // Link to edit template page
                />
            </motion.div>
            <motion.div variants={{hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 }}}>
                <ListItemCard 
                title="Most Active Users (by Resumes Created)" 
                items={overviewData.topUsers} 
                icon={UserCheck}
                itemNameKey="userName" // Assuming API populates userName
                // itemLinkPrefix="/admin/users/" // Example if you have a user detail page
                />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminAnalyticsOverviewPage;
