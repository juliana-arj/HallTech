const SUPABASE_URL = 'https://icgnbeiitiybyzqpqsqo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZ25iZWlpdGl5Ynl6cXBxc3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMTI2MjEsImV4cCI6MjEwMTY4ODYyMX0.HpCnOdx6rajranqz8HPFzJYm_lZakuCtm0VYlMOkhMo';

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);