
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types/player";

export const usePlayerData = (playerId?: string) => {
  return useQuery({
    queryKey: ['player', playerId],
    queryFn: async (): Promise<Player | null> => {
      if (!playerId) return null;
      
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          player_recent_form (
            matches,
            goals,
            assists,
            rating
          )
        `)
        .eq('id', playerId)
        .single();

      if (error) {
        console.error('Error fetching player:', error);
        throw error;
      }

      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        club: data.club,
        age: data.age,
        dateOfBirth: data.date_of_birth,
        positions: data.positions,
        dominantFoot: data.dominant_foot as 'Left' | 'Right' | 'Both',
        nationality: data.nationality,
        contractStatus: data.contract_status as 'Free Agent' | 'Under Contract' | 'Loan' | 'Youth Contract',
        contractExpiry: data.contract_expiry,
        region: data.region,
        image: data.image_url,
        xtvScore: data.xtv_score,
        transferroomRating: data.transferroom_rating,
        futureRating: data.future_rating,
        recentForm: data.player_recent_form?.[0] ? {
          matches: data.player_recent_form[0].matches,
          goals: data.player_recent_form[0].goals,
          assists: data.player_recent_form[0].assists,
          rating: data.player_recent_form[0].rating,
        } : undefined,
      };
    },
    enabled: !!playerId,
  });
};
