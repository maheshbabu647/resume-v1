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
  exportAIUsageData
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
  RefreshCw
} from 'lucide-react';

const AdminAIUsagePage = () => {
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

  const fetchAllData = async () => {
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
      if (usersRes.success) setUserStats(usersRes.data.users);
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

          {/* Overall Stats Cards */}
          {overallStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Requests</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {formatNumber(overallStats.totalRequests)}
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
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Cost</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {formatCurrency(overallStats.totalCost)}
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
                transition={{ delay: 0.3 }}
              >
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {formatNumber(overallStats.totalInputTokens + overallStats.totalOutputTokens)}
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
                transition={{ delay: 0.4 }}
              >
                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Authenticated</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {formatNumber(overallStats.authenticatedRequests)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {((overallStats.authenticatedRequests / overallStats.totalRequests) * 100).toFixed(1)}%
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

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Top Users by AI Usage</CardTitle>
                  <CardDescription>Users ranked by total AI cost</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Requests</TableHead>
                        <TableHead>Tokens (In/Out)</TableHead>
                        <TableHead>Total Cost</TableHead>
                        <TableHead>Last Used</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userStats.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.userEmail || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">
                                {user.successfulRequests} successful / {user.failedRequests} failed
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{formatNumber(user.totalRequests)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <span className="text-blue-600">{formatNumber(user.totalInputTokens)}</span>
                              {' / '}
                              <span className="text-purple-600">{formatNumber(user.totalOutputTokens)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">
                            {formatCurrency(user.totalCost)}
                          </TableCell>
                          <TableCell>
                            {user.lastUsed ? new Date(user.lastUsed).toLocaleDateString() : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Usage by Service</CardTitle>
                  <CardDescription>AI service usage breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Total Requests</TableHead>
                        <TableHead>Auth / Anon</TableHead>
                        <TableHead>Tokens</TableHead>
                        <TableHead>Total Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceStats.map((service) => (
                        <TableRow key={service._id}>
                          <TableCell className="font-medium">
                            {getServiceName(service._id)}
                          </TableCell>
                          <TableCell>{formatNumber(service.totalRequests)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <span className="text-green-600">{service.authenticatedRequests}</span>
                              {' / '}
                              <span className="text-gray-600">{service.unauthenticatedRequests}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatNumber(service.totalInputTokens + service.totalOutputTokens)}
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">
                            {formatCurrency(service.totalCost)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Anonymous Tab */}
            <TabsContent value="anonymous">
              {anonymousStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Anonymous User Statistics
                    </CardTitle>
                    <CardDescription>
                      AI usage by users before sign-in
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Requests</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatNumber(anonymousStats.totalRequests)}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Cost</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(anonymousStats.totalCost)}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Tokens</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {formatNumber(anonymousStats.totalInputTokens + anonymousStats.totalOutputTokens)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Service Breakdown</h3>
                      <div className="space-y-2">
                        {Object.entries(anonymousStats.byService).map(([service, stats]) => (
                          <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium">{getServiceName(service)}</p>
                              <p className="text-sm text-gray-500">{stats.requests} requests</p>
                            </div>
                            <p className="font-bold">{formatCurrency(stats.cost)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

