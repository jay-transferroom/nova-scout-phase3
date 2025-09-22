
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
        // Shadow squad: backup players from first team, excluding the leading player per position
        const firstTeamPlayers = clubPlayers.filter(player => 
          player.club === 'Chelsea FC' || 
          (player.club?.includes('Chelsea') && !player.club?.includes('U21') && !player.club?.includes('U18'))
        );
        
        // Get the leading players for each position to exclude from shadow squad
        const positions = ['GK', 'LB', 'CB', 'RB', 'CM', 'W', 'F'];
        const leadingPlayerIds = new Set();
        
        positions.forEach(position => {
          const positionPlayers = firstTeamPlayers.filter(player => 
            player.positions.some(pos => {
              if (position === 'W') return pos === 'W' || pos === 'LW' || pos === 'RW' || pos === 'LM' || pos === 'RM';
              if (position === 'F') return pos === 'F' || pos === 'FW' || pos === 'ST' || pos === 'CF';
              return pos === position || (position === 'CB' && pos === 'CB') || (position === 'CM' && (pos === 'CM' || pos === 'CDM' || pos === 'CAM'));
            })
          );
          
          const sortedPosition = positionPlayers.sort((a, b) => {
            const ratingA = a.transferroomRating || a.xtvScore || 0;
            const ratingB = b.transferroomRating || b.xtvScore || 0;
            return ratingB - ratingA;
          });
          
          // For CB, we need to exclude the top 2 players, for other positions just the top 1
          const numToExclude = position === 'CB' ? 2 : 1;
          sortedPosition.slice(0, numToExclude).forEach(player => {
            leadingPlayerIds.add(player.id);
          });
        });
        
        // Return all first team players except the leading ones
        return firstTeamPlayers.filter(player => !leadingPlayerIds.has(player.id));
      
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
