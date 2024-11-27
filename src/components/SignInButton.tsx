import React from 'react';
import { SignInButton as ClerkSignInButton } from "@clerk/clerk-react";
import { Button } from './ui/button';
import { LogIn } from 'lucide-react';

export function SignInButton() {
  return (
    <ClerkSignInButton mode="modal">
      <Button className="text-sm h-8 rounded-full  border border-border/40 hover:muted/60 transition-colors" >
        <LogIn className="mr-2 h-4 w-4 " />
        Sign In
      </Button>
    </ClerkSignInButton>
  );
}
