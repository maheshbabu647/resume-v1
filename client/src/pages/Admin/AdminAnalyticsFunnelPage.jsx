import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getAnalyticsFunnel } from '@/api/adminServiceApi';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    AlertCircle,
    RefreshCw,
    Users as UsersFunnelStageIcon, // Main icon for funnel page
    ArrowRight,
    TrendingUp,
    FileText as FileTextIcon,
    DownloadCloud,
    CheckCircle // For conversion %
} from 'lucide-react';
import { cn } from '@/lib/utils';

const getStageIconAndColor = (stageName) => {
    const lowerStageName = stageName.toLowerCase();
    if (lowerStageName.includes('signup')) return { Icon: UsersFunnelStageIcon, color: 'text-blue-500 dark:text-blue-400' };
    if (lowerStageName.includes('create')) return { Icon: FileTextIcon, color: 'text-green-500 dark:text-green-400' };
    if (lowerStageName.includes('download')) return { Icon: DownloadCloud, color: 'text-purple-500 dark:text-purple-400' };
    return { Icon: TrendingUp, color: 'text-gray-500 dark:text-gray-400' };
};

// Sub-component for individual funnel stage cards
const FunnelStageCard = ({ stageName, count, conversionFromPrevious, conversionFromTop, isFirstStage }) => {
  const { Icon, color } = getStageIconAndColor(stageName);
  return (
    <Card className="bg-card border-border shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 ease-in-out rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 px-5">
        <div className="flex items-center gap-3">
          <span className={cn("p-2 rounded-lg bg-opacity-10", color.replace('text-', 'bg-').replace('-500', '-500/10').replace('-400', '-400/10'))}>
            <Icon className={cn("h-6 w-6", color)} strokeWidth={1.75} />
          </span>
          <CardTitle className="text-md sm:text-lg font-semibold text-foreground">{stageName}</CardTitle>
        </div>
        <span className="text-2xl sm:text-3xl font-bold text-primary">{count}</span>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-2">
        {isFirstStage ? (
          <p className="text-xs text-muted-foreground italic">Top of the funnel.</p>
        ) : (
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center">
              <CheckCircle size={14} className="mr-1.5 text-green-500" />
              <span>vs. Previous Stage: <strong className="text-foreground">{conversionFromPrevious}</strong></span>
            </div>
            <div className="flex items-center">
              <TrendingUp size={14} className="mr-1.5 text-indigo-500" />
              <span>vs. Top of Funnel: <strong className="text-foreground">{conversionFromTop}</strong></span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


const AdminAnalyticsFunnelPage = () => {
  const [funnelData, setFunnelData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dayOptions = [
    { value: 7, label: 'Last 7 Days' },
    { value: 30, label: 'Last 30 Days' },
    { value: 60, label: 'Last 60 Days' },
    { value: 90, label: 'Last 90 Days' },
  ];
  const [selectedDays, setSelectedDays] = useState(dayOptions[1].value);

  const fetchFunnelData = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const data = await getAnalyticsFunnel(selectedDays);
      setFunnelData(data);
    } catch (err) {
      setError(err.message || `Failed to load funnel data.`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDays]);

  useEffect(() => { fetchFunnelData(); }, [fetchFunnelData]);
  const handleRetry = () => fetchFunnelData();

  const calculateConversion = (currentCount, previousCount) => {
    if (!previousCount || previousCount === 0 || currentCount === undefined || previousCount === undefined) return 'N/A';
    return ((Number(currentCount) / Number(previousCount)) * 100).toFixed(1) + '%';
  };

  if (isLoading) { /* ... (same as before) ... */ }
  if (error) { /* ... (same as before) ... */ }
  // Re-pasting loading/error for brevity
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-background"><LoadingSpinner size="xlarge" label="Loading Funnel Data..." colorClassName="text-primary"/></div>;
  }
  if (error) {
    return (
      <div className="max-w-3xl mx-auto text-center py-10">
        <Alert variant="destructive" className="mb-6 shadow-lg rounded-lg"><AlertCircle className="h-6 w-6" /><AlertTitle className="text-lg font-semibold">Error Loading Funnel Data</AlertTitle><AlertDescription className="mt-1">{error}</AlertDescription></Alert>
        <Button onClick={handleRetry} variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"><RefreshCw className="mr-2 h-5 w-5" /> Try Again</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Admin: User Conversion Funnel | CareerForge</title></Helmet>
      <div className="max-w-full">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-1.5">
            <UsersFunnelStageIcon className="h-8 w-8 text-primary" strokeWidth={2} />
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">User Conversion Funnel</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">Track user progression through key stages for the selected period.</p>
        </motion.header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
          <Card className="bg-card border-border shadow-lg rounded-xl">
            <CardHeader className="pb-4 pt-5 px-5"><CardTitle className="text-lg text-foreground">Filter Data</CardTitle></CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-end">
                <div className="w-full sm:w-auto sm:min-w-[200px]">
                  <Label htmlFor="funnelDaysSelect" className="text-sm font-medium text-muted-foreground mb-1.5 block">Time Period</Label>
                  <Select value={selectedDays.toString()} onValueChange={(val) => setSelectedDays(Number(val))}>
                    <SelectTrigger id="funnelDaysSelect" className="w-full bg-background border-input"><SelectValue placeholder="Select period" /></SelectTrigger>
                    <SelectContent className="bg-popover">{dayOptions.map(opt => (<SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                {funnelData && <p className="text-sm text-muted-foreground mt-2 sm:mt-0 self-center sm:self-end">Analysis for the last {funnelData.days} days.</p>}
                 <Button onClick={fetchFunnelData} disabled={isLoading} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 ml-auto">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <RefreshCw className="mr-2 h-4 w-4" />} Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {funnelData && funnelData.funnel && funnelData.funnel.length > 0 ? (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 }}}} className="space-y-4 md:space-y-6">
            {funnelData.funnel.map((stage, index) => {
              const previousStageCount = index > 0 ? funnelData.funnel[index - 1].count : null;
              const firstStageCount = funnelData.funnel[0].count;
              return (
                <React.Fragment key={stage.stage}>
                  {index > 0 && (
                    <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height: 'auto' }} transition={{delay: index * 0.1 + 0.1}} className="flex justify-center items-center my-1 md:my-2">
                      <div className="flex flex-col items-center">
                        <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground/70 transform rotate-90" />
                        {previousStageCount !== null && (
                          <span className="text-xs sm:text-sm text-primary font-semibold mt-0.5 bg-primary/10 px-1.5 py-0.5 rounded-md">
                            {calculateConversion(stage.count, previousStageCount)}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                  <motion.div variants={{hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" }}}}>
                    <FunnelStageCard
                      stageName={stage.stage}
                      count={stage.count}
                      conversionFromPrevious={calculateConversion(stage.count, previousStageCount)}
                      conversionFromTop={calculateConversion(stage.count, firstStageCount)}
                      isFirstStage={index === 0}
                    />
                  </motion.div>
                </React.Fragment>
              );
            })}
          </motion.div>
        ) : (
          !isLoading && (
            <div className="text-center py-16">
              <UsersFunnelStageIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" strokeWidth={1.5}/>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Funnel Data</h3>
              <p className="text-muted-foreground max-w-md mx-auto">There is no funnel data available for the selected criteria. Try a different time period or check back later.</p>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default AdminAnalyticsFunnelPage;
