import React, {useEffect } from 'react';

import AppRouter from './routes/AppRouter.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { TemplateContextProvider } from './context/TemplateContext.jsx';
import { ResumeContextProvider } from './context/ResumeContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx'; // Import ThemeProvider
import { CoverLetterContextProvider } from './context/CoverLetterContext.jsx';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import * as Sentry from "@sentry/react";

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

  tracesSampleRate: 1.0, 

  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0, 
});


const App = () => {
  return (
    <ThemeProvider> {/* Wrap with ThemeProvider */}
      <AuthContextProvider>
        <TemplateContextProvider>
          <ResumeContextProvider>
            <CoverLetterContextProvider>
              <AppRouter />
            </CoverLetterContextProvider>
          </ResumeContextProvider>
        </TemplateContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
};

export default App;
