import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RouteChangeTracker from '@/components/Analytics/RouteChangeTracker.js';
import OAuthHandler from '@/components/Auth/OAuthHandler.jsx';
import LoadingSpinner from '@/components/Common/LoadingSpinner/LoadingSpinner.jsx';

import MainLayout from '../components/Layout/MainLayout.jsx';
import AdminLayout from '@/components/Layout/AdminLayout.jsx';

// Lazy load pages for better performance
const LoginPage = React.lazy(() => import('../pages/Auth/LoginPage.jsx'));
const SignupPage = React.lazy(() => import('../pages/Auth/SignupPage.jsx'));
const ForgotPasswordPage = React.lazy(() => import('../pages/Auth/ForgotPasswordPage.jsx'));
const ResetPasswordPage = React.lazy(() => import('../pages/Auth/ResetPasswordPage.jsx'));
const VerifyEmailPage = React.lazy(() => import('../pages/Auth/VerifyEmailPage.jsx'));
const DashboardPage = React.lazy(() => import('../pages/General/DashboardPage.jsx'));
const CoverLetterGeneratorPage = React.lazy(() => import('../pages/CoverLetter/CoverLetterGeneratorPage.jsx'));
const CoverLetterEditPage = React.lazy(() => import('../pages/CoverLetter/CoverLetterEditPage.jsx'));
const CoverLetterPreviewPage = React.lazy(() => import('../pages/CoverLetter/CoverLetterPreviewPage.jsx'));
const HomePage = React.lazy(() => import('../pages/General/HomePage.jsx'));
const TemplatesPage = React.lazy(() => import('../pages/General/TemplatesPage.jsx'));
const OAuthReturnPage = React.lazy(() => import('../pages/General/OAuthReturnPage.jsx'));
const ResumeEditorPage = React.lazy(() => import('../pages/Resume/ResumeEditorPage.jsx'));
const ResumeViewerPage = React.lazy(() => import('../pages/Resume/ResumeViewerPage.jsx'));
const NotFoundPage = React.lazy(() => import('../pages/General/NotFoundPage.jsx'));
const UnauthorizedPage = React.lazy(() => import('../pages/General/UnauthorizedPage.jsx'));

// Admin Page Imports - Lazy loaded
const AdminDashboardPage = React.lazy(() => import('../pages/Admin/AdminDashboardPage.jsx'));
const AdminTemplatesPage = React.lazy(() => import('../pages/Admin/AdminTemplatesPage.jsx'));
const AdminTemplateEditPage = React.lazy(() => import('../pages/Admin/AdminTemplateEditPage.jsx'));
const AdminAnalyticsOverviewPage = React.lazy(() => import('../pages/Admin/AdminAnalyticsOverviewPage.jsx'));
const AdminAnalyticsTimeSeriesPage = React.lazy(() => import('../pages/Admin/AdminAnalyticsTimeSeriesPage.jsx'));
const AdminAnalyticsFunnelPage = React.lazy(() => import('../pages/Admin/AdminAnalyticsFunnelPage.jsx'));
const AdminAnalyticsRetentionPage = React.lazy(() => import('../pages/Admin/AdminAnalyticsRetentionPage.jsx'));
const AdminAnalyticsSecurityPage = React.lazy(() => import('../pages/Admin/AdminAnalyticsSecurityPage.jsx'));
const AdminAnalyticsDevicePage = React.lazy(() => import('../pages/Admin/AdminAnalyticsDevicePage.jsx'));
const AdminAnalyticsPerformancePage = React.lazy(() => import('../pages/Admin/AdminAnalyticsPerformancePage.jsx'));
const MonarchDashboardPage = React.lazy(() => import('../pages/Admin/MonarchDashboardPage.jsx'));

// Protected Route Wrapper
import ProtectedRoute from './ProtectedRoute.jsx';

const AppRouter = () => {
  return (
    <Router>
      <OAuthHandler />
      <RouteChangeTracker />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
        {/* Standalone Auth & Info Pages (No Main Navbar/Footer) */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
        <Route path='/oauth-return' element={<OAuthReturnPage />} />
        {/* <Route path='/verification-required' element={<VerificationRequiredPage />} /> */}
        {/* --- MODIFICATION START --- */}
        {/* Changed path from '/verify-email/:token' to '/verify-email' */}
        <Route path='/verify-email' element={<VerifyEmailPage />} />
        {/* --- MODIFICATION END --- */}
        
        {/* Main Application Layout (Includes Navbar/Footer) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='home' element={<HomePage />} />
          <Route path='unauthorized' element={<UnauthorizedPage />} />
          <Route path='templates' element={<TemplatesPage />} />
          <Route path='resume/new/:newResumeTemplateId' element={<ResumeEditorPage />} />
          <Route path='resume/view/:templateId' element={<ResumeViewerPage />} />
          <Route path='cover-letter/generate' element={<CoverLetterGeneratorPage />} />   

          {/* Routes protected by authentication */}
          <Route element={<ProtectedRoute roles={['user', 'admin']} />}>
            <Route path='dashboard' element={<DashboardPage />} />
            <Route path='cover-letter/edit/:coverLetterId' element={<CoverLetterEditPage />} />
            <Route path='cover-letter/preview/:coverLetterId' element={<CoverLetterPreviewPage />} />
            <Route path='resume/edit/:existingResumeId' element={<ResumeEditorPage />} />
            <Route path='resume/saved/view/:resumeId' element={<ResumeViewerPage />} />
          </Route>

          {/* Admin Routes - nested under its own protected layout */}
          <Route path="admin" element={<ProtectedRoute roles={['admin']} />}>
             <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="monarch-dashboard" element={<MonarchDashboardPage />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="templates" element={<AdminTemplatesPage />} />
                <Route path="templates/new" element={<AdminTemplateEditPage />} />
                <Route path="templates/edit/:templateId" element={<AdminTemplateEditPage />} />
                <Route path="analytics/overview" element={<AdminAnalyticsOverviewPage />} />
                <Route path="analytics/timeseries" element={<AdminAnalyticsTimeSeriesPage />} />
                <Route path="analytics/funnel" element={<AdminAnalyticsFunnelPage />} />
                <Route path="analytics/retention" element={<AdminAnalyticsRetentionPage />} />
                <Route path="analytics/security" element={<AdminAnalyticsSecurityPage />} />
                <Route path="analytics/device" element={<AdminAnalyticsDevicePage />} />
                <Route path="analytics/performance" element={<AdminAnalyticsPerformancePage />} />
            </Route>
          </Route>

          {/* Catch-all Not Found Route must be last */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;