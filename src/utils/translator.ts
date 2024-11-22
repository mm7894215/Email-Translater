import { toast } from 'react-hot-toast';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = 'sk-3a452b2f293f4d578bb39795ce0abc31';

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const translateHtml = async (
  htmlContent: string,
  targetLanguage: string
): Promise<string> => {
  const textParts: string[] = [];
  const htmlParts: string[] = [];
  
  let currentText = '';
  let inTag = false;
  let inScript = false;
  let inStyle = false;
  
  const processCurrentText = () => {
    if (currentText.trim() && !inScript && !inStyle) {
      textParts.push(currentText.trim());
      htmlParts.push(currentText);
    } else {
      htmlParts.push(currentText);
    }
    currentText = '';
  };
  
  for (let i = 0; i < htmlContent.length; i++) {
    if (htmlContent.substring(i, i + 7).toLowerCase() === '<script') {
      inScript = true;
    } else if (htmlContent.substring(i, i + 9).toLowerCase() === '</script>') {
      inScript = false;
    } else if (htmlContent.substring(i, i + 6).toLowerCase() === '<style') {
      inStyle = true;
    } else if (htmlContent.substring(i, i + 8).toLowerCase() === '</style>') {
      inStyle = false;
    }

    if (htmlContent[i] === '<') {
      processCurrentText();
      currentText = '<';
      inTag = true;
    } else if (htmlContent[i] === '>') {
      currentText += '>';
      htmlParts.push(currentText);
      currentText = '';
      inTag = false;
    } else {
      currentText += htmlContent[i];
    }
  }
  
  processCurrentText();

  // Batch translations to avoid rate limits (10 texts per request)
  const batchSize = 10;
  const translatedTexts: string[] = [];
  
  for (let i = 0; i < textParts.length; i += batchSize) {
    const batch = textParts.slice(i, i + batchSize);
    
    try {
      const prompt = `Translate the following text to ${targetLanguage}. Preserve any HTML entities and formatting. Only return the translated text, nothing else:\n\n${batch.join('\n')}`;
      
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate text to ${targetLanguage}. Preserve formatting and HTML entities. Only return the translated text.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error?.message || 
          `Translation failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json() as DeepSeekResponse;
      if (!data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid translation response format');
      }

      const translatedBatch = data.choices[0].message.content
        .trim()
        .split('\n')
        .map(line => line.trim())
        .filter(line => line);

      translatedTexts.push(...translatedBatch);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown translation error';
      console.error('Translation error:', errorMessage);
      toast.error(`Translation failed: ${errorMessage}`);
      translatedTexts.push(...batch); // Use original text if translation fails
    }

    // Add a small delay between batches to respect rate limits
    if (i + batchSize < textParts.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Reconstruct HTML with translated text
  let translatedHtml = '';
  let textIndex = 0;
  
  for (const part of htmlParts) {
    if (part.startsWith('<') && part.endsWith('>')) {
      translatedHtml += part;
    } else if (part.trim()) {
      translatedHtml += translatedTexts[textIndex++] || part;
    } else {
      translatedHtml += part;
    }
  }

  return translatedHtml;
};