import { Translate } from '@google-cloud/translate/build/src/v2';

interface TranslationResult {
  translatedHtml: string;
  error?: string;
}

const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`);
    if (!response.ok) {
      throw new Error('Translation API request failed');
    }
    const data = await response.json();
    return data[0][0][0];
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export const translateHtml = async (
  htmlContent: string,
  targetLanguage: string
): Promise<TranslationResult> => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const textNodes: Node[] = [];
    const walker = document.createTreeWalker(
      doc.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      const trimmedText = node.textContent?.trim();
      if (trimmedText && trimmedText.length > 0) {
        textNodes.push(node);
      }
    }

    for (const node of textNodes) {
      const text = node.textContent?.trim();
      if (text) {
        try {
          const translatedText = await translateText(text, targetLanguage);
          if (translatedText && translatedText !== text) {
            node.textContent = translatedText;
          }
        } catch (error) {
          console.error('Translation error for text:', text, error);
        }
      }
    }

    const translatedHtml = doc.body.innerHTML;
    return { translatedHtml };
  } catch (error) {
    console.error('Translation service error:', error);
    return { 
      translatedHtml: htmlContent,
      error: 'Failed to translate content' 
    };
  }
}; 