import { useState, useEffect, useCallback, useRef } from 'react';
import Notification, { NotificationType } from './Notification';
import { TranslationConfig, TranslationProvider, createTranslationService } from '../services/translationServices';

interface Language {
  code: string;
  name: string;
}

interface LanguageSelectorProps {
  onLanguagesChange: (languages: string[]) => void;
  selectedLanguages: string[];
  disabled?: boolean;
  onFileConverted?: (htmlContent: string) => void;
  translationConfig?: TranslationConfig;
}

interface LanguageGroup {
  label: string;
  languages: Language[];
}

const languageGroups: LanguageGroup[] = [
  {
    label: 'Recently Used',
    languages: []
  },
  {
    label: 'Popular Languages',
    languages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' },
      { code: 'zh', name: '中文' },
    ]
  },
  {
    label: 'All Languages',
    languages: [
      { code: 'en', name: 'English' },
      { code: 'de', name: 'Deutsch' },
      { code: 'fr', name: 'Français' },
      { code: 'es', name: 'Español' },
      { code: 'it', name: 'Italiano' },
      { code: 'zh', name: '中文' },
      { code: 'ja', name: '日本語' },
      { code: 'ko', name: '한국어' },
      { code: 'ru', name: 'Русский' },
    ]
  }
];

interface NotificationState {
  message: string;
  type: NotificationType;
  show: boolean;
}

interface TranslationStatus {
  [key: string]: {
    status: 'pending' | 'completed' | 'error';
    progress?: number;
  };
}

interface FileConversionStatus {
  status: 'pending' | 'converting' | 'completed' | 'error';
  progress?: number;
  originalFile?: string;
  convertedFile?: string;
}

export const LanguageSelector = ({ 
  onLanguagesChange,
  selectedLanguages = [],
  disabled = false,
  onFileConverted,
  translationConfig = { provider: 'google' }
}: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [notification, setNotification] = useState<NotificationState>({
    message: '',
    type: 'info',
    show: false
  });
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [recentLanguages, setRecentLanguages] = useState<Language[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [fileStatus, setFileStatus] = useState<FileConversionStatus>({
    status: 'pending'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<TranslationConfig>(translationConfig);

  useEffect(() => {
    const recent = localStorage.getItem('recentLanguages');
    if (recent) {
      setRecentLanguages(JSON.parse(recent));
    }
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current && 
      !dropdownRef.current.contains(event.target as Node) &&
      !buttonRef.current?.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleClickOutside]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({
      message,
      type,
      show: true
    });
  };

  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      const isRemoving = selectedLanguages.includes(languageCode);
      const newSelectedLanguages = isRemoving
        ? selectedLanguages.filter(code => code !== languageCode)
        : [...selectedLanguages, languageCode];
      
      if (!isRemoving) {
        setTranslationStatus(prev => ({
          ...prev,
          [languageCode]: { status: 'pending', progress: 0 }
        }));

        if (!currentConfig.apiKey) {
          setShowApiKeyModal(true);
          return;
        }

        try {
          const translationService = createTranslationService(currentConfig);
          const result = await translationService.translate(
            'Your text to translate',
            languageCode
          );

          setTranslationStatus(prev => ({
            ...prev,
            [languageCode]: { status: 'completed', progress: 100 }
          }));

          const language = languageGroups[2].languages.find(lang => lang.code === languageCode);
          showNotification(`Translation completed for ${language?.name}`, 'success');
        } catch (error) {
          throw error;
        }
      }
      
      onLanguagesChange(newSelectedLanguages);
      localStorage.setItem('selectedLanguages', JSON.stringify(newSelectedLanguages));
      
    } catch (error) {
      console.error('Error selecting language:', error);
      setTranslationStatus(prev => ({
        ...prev,
        [languageCode]: { status: 'error' }
      }));
      showNotification(
        error instanceof Error ? error.message : 'Translation failed',
        'error'
      );
    }
  };

  const handleSelectAll = () => {
    try {
      const allLanguageCodes = languageGroups[2].languages.map(lang => lang.code);
      const newLanguages = allLanguageCodes.filter(
        code => !selectedLanguages.includes(code)
      );
      
      const newTranslationStatus = { ...translationStatus };
      newLanguages.forEach(code => {
        newTranslationStatus[code] = { status: 'pending', progress: 0 };
      });
      setTranslationStatus(newTranslationStatus);

      newLanguages.forEach(code => {
        new Promise<void>((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            if (progress <= 100) {
              setTranslationStatus(prev => ({
                ...prev,
                [code]: { status: 'pending', progress }
              }));
            } else {
              clearInterval(interval);
              resolve();
            }
          }, Math.random() * 500 + 300);
        }).then(() => {
          setTranslationStatus(prev => ({
            ...prev,
            [code]: { status: 'completed', progress: 100 }
          }));
          const language = languageGroups[2].languages.find(lang => lang.code === code);
          showNotification(`Translation completed for ${language?.name}`, 'success');
        });
      });
      
      onLanguagesChange(allLanguageCodes);
      localStorage.setItem('selectedLanguages', JSON.stringify(allLanguageCodes));
    } catch (error) {
      console.error('Error selecting all languages:', error);
      showNotification('Failed to select all languages', 'error');
    }
  };

  const handleClearAll = () => {
    try {
      onLanguagesChange([]);
      localStorage.setItem('selectedLanguages', JSON.stringify([]));
      showNotification('All languages cleared', 'success');
    } catch (error) {
      console.error('Error clearing languages:', error);
      showNotification('Failed to clear languages', 'error');
    }
  };

  const handleMultipleSelect = (languageCodes: string[]) => {
    try {
      const newSelectedLanguages = [...selectedLanguages];
      
      languageCodes.forEach(code => {
        if (!selectedLanguages.includes(code)) {
          newSelectedLanguages.push(code);
          handleLanguageSelect(code);
        }
      });
      
      onLanguagesChange(newSelectedLanguages);
      localStorage.setItem('selectedLanguages', JSON.stringify(newSelectedLanguages));
    } catch (error) {
      console.error('Error selecting multiple languages:', error);
      showNotification('Failed to select languages', 'error');
    }
  };

  const updateRecentLanguages = (languageCode: string) => {
    const language = languageGroups[2].languages.find(lang => lang.code === languageCode);
    if (!language) return;

    const newRecent = [
      language,
      ...recentLanguages.filter(lang => lang.code !== languageCode)
    ].slice(0, 3);

    setRecentLanguages(newRecent);
    localStorage.setItem('recentLanguages', JSON.stringify(newRecent));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.php')) {
      showNotification('Please upload a PHP file', 'error');
      return;
    }

    try {
      setFileStatus({
        status: 'converting',
        progress: 0,
        originalFile: file.name
      });

      const formData = new FormData();
      formData.append('file', file);

      const progressInterval = setInterval(() => {
        setFileStatus(prev => ({
          ...prev,
          progress: Math.min((prev.progress || 0) + 10, 90)
        }));
      }, 300);

      try {
        const response = await fetch('/api/convert-php', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Conversion failed');
        }

        const result = await response.json();
        clearInterval(progressInterval);

        setFileStatus({
          status: 'completed',
          progress: 100,
          originalFile: file.name,
          convertedFile: result.htmlFile
        });

        if (onFileConverted) {
          onFileConverted(result.htmlContent);
        }

        showNotification('File converted successfully', 'success');
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    } catch (error) {
      console.error('Error converting file:', error);
      setFileStatus({
        status: 'error',
        originalFile: file.name
      });
      showNotification('Failed to convert file', 'error');
    }
  };

  const renderLanguageItem = (language: Language) => (
    <li
      key={language.code}
      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 
        ${selectedLanguages.includes(language.code) ? 'bg-blue-50' : ''}
        transition-all duration-200 ease-in-out`}
      role="option"
      aria-selected={selectedLanguages.includes(language.code)}
      onClick={() => handleLanguageSelect(language.code)}
    >
      <div className="flex items-center justify-between w-full group">
        <div className="flex items-center gap-2">
          <span className="font-medium">{language.name}</span>
          <span className="text-xs text-gray-500">{language.code.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-3">
          {translationStatus[language.code]?.status === 'pending' && (
            <div className="flex items-center gap-2 min-w-[100px]">
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${translationStatus[language.code].progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 min-w-[40px]">
                {translationStatus[language.code].progress}%
              </span>
            </div>
          )}
          {translationStatus[language.code]?.status === 'completed' && (
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <input
            type="checkbox"
            checked={selectedLanguages.includes(language.code)}
            onChange={() => handleLanguageSelect(language.code)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 
              focus:ring-blue-500 transition-all duration-200"
            aria-label={`Select ${language.name}`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </li>
  );

  const renderLanguageGroup = (group: LanguageGroup) => {
    const filteredLanguages = group.languages.filter(lang =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredLanguages.length === 0) return null;

    return (
      <div key={group.label} className="py-2">
        <div className="px-4 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
          {group.label}
        </div>
        <ul>
          {filteredLanguages.map(renderLanguageItem)}
        </ul>
      </div>
    );
  };

  const renderFileUpload = () => (
    <button
      onClick={() => fileInputRef.current?.click()}
      className="p-1.5 text-sm text-blue-600 hover:text-blue-700
        hover:bg-blue-50 rounded-md transition-colors duration-200 relative"
      disabled={fileStatus.status === 'converting'}
      title="Upload PHP File"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".php"
        className="hidden"
        onChange={handleFileUpload}
      />
      <div className="flex items-center gap-1">
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        {fileStatus.status === 'converting' && (
          <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${fileStatus.progress}%` }}
            />
          </div>
        )}
        {fileStatus.status === 'completed' && (
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {(fileStatus.originalFile && fileStatus.status !== 'pending') && (
        <div className="absolute top-full right-0 mt-1 text-xs text-gray-500 whitespace-nowrap">
          {fileStatus.status === 'converting' ? 'Converting...' : 'Converted'}
        </div>
      )}
    </button>
  );

  const renderApiKeyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-medium mb-4">Translation Service Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider
            </label>
            <select
              className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={currentConfig.provider}
              onChange={(e) => setCurrentConfig(prev => ({
                ...prev,
                provider: e.target.value as TranslationProvider
              }))}
            >
              <option value="google">Google Translate</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              value={currentConfig.apiKey || ''}
              onChange={(e) => setCurrentConfig(prev => ({
                ...prev,
                apiKey: e.target.value
              }))}
              placeholder="Enter your API key"
            />
          </div>
          {currentConfig.provider === 'openai' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <select
                className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={currentConfig.model || 'gpt-3.5-turbo'}
                onChange={(e) => setCurrentConfig(prev => ({
                  ...prev,
                  model: e.target.value
                }))}
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
              </select>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            onClick={() => setShowApiKeyModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            onClick={() => {
              localStorage.setItem('translationConfig', JSON.stringify(currentConfig));
              setShowApiKeyModal(false);
              showNotification('Translation configuration saved', 'success');
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
      {showApiKeyModal && renderApiKeyModal()}
      <div className="relative language-selector" ref={dropdownRef}>
        <button
          ref={buttonRef}
          className={`flex items-center justify-between w-full px-4 py-2.5 text-sm border rounded-lg
            ${disabled ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'} 
            transition-all duration-200 ease-in-out
            ${selectedLanguages.length > 0 ? 'border-blue-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {selectedLanguages.length 
                ? `${selectedLanguages.length} languages selected`
                : 'Select Languages'}
            </span>
            {selectedLanguages.length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                {selectedLanguages.length}
              </span>
            )}
          </div>
          <svg 
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-80 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-3 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Translation Service</span>
                <button
                  className="text-sm text-blue-600 hover:text-blue-700"
                  onClick={() => setShowApiKeyModal(true)}
                >
                  Configure
                </button>
              </div>
              {renderFileUpload()}
            </div>

            <div className="p-3 border-b">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full px-4 py-2 pr-8 text-sm border rounded-md
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search languages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  className="absolute right-3 top-2.5 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {languageGroups.map(renderLanguageGroup)}
            </div>

            <div className="p-3 border-t bg-gray-50 flex justify-between">
              <button
                className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700
                  hover:bg-blue-50 rounded-md transition-colors duration-200"
                onClick={handleSelectAll}
              >
                Select All
              </button>
              <button
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700
                  hover:bg-red-50 rounded-md transition-colors duration-200"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LanguageSelector;