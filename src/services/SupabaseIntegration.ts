import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://tobysgkjumsftgcyjctn.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvYnlzZ2tqdW1zZnRnY3lqY3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzMTg3MTIsImV4cCI6MjA0Nzg5NDcxMn0.X0FmCTnUUONz58kmiuaHshbidnULNL2lwwbckN5XxpE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveTranslationRecord = async (userId: string, translation: string) => {
    const { data, error } = await supabase
        .from('translation_records')
        .insert([{ user_id: userId, translation }]);
    if (error) console.error('Error saving translation record:', error);
    return data;
};

export const saveApiKey = async (userId: string, apiKey: string) => {
    const { data, error } = await supabase
        .from('user_settings')
        .upsert({ user_id: userId, api_key: apiKey });
    if (error) console.error('Error saving API key:', error);
    return data;
};

export default supabase;
