import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getAnalyticsSecurity } from '@/api/adminServiceApi';
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
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { AlertCircle, RefreshCw, ShieldAlert as ShieldAlertIcon, ListChecks, WifiOff, AlertOctagon, Ban } from 'lucide-react'; // Added Ban for Rate Limit
import { cn } from '@/lib/utils';

// StatCard component (can be moved to a common components folder if used elsewhere)
const StatCard = ({ title, value, icon: Icon, colorClassName = "text-primary", description = null }) => (
  <Card className="bg-card border-border shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300 ease-in-out rounded-xl overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-5 px-5">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {Icon && <Icon className={cn("h-5 w-5", colorClassName)} strokeWidth={1.75} />}
    </CardHeader>
    <CardContent className="px-5 pb-5">
      <div className="text-3xl font-bold text-foreground">{value ?? 'N/A'}</div>
      {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
    </CardContent>
  </Card>
);

const AdminAnalyticsSecurityPage = () => {
  const [securityData, setSecurityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dayOptions = [
    { value: 1, label: 'Last 24 Hours' },
    { value: 7, label: 'Last 7 Days' },
    { value: 30, label: 'Last 30 Days' },
  ];
  const [selectedDays, setSelectedDays] = useState(dayOptions[1].value); // Default to 7 days

  const fetchSecurityData = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const data = await getAnalyticsSecurity(selectedDays);
      setSecurityData(data);
    } catch (err) {
      setError(err.message || `Failed to load security analytics data.`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDays]);

  useEffect(() => { fetchSecurityData(); }, [fetchSecurityData]);
  const handleRetry = () => fetchSecurityData();

  if (isLoading) { /* ... (same as before) ... */ }
  if (error) { /* ... (same as before) ... */ }
  // Re-pasting loading/error for brevity
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-background"><LoadingSpinner size="xlarge" label="Loading Security Data..." colorClassName="text-primary"/></div>;
  }
  if (error) {
    return (
      <div className="max-w-3xl mx-auto text-center py-10">
        <Alert variant="destructive" className="mb-6 shadow-lg rounded-lg"><AlertCircle className="h-6 w-6" /><AlertTitle className="text-lg font-semibold">Error Loading Security Data</AlertTitle><AlertDescription className="mt-1">{error}</AlertDescription></Alert>
        <Button onClick={handleRetry} variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"><RefreshCw className="mr-2 h-5 w-5" /> Try Again</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Admin: Security Analytics | CareerForge</title></Helmet>
      <div className="max-w-full">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-1.5">
            <ShieldAlertIcon className="h-8 w-8 text-primary" strokeWidth={2} />
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">Security Analytics</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">Overview of security-related events and anomalies for the selected period.</p>
        </motion.header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
          <Card className="bg-card border-border shadow-lg rounded-xl">
            <CardHeader className="pb-4 pt-5 px-5"><CardTitle className="text-lg text-foreground">Filter Data</CardTitle></CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-end">
                <div className="w-full sm:w-auto sm:min-w-[200px]">
                  <Label htmlFor="securityDaysSelect" className="text-sm font-medium text-muted-foreground mb-1.5 block">Time Period</Label>
                  <Select value={selectedDays.toString()} onValueChange={(val) => setSelectedDays(Number(val))}>
                    <SelectTrigger id="securityDaysSelect" className="w-full bg-background border-input"><SelectValue placeholder="Select period" /></SelectTrigger>
                    <SelectContent className="bg-popover">{dayOptions.map(opt => (<SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                {securityData && <p className="text-sm text-muted-foreground mt-2 sm:mt-0 self-center sm:self-end">Displaying data for the last {securityData.days} days.</p>}
                <Button onClick={fetchSecurityData} disabled={isLoading} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 ml-auto">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <RefreshCw className="mr-2 h-4 w-4" />} Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {securityData ? (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 }}}} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <motion.div variants={{hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 }}}>
                <StatCard title="Failed Logins" value={securityData.failedLogins} icon={AlertOctagon} colorClassName="text-destructive" />
              </motion.div>
              <motion.div variants={{hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 }}}>
                <StatCard title="Rate Limit Hits" value={securityData.rateLimitHits} icon={Ban} colorClassName="text-orange-500 dark:text-orange-400" />
              </motion.div>
              <motion.div variants={{hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 }}}>
                <StatCard title="Error Events Logged" value={securityData.errorEvents} icon={AlertCircle} colorClassName="text-yellow-500 dark:text-yellow-400" />
              </motion.div>
            </div>

            <motion.div variants={{hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 }}}>
              <Card className="bg-card border-border shadow-xl rounded-xl overflow-hidden">
                <CardHeader className="px-5 pt-5 pb-3">
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                    <ListChecks className="h-6 w-6 mr-2.5 text-primary" strokeWidth={1.75}/>
                    Top Failing IP Addresses
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">IP addresses with the most failed login attempts.</CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  {securityData.topFailIPs && securityData.topFailIPs.length > 0 ? (
                    <div className="overflow-x-auto max-h-96 border border-border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[60%] sm:w-[70%]">IP Address</TableHead>
                            <TableHead className="text-right">Failed Attempts</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {securityData.topFailIPs.slice(0,10).map((ipInfo) => (
                            <TableRow key={ipInfo._id} className="hover:bg-muted/50">
                              <TableCell className="font-mono text-sm text-muted-foreground">{ipInfo._id}</TableCell>
                              <TableCell className="text-right font-medium text-foreground">{ipInfo.count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic py-4 text-center">No significant failing IP addresses recorded for this period.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : (
          !isLoading && (
            <div className="text-center py-16">
              <ShieldAlertIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" strokeWidth={1.5}/>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Security Data</h3>
              <p className="text-muted-foreground max-w-md mx-auto">There is no security analytics data available for the selected criteria. Try a different time period or check back later.</p>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default AdminAnalyticsSecurityPage;
