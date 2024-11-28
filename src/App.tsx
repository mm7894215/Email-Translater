import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from './components/ThemeProvider';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { TranslateEmail } from './pages/TranslateEmail';
import { Settings } from './pages/Settings';

// Initialize Clerk with publishable key
const initClerk = () => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!clerkPubKey) {
    throw new Error("Missing Clerk Publishable Key");
  }
  return clerkPubKey;
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="app-theme">
      <ClerkProvider publishableKey={initClerk()}>
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