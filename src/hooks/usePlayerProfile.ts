
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types/player";
import { ReportWithPlayer } from "@/types/report";

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

export const usePlayerProfile = (playerId?: string) => {
  const { data: player, isLoading, error } = useQuery({
    queryKey: ['player', playerId],
    queryFn: async (): Promise<Player | null> => {
      if (!playerId) return null;

      console.log('Fetching player with ID:', playerId);

      const { data, error } = await supabase
        .from('players_new')
        .select('*')
        .eq('id', parseInt(playerId))
        .single();

      if (error) {
        console.error('Error fetching player:', error);
        throw error;
      }

      if (!data) return null;

      const playerRecord = data as PlayerNewRecord;

      // Transform the data to match our Player interface
      return {
        id: playerRecord.id.toString(),
        name: playerRecord.name,
        club: playerRecord.currentteam || playerRecord.parentteam || 'Unknown',
        age: playerRecord.age || 0,
        dateOfBirth: playerRecord.birthdate || '',
        positions: [playerRecord.firstposition, playerRecord.secondposition].filter(Boolean) as string[],
        dominantFoot: 'Right' as const, // Default since not available in players_new
        nationality: playerRecord.firstnationality || 'Unknown',
        contractStatus: 'Under Contract' as const, // Default since not available in players_new
        contractExpiry: playerRecord.contractexpiration,
        region: 'Europe', // Default since not available in players_new
        image: playerRecord.imageurl,
        xtvScore: playerRecord.xtv,
        transferroomRating: playerRecord.rating,
        futureRating: playerRecord.potential,
        euGbeStatus: 'Pass' as const, // All current Premier League players have Pass status
        recentForm: undefined, // Not available in players_new
      };
    },
    enabled: !!playerId,
  });

  // Fetch reports for this player - try both the integer ID and player name
  const { data: playerReports, isLoading: reportsLoading } = useQuery({
    queryKey: ['player-reports', playerId, player?.name],
    queryFn: async (): Promise<ReportWithPlayer[]> => {
      if (!playerId || !player) return [];

      console.log('Fetching reports for player:', { playerId, playerName: player.name });

      // Try to find reports by player_id (could be stored as string version of integer ID or player name)
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          scout_profile:profiles(*)
        `)
        .or(`player_id.eq.${playerId},player_id.ilike.${player.name}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching player reports:', error);
        return [];
      }

      console.log('Found reports for player:', data?.length || 0);

      // Transform the data to match our ReportWithPlayer interface
      const transformedReports: ReportWithPlayer[] = (data || []).map((report: any) => {
        // Parse sections if it's a string
        let sections = report.sections;
        if (typeof sections === 'string') {
          try {
            sections = JSON.parse(sections);
          } catch (e) {
            console.log(`Failed to parse sections for report ${report.id}:`, e);
            sections = [];
          }
        }

        // Parse match_context if it's a string
        let matchContext = report.match_context;
        if (typeof matchContext === 'string') {
          try {
            matchContext = JSON.parse(matchContext);
          } catch (e) {
            console.log(`Failed to parse match_context for report ${report.id}:`, e);
            matchContext = null;
          }
        }

        return {
          id: report.id,
          playerId: report.player_id,
          templateId: report.template_id,
          scoutId: report.scout_id,
          createdAt: new Date(report.created_at),
          updatedAt: new Date(report.updated_at),
          status: report.status as 'draft' | 'submitted' | 'reviewed',
          sections: Array.isArray(sections) ? sections : [],
          matchContext: matchContext,
          tags: report.tags || [],
          flaggedForReview: report.flagged_for_review || false,
          player: player, // Include the player data
          scoutProfile: report.scout_profile,
        };
      });

      return transformedReports;
    },
    enabled: !!playerId && !!player,
  });

  return {
    player,
    isLoading,
    error,
    playerReports: playerReports || [],
    reportsLoading,
  };
};
