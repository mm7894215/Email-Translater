'use client';

import { Link } from 'react-router-dom';
import { Button } from "./button";

export const Navbar = () => {
  return (
    <nav className="w-full p-4 bg-background/60 backdrop-blur-lg fixed top-0 z-50">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold">
          EmailAnalyzer
        </Link>
        <div className="flex gap-4">
          <Link to="/">
            <Button
              variant="ghost"
              className="text-sm font-medium"
            >
              Home
            </Button>
          </Link>
          <Link to="/upload">
            <Button
              variant="ghost"
              className="text-sm font-medium"
            >
              Upload
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}; 