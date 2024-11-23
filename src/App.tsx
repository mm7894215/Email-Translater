import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/clerk-react';
import { Header } from './components/Header';
import { TranslateEmail } from './pages/TranslateEmail';
import { Settings } from './pages/Settings';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <ThemeProvider defaultTheme="dark" storageKey="email-translator-theme">
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Header />
            <main className="container mx-auto py-6">
              <Routes>
                <Route path="/" element={<ErrorBoundary><TranslateEmail /></ErrorBoundary>} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/sign-in" element={<Settings />} />
              </Routes>
            </main>
            <Toaster position="bottom-right" />
          </div>
        </Router>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;