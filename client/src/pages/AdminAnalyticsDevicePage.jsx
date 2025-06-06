import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getAnalyticsDevice } from '@/api/adminServiceApi';
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
import { AlertCircle, RefreshCw, Smartphone, Globe, ListChecks } from 'lucide-react'; // Added ListChecks
import { cn } from '@/lib/utils';

const AdminAnalyticsDevicePage = () => {
  const [deviceData, setDeviceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dayOptions = [
    { value: 7, label: 'Last 7 Days' },
    { value: 30, label: 'Last 30 Days' },
    { value: 90, label: 'Last 90 Days' },
  ];
  const [selectedDays, setSelectedDays] = useState(dayOptions[1].value); // Default to 30 days

  const fetchDeviceData = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const data = await getAnalyticsDevice(selectedDays);
      setDeviceData(data);
    } catch (err) {
      setError(err.message || `Failed to load device analytics data.`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDays]);

  useEffect(() => { fetchDeviceData(); }, [fetchDeviceData]);
  const handleRetry = () => fetchDeviceData();

  if (isLoading) { /* ... (same as before) ... */ }
  if (error) { /* ... (same as before) ... */ }
  // Re-pasting loading/error for brevity
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-background"><LoadingSpinner size="xlarge" label="Loading Device Data..." colorClassName="text-primary"/></div>;
  }
  if (error) {
    return (
      <div className="max-w-3xl mx-auto text-center py-10">
        <Alert variant="destructive" className="mb-6 shadow-lg rounded-lg"><AlertCircle className="h-6 w-6" /><AlertTitle className="text-lg font-semibold">Error Loading Device Data</AlertTitle><AlertDescription className="mt-1">{error}</AlertDescription></Alert>
        <Button onClick={handleRetry} variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"><RefreshCw className="mr-2 h-5 w-5" /> Try Again</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Admin: Device & Geo Analytics | CareerForge</title></Helmet>
      <div className="max-w-full">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-1.5">
            <Smartphone className="h-8 w-8 text-primary" strokeWidth={2} />
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">Device & Geo Analytics</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">Insights into user devices and general access patterns for the selected period.</p>
        </motion.header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
          <Card className="bg-card border-border shadow-lg rounded-xl">
            <CardHeader className="pb-4 pt-5 px-5"><CardTitle className="text-lg text-foreground">Filter Data</CardTitle></CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-end">
                <div className="w-full sm:w-auto sm:min-w-[200px]">
                  <Label htmlFor="deviceDaysSelect" className="text-sm font-medium text-muted-foreground mb-1.5 block">Time Period</Label>
                  <Select value={selectedDays.toString()} onValueChange={(val) => setSelectedDays(Number(val))}>
                    <SelectTrigger id="deviceDaysSelect" className="w-full bg-background border-input"><SelectValue placeholder="Select period" /></SelectTrigger>
                    <SelectContent className="bg-popover">{dayOptions.map(opt => (<SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                {deviceData && <p className="text-sm text-muted-foreground mt-2 sm:mt-0 self-center sm:self-end">Displaying data for the last {deviceData.days} days.</p>}
                <Button onClick={fetchDeviceData} disabled={isLoading} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 ml-auto">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <RefreshCw className="mr-2 h-4 w-4" />} Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {deviceData ? (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 }}}} className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <motion.div variants={{hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 }}}>
              <Card className="bg-card border-border shadow-xl rounded-xl overflow-hidden h-full flex flex-col">
                <CardHeader className="px-5 pt-5 pb-3">
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                    <Smartphone className="h-6 w-6 mr-2.5 text-primary" strokeWidth={1.75}/>
                    Top User Agents
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">Most common browsers and devices used to access the platform.</CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5 flex-grow">
                  {deviceData.topUserAgents && deviceData.topUserAgents.length > 0 ? (
                    <div className="overflow-y-auto max-h-96 border border-border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent sticky top-0 bg-card z-10">
                            <TableHead className="w-[calc(100%-6rem)] sm:w-[calc(100%-8rem)]">User Agent String</TableHead>
                            <TableHead className="text-right">Count</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {deviceData.topUserAgents.slice(0,15).map((ua) => ( // Show top 15
                            <TableRow key={ua._id} className="hover:bg-muted/50">
                              <TableCell className="text-xs text-muted-foreground truncate" title={ua._id}>{ua._id}</TableCell>
                              <TableCell className="text-right font-medium text-foreground">{ua.count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic py-4 text-center">No user agent data recorded for this period.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={{hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 }}}>
              <Card className="bg-card border-border shadow-xl rounded-xl overflow-hidden h-full flex flex-col">
                <CardHeader className="px-5 pt-5 pb-3">
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                    <Globe className="h-6 w-6 mr-2.5 text-primary" strokeWidth={1.75}/>
                    Top IP Addresses (by Activity)
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">Most active IP addresses on the platform.</CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5 flex-grow">
                  {deviceData.topIPs && deviceData.topIPs.length > 0 ? (
                    <div className="overflow-y-auto max-h-96 border border-border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent sticky top-0 bg-card z-10">
                            <TableHead className="w-[calc(100%-6rem)] sm:w-[calc(100%-8rem)]">IP Address</TableHead>
                            <TableHead className="text-right">Activity Count</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {deviceData.topIPs.slice(0,15).map((ipInfo) => ( // Show top 15
                            <TableRow key={ipInfo._id} className="hover:bg-muted/50">
                              <TableCell className="font-mono text-sm text-muted-foreground">{ipInfo._id}</TableCell>
                              <TableCell className="text-right font-medium text-foreground">{ipInfo.count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic py-4 text-center">No significant IP address activity recorded for this period.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : (
          !isLoading && (
            <div className="text-center py-16">
              <Smartphone className="h-16 w-16 mx-auto text-muted-foreground/50 mb-6" strokeWidth={1.5}/>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Device Data</h3>
              <p className="text-muted-foreground max-w-md mx-auto">There is no device or geo analytics data available for the selected criteria. Try a different time period or check back later.</p>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default AdminAnalyticsDevicePage;
