import React, { useState, useEffect } from 'react';
import { translateHtml } from '../services/translationService';
import { LanguageSelector } from './LanguageSelector';
import { toast } from 'react-hot-toast';

interface EmailPreviewProps {
  htmlContent: string;
  onTranslated?: (translations: Record<string, string>) => void;
}

interface Translation {
  language: string;
  content: string;
  isLoading: boolean;
  error: string | null;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ 
  htmlContent,
  onTranslated 
}) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']);
  const [translations, setTranslations] = useState<Record<string, Translation>>({
    original: {
      language: 'original',
      content: '',
      isLoading: false,
      error: null
    }
  });

  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setTranslations(prev => ({
      ...prev,
      original: {
        language: 'original',
        content: htmlContent,
        isLoading: false,
        error: null
      }
    }));
  }, [htmlContent]);

  const handleTranslate = async () => {
    if (!htmlContent) return;

    setIsTranslating(true);
    const newTranslations: Record<string, Translation> = {
      original: {
        language: 'original',
        content: htmlContent,
        isLoading: false,
        error: null
      }
    };

    for (const language of selectedLanguages) {
      newTranslations[language] = {
        language,
        content: '',
        isLoading: true,
        error: null
      };
      setTranslations({ ...newTranslations });

      try {
        const { translatedHtml, error } = await translateHtml(htmlContent, language);
        if (error) {
          throw new Error(error);
        }
        newTranslations[language] = {
          language,
          content: translatedHtml,
          isLoading: false,
          error: null
        };
        toast.success(`Successfully translated to ${language.toUpperCase()}`);
      } catch (err) {
        console.error('Translation failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'Translation service unavailable';
        newTranslations[language] = {
          language,
          content: '',
          isLoading: false,
          error: errorMessage
        };
        toast.error(`Failed to translate to ${language.toUpperCase()}: ${errorMessage}`);
      } finally {
        setTranslations({ ...newTranslations });
      }
    }

    setIsTranslating(false);
    onTranslated?.(Object.fromEntries(
      Object.entries(newTranslations).map(([key, value]) => [key, value.content])
    ));
  };

  if (!htmlContent) {
    return (
      <div className="flex flex-col h-full fade-in">
        <div className="p-4 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-gray-100">Email Preview</h2>
          <p className="text-sm text-slate-400 mt-1">Upload an HTML email to start</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <svg 
              className="w-16 h-16 mx-auto text-slate-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="text-slate-400">No email content to preview</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full fade-in">
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">Email Preview</h2>
            <p className="text-sm text-slate-400 mt-1">Select languages and preview translations</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-64">
              <LanguageSelector
                selectedLanguages={selectedLanguages}
                onLanguagesChange={setSelectedLanguages}
                disabled={isTranslating}
              />
            </div>
            <button
              className={`btn ${isTranslating ? 'btn-secondary' : 'btn-primary'} 
                disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={handleTranslate}
              disabled={isTranslating || selectedLanguages.length === 0}
            >
              {isTranslating ? (
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : 'Translate'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.entries(translations).map(([key, translation]) => (
            <div 
              key={key} 
              className="card slide-up-fade"
              style={{animationDelay: `${Object.keys(translations).indexOf(key) * 0.1}s`}}
            >
              <div className="px-4 py-3 border-b border-slate-700/50 flex justify-between items-center">
                <h3 className="font-medium text-gray-100">
                  {key === 'original' ? 'Original' : translation.language.toUpperCase()}
                </h3>
                <button
                  className="inline-flex items-center px-3 py-1 text-sm text-indigo-400 hover:text-indigo-300 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 
                    rounded-md transition-colors"
                  onClick={() => {
                    const blob = new Blob([translation.content], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `email_${key}.html`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
              <div className="p-4">
                {translation.isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="loading-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                ) : translation.error ? (
                  <div className="flex items-center justify-center h-40 text-red-400">
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>{translation.error}</p>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="email-preview w-full overflow-auto max-h-[500px] prose prose-invert"
                    dangerouslySetInnerHTML={{ __html: translation.content }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};