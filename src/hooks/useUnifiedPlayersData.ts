
import { usePlayersData } from './usePlayersData';
import { usePrivatePlayers } from './usePrivatePlayers';
import { Player } from '@/types/player';
import { useMemo } from 'react';

export const useUnifiedPlayersData = () => {
  const { data: publicPlayers = [], isLoading: publicLoading, error: publicError } = usePlayersData();
  const { privatePlayers = [], loading: privateLoading, error: privateError } = usePrivatePlayers();

  const data = useMemo(() => {
    // Transform private players to match Player interface
    const transformedPrivatePlayers: Player[] = privatePlayers.map(privatePlayer => ({
      id: privatePlayer.id,
      name: privatePlayer.name,
      club: privatePlayer.club || 'Unknown Club',
      age: privatePlayer.age || 0,
      positions: privatePlayer.positions || [],
      nationality: privatePlayer.nationality || 'Unknown',
      region: privatePlayer.region || 'Unknown',
      dateOfBirth: privatePlayer.date_of_birth || '',
      dominantFoot: privatePlayer.dominant_foot || 'Right',
      contractStatus: 'Private Player',
      contractExpiry: undefined,
      image: undefined,
      xtvScore: undefined,
      transferroomRating: undefined,
      futureRating: undefined,
      euGbeStatus: 'Unknown',
      recentForm: undefined,
      isPrivatePlayer: true,
      privatePlayerData: privatePlayer
    }));

    // Combine public and private players
    return [...publicPlayers, ...transformedPrivatePlayers];
  }, [publicPlayers, privatePlayers]);

  const isLoading = publicLoading || privateLoading;
  const error = publicError || privateError;

  return { data, isLoading, error };
};
