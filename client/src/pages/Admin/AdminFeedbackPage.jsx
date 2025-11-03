import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAdminFeedback } from '@/api/adminServiceApi';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner';
import {
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Star,
  User,
  Calendar,
  Filter,
  Download,
  Save,
  Sparkles,
  FileSearch,
} from 'lucide-react';

const AdminFeedbackPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [actionFilter, setActionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const limit = 20;

  const fetchFeedback = async (page = 1, action = '', sort = 'createdAt', order = 'desc') => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAdminFeedback(page, limit, action, sort, order);
      setFeedback(response.feedback || []);
      setPagination(response.pagination || {});
    } catch (err) {
      setError(err.message || 'Failed to fetch feedback');
      console.error('Error fetching feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Convert 'all' to empty string for API call
    const apiAction = actionFilter === 'all' ? '' : actionFilter;
    fetchFeedback(currentPage, apiAction, sortBy, sortOrder);
  }, [currentPage, actionFilter, sortBy, sortOrder]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (value) => {
    setActionFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'save_resume':
        return <Save className="h-4 w-4" />;
      case 'download_resume':
        return <Download className="h-4 w-4" />;
      case 'enhance_resume':
        return <Sparkles className="h-4 w-4" />;
      case 'ats_check':
        return <FileSearch className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getActionBadgeVariant = (action) => {
    switch (action) {
      case 'save_resume':
        return 'default';
      case 'download_resume':
        return 'secondary';
      case 'enhance_resume':
        return 'outline';
      case 'ats_check':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatActionName = (action) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-muted-foreground text-sm">No rating</span>;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}/5</span>
      </div>
    );
  };

  if (isLoading && feedback.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" label="Loading feedback..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Feedback | Admin Dashboard | CareerForge</title>
        <meta name="description" content="View and manage user feedback in the admin dashboard." />
      </Helmet>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 bg-background text-foreground min-h-[calc(100vh-100px)]">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14"
        >
          <div className="flex items-center gap-3.5 mb-2">
            <MessageSquare className="h-9 w-9 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              User Feedback
            </h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg">
            View all user feedback, ratings, and comments submitted across the platform.
          </p>
        </motion.header>

        {/* Filters and Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{pagination.total || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Feedback</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {feedback.filter(f => f.rating && f.rating >= 4).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Positive (4+)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {feedback.filter(f => f.rating && f.rating < 3).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Needs Attention</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={actionFilter} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="save_resume">Save Resume</SelectItem>
                      <SelectItem value="download_resume">Download Resume</SelectItem>
                      <SelectItem value="enhance_resume">Enhance Resume</SelectItem>
                      <SelectItem value="ats_check">ATS Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Feedback Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Feedback List
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {feedback.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No feedback found</h3>
                  <p className="text-muted-foreground">
                    {actionFilter !== 'all' ? 'Try adjusting your filters.' : 'No feedback has been submitted yet.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSortChange('action')}
                        >
                          <div className="flex items-center gap-2">
                            Action
                            {sortBy === 'action' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead>User</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSortChange('rating')}
                        >
                          <div className="flex items-center gap-2">
                            Rating
                            {sortBy === 'rating' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Comments</TableHead>
                        <TableHead>Page</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSortChange('createdAt')}
                        >
                          <div className="flex items-center gap-2">
                            Date
                            {sortBy === 'createdAt' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedback.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="text-muted-foreground">
                                {getActionIcon(item.action)}
                              </div>
                              <Badge variant={getActionBadgeVariant(item.action)}>
                                {formatActionName(item.action)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.userId ? (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">
                                    {item.userId.userName || item.userId.name || 'Unknown User'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {item.userId.userEmail || item.userId.email || 'No email'}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">Anonymous</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {renderStars(item.rating)}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-md">
                              {item.comments ? (
                                <p className="text-sm line-clamp-2" title={item.comments}>
                                  {item.comments}
                                </p>
                              ) : (
                                <span className="text-muted-foreground text-sm">No comments</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.pageUrl ? (
                              <a
                                href={item.pageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline truncate block max-w-xs"
                                title={item.pageUrl}
                              >
                                {item.pageUrl}
                              </a>
                            ) : (
                              <span className="text-muted-foreground text-sm">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{formatDate(item.createdAt)}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.page - 1) * limit) + 1} to{' '}
                    {Math.min(pagination.page * limit, pagination.total)} of{' '}
                    {pagination.total} feedback entries
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default AdminFeedbackPage;
