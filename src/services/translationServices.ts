export type TranslationProvider = 'google' | 'openai' | 'custom';

export interface TranslationConfig {
  provider: TranslationProvider;
  apiKey?: string;
  model?: string; // 用于 OpenAI
  customEndpoint?: string; // 用于自定义服务
}

export interface TranslationService {
  translate: (text: string, targetLang: string) => Promise<string>;
  name: string;
  requiresApiKey: boolean;
}

class GoogleTranslationService implements TranslationService {
  private apiKey?: string;
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  name = 'Google Translate';
  requiresApiKey = true;

  async translate(text: string, targetLang: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Google Translate API key is required');
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLang,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  }
}

class OpenAITranslationService implements TranslationService {
  private apiKey?: string;
  private model: string;

  constructor(apiKey?: string, model = 'gpt-3.5-turbo') {
    this.apiKey = apiKey;
    this.model = model;
  }

  name = 'OpenAI';
  requiresApiKey = true;

  async translate(text: string, targetLang: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are a translator. Translate the following text to ${targetLang}. Provide only the translation without any additional text.`
          },
          {
            role: 'user',
            content: text
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
}

export const createTranslationService = (config: TranslationConfig): TranslationService => {
  switch (config.provider) {
    case 'google':
      return new GoogleTranslationService(config.apiKey);
    case 'openai':
      return new OpenAITranslationService(config.apiKey, config.model);
    default:
      throw new Error('Unsupported translation provider');
  }
}; 