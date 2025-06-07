import React from 'react';

import AppRouter from './routes/AppRouter.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { TemplateContextProvider } from './context/TemplateContext.jsx';
import { ResumeContextProvider } from './context/ResumeContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx'; // Import ThemeProvider
import { CoverLetterContextProvider } from './context/CoverLetterContext.jsx';

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
