
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
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
      const profileData: Profile = {
        ...profile,
        role: profile.role as 'scout' | 'recruitment',
        club: profile.clubs || { 
          id: 'chelsea', 
          name: 'Chelsea F.C.', 
          league: 'Premier League', 
          country: 'England', 
          logo_url: 'https://logos-world.net/wp-content/uploads/2020/06/Chelsea-Logo.png' 
        }
      };
      
      return profileData;
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
  }
  return null;
};
