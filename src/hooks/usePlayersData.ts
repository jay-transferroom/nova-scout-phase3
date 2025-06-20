
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types/player";

interface PlayerWithForm {
  id: string;
  name: string;
  club: string;
  age: number;
  date_of_birth: string;
  positions: string[];
  dominant_foot: 'Left' | 'Right' | 'Both';
  nationality: string;
  contract_status: 'Free Agent' | 'Under Contract' | 'Loan' | 'Youth Contract';
  contract_expiry: string | null;
  region: string;
  image_url: string | null;
  xtv_score: number | null;
  transferroom_rating: number | null;
  future_rating: number | null;
  player_recent_form: Array<{
    matches: number;
    goals: number;
    assists: number;
    rating: number;
  }> | null;
}

export const usePlayersData = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: async (): Promise<Player[]> => {
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
        `);

      if (error) {
        console.error('Error fetching players:', error);
        throw error;
      }

      // Transform the data to match our Player interface
      return (data as PlayerWithForm[]).map((player) => ({
        id: player.id,
        name: player.name,
        club: player.club,
        age: player.age,
        dateOfBirth: player.date_of_birth,
        positions: player.positions,
        dominantFoot: player.dominant_foot,
        nationality: player.nationality,
        contractStatus: player.contract_status,
        contractExpiry: player.contract_expiry,
        region: player.region,
        image: player.image_url,
        xtvScore: player.xtv_score,
        transferroomRating: player.transferroom_rating,
        futureRating: player.future_rating,
        recentForm: player.player_recent_form?.[0] ? {
          matches: player.player_recent_form[0].matches,
          goals: player.player_recent_form[0].goals,
          assists: player.player_recent_form[0].assists,
          rating: player.player_recent_form[0].rating,
        } : undefined,
      }));
    },
  });
};
