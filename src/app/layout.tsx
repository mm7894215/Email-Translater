import React from 'react';
import { Providers } from "./providers";
import { Navbar } from '../components/ui/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
} 