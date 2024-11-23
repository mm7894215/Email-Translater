import React from 'react';
import { SignInButton as ClerkSignInButton } from "@clerk/clerk-react";
import { Button } from './ui/button';
import { LogIn } from 'lucide-react';

export function SignInButton() {
  return (
    <ClerkSignInButton mode="modal">
      <Button className="w-full sm:w-auto">
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Button>
    </ClerkSignInButton>
  );
}
