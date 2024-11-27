import { ClerkProvider } from '@clerk/clerk-react';
import { ReactNode } from 'react';

interface ClerkIntegrationProps {
  children: ReactNode;
}

const ClerkIntegration = ({ children }: ClerkIntegrationProps) => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPubKey) {
    throw new Error('Missing Clerk Publishable Key');
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      {children}
    </ClerkProvider>
  );
};

export default ClerkIntegration;
