import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RouteChangeTracker from '@/components/Analytics/RouteChangeTracker.js';
import OAuthHandler from '@/components/Auth/OAuthHandler.jsx';

import MainLayout from '../components/Layout/MainLayout.jsx';
import AdminLayout from '@/components/Layout/AdminLayout.jsx';

// Page Imports
import LoginPage from '../pages/Auth/LoginPage.jsx';
import SignupPage from '../pages/Auth/SignupPage.jsx';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage.jsx';
import VerifyEmailPage from '../pages/Auth/VerifyEmailPage.jsx';
import DashboardPage from '../pages/General/DashboardPage.jsx';
import CoverLetterGeneratorPage from '../pages/CoverLetter/CoverLetterGeneratorPage.jsx';
import CoverLetterEditPage from '../pages/CoverLetter/CoverLetterEditPage.jsx';
import CoverLetterPreviewPage from '../pages/CoverLetter/CoverLetterPreviewPage.jsx';
import HomePage from '../pages/General/HomePage.jsx';
import TemplatesPage from '../pages/General/TemplatesPage.jsx';
import OAuthReturnPage from '../pages/General/OAuthReturnPage.jsx';
import ResumeEditorPage from '../pages/Resume/ResumeEditorPage.jsx';
import ResumeViewerPage from '../pages/Resume/ResumeViewerPage.jsx';
import ATSCheckerPage from '../pages/ATSChecker/ATSCheckerPage.jsx';
import NotFoundPage from '../pages/General/NotFoundPage.jsx';
import UnauthorizedPage from '../pages/General/UnauthorizedPage.jsx';

// Admin Page Imports
import AdminDashboardPage from '../pages/Admin/AdminDashboardPage.jsx';
import AdminTemplatesPage from '../pages/Admin/AdminTemplatesPage.jsx';
import AdminTemplateEditPage from '../pages/Admin/AdminTemplateEditPage.jsx';
import AdminAnalyticsOverviewPage from '../pages/Admin/AdminAnalyticsOverviewPage.jsx';
import AdminAnalyticsTimeSeriesPage from '../pages/Admin/AdminAnalyticsTimeSeriesPage.jsx';
import AdminAnalyticsFunnelPage from '../pages/Admin/AdminAnalyticsFunnelPage.jsx';
import AdminAnalyticsRetentionPage from '../pages/Admin/AdminAnalyticsRetentionPage.jsx';
import AdminAnalyticsSecurityPage from '../pages/Admin/AdminAnalyticsSecurityPage.jsx';
import AdminAnalyticsDevicePage from '../pages/Admin/AdminAnalyticsDevicePage.jsx';
import AdminAnalyticsPerformancePage from '../pages/Admin/AdminAnalyticsPerformancePage.jsx';
import AdminUsersPage from '../pages/Admin/AdminUsersPage.jsx';
import AdminAIUsagePage from '../pages/Admin/AdminAIUsagePage.jsx';
import AdminFeedbackPage from '../pages/Admin/AdminFeedbackPage.jsx';
import MonarchDashboardPage from '../pages/Admin/MonarchDashboardPage.jsx';

// Protected Route Wrapper
import ProtectedRoute from './ProtectedRoute.jsx';

const AppRouter = () => {
  return (
    <Router>
      <OAuthHandler />
      <RouteChangeTracker />
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
          <Route path='ats-checker' element={<ATSCheckerPage />} />   

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
               <Route path="users" element={<AdminUsersPage />} />
               <Route path="ai-usage" element={<AdminAIUsagePage />} />
               <Route path="feedback" element={<AdminFeedbackPage />} />
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