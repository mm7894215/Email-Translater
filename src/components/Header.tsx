import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { ThemeToggle } from './ThemeToggle';
import { SignInButton } from './SignInButton';
import { Snail } from 'lucide-react';

export function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="fixed inset-x-0 top-6 z-50 w-full max-w-[1200px] mx-auto">
      <div className="absolute inset-0 bg-background/30 shadow-sm rounded-full border border-border/40 backdrop-blur-[8px] backdrop-saturate-[1.8]" />
      
      <nav className="relative px-6 flex h-[52px] items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-md font-bold tracking-tight hover:opacity-80 transition-all font-mono"
          >
            <Snail strokeWidth={1.75} className="w-6 h-6" /> Email Analyzer Pro
          </Link>
          
          {isSignedIn && (
            <div className="hidden md:flex items-center gap-1">
              <Link 
                to="/translate"
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                Translate
              </Link>
              <Link
                to="/settings"
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors" 
              >
                Settings  
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:inline-block">
                {user.emailAddresses[0]?.emailAddress}
              </span>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-7 h-7 rounded-full',
                    userButtonTrigger: 'h-7 w-7',
                  },
                }}
              />
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
      </nav>
    </header>
  );
}
