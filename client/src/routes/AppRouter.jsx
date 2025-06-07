import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from '../components/Layout/MainLayout.jsx';
import AdminLayout from '@/components/Layout/AdminLayout.jsx';

// Page Imports
import LoginPage from '../pages/LoginPage.jsx';
import SignupPage from '../pages/SignupPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';
import VerifyEmailPage from '../pages/VerifyEmailPage.jsx';
import VerificationRequiredPage from '../pages/VerificationRequiredPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import CoverLetterGeneratorPage from '../pages/CoverLetterGeneratorPage.jsx';
import CoverLetterEditPage from '../pages/CoverLetterEditPage.jsx';
import HomePage from '@/pages/HomePage.jsx';
import TemplatesPage from '../pages/TemplatesPage.jsx';
import ResumeEditorPage from '../pages/ResumeEditorPage.jsx';
import ResumeViewerPage from '../pages/ResumeViewerPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import UnauthorizedPage from '../pages/UnauthorizedPage.jsx';

// Admin Page Imports
import AdminDashboardPage from '@/pages/AdminDashboardPage.jsx';
import AdminTemplatesPage from '../pages/AdminTemplatesPage.jsx';
import AdminTemplateEditPage from '../pages/AdminTemplateEditPage.jsx';
import AdminAnalyticsOverviewPage from '@/pages/AdminAnalyticsOverviewPage.jsx';
import AdminAnalyticsTimeSeriesPage from '@/pages/AdminAnalyticsTimeSeriesPage.jsx';
import AdminAnalyticsFunnelPage from '@/pages/AdminAnalyticsFunnelPage.jsx';
import AdminAnalyticsRetentionPage from '@/pages/AdminAnalyticsRetentionPage.jsx';
import AdminAnalyticsSecurityPage from '@/pages/AdminAnalyticsSecurityPage.jsx';
import AdminAnalyticsDevicePage from '@/pages/AdminAnalyticsDevicePage.jsx';
import AdminAnalyticsPerformancePage from '@/pages/AdminAnalyticsPerformancePage.jsx';

// Protected Route Wrapper
import ProtectedRoute from './ProtectedRoute.jsx';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Standalone Auth & Info Pages (No Main Navbar/Footer) */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
        <Route path='/verification-required' element={<VerificationRequiredPage />} />
        <Route path='/verify-email/:token' element={<VerifyEmailPage />} />
        
        {/* Main Application Layout (Includes Navbar/Footer) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='home' element={<HomePage />} />
          <Route path='unauthorized' element={<UnauthorizedPage />} />
          
          {/* Routes protected by authentication */}
          <Route element={<ProtectedRoute roles={['user', 'admin']} />}>
            <Route path='dashboard' element={<DashboardPage />} />
            <Route path='templates' element={<TemplatesPage />} />
            <Route path='cover-letter/generate' element={<CoverLetterGeneratorPage />} />
            <Route path='cover-letter/edit/:coverLetterId' element={<CoverLetterEditPage />} />
            <Route path='resume/new/:newResumeTemplateId' element={<ResumeEditorPage />} />
            <Route path='resume/edit/:existingResumeId' element={<ResumeEditorPage />} />
            <Route path='resume/saved/view/:resumeId' element={<ResumeViewerPage />} />
            <Route path='resume/view/:templateId' element={<ResumeViewerPage />} />
          </Route>

          {/* Admin Routes - nested under its own protected layout */}
          <Route path="admin" element={<ProtectedRoute roles={['admin']} />}>
             <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
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
    </Router>
  );
};

export default AppRouter;
