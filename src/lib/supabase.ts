import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://souwryoqplminhjtayas.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvdXdyeW9xcGxtaW5oanRheWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTk2NzcsImV4cCI6MjA5MjUzNTY3N30.uStt1VNwypKuD91IrrtbvOPfq6YgL4bslFZNBNCDD7I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
