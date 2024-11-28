import { v2 } from '@google-cloud/translate';
const { Translate } = v2;
type TranslateType = InstanceType<typeof Translate>;

interface TranslationResult {
  translatedHtml: string;
  error?: string;
}

export class TranslationService {
  private translate: TranslateType;

  constructor() {
    this.translate = new Translate({
      projectId: import.meta.env.VITE_GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: import.meta.env.VITE_GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: import.meta.env.VITE_GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    });
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const [translation] = await this.translate.translate(text, targetLanguage);
      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  async translateHtml(
    htmlContent: string,
    targetLanguage: string
  ): Promise<TranslationResult> {
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
            const translatedText = await this.translateText(text, targetLanguage);
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
  }
} 