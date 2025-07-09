
import { User, Session } from '@supabase/supabase-js';

export interface Club {
  id: string;
  name: string;
  league: string | null;
  country: string | null;
  logo_url: string | null;
}

export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'scout' | 'recruitment' | 'director';
  club_id?: string;
  club?: Club;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}
