
import { useQuery } from "@tanstack/react-query";
import { usePlayersData } from "./usePlayersData";
import { usePrivatePlayers } from "./usePrivatePlayers";
import { Player } from "@/types/player";
import { PrivatePlayer } from "@/types/privatePlayer";

// Transform private player to regular player format
const transformPrivatePlayerToPlayer = (privatePlayer: PrivatePlayer): Player => ({
  id: `private-${privatePlayer.id}`, // Prefix to distinguish from regular players
  name: privatePlayer.name,
  club: privatePlayer.club || 'Unknown',
  age: privatePlayer.age || 0,
  dateOfBirth: privatePlayer.date_of_birth || '',
  positions: privatePlayer.positions || [],
  dominantFoot: privatePlayer.dominant_foot || 'Right',
  nationality: privatePlayer.nationality || 'Unknown',
  contractStatus: 'Under Contract',
  contractExpiry: undefined,
  region: privatePlayer.region || 'Unknown',
  image: undefined,
  xtvScore: undefined,
  transferroomRating: undefined,
  futureRating: undefined,
  euGbeStatus: 'Pass',
  recentForm: undefined,
  // Add metadata to identify as private player
  isPrivatePlayer: true,
  privatePlayerData: privatePlayer
});

export const useUnifiedPlayersData = () => {
  const { data: regularPlayers = [], isLoading: regularLoading, error: regularError } = usePlayersData();
  const { privatePlayers = [], loading: privateLoading, error: privateError } = usePrivatePlayers();

  return useQuery({
    queryKey: ['unified-players', regularPlayers, privatePlayers],
    queryFn: () => {
      // Transform private players to match Player interface
      const transformedPrivatePlayers = privatePlayers.map(transformPrivatePlayerToPlayer);
      
      // Combine both arrays
      const allPlayers = [...regularPlayers, ...transformedPrivatePlayers];
      
      console.log('Unified players:', {
        regularCount: regularPlayers.length,
        privateCount: privatePlayers.length,
        totalCount: allPlayers.length
      });
      
      return allPlayers;
    },
    enabled: !regularLoading && !privateLoading,
  });
};
