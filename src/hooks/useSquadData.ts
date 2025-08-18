
import { useMemo } from "react";
import { Player } from "@/types/player";

export const useSquadData = (clubPlayers: Player[], selectedSquad: string) => {
  // Get all players for full squad view, with proper first XI vs shadow squad logic
  const squadPlayers = useMemo(() => {
    if (selectedSquad === 'first-xi') {
      // Show all players for depth analysis
      return clubPlayers;
    } else if (selectedSquad === 'shadow-squad') {
      // Shadow squad: exclude the primary player for each position
      const primaryPlayerIds = new Set<string>();
      
      // Define position priorities to identify primary players
      const positionGroups = [
        ['GK'],
        ['LB', 'LWB'],
        ['CB'],
        ['RB', 'RWB'], 
        ['CDM'],
        ['CM'],
        ['CAM'],
        ['LM'],
        ['RM'],
        ['LW'],
        ['RW'],
        ['ST', 'CF']
      ];

      // For each position group, find the best player and mark as primary
      positionGroups.forEach(positions => {
        const playersInPosition = clubPlayers.filter(player =>
          player.positions.some(pos => positions.includes(pos))
        );
        
        if (playersInPosition.length > 0) {
          // Sort by rating and take the best as primary
          const bestPlayer = playersInPosition.sort((a, b) => {
            const ratingA = a.transferroomRating || a.xtvScore || 0;
            const ratingB = b.transferroomRating || b.xtvScore || 0;
            return ratingB - ratingA;
          })[0];
          
          primaryPlayerIds.add(bestPlayer.id);
        }
      });

      // Return all players except the primary ones
      return clubPlayers.filter(player => !primaryPlayerIds.has(player.id));
    }
    
    return clubPlayers;
  }, [clubPlayers, selectedSquad]);

  return { squadPlayers };
};
