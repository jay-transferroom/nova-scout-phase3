import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types/player";
import { ReportWithPlayer } from "@/types/report";

export const usePrivatePlayerProfile = (playerId?: string) => {
  // Fetch private player data
  const { data: player, isLoading, error } = useQuery({
    queryKey: ['private-player', playerId],
    queryFn: async (): Promise<Player | null> => {
      if (!playerId) return null;

      console.log('Fetching private player with ID:', playerId);

      const { data, error } = await supabase
        .from('private_players')
        .select('*')
        .eq('id', playerId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching private player:', error);
        throw error;
      }

      if (!data) return null;

      console.log('Found private player:', data);

      // Transform to match Player interface
      return {
        id: data.id,
        name: data.name,
        club: data.club || 'Unknown',
        age: data.age || 0,
        dateOfBirth: data.date_of_birth || '',
        positions: data.positions || [],
        dominantFoot: (data.dominant_foot as 'Left' | 'Right' | 'Both') || 'Right',
        nationality: data.nationality || 'Unknown',
        contractStatus: 'Private Player' as any,
        contractExpiry: undefined,
        region: data.region || 'Unknown',
        image: undefined,
        xtvScore: undefined,
        transferroomRating: undefined,
        futureRating: undefined,
        euGbeStatus: 'Unknown',
        recentForm: undefined,
        isPrivatePlayer: true,
        // Include private player specific data
        notes: data.notes,
        source_context: data.source_context,
      };
    },
    enabled: !!playerId,
  });

  // Fetch reports for this private player
  const { data: playerReports, isLoading: reportsLoading } = useQuery({
    queryKey: ['private-player-reports', playerId],
    queryFn: async (): Promise<ReportWithPlayer[]> => {
      if (!playerId || !player) return [];

      console.log('usePrivatePlayerProfile: Fetching reports for private player:', { playerId, playerName: player.name });

      // Find reports by the private player's UUID
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          scout_profile:profiles(*)
        `)
        .eq('player_id', playerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('usePrivatePlayerProfile: Error fetching private player reports:', error);
        return [];
      }

      console.log('usePrivatePlayerProfile: Found reports for private player:', data?.length || 0, data);

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
          player: player, // Include the private player data
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