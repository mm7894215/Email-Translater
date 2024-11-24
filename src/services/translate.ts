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

interface TranslationItem extends Array<string> {
  0: string;
}

const googleTranslate = async (text: string, targetLang: string): Promise<string> => {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Translation failed');
    }
    
    const data = await response.json();
    return data[0].map((item: TranslationItem) => item[0]).join('');
  } catch (error) {
    console.error('Google Translate error:', error);
    throw new Error('Failed to translate using Google Translate');
  }
};

export const googleTranslateProvider: TranslationProvider = {
  name: 'google',
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

export const translateEmail = async (
  content: string,
  targetLanguage: string,
  provider: TranslationProvider = googleTranslateProvider
): Promise<string> => {
  try {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
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
    
    for (const node of textNodes) {
      if (node.textContent) {
        const translated = await provider.translate([node.textContent], targetLanguage);
        node.textContent = translated[0];
      }
    }
    
    return tempDiv.innerHTML;
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate email content');
  }
};
