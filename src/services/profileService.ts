
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
      // If no club is assigned, try to find Chelsea or default to first available club
      let clubData = profile.clubs;
      
      if (!clubData) {
        console.log('No club assigned to user, looking for Chelsea or default club...');
        
        // First try to find Chelsea
        const { data: chelseaClub } = await supabase
          .from('clubs')
          .select('*')
          .ilike('name', '%chelsea%')
          .single();
        
        if (chelseaClub) {
          clubData = chelseaClub;
          console.log('Found Chelsea club:', chelseaClub);
        } else {
          // Fallback to any English club or first club available
          const { data: fallbackClub } = await supabase
            .from('clubs')
            .select('*')
            .eq('country', 'England')
            .limit(1)
            .single();
          
          if (fallbackClub) {
            clubData = fallbackClub;
            console.log('Using fallback English club:', fallbackClub);
          } else {
            // Ultimate fallback - any club
            const { data: anyClub } = await supabase
              .from('clubs')
              .select('*')
              .limit(1)
              .single();
            
            clubData = anyClub || {
              id: 'default',
              name: 'Chelsea F.C.',
              league: 'Premier League',
              country: 'England',
              logo_url: 'https://logos-world.net/wp-content/uploads/2020/06/Chelsea-Logo.png'
            };
          }
        }
      }
      
      const profileData: Profile = {
        ...profile,
        role: profile.role as 'scout' | 'recruitment',
        club: clubData
      };
      
      return profileData;
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
  }
  return null;
};
