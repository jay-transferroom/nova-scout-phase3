import { useMemo } from "react";
import { Player } from "@/types/player";

export const useSquadData = (clubPlayers: Player[], selectedSquad: string, positionAssignments: any[] = []) => {
  
  // Helper function to check if a player should be excluded from first team and shadow squad
  const isEligibleForSeniorSquad = (player: Player) => {
    // Exclude players under 21
    if (player.age < 21) return false;
    
    // Exclude players on loan (club is not Chelsea-related)
    const isOnLoan = player.club !== 'Chelsea FC' && 
                     !player.club?.includes('Chelsea') && 
                     player.club !== 'Unknown';
    if (isOnLoan) return false;
    
    // Must be Chelsea-related club but not youth teams
    const isChelsea = player.club === 'Chelsea FC' || 
                     (player.club?.includes('Chelsea') && 
                      !player.club?.includes('U21') && 
                      !player.club?.includes('U18'));
    
    return isChelsea;
  };

  // Filter players based on squad selection
  const squadPlayers = useMemo(() => {
    switch (selectedSquad) {
      case 'first-team':
        return clubPlayers.filter(isEligibleForSeniorSquad);
      
      case 'shadow-squad':
        // Shadow squad: all eligible players EXCLUDING those assigned to first-team positions
        const eligiblePlayers = clubPlayers.filter(isEligibleForSeniorSquad);
        
        // Get player IDs that are assigned to first-team positions
        const firstTeamAssignedPlayerIds = new Set(
          positionAssignments
            .filter(assignment => assignment.squad_type === 'first-team')
            .map(assignment => assignment.player_id)
        );
        
        // Return eligible players that are NOT assigned to first-team positions
        return eligiblePlayers.filter(player => !firstTeamAssignedPlayerIds.has(player.id.toString()));
      
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
  }, [clubPlayers, selectedSquad, positionAssignments]);

  return { squadPlayers };
};