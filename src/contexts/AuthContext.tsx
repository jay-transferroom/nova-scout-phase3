
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Club {
  id: string;
  name: string;
  league: string | null;
  country: string | null;
  logo_url: string | null;
}

interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'scout' | 'recruitment';
  club_id?: string;
  club?: Club;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          clubs (
            id,
            name,
            league,
            country,
            logo_url
          )
        `)
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      console.log('Profile data:', profile);
      
      if (profile) {
        const profileData = {
          ...profile,
          role: profile.role as 'scout' | 'recruitment',
          club: profile.clubs || undefined
        };
        
        setProfile(profileData);
        
        // Initialize default permissions for recruitment role if they don't exist
        if (profile.role === 'recruitment') {
          await ensureDefaultPermissions(userId);
        }
        
        return profileData;
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
    return null;
  };

  const ensureDefaultPermissions = async (userId: string) => {
    try {
      // Check if user already has permissions
      const { data: existingPermissions } = await supabase
        .from('user_permissions')
        .select('permission')
        .eq('user_id', userId);

      const defaultPermissions = [
        'dashboard', 'reports', 'requirements', 'pitches', 
        'scouting_tasks', 'upcoming_matches', 'data_import',
        'templates', 'user_management'
      ];

      const existingPermissionNames = existingPermissions?.map(p => p.permission) || [];
      const missingPermissions = defaultPermissions.filter(p => !existingPermissionNames.includes(p));

      if (missingPermissions.length > 0) {
        console.log('Creating missing permissions for recruitment user:', missingPermissions);
        
        const permissionsToInsert = missingPermissions.map(permission => ({
          user_id: userId,
          permission,
          enabled: true
        }));

        const { error } = await supabase
          .from('user_permissions')
          .insert(permissionsToInsert);

        if (error) {
          console.error('Error creating default permissions:', error);
        } else {
          console.log('Default permissions created successfully');
        }
      }
    } catch (error) {
      console.error('Error ensuring default permissions:', error);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile with club information
          setTimeout(async () => {
            await fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
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

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
