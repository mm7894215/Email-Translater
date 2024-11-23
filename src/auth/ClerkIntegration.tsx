import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import React from 'react';

const clerkPubKey = process.env.CLERK_SECRET_KEY || 'sk_test_vsdrcfY9tbSQjzQWChkYt7fxCirkOiFrELIWbCm9Nd';

const ClerkIntegration: React.FC = ({ children }) => {
    return (
        <ClerkProvider frontendApi={clerkPubKey}>
            <SignedIn>{children}</SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </ClerkProvider>
    );
};

export default ClerkIntegration;
