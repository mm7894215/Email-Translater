import { translate } from '@vitalets/google-translate-api';

export interface TranslationResult {
  text: string;
  from: {
    language: {
      iso: string;
    };
  };
}

export interface TranslationProvider {
  translate: (text: string[], targetLang: string) => Promise<string[]>;
  name: string;
  requiresKey: boolean;
}

const googleTranslate = async (text: string, targetLang: string): Promise<string> => {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Translation failed');
    }
    
    const data = await response.json();
    return data[0].map((item: any[]) => item[0]).join('');
  } catch (error) {
    console.error('Google Translate error:', error);
    throw new Error('Failed to translate using Google Translate');
  }
};

export const googleTranslateProvider: TranslationProvider = {
  name: 'Google Translate (Free)',
  requiresKey: false,
  translate: async (texts: string[], targetLang: string) => {
    const results = await Promise.all(
      texts.map(async (text) => {
        try {
          const result = await googleTranslate(text, targetLang);
          return result;
        } catch (error) {
          console.error('Google translation error:', error);
          throw error;
        }
      })
    );
    return results;
  },
};

export const deeplTranslateProvider: TranslationProvider = {
  name: 'DeepL',
  requiresKey: true,
  translate: async (texts: string[], targetLang: string, apiKey?: string) => {
    if (!apiKey) {
      throw new Error('DeepL API key is required');
    }

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: texts,
        target_lang: targetLang,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepL translation failed: ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    return data.translations.map((t: { text: string }) => t.text);
  },
};

// 语言代码映射
export const languageCodeMap = {
  'zh-CN': {
    google: 'zh-CN',
    deepl: 'zh',
  },
  'ja': {
    google: 'ja',
    deepl: 'ja',
  },
  'ko': {
    google: 'ko',
    deepl: 'ko',
  },
  'es': {
    google: 'es',
    deepl: 'es',
  },
  'fr': {
    google: 'fr',
    deepl: 'fr',
  },
  'de': {
    google: 'de',
    deepl: 'de',
  },
};

export const translateEmail = async (html: string, targetLang: string): Promise<string> => {
  try {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // 提取所有文本节点
    const textNodes: Node[] = [];
    const walk = document.createTreeWalker(
      tempDiv,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    while ((node = walk.nextNode())) {
      const text = node.textContent?.trim();
      if (text) {
        textNodes.push(node);
      }
    }
    
    // 翻译所有文本
    for (const node of textNodes) {
      if (node.textContent) {
        const translated = await googleTranslate(node.textContent, targetLang);
        node.textContent = translated;
      }
    }
    
    return tempDiv.innerHTML;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate email content');
  }
};
