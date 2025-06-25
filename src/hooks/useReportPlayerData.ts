
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types/player";

interface PlayerNewRecord {
  id: number;
  name: string;
  currentteam: string | null;
  parentteam: string | null;
  age: number | null;
  birthdate: string | null;
  firstposition: string | null;
  secondposition: string | null;
  firstnationality: string | null;
  secondnationality: string | null;
  contractexpiration: string | null;
  imageurl: string | null;
  xtv: number | null;
  rating: number | null;
  potential: number | null;
  basevalue: number | null;
}

export const useReportPlayerData = (playerId?: string) => {
  return useQuery({
    queryKey: ['report-player', playerId],
    queryFn: async (): Promise<Player | null> => {
      if (!playerId) return null;

      // Check if the ID is numeric (from players_new table)
      if (/^\d+$/.test(playerId)) {
        const { data, error } = await supabase
          .from('players_new')
          .select('*')
          .eq('id', parseInt(playerId))
          .single();

        if (error) {
          console.error('Error fetching player from players_new:', error);
          return null;
        }

        if (!data) return null;

        const player = data as PlayerNewRecord;

        // Transform the data to match our Player interface
        return {
          id: player.id.toString(),
          name: player.name,
          club: player.currentteam || player.parentteam || 'Unknown',
          age: player.age || 0,
          dateOfBirth: player.birthdate || '',
          positions: [player.firstposition, player.secondposition].filter(Boolean) as string[],
          dominantFoot: 'Right' as const,
          nationality: player.firstnationality || 'Unknown',
          contractStatus: 'Under Contract' as const,
          contractExpiry: player.contractexpiration,
          region: 'Europe',
          image: player.imageurl,
          xtvScore: player.xtv,
          transferroomRating: player.rating,
          futureRating: player.potential,
          recentForm: undefined,
        };
      } else {
        // UUID format - check players table
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('id', playerId)
          .single();

        if (error) {
          console.error('Error fetching player from players:', error);
          return null;
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
          recentForm: undefined,
        };
      }
    },
    enabled: !!playerId,
  });
};
