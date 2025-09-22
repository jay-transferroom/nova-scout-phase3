
import { useMemo } from "react";
import { Player } from "@/types/player";

export const useSquadData = (clubPlayers: Player[], selectedSquad: string) => {
  // Filter players based on squad selection
  const squadPlayers = useMemo(() => {
    switch (selectedSquad) {
      case 'first-team':
        return clubPlayers.filter(player => 
          player.club === 'Chelsea FC' || 
          (player.club?.includes('Chelsea') && !player.club?.includes('U21') && !player.club?.includes('U18'))
        );
      
      case 'shadow-squad':
        // Shadow squad: backup players from first team, excluding the top 11
        const firstTeamPlayers = clubPlayers.filter(player => 
          player.club === 'Chelsea FC' || 
          (player.club?.includes('Chelsea') && !player.club?.includes('U21') && !player.club?.includes('U18'))
        );
        
        // Sort by rating and exclude top 11
        const sortedPlayers = firstTeamPlayers.sort((a, b) => {
          const ratingA = a.transferroomRating || a.xtvScore || 0;
          const ratingB = b.transferroomRating || b.xtvScore || 0;
          return ratingB - ratingA;
        });
        
        return sortedPlayers.slice(11); // Return players beyond the top 11
      
      case 'u21':
        return clubPlayers.filter(player => player.club?.includes('U21'));
      
      case 'u18':
        return clubPlayers.filter(player => player.club?.includes('U18'));
      
      case 'on-loan':
        return clubPlayers.filter(player => 
          player.club !== 'Chelsea FC' && 
          !player.club?.includes('Chelsea') &&
          player.club !== 'Unknown'
        );
      
      default:
        return clubPlayers;
    }
  }, [clubPlayers, selectedSquad]);

  return { squadPlayers };
};
