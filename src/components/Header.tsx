import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { ThemeToggle } from "./ThemeToggle";
import { SignInButton } from './SignInButton';
import { Snail } from 'lucide-react';

export function Header() {
  const { user } = useUser();

  return (
    <div className="fixed inset-x-0 top-6 z-50">
      <header className="relative w-full max-w-[1200px] mx-auto">
        <div className="absolute inset-0 bg-background/30 shadow-sm rounded-full border border-border/40 backdrop-blur-[8px] backdrop-saturate-[1.8]" />
        <nav className="relative px-6">
          <div className="flex h-[52px] items-center justify-between">
            {/* Left section */}
            <div className="flex items-center gap-6">
              <Link 
                to="/" 
                className="flex items-center gap-3 text-md font-bold tracking-tight hover:opacity-80 transition-all font-mono"
              >
                <Snail strokeWidth={1.75} className="w-6 h-6" /> Email Analyzer Pro
              </Link>
              <div className="hidden md:flex items-center gap-1" >
                <Link 
                  to="/translate" 
                  className="rounded-md px-3 py-2 text-[14px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  Translate
                </Link>
                {user && (
                  <Link 
                    to="/settings" 
                    className="rounded-md px-3 py-2 text-[14px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    Settings
                  </Link>
                )}
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-muted-foreground hidden sm:inline-block">
                    {user.emailAddresses[0]?.emailAddress}
                  </span>
                  <div className="h-7">
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-7 h-7 rounded-full",
                          userButtonTrigger: "h-7 w-7"
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <SignInButton />
              )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
