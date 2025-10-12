import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getAnalyticsPerformance } from '@/api/adminServiceApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import { Badge } from "@/components/ui/badge";
import { AlertCircle, RefreshCw, GaugeCircle, ListChecks, Clock } from 'lucide-react';

const AdminAnalyticsPerformancePage = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dayOptions = [
    { value: 1, label: 'Last 24 Hours' },
    { value: 7, label: 'Last 7 Days' },
    { value: 30, label: 'Last 30 Days' },
  ];
  // API default is 7 for this endpoint
  const [selectedDays, setSelectedDays] = useState(dayOptions[1].value);

  const fetchPerformanceData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAnalyticsPerformance(selectedDays);
      setPerformanceData(data);
    } catch (err) {
      setError(err.message || `Failed to load API performance data.`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDays]);

  useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  const handleRetry = () => {
    fetchPerformanceData();
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });
  };
  
  const getMethodBadgeVariant = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET': return 'default'; // bg-primary
      case 'POST': return 'secondary'; // bg-secondary
      case 'PUT': return 'outline'; // border-border, text-foreground
      case 'DELETE': return 'destructive'; // bg-destructive
      default: return 'secondary';
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-background">
        <LoadingSpinner size="large" label="Loading Performance Data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error Loading Performance Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={handleRetry} variant="outline" className="mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin: API Performance | CareerForge</title>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-background text-foreground">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <GaugeCircle className="h-8 w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              API Performance Analytics
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Overview of API endpoint response times and slowest requests for the selected period.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 p-4 sm:p-6 bg-card border border-border rounded-lg shadow-sm"
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
            <div>
              <Label htmlFor="performanceDaysSelect" className="text-sm font-medium text-muted-foreground mb-1.5 block">Time Period</Label>
              <Select value={selectedDays.toString()} onValueChange={(val) => setSelectedDays(Number(val))}>
                <SelectTrigger id="performanceDaysSelect" className="w-full sm:w-[200px] bg-background border-input">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {dayOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {performanceData && <p className="text-sm text-muted-foreground mt-2 sm:mt-0">Displaying data for the last {performanceData.days} days.</p>}
          </div>
        </motion.div>

        {performanceData ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                  <ListChecks className="h-5 w-5 mr-2 text-primary" />
                  Average Response Time by Endpoint
                </CardTitle>
              </CardHeader>
              <CardContent>
                {performanceData.avgByEndpoint && performanceData.avgByEndpoint.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Method</TableHead>
                          <TableHead className="w-[40%]">Endpoint URL</TableHead>
                          <TableHead className="text-right">Avg. Duration (ms)</TableHead>
                          <TableHead className="text-right">Max. Duration (ms)</TableHead>
                          <TableHead className="text-right">Requests</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {performanceData.avgByEndpoint.map((ep) => (
                          <TableRow key={`${ep._id.method}-${ep._id.url}`}>
                            <TableCell><Badge variant={getMethodBadgeVariant(ep._id.method)}>{ep._id.method}</Badge></TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground truncate" title={ep._id.url}>{ep._id.url}</TableCell>
                            <TableCell className="text-right font-medium text-foreground">{ep.avgDuration?.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{ep.maxDuration?.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{ep.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No endpoint performance data available.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Slowest API Requests (Top 10)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {performanceData.slowestRequests && performanceData.slowestRequests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Method</TableHead>
                          <TableHead className="w-[35%]">URL</TableHead>
                          <TableHead className="text-right">Duration (ms)</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                          <TableHead>User ID</TableHead>
                          <TableHead>Timestamp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {performanceData.slowestRequests.map((req, index) => (
                          <TableRow key={index}>
                             <TableCell><Badge variant={getMethodBadgeVariant(req.method)}>{req.method}</Badge></TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground truncate" title={req.url}>{req.url}</TableCell>
                            <TableCell className="text-right font-medium text-destructive">{req.durationMs?.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                                <Badge variant={req.status >= 400 ? 'destructive' : (req.status >= 300 ? 'secondary' : 'default')}>
                                    {req.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground truncate" title={req.userId}>{req.userId || 'N/A'}</TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{formatTimestamp(req.timestamp)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No slow request data available for this period.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          !isLoading && (
            <div className="text-center py-10">
              <GaugeCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No API performance data available for the selected criteria.</p>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default AdminAnalyticsPerformancePage;
