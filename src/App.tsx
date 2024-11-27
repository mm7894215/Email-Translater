import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from 'next-themes';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { TranslateEmail } from './pages/TranslateEmail';
import { Settings } from './pages/Settings';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

function App() {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
    >
      <ClerkProvider publishableKey={clerkPubKey}>
        <Router>
          <div className="min-h-screen bg-background">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/translate" element={<TranslateEmail />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </Router>
      </ClerkProvider>
    </ThemeProvider>
  );
}

export default App;