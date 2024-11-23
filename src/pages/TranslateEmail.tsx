import React, { useState } from 'react';
import { EmailUploader } from '../components/EmailUploader';
import { LanguageSelector } from '../components/LanguageSelector';
import { translateEmail } from '../services/translate';
import { DownloadButton } from '../components/DownloadButton';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Languages, Sparkles } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { SignInButton } from '../components/SignInButton';
import { toast } from 'react-hot-toast';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/segment';

type TranslationProvider = 'gpt-4' | 'gpt-3.5' | 'google';

// 添加错误类型定义
interface TranslationError extends Error {
  message: string;
}

export function TranslateEmail() {
  const { user } = useUser();
  const [htmlContent, setHtmlContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [provider, setProvider] = useState<TranslationProvider>('gpt-4');

  const handleFileUpload = (content: string, name: string) => {
    setHtmlContent(content);
    setFileName(name);
    setTranslations({});
  };

  const handleTranslate = async () => {
    if (!htmlContent) {
      toast.error('Please upload an email to translate');
      return;
    }
    
    if (selectedLanguages.length === 0) {
      toast.error('Please select at least one target language');
      return;
    }
    
    if (!user) {
      toast.error('Please sign in to use the translation service');
      return;
    }
    
    setIsTranslating(true);
    try {
      const results = await Promise.all(
        selectedLanguages.map(async (lang) => {
          try {
            const translated = await translateEmail(htmlContent, lang);
            return [lang, translated];
          } catch (error) {
            const err = error as TranslationError;
            toast.error(`Failed to translate to ${lang}: ${err.message}`);
            return [lang, ''];
          }
        })
      );
      
      const successfulTranslations = results.filter(([, content]) => content);
      setTranslations(Object.fromEntries(successfulTranslations));
      
      if (successfulTranslations.length > 0) {
        toast.success('Translation completed successfully!');
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Failed to translate. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <EmailUploader onUpload={handleFileUpload} />
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className=" w-full sm:w-auto flex items-center gap-4">
            <Tabs 
              value={provider} 
              onValueChange={(value: string) => setProvider(value as TranslationProvider)} 
              className="items-center"
            >
                <TabsList>
                  <TabsTrigger value="gpt-4" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    GPT-4
                  </TabsTrigger>
                  <TabsTrigger value="gpt-3.5">GPT-3.5</TabsTrigger>
                  <TabsTrigger value="google">Google</TabsTrigger>
                </TabsList>
              </Tabs>
              <LanguageSelector
                selectedLanguages={selectedLanguages}
                onChange={setSelectedLanguages}
              />
              
              
            </div>
            
            {user ? (
              <Button
                onClick={handleTranslate}
                disabled={!htmlContent || selectedLanguages.length === 0 || isTranslating}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg"
                size="lg"
              >
                <Languages className="mr-2 h-5 w-5" />
                {isTranslating ? 'Translating...' : 'Translate Now'}
              </Button>
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {htmlContent && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Original Content</h2>
            </div>
            <div
              className="prose prose-sm dark:prose-invert max-w-none overflow-auto
                [&>*]:mx-auto [&>*]:w-full 
                [&>p]:my-2 
                [&>ul]:list-disc [&>ol]:list-decimal 
                [&>ul]:pl-4 [&>ol]:pl-4 
                [&_a]:text-blue-500 [&_a]:underline hover:[&_a]:text-blue-600
                [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic
                [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded
                [&_code]:font-mono [&_code]:text-sm
                [&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2
                [&_img]:max-w-full [&_img]:h-auto"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </Card>
        )}

        {Object.entries(translations).map(([lang, content]) => (
          <Card key={lang} className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Translated Content ({lang})
              </h2>
              <DownloadButton
                htmlContent={content}
                fileName={fileName.replace(/\.[^/.]+$/, '')}
                language={lang}
              />
            </div>
            <div
              className="prose prose-sm dark:prose-invert max-w-none overflow-auto
                [&>*]:mx-auto [&>*]:w-full 
                [&>p]:my-2 
                [&>ul]:list-disc [&>ol]:list-decimal 
                [&>ul]:pl-4 [&>ol]:pl-4 
                [&_a]:text-blue-500 [&_a]:underline hover:[&_a]:text-blue-600
                [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic
                [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded
                [&_code]:font-mono [&_code]:text-sm
                [&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:p-2
                [&_img]:max-w-full [&_img]:h-auto"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
