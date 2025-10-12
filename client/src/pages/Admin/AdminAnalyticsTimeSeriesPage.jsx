import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getAnalyticsTimeSeries } from '@/api/adminServiceApi';
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
import { Loader2, AlertCircle, RefreshCw, LineChart as LineChartLucideIcon } from 'lucide-react'; // Renamed to avoid conflict
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { cn } from '@/lib/utils';

const AdminAnalyticsTimeSeriesPage = () => {
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const eventTypes = [
    { value: 'user_signup', label: 'User Signups' },
    { value: 'resume_create', label: 'Resumes Created' },
    { value: 'resume_download', label: 'Resumes Downloaded' },
    { value: 'template_create', label: 'Templates Created' }, // Example new event type
    { value: 'api_error', label: 'API Errors Logged' }, // Example new event type
  ];
  const dayOptions = [
    { value: 7, label: 'Last 7 Days' },
    { value: 30, label: 'Last 30 Days' },
    { value: 60, label: 'Last 60 Days' },
    { value: 90, label: 'Last 90 Days' },
  ];

  const [selectedEventType, setSelectedEventType] = useState(eventTypes[0].value);
  const [selectedDays, setSelectedDays] = useState(dayOptions[1].value);

  const fetchTimeSeriesData = useCallback(async () => {
    if (!selectedEventType) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAnalyticsTimeSeries(selectedEventType, selectedDays);
      const formattedData = data.data.map(item => ({
        ...item,
        // Format date for better display on XAxis, e.g., "Jan 1", "Feb 15"
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      }));
      setTimeSeriesData({ ...data, data: formattedData });
    } catch (err) {
      setError(err.message || `Failed to load time series data for ${selectedEventType}.`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEventType, selectedDays]);

  useEffect(() => {
    fetchTimeSeriesData();
  }, [fetchTimeSeriesData]);

  const handleRetry = () => {
    fetchTimeSeriesData();
  };
  
  const [chartThemeColors, setChartThemeColors] = useState({
    line: 'hsl(var(--primary))',
    grid: 'hsl(var(--border))',
    text: 'hsl(var(--muted-foreground))',
    tooltipBg: 'hsl(var(--popover))',
    tooltipText: 'hsl(var(--popover-foreground))',
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const updateColors = () => {
      const isDark = root.classList.contains('dark');
      setChartThemeColors({
        line: isDark ? 'hsl(var(--primary-foreground))' : 'hsl(var(--primary))', // Example: primary-foreground for dark, primary for light
        grid: isDark ? 'hsl(var(--border) / 0.3)' : 'hsl(var(--border) / 0.6)',
        text: 'hsl(var(--muted-foreground))',
        tooltipBg: 'hsl(var(--popover))',
        tooltipText: 'hsl(var(--popover-foreground))',
      });
    };
    updateColors(); // Initial set
    const observer = new MutationObserver(updateColors);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const selectedEventLabel = eventTypes.find(et => et.value === selectedEventType)?.label || 'Selected Event';

  return (
    <>
      <Helmet>
        <title>Admin: Event Time Series | CareerForge</title>
      </Helmet>
      <div className="max-w-full"> {/* This page is now rendered inside AdminLayout's <main> */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-10"
        >
          <div className="flex items-center gap-3 mb-1.5">
            <LineChartLucideIcon className="h-8 w-8 text-primary" strokeWidth={2} />
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              Event Time Series Analysis
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Visualize trends for key platform events over selected time periods.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-card border-border shadow-lg rounded-xl">
            <CardHeader className="pb-4 pt-5 px-5">
              <CardTitle className="text-lg text-foreground">Filter Data</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-end">
                <div className="w-full sm:w-auto sm:min-w-[200px]">
                  <Label htmlFor="eventTypeSelect" className="text-sm font-medium text-muted-foreground mb-1.5 block">Event Type</Label>
                  <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                    <SelectTrigger id="eventTypeSelect" className="w-full bg-background border-input"><SelectValue placeholder="Select event type" /></SelectTrigger>
                    <SelectContent className="bg-popover">{eventTypes.map(et => (<SelectItem key={et.value} value={et.value}>{et.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-auto sm:min-w-[180px]">
                  <Label htmlFor="daysSelect" className="text-sm font-medium text-muted-foreground mb-1.5 block">Time Period</Label>
                  <Select value={selectedDays.toString()} onValueChange={(val) => setSelectedDays(Number(val))}>
                    <SelectTrigger id="daysSelect" className="w-full bg-background border-input"><SelectValue placeholder="Select period" /></SelectTrigger>
                    <SelectContent className="bg-popover">{dayOptions.map(opt => (<SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <Button onClick={fetchTimeSeriesData} disabled={isLoading} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <RefreshCw className="mr-2 h-4 w-4" />} Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-card border-border shadow-xl rounded-xl">
            <CardHeader className="px-5 pt-5 pb-3">
              <CardTitle className="text-xl text-foreground">
                {selectedEventLabel} Trend <span className="text-sm font-normal text-muted-foreground"> (Last {selectedDays} Days)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 h-[450px] sm:h-[550px] px-2 sm:px-4 pb-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full"><LoadingSpinner size="xlarge" label="Loading chart data..." colorClassName="text-primary"/></div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Alert variant="destructive" className="max-w-md w-full"><AlertCircle className="h-5 w-5" /><AlertTitle>Error Loading Chart</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
                  <Button onClick={handleRetry} variant="outline" className="mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button>
                </div>
              ) : timeSeriesData && timeSeriesData.data && timeSeriesData.data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData.data} margin={{ top: 5, right: 25, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartThemeColors.grid} />
                    <XAxis dataKey="date" stroke={chartThemeColors.text} tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={50} dy={10} />
                    <YAxis stroke={chartThemeColors.text} tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: chartThemeColors.tooltipBg, borderColor: chartThemeColors.grid, color: chartThemeColors.tooltipText, borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' }}
                      itemStyle={{ color: chartThemeColors.tooltipText }}
                      labelStyle={{ fontWeight: 'bold', color: chartThemeColors.tooltipText }}
                      cursor={{ stroke: chartThemeColors.line, strokeWidth: 1, strokeDasharray: '3 3' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', color: chartThemeColors.text, paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="count" name={selectedEventLabel} stroke={chartThemeColors.line} strokeWidth={2.5} dot={{ r: 3, fill: chartThemeColors.line, strokeWidth:1, stroke: chartThemeColors.tooltipBg }} activeDot={{ r: 7, strokeWidth:2, fill: chartThemeColors.line, stroke: chartThemeColors.tooltipBg }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <LineChartLucideIcon className="h-16 w-16 text-muted-foreground/50 mb-4" strokeWidth={1}/>
                  <p className="text-muted-foreground">No data available for the selected criteria.</p>
                  <p className="text-xs text-muted-foreground/80 mt-1">Try adjusting the filters or check back later.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default AdminAnalyticsTimeSeriesPage;
