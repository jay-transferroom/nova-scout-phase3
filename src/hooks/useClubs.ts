
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
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
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
