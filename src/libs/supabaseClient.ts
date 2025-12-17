import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://adjdakyfzbxxzoyziydb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkamRha3lmemJ4eHpveXppeWRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTQ2MDIsImV4cCI6MjA4MTQ3MDYwMn0.mgmydlFmroUW__9fNtqEtqtEEa8Xp7NyTCYPW1Vc9S4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);