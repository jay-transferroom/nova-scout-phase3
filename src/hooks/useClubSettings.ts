import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ClubSettings {
  id: string;
  club_name: string;
  formation: string;
  style_of_play?: string;
  philosophy?: string;
  created_at: string;
  updated_at: string;
  created_by_user_id?: string;
}

export const useClubSettings = (clubName: string) => {
  return useQuery({
    queryKey: ['club-settings', clubName],
    queryFn: async (): Promise<ClubSettings | null> => {
      const { data, error } = await supabase
        .from('club_settings')
        .select('*')
        .eq('club_name', clubName)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateClubSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: Partial<ClubSettings> & { club_name: string }) => {
      const { error } = await supabase
        .from('club_settings')
        .upsert(settings)
        .select()
        .single();
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      // Invalidate multiple queries to ensure the UI updates
      queryClient.invalidateQueries({ queryKey: ['club-settings', variables.club_name] });
      queryClient.invalidateQueries({ queryKey: ['club-settings'] });
    },
  });
};