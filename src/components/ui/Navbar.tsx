'use client';

import React from 'react';
import NextLink from 'next/link';
import { Button } from "./button";

export const Navbar = () => {
  return (
    <nav className="w-full p-4 bg-background/60 backdrop-blur-lg fixed top-0 z-50">
      <div className="flex items-center gap-6">
        <NextLink href="/" className="text-xl font-bold">
          EmailAnalyzer
        </NextLink>
        <div className="flex gap-4">
          <NextLink href="/">
            <Button
              variant="ghost"
              className="text-sm font-medium"
            >
              Home
            </Button>
          </NextLink>
          <NextLink href="/upload">
            <Button
              variant="ghost"
              className="text-sm font-medium"
            >
              Upload
            </Button>
          </NextLink>
        </div>
      </div>
    </nav>
  );
}; 