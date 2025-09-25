
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Club {
  id: string;
  name: string;
  league: string | null;
  country: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useClubs = () => {
  return useQuery({
    queryKey: ['clubs'],
    queryFn: async (): Promise<Club[]> => {
      // Since clubs table doesn't exist, return hardcoded Chelsea data
      return [{
        id: 'chelsea',
        name: 'Chelsea F.C.',
        league: 'Premier League',
        country: 'England',
        logo_url: 'https://logos-world.net/wp-content/uploads/2020/06/Chelsea-Logo.png',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    },
  });
};

export const useUpdateUserClub = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, clubId }: { userId: string; clubId: string | null }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ club_id: clubId })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
