// src/config/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
