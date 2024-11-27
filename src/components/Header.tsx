import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { ThemeToggle } from "./ThemeToggle";
import { SignInButton } from './SignInButton';

export function Header() {
  const { user } = useUser();

  return (
    <div className="fixed inset-x-0 top-10 z-50">
      <header className="relative w-full max-w-[1100px] mx-auto border border-border/40  backdrop-blur-sm backdrop-saturate-200  border-gray-200 dark:border-gray-900 rounded-full">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/0 rounded-full" />
        <nav className="mx-auto max-w-screen-xl px-6 lg:px-6">
          <div className="relative flex h-[54px] items-center justify-between">
            {/* Left section */}
            <div className="flex items-center gap-6">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-lg font-medium tracking-tight hover:opacity-80 transition-all"
              >
                Email Analyzer Pro
              </Link>
              <div className="hidden md:flex items-center gap-1">
                <Link 
                  to="/translate" 
                  className="rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  Translate
                </Link>
                {user && (
                  <Link 
                    to="/settings" 
                    className="rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
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
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      </header>
    </div>
  );
}
