import React, { useState, useEffect } from 'react';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'react-hot-toast';
import { saveApiKey, getApiKey } from '../services/supabase';

export function Settings() {
  const { user, isLoaded } = useUser();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadApiKey = async () => {
      if (user) {
        try {
          const key = await getApiKey(user.id);
          if (key) {
            setApiKey(key);
          }
        } catch (error) {
          console.error('Error loading API key:', error);
          toast.error('Failed to load API key');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadApiKey();
  }, [user]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <RedirectToSignIn />;
  }

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsSaving(true);
    try {
      await saveApiKey(user.id, apiKey);
      toast.success('API key saved successfully');
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save API key');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="container mx-auto p-6 mt-24">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Configure your translation service settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="apiKey"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              DeepL API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter your DeepL API key"
            />
            <p className="text-sm text-muted-foreground">
              You can get your DeepL API key from{' '}
              <a
                href="https://www.deepl.com/pro-api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                DeepL Pro API
              </a>
            </p>
          </div>
          <Button onClick={handleSaveApiKey} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save API Key'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
