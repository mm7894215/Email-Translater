import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveTranslationRecord = async (userId: string, translation: string) => {
  try {
    const { data, error } = await supabase
      .from('translation_records')
      .insert([
        {
          user_id: userId,
          translation,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving translation record:', error);
    return null;
  }
};

export const saveApiKey = async (userId: string, apiKey: string) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: userId,
          api_key: apiKey,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving API key:', error);
    return null;
  }
};

export const getApiKey = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('api_key')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.api_key;
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
};
