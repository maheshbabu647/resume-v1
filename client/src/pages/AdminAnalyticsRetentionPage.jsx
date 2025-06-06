import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getAnalyticsRetention } from '@/api/adminServiceApi';
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
import { Progress } from "@/components/ui/progress";
import { AlertCircle, RefreshCw, UsersRound as UsersRoundIcon, CalendarClock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sub-component for individual retention stat cards
const RetentionStatCard = ({ period, percentage, cohortSize, retainedUsers }) => {
  const numericPercentage = parseFloat(percentage);
  const isValidPercentage = !isNaN(numericPercentage) && isFinite(numericPercentage);

  return (
    <Card className="bg-card border-border shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 ease-in-out rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-medium text-muted-foreground">{period} Retention</CardTitle>
        <CalendarClock className="h-5 w-5 text-primary/70" strokeWidth={1.75}/>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="text-3xl font-bold text-primary mb-2">
          {isValidPercentage ? `${numericPercentage.toFixed(1)}%` : 'N/A'}
        </div>
        <Progress 
          value={isValidPercentage ? numericPercentage : 0} 
          className="h-2.5 mb-2.5 [&>div]:bg-gradient-to-r [&>div]:from-primary/70 [&>div]:to-primary" 
          aria-label={`${period} retention: ${isValidPercentage ? numericPercentage.toFixed(1) : 'Not Available'}%`}
        />
        <p className="text-xs text-muted-foreground">
          {isValidPercentage ? `${retainedUsers} of ${cohortSize}` : 'Data unavailable'} users from cohort
        </p>
      </CardContent>
    </Card>
  );
};


const AdminAnalyticsRetentionPage = () => {
  const [retentionData, setRetentionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dayOptions = [
    { value: 7, label: '7-Day Cohort Window' },
    { value: 14, label: '14-Day Cohort Window' },
    { value: 30, label: '30-Day Cohort Window' },
  ];
  const [selectedDays, setSelectedDays] = useState(dayOptions[1].value); // Default to 14 days

  const fetchRetentionData = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const data = await getAnalyticsRetention(selectedDays);
      setRetentionData(data);
    } catch (err) {
      setError(err.message || `Failed to load retention data.`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDays]);

  useEffect(() => { fetchRetentionData(); }, [fetchRetentionData]);
  const handleRetry = () => fetchRetentionData();

  if (isLoading) { /* ... (same as before) ... */ }
  if (error) { /* ... (same as before) ... */ }
  // Re-pasting loading/error for brevity
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-background"><LoadingSpinner size="xlarge" label="Loading Retention Data..." colorClassName="text-primary"/></div>;
  }
  if (error) {
    return (
      <div className="max-w-3xl mx-auto text-center py-10">
        <Alert variant="destructive" className="mb-6 shadow-lg rounded-lg"><AlertCircle className="h-6 w-6" /><AlertTitle className="text-lg font-semibold">Error Loading Retention Data</AlertTitle><AlertDescription className="mt-1">{error}</AlertDescription></Alert>
        <Button onClick={handleRetry} variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"><RefreshCw className="mr-2 h-5 w-5" /> Try Again</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Admin: User Retention Analysis | CareerForge</title></Helmet>
      <div className="max-w-full">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-1.5">
            <UsersRoundIcon className="h-8 w-8 text-primary" strokeWidth={2} />
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">User Retention Analysis</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">Percentage of new users returning on subsequent days after signing up within the selected cohort window.</p>
        </motion.header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
          <Card className="bg-card border-border shadow-lg rounded-xl">
            <CardHeader className="pb-4 pt-5 px-5"><CardTitle className="text-lg text-foreground">Filter Data</CardTitle></CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-end">
                <div className="w-full sm:w-auto sm:min-w-[240px]"> {/* Increased min-width */}
                  <Label htmlFor="retentionDaysSelect" className="text-sm font-medium text-muted-foreground mb-1.5 block">Cohort Definition Window</Label>
                  <Select value={selectedDays.toString()} onValueChange={(val) => setSelectedDays(Number(val))}>
                    <SelectTrigger id="retentionDaysSelect" className="w-full bg-background border-input"><SelectValue placeholder="Select period" /></SelectTrigger>
                    <SelectContent className="bg-popover">{dayOptions.map(opt => (<SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                {retentionData && <p className="text-sm text-muted-foreground mt-2 sm:mt-0 self-center sm:self-end">Cohort Size (Users in last {selectedDays} days): <strong className="text-foreground text-base">{retentionData.cohortSize}</strong></p>}
                <Button onClick={fetchRetentionData} disabled={isLoading} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 ml-auto">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <RefreshCw className="mr-2 h-4 w-4" />} Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {retentionData && retentionData.retention ? (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 }}}} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {Object.entries(retentionData.retention).map(([period, percentage]) => {
                const numericPercentage = parseFloat(percentage);
                const retainedUsers = retentionData.cohortSize > 0 && !isNaN(numericPercentage) && isFinite(numericPercentage)
                                    ? Math.round((numericPercentage / 100) * retentionData.cohortSize)
                                    : 0;
                return (
                    <motion.div key={period} variants={{hidden: { opacity: 0, y: 15, scale:0.98 }, visible: { opacity: 1, y: 0, scale:1, transition: { duration: 0.4, ease: "easeOut" }}}}>
                        <RetentionStatCard
                        period={period}
                        percentage={percentage ?? 'N/A'}
                        cohortSize={retentionData.cohortSize}
                        retainedUsers={retainedUsers}
                        />
                    </motion.div>
                );
            })}
          </motion.div>
        ) : (
          !isLoading && (
            <div className="text-center py-16">
              <CalendarClock className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" strokeWidth={1.5}/>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Retention Data</h3>
              <p className="text-muted-foreground max-w-md mx-auto">There is no retention data available for the selected criteria. Try a different time period or check back later.</p>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default AdminAnalyticsRetentionPage;
