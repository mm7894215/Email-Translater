import React, { useState, useEffect } from 'react';
import { translateHtml } from '../services/translationService';
import { LanguageSelector } from './LanguageSelector';

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

  // 当 htmlContent 改变时更新原始预览
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
        newTranslations[language] = {
          language,
          content: translatedHtml,
          isLoading: false,
          error: error || null
        };
        setTranslations({ ...newTranslations });
      } catch (err) {
        console.error('Translation failed:', err);
        newTranslations[language] = {
          language,
          content: '',
          isLoading: false,
          error: 'Translation failed'
        };
        setTranslations({ ...newTranslations });
      }
    }

    setIsTranslating(false);
    onTranslated?.(Object.fromEntries(
      Object.entries(newTranslations).map(([key, value]) => [key, value.content])
    ));
  };

  // 如果没有内容，显示提示信息
  if (!htmlContent) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Email Preview</h2>
          <p className="text-sm text-gray-500 mt-1">Upload an HTML email to start</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No email content to preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Email Preview</h2>
            <p className="text-sm text-gray-500 mt-1">Select languages and preview translations</p>
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
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors
                whitespace-nowrap"
              onClick={handleTranslate}
              disabled={isTranslating || selectedLanguages.length === 0}
            >
              {isTranslating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Translating...
                </span>
              ) : 'Translate'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.entries(translations).map(([key, translation]) => (
            <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-medium text-gray-800">
                  {key === 'original' ? 'Original' : translation.language.toUpperCase()}
                </h3>
                <button
                  className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md
                    transition-colors"
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                  </div>
                ) : translation.error ? (
                  <div className="flex items-center justify-center h-40 text-red-500">
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>{translation.error}</p>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="email-preview w-full overflow-auto max-h-[500px]"
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