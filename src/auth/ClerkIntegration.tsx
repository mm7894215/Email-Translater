import { ClerkProvider } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { dark } from '@clerk/themes'



interface ClerkIntegrationProps {
  children: ReactNode;
}

const ClerkIntegration = ({ children }: ClerkIntegrationProps) => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPubKey) {
    throw new Error("Missing Clerk Publishable Key");
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: dark,
      }}
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkIntegration;
