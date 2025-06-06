import React from 'react';

import AppRouter from './routes/AppRouter.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { TemplateContextProvider } from './context/TemplateContext.jsx';
import { ResumeContextProvider } from './context/ResumeContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx'; // Import ThemeProvider

const App = () => {
  return (
    <ThemeProvider> {/* Wrap with ThemeProvider */}
      <AuthContextProvider>
        <TemplateContextProvider>
          <ResumeContextProvider>
            <AppRouter />
          </ResumeContextProvider>
        </TemplateContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
};

export default App;
