
import { supabase } from '@/integrations/supabase/client';

export const signUpUser = async (
  email: string, 
  password: string, 
  firstName?: string, 
  lastName?: string
) => {
  // Use the correct published Lovable URL for email confirmations
  const redirectUrl = 'https://transferroom-scout.lovable.app/';
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    }
  });
  return { error };
};

export const signInUser = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { error };
};

export const signOutUser = async () => {
  await supabase.auth.signOut();
};
