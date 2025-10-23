import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import {
  getAIUsageStats,
  getAIUsageByUsers,
  getAIUsageByService,
  getAIUsageAnonymous,
  getAIUsageTrends,
  exportAIUsageData,
  getAIUsageByUser,
  fixAIUsageDataInconsistency
} from '@/api/adminServiceApi';
import {
  Brain,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  Activity,
  BarChart3,
  Download,
  Calendar,
  Lock,
  LockOpen,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Eye,
  Mail,
  User
} from 'lucide-react';

const AdminAIUsagePage = () => {
  console.log('[AdminAIUsage] Component loaded/rendered');
  
  const [overallStats, setOverallStats] = useState(null);
  const [userStats, setUserStats] = useState([]);
  const [serviceStats, setServiceStats] = useState([]);
  const [anonymousStats, setAnonymousStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedUser, setExpandedUser] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  const fetchAllData = async () => {
    console.log('[AdminAIUsage] fetchAllData called');
    try {
      setIsLoading(true);
      setError(null);

      const { startDate, endDate } = dateRange;

      // Fetch all data in parallel using the API service
      const [overallRes, usersRes, servicesRes, anonymousRes, trendsRes] = await Promise.all([
        getAIUsageStats(startDate, endDate),
        getAIUsageByUsers(50, 0, startDate, endDate),
        getAIUsageByService(startDate, endDate),
        getAIUsageAnonymous(startDate, endDate),
        getAIUsageTrends('day', startDate, endDate)
      ]);

      if (overallRes.success) setOverallStats(overallRes.data);
      if (usersRes.success) {
        console.log('[AdminAIUsage] Users data received:', usersRes.data.users);
        setUserStats(usersRes.data.users);
      }
      if (servicesRes.success) setServiceStats(servicesRes.data);
      if (anonymousRes.success) setAnonymousStats(anonymousRes.data);
      if (trendsRes.success) setTrends(trendsRes.data);

    } catch (err) {
      setError(err.message || 'Failed to fetch AI usage data');
      console.error('Error fetching AI usage data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyFilters = () => {
    fetchAllData();
  };

  const handleExportCSV = async () => {
    try {
      const { startDate, endDate } = dateRange;
      const blob = await exportAIUsageData('csv', startDate, endDate);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-usage-export-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data. Please try again.');
    }
  };

  const handleFixData = async () => {
    try {
      console.log('[AdminAIUsage] Fixing data inconsistency...');
      const result = await fixAIUsageDataInconsistency();
      console.log('[AdminAIUsage] Fix result:', result);
      alert(`Data fixed! ${result.recordsUpdated} records updated.`);
      // Refresh the data
      await fetchAllData();
    } catch (err) {
      console.error('Error fixing data:', err);
      alert('Failed to fix data: ' + (err.message || 'Unknown error'));
    }
  };

  const toggleUserExpansion = async (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
      return;
    }

    setExpandedUser(userId);
    
    // Fetch detailed user data if not already loaded
    if (!userDetails[userId]) {
      try {
        const { startDate, endDate } = dateRange;
        console.log('[AdminAIUsage] Fetching user details for:', userId);
        const response = await getAIUsageByUser(userId, startDate, endDate);
        
        console.log('[AdminAIUsage] User details response:', response);
        
        if (response.success) {
          console.log('[AdminAIUsage] User data:', response.data);
          console.log('[AdminAIUsage] Has before data:', response.data.hasBeforeSignupData);
          console.log('[AdminAIUsage] Before stats:', response.data.before);
          console.log('[AdminAIUsage] After stats:', response.data.after);
          
          setUserDetails(prev => ({
            ...prev,
            [userId]: response.data
          }));
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to fetch user details');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getServiceName = (serviceKey) => {
    const names = {
      'resume_summary': 'Resume Summary',
      'cover_letter': 'Cover Letter',
      'field_content': 'Field Content',
      'resume_enhancement': 'Resume Enhancement',
      'ats_analysis': 'ATS Analysis',
      'ats_optimization': 'ATS Optimization',
      'resume_parser': 'Resume Parser',
      'chat': 'AI Chat'
    };
    return names[serviceKey] || serviceKey;
  };

  const getModelBadge = (model) => {
    if (model === 'gemini-2.5-flash') {
      return <Badge variant="default" className="bg-blue-100 text-blue-800">2.5 Flash</Badge>;
    }
    if (model === 'gemini-2.0-flash-exp') {
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800">2.0 Flash Exp</Badge>;
    }
    return <Badge variant="outline">{model}</Badge>;
  };

  if (isLoading && !overallStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" label="Loading AI usage analytics..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>AI Usage Analytics - Admin Dashboard</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Brain className="w-8 h-8 text-blue-600" />
                AI Usage Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Track AI token usage, costs, and trends across all services
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleFixData}
                variant="outline"
                className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 border-yellow-300 text-yellow-700"
              >
                <Zap className="w-4 h-4" />
                Fix Data
              </Button>
              <Button
                onClick={fetchAllData}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                onClick={handleExportCSV}
                variant="default"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </motion.div>

          {/* Date Range Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    End Date
                  </label>
                  <Input
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateRangeChange}
                  />
                </div>
                <Button onClick={handleApplyFilters} className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Overall Stats Cards - Enhanced */}
          {overallStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Requests</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {formatNumber(overallStats.totalRequests)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          All AI API calls
                        </p>
                      </div>
                      <Activity className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Input Tokens</p>
                        <p className="text-2xl font-bold text-purple-900 mt-1">
                          {formatNumber(overallStats.totalInputTokens)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Prompt tokens
                        </p>
                      </div>
                      <Zap className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-l-4 border-l-pink-500 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Output Tokens</p>
                        <p className="text-2xl font-bold text-pink-900 mt-1">
                          {formatNumber(overallStats.totalOutputTokens)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Generated tokens
                        </p>
                      </div>
                      <Zap className="w-8 h-8 text-pink-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Cost</p>
                        <p className="text-2xl font-bold text-green-900 mt-1">
                          {formatCurrency(overallStats.totalCost)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          USD spent
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Authenticated</p>
                        <p className="text-2xl font-bold text-orange-900 mt-1">
                          {formatNumber(overallStats.authenticatedRequests)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {((overallStats.authenticatedRequests / overallStats.totalRequests) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                      <LockOpen className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Tabs for detailed views */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">By User</TabsTrigger>
              <TabsTrigger value="services">By Service</TabsTrigger>
              <TabsTrigger value="anonymous">Anonymous</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {overallStats && (
                <>
                  {/* Auth vs Anonymous Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Authentication Status Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                              <LockOpen className="w-4 h-4 text-green-600" />
                              Authenticated Users
                            </span>
                            <Badge variant="default">
                              {overallStats.byAuthStatus.authenticated.requests} requests
                            </Badge>
                          </div>
                          <div className="text-2xl font-bold">
                            {formatCurrency(overallStats.byAuthStatus.authenticated.cost)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatNumber(overallStats.byAuthStatus.authenticated.tokens)} tokens
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                              <Lock className="w-4 h-4 text-gray-600" />
                              Anonymous Users
                            </span>
                            <Badge variant="secondary">
                              {overallStats.byAuthStatus.unauthenticated.requests} requests
                            </Badge>
                          </div>
                          <div className="text-2xl font-bold">
                            {formatCurrency(overallStats.byAuthStatus.unauthenticated.cost)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatNumber(overallStats.byAuthStatus.unauthenticated.tokens)} tokens
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Model Usage */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        Model Usage Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(overallStats.byModel).map(([model, stats]) => (
                          <div key={model} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              {getModelBadge(model)}
                              <div>
                                <p className="font-medium">{stats.requests} requests</p>
                                <p className="text-sm text-gray-500">
                                  {formatNumber(stats.inputTokens)} in / {formatNumber(stats.outputTokens)} out
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{formatCurrency(stats.cost)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Users Tab - Enhanced with detailed breakdown */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Authenticated Users - AI Usage Breakdown
                  </CardTitle>
                  <CardDescription>
                    Detailed AI credit usage for signed-in users (click any row to view service breakdown)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-12"></TableHead>
                          <TableHead className="min-w-[250px]">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              User Email
                            </div>
                          </TableHead>
                          <TableHead className="text-center">Requests</TableHead>
                          <TableHead className="text-right">
                            <div className="flex flex-col items-end">
                              <span>Input Tokens</span>
                              <span className="text-xs text-gray-500 font-normal">(Cost)</span>
                            </div>
                          </TableHead>
                          <TableHead className="text-right">
                            <div className="flex flex-col items-end">
                              <span>Output Tokens</span>
                              <span className="text-xs text-gray-500 font-normal">(Cost)</span>
                            </div>
                          </TableHead>
                          <TableHead className="text-right">
                            <div className="flex flex-col items-end">
                              <span className="font-bold">Total Cost</span>
                              <span className="text-xs text-gray-500 font-normal">USD</span>
                            </div>
                          </TableHead>
                          <TableHead className="text-center">Last Used</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userStats.map((user, index) => (
                          <React.Fragment key={user._id}>
                            {/* Main User Row */}
                            <TableRow 
                              className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                                expandedUser === user._id ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => toggleUserExpansion(user._id)}
                            >
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  {expandedUser === user._id ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </Button>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="font-medium text-gray-900">
                                      {user.userEmail || 'Unknown'}
                                    </span>
                                  </div>
                                  <div className="flex gap-2 text-xs">
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                      ✓ {user.successfulRequests} successful
                                    </Badge>
                                    {user.failedRequests > 0 && (
                                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                        ✗ {user.failedRequests} failed
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary" className="font-mono">
                                  {formatNumber(user.totalRequests)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex flex-col items-end gap-1">
                                  <span className="font-mono text-blue-700 font-semibold">
                                    {formatNumber(user.totalInputTokens)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatCurrency(user.totalInputTokens * 0.30 / 1_000_000)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex flex-col items-end gap-1">
                                  <span className="font-mono text-purple-700 font-semibold">
                                    {formatNumber(user.totalOutputTokens)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatCurrency(user.totalOutputTokens * 2.50 / 1_000_000)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-bold text-green-700 text-lg">
                                  {formatCurrency(user.totalCost)}
                                </div>
                              </TableCell>
                              <TableCell className="text-center text-sm text-gray-600">
                                {user.lastUsed ? new Date(user.lastUsed).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                }) : 'N/A'}
                              </TableCell>
                            </TableRow>

                            {/* Expanded Details Row */}
                            {expandedUser === user._id && userDetails[user._id] && (
                              <TableRow>
                                <TableCell colSpan={7} className="bg-gray-50 p-6">
                                  <div className="space-y-6">
                                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
                                      <User className="w-5 h-5" />
                                      Complete Usage History: {user.userEmail || 'User'}
                                    </h4>
                                    
                                    {/* After Sign-In Section */}
                                    <div className="border-l-4 border-l-green-500 pl-4">
                                      <div className="flex items-center gap-2 mb-4">
                                        <LockOpen className="w-5 h-5 text-green-600" />
                                        <h5 className="font-semibold text-green-900 text-base">After Sign-In (Authenticated)</h5>
                                        <Badge className="bg-green-100 text-green-800">Current Data</Badge>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Services Breakdown */}
                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                          <h6 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                            <Activity className="w-4 h-4" />
                                            Usage by Service
                                          </h6>
                                          <div className="space-y-2">
                                            {userDetails[user._id].after && Object.keys(userDetails[user._id].after.byService).length > 0 ? (
                                              Object.entries(userDetails[user._id].after.byService).map(([service, stats]) => (
                                                <div key={service} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                  <div>
                                                    <p className="font-medium text-sm">{getServiceName(service)}</p>
                                                    <p className="text-xs text-gray-500">
                                                      {formatNumber(stats.inputTokens)} in / {formatNumber(stats.outputTokens)} out
                                                    </p>
                                                  </div>
                                                  <div className="text-right">
                                                    <p className="font-bold text-sm">{formatCurrency(stats.cost)}</p>
                                                    <p className="text-xs text-gray-500">{stats.requests} req</p>
                                                  </div>
                                                </div>
                                              ))
                                            ) : (
                                              <p className="text-sm text-gray-500 italic">No authenticated usage yet</p>
                                            )}
                                          </div>
                                        </div>

                                        {/* Models Breakdown */}
                                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                          <h6 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                            <Brain className="w-4 h-4" />
                                            Usage by Model
                                          </h6>
                                          <div className="space-y-2">
                                            {userDetails[user._id].after && Object.keys(userDetails[user._id].after.byModel).length > 0 ? (
                                              Object.entries(userDetails[user._id].after.byModel).map(([model, stats]) => (
                                                <div key={model} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                  <div>
                                                    {getModelBadge(model)}
                                                    <p className="text-xs text-gray-500 mt-1">
                                                      {formatNumber(stats.inputTokens)} in / {formatNumber(stats.outputTokens)} out
                                                    </p>
                                                  </div>
                                                  <div className="text-right">
                                                    <p className="font-bold text-sm">{formatCurrency(stats.cost)}</p>
                                                    <p className="text-xs text-gray-500">{stats.requests} req</p>
                                                  </div>
                                                </div>
                                              ))
                                            ) : (
                                              <p className="text-sm text-gray-500 italic">No authenticated usage yet</p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Before Sign-In Section */}
                                    <div className="border-l-4 border-l-gray-400 pl-4">
                                      <div className="flex items-center gap-2 mb-4">
                                        <Lock className="w-5 h-5 text-gray-600" />
                                        <h5 className="font-semibold text-gray-900 text-base">Before Sign-In (Anonymous)</h5>
                                        <Badge variant="outline" className="bg-gray-100 text-gray-700">Historical Data</Badge>
                                      </div>
                                      
                                      {userDetails[user._id].hasBeforeSignupData && userDetails[user._id].before ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {/* Services Breakdown */}
                                          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                            <h6 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                              <Activity className="w-4 h-4" />
                                              Usage by Service
                                            </h6>
                                            <div className="space-y-2">
                                              {Object.keys(userDetails[user._id].before.byService).length > 0 ? (
                                                Object.entries(userDetails[user._id].before.byService).map(([service, stats]) => (
                                                  <div key={service} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                    <div>
                                                      <p className="font-medium text-sm">{getServiceName(service)}</p>
                                                      <p className="text-xs text-gray-500">
                                                        {formatNumber(stats.inputTokens)} in / {formatNumber(stats.outputTokens)} out
                                                      </p>
                                                    </div>
                                                    <div className="text-right">
                                                      <p className="font-bold text-sm">{formatCurrency(stats.cost)}</p>
                                                      <p className="text-xs text-gray-500">{stats.requests} req</p>
                                                    </div>
                                                  </div>
                                                ))
                                              ) : (
                                                <p className="text-sm text-gray-500 italic">No service usage before sign-up</p>
                                              )}
                                            </div>
                                          </div>

                                          {/* Models Breakdown */}
                                          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                            <h6 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                              <Brain className="w-4 h-4" />
                                              Usage by Model
                                            </h6>
                                            <div className="space-y-2">
                                              {Object.keys(userDetails[user._id].before.byModel).length > 0 ? (
                                                Object.entries(userDetails[user._id].before.byModel).map(([model, stats]) => (
                                                  <div key={model} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                    <div>
                                                      {getModelBadge(model)}
                                                      <p className="text-xs text-gray-500 mt-1">
                                                        {formatNumber(stats.inputTokens)} in / {formatNumber(stats.outputTokens)} out
                                                      </p>
                                                    </div>
                                                    <div className="text-right">
                                                      <p className="font-bold text-sm">{formatCurrency(stats.cost)}</p>
                                                      <p className="text-xs text-gray-500">{stats.requests} req</p>
                                                    </div>
                                                  </div>
                                                ))
                                              ) : (
                                                <p className="text-sm text-gray-500 italic">No model usage before sign-up</p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                          <div className="flex items-start gap-3">
                                            <Activity className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-gray-600">
                                              No anonymous usage detected before this user signed up. They likely signed up directly without using AI features first.
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        ))}
                        
                        {userStats.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                              No authenticated user data available for the selected period
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab - Enhanced */}
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Usage by Service
                  </CardTitle>
                  <CardDescription>
                    AI service usage breakdown with detailed token and cost analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="min-w-[180px]">Service Name</TableHead>
                          <TableHead className="text-center">Total Requests</TableHead>
                          <TableHead className="text-center">
                            <div className="flex flex-col items-center">
                              <span>Auth / Anon</span>
                              <span className="text-xs text-gray-500 font-normal">Requests Split</span>
                            </div>
                          </TableHead>
                          <TableHead className="text-right">
                            <div className="flex flex-col items-end">
                              <span>Input Tokens</span>
                              <span className="text-xs text-gray-500 font-normal">(Cost)</span>
                            </div>
                          </TableHead>
                          <TableHead className="text-right">
                            <div className="flex flex-col items-end">
                              <span>Output Tokens</span>
                              <span className="text-xs text-gray-500 font-normal">(Cost)</span>
                            </div>
                          </TableHead>
                          <TableHead className="text-right">
                            <div className="flex flex-col items-end">
                              <span className="font-bold">Total Cost</span>
                              <span className="text-xs text-gray-500 font-normal">USD</span>
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceStats.map((service) => {
                          // Calculate approximate costs (weighted average based on model usage)
                          const avgInputCost = service.totalInputTokens * 0.30 / 1_000_000;
                          const avgOutputCost = service.totalOutputTokens * 2.50 / 1_000_000;
                          
                          return (
                            <TableRow key={service._id} className="hover:bg-gray-50">
                              <TableCell className="font-medium text-gray-900">
                                {getServiceName(service._id)}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary" className="font-mono">
                                  {formatNumber(service.totalRequests)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2 text-sm">
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <LockOpen className="w-3 h-3 mr-1" />
                                    {service.authenticatedRequests}
                                  </Badge>
                                  <span className="text-gray-400">/</span>
                                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                    <Lock className="w-3 h-3 mr-1" />
                                    {service.unauthenticatedRequests}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex flex-col items-end gap-1">
                                  <span className="font-mono text-blue-700 font-semibold">
                                    {formatNumber(service.totalInputTokens)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatCurrency(avgInputCost)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex flex-col items-end gap-1">
                                  <span className="font-mono text-purple-700 font-semibold">
                                    {formatNumber(service.totalOutputTokens)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatCurrency(avgOutputCost)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-bold text-green-700 text-lg">
                                  {formatCurrency(service.totalCost)}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        
                        {serviceStats.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No service data available for the selected period
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Anonymous Tab - Completely Redesigned */}
            <TabsContent value="anonymous">
              {anonymousStats && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Requests</p>
                            <p className="text-2xl font-bold text-blue-900 mt-1">
                              {formatNumber(anonymousStats.totalRequests)}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              {anonymousStats.successfulRequests} successful
                            </p>
                          </div>
                          <Activity className="w-8 h-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Input Tokens</p>
                            <p className="text-2xl font-bold text-purple-900 mt-1">
                              {formatNumber(anonymousStats.totalInputTokens)}
                            </p>
                            <p className="text-xs text-purple-600 mt-1">
                              {formatCurrency(anonymousStats.totalInputTokens * 0.30 / 1_000_000)} cost
                            </p>
                          </div>
                          <Zap className="w-8 h-8 text-purple-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-pink-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Output Tokens</p>
                            <p className="text-2xl font-bold text-pink-900 mt-1">
                              {formatNumber(anonymousStats.totalOutputTokens)}
                            </p>
                            <p className="text-xs text-pink-600 mt-1">
                              {formatCurrency(anonymousStats.totalOutputTokens * 2.50 / 1_000_000)} cost
                            </p>
                          </div>
                          <Zap className="w-8 h-8 text-pink-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Total Cost</p>
                            <p className="text-2xl font-bold text-green-900 mt-1">
                              {formatCurrency(anonymousStats.totalCost)}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              Before authentication
                            </p>
                          </div>
                          <DollarSign className="w-8 h-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Anonymous Users Table - Same Structure as By User Tab */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-gray-600" />
                        Anonymous Users - Detailed Breakdown
                      </CardTitle>
                      <CardDescription>
                        Users who accessed AI features <strong>before signing in</strong> - Showing aggregated anonymous usage
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="w-12"></TableHead>
                              <TableHead className="min-w-[250px]">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  User Identity
                                </div>
                              </TableHead>
                              <TableHead className="text-center">Requests</TableHead>
                              <TableHead className="text-right">
                                <div className="flex flex-col items-end">
                                  <span>Input Tokens</span>
                                  <span className="text-xs text-gray-500 font-normal">(Cost)</span>
                                </div>
                              </TableHead>
                              <TableHead className="text-right">
                                <div className="flex flex-col items-end">
                                  <span>Output Tokens</span>
                                  <span className="text-xs text-gray-500 font-normal">(Cost)</span>
                                </div>
                              </TableHead>
                              <TableHead className="text-right">
                                <div className="flex flex-col items-end">
                                  <span className="font-bold">Total Cost</span>
                                  <span className="text-xs text-gray-500 font-normal">USD</span>
                                </div>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <React.Fragment key="anonymous-aggregate">
                              {/* Main Anonymous Row */}
                              <TableRow 
                                className="cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setExpandedUser(expandedUser === 'anonymous' ? null : 'anonymous')}
                              >
                                <TableCell>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    {expandedUser === 'anonymous' ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </Button>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                                      <span className="font-medium text-gray-900">
                                        Anonymous Users (Not Signed In)
                                      </span>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                        All pre-signup usage
                                      </Badge>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        ✓ {anonymousStats.successfulRequests} successful
                                      </Badge>
                                      {anonymousStats.failedRequests > 0 && (
                                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                          ✗ {anonymousStats.failedRequests} failed
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="secondary" className="font-mono">
                                    {formatNumber(anonymousStats.totalRequests)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="font-mono text-blue-700 font-semibold">
                                      {formatNumber(anonymousStats.totalInputTokens)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatCurrency(anonymousStats.totalInputTokens * 0.30 / 1_000_000)}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="font-mono text-purple-700 font-semibold">
                                      {formatNumber(anonymousStats.totalOutputTokens)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {formatCurrency(anonymousStats.totalOutputTokens * 2.50 / 1_000_000)}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="font-bold text-green-700 text-lg">
                                    {formatCurrency(anonymousStats.totalCost)}
                                  </div>
                                </TableCell>
                              </TableRow>

                              {/* Expanded Details Row - Same Structure as User Details */}
                              {expandedUser === 'anonymous' && (
                                <TableRow>
                                  <TableCell colSpan={6} className="bg-gray-50 p-6">
                                    <div className="space-y-6">
                                      <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
                                        <Lock className="w-5 h-5" />
                                        Complete Anonymous Usage - Before Sign-In Only
                                      </h4>
                                      
                                      {/* Before Sign-In Section (Only section for anonymous) */}
                                      <div className="border-l-4 border-l-gray-500 pl-4">
                                        <div className="flex items-center gap-2 mb-4">
                                          <Lock className="w-5 h-5 text-gray-600" />
                                          <h5 className="font-semibold text-gray-900 text-base">Before Sign-In (Anonymous)</h5>
                                          <Badge className="bg-gray-100 text-gray-800">All Data</Badge>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {/* Services Breakdown */}
                                          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                            <h6 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                              <Activity className="w-4 h-4" />
                                              Usage by Service
                                            </h6>
                                            <div className="space-y-2">
                                              {Object.entries(anonymousStats.byService).map(([service, stats]) => (
                                                <div key={service} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                  <div>
                                                    <p className="font-medium text-sm">{getServiceName(service)}</p>
                                                    <p className="text-xs text-gray-500">
                                                      {formatNumber(stats.inputTokens || 0)} in / {formatNumber(stats.outputTokens || 0)} out
                                                    </p>
                                                  </div>
                                                  <div className="text-right">
                                                    <p className="font-bold text-sm">{formatCurrency(stats.cost)}</p>
                                                    <p className="text-xs text-gray-500">{stats.requests} req</p>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>

                                          {/* Info Card */}
                                          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                            <h6 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                              <TrendingUp className="w-4 h-4" />
                                              About This Data
                                            </h6>
                                            <div className="space-y-3">
                                              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                                <p className="text-xs font-medium text-blue-900 mb-1">What is this?</p>
                                                <p className="text-xs text-blue-800">
                                                  These are AI features used by visitors who <strong>never created an account</strong> or used features before signing up.
                                                </p>
                                              </div>
                                              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                                                <p className="text-xs font-medium text-amber-900 mb-1">💡 Insights</p>
                                                <p className="text-xs text-amber-800">
                                                  High anonymous usage shows strong interest. Consider improving the sign-up flow to convert these users!
                                                </p>
                                              </div>
                                              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                                                <p className="text-xs font-medium text-purple-900 mb-1">🔧 Future Enhancement</p>
                                                <p className="text-xs text-purple-800">
                                                  Implement session tracking to link this usage to users after they sign up.
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminAIUsagePage;

