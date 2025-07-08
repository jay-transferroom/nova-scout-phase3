
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
      if (!playerId) {
        console.log('useReportPlayerData: playerId is undefined or null');
        return null;
      }

      console.log('useReportPlayerData: Fetching player data for ID:', playerId);

      // Check if the ID is numeric (from players_new table)
      if (/^\d+$/.test(playerId)) {
        console.log('useReportPlayerData: Fetching from players_new table');
        const { data, error } = await supabase
          .from('players_new')
          .select('*')
          .eq('id', parseInt(playerId))
          .single();

        if (error) {
          console.error('Error fetching player from players_new:', error);
          return null;
        }

        if (!data) {
          console.log('useReportPlayerData: No player found in players_new table');
          return null;
        }

        const player = data as PlayerNewRecord;
        console.log('useReportPlayerData: Found player in players_new:', player);

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
        // UUID format - check players table first, then private_players
        console.log('useReportPlayerData: Fetching from players table');
        const { data: playersData, error: playersError } = await supabase
          .from('players')
          .select('*')
          .eq('id', playerId)
          .maybeSingle();

        if (playersError) {
          console.error('Error fetching player from players:', playersError);
        }

        if (playersData) {
          console.log('useReportPlayerData: Found player in players:', playersData);
          return {
            id: playersData.id,
            name: playersData.name,
            club: playersData.club,
            age: playersData.age,
            dateOfBirth: playersData.date_of_birth,
            positions: playersData.positions,
            dominantFoot: playersData.dominant_foot as 'Left' | 'Right' | 'Both',
            nationality: playersData.nationality,
            contractStatus: playersData.contract_status as 'Free Agent' | 'Under Contract' | 'Loan' | 'Youth Contract',
            contractExpiry: playersData.contract_expiry,
            region: playersData.region,
            image: playersData.image_url,
            xtvScore: playersData.xtv_score,
            transferroomRating: playersData.transferroom_rating,
            futureRating: playersData.future_rating,
            recentForm: undefined,
          };
        }

        // If not found in players table, check private_players table
        console.log('useReportPlayerData: Player not found in players table, checking private_players');
        const { data: privatePlayerData, error: privatePlayerError } = await supabase
          .from('private_players')
          .select('*')
          .eq('id', playerId)
          .maybeSingle();

        if (privatePlayerError) {
          console.error('Error fetching private player:', privatePlayerError);
          return null;
        }

        if (privatePlayerData) {
          console.log('useReportPlayerData: Found private player:', privatePlayerData);
          return {
            id: privatePlayerData.id,
            name: privatePlayerData.name,
            club: privatePlayerData.club || 'Unknown',
            age: privatePlayerData.age || 0,
            dateOfBirth: privatePlayerData.date_of_birth || '',
            positions: privatePlayerData.positions || [],
            dominantFoot: (privatePlayerData.dominant_foot as 'Left' | 'Right' | 'Both') || 'Right',
            nationality: privatePlayerData.nationality || 'Unknown',
            contractStatus: 'Private Player' as any,
            contractExpiry: null,
            region: privatePlayerData.region || 'Unknown',
            image: undefined,
            xtvScore: undefined,
            transferroomRating: undefined,
            futureRating: undefined,
            recentForm: undefined,
            isPrivatePlayer: true,
          };
        }

        console.log('useReportPlayerData: No player found in any table');
        return null;
      }
    },
    enabled: !!playerId,
  });
};
