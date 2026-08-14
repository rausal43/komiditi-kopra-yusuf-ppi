import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vlvzoxlwlyvvdxcglgfs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsdnpveGx3bHl2dmR4Y2dsZ2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2OTIzNDgsImV4cCI6MjEwMjI2ODM0OH0.PQbVbugs0ZzygKLrTYHcMCQ_1XsHQTwbNjnd1mwGGKI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
