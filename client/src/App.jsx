import React, { useEffect, Suspense } from 'react';
import AppRouter from './routes/AppRouter.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { TemplateContextProvider } from './context/TemplateContext.jsx';
import { ResumeContextProvider } from './context/ResumeContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { CoverLetterContextProvider } from './context/CoverLetterContext.jsx';
import LoadingSpinner from './components/Common/LoadingSpinner/LoadingSpinner.jsx';

// Lazy load Sentry to reduce initial bundle size
const initializeSentry = async () => {
  const { default: Sentry } = await import('@sentry/react');
  const {
    createRoutesFromChildren,
    matchRoutes,
    useLocation,
    useNavigationType,
  } = await import("react-router-dom");

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN, 
    integrations: [
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1, // Reduced from 1.0 for better performance
    replaysSessionSampleRate: 0.1, 
    replaysOnErrorSampleRate: 1.0, 
  });
};

// Initialize Sentry after component mount
if (import.meta.env.VITE_SENTRY_DSN) {
  initializeSentry();
}


const App = () => {
  return (
    <ThemeProvider>
      <AuthContextProvider>
        <TemplateContextProvider>
          <ResumeContextProvider>
            <CoverLetterContextProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <AppRouter />
              </Suspense>
            </CoverLetterContextProvider>
          </ResumeContextProvider>
        </TemplateContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
};

export default App;
