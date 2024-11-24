import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { SignInButton } from './SignInButton';

export function Header() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">
              Email Translator
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/">

              Translate
            </Link>
            {user && (
              <Link to="/settings">

                Settings
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
        <ThemeToggle />
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</span>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <SignInButton />
          )}
       
        </div>
      </div>
    </header>
  );
}
