
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { getTeamLogoUrl } from '@/utils/teamLogos';

export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    console.log('Fetching profile for user:', userId);
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
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
      role: profile.role as 'scout' | 'recruitment' | 'director',
        club: {
          id: 'chelsea',
          name: 'Chelsea F.C.',
          league: 'Premier League',
          country: 'England',
          logo_url: getTeamLogoUrl('Chelsea F.C.')
        }
      };
      
      return profileData;
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
  }
  return null;
};
