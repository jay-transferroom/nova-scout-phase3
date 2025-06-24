
import { useMemo } from "react";
import { Player } from "@/types/player";

export const useSquadMetrics = (squadPlayers: Player[], selectedSquad: string) => {
  const squadMetrics = useMemo(() => {
    if (squadPlayers.length === 0) {
      return { totalValue: 0, avgAge: 0, contractsExpiring: 0 };
    }

    // Different base values for different squad types
    let baseValueMultiplier = 1;
    switch (selectedSquad) {
      case 'first-xi':
        baseValueMultiplier = 2.5; // Most valuable
        break;
      case 'shadow-squad':
        baseValueMultiplier = 2.0; // High value subset
        break;
    }

    // Calculate total value based on player ages and positions
    const totalValue = squadPlayers.reduce((sum, player) => {
      let baseValue = 15 * baseValueMultiplier; // Base value in millions
      
      // Adjust value based on age
      if (player.age < 20) baseValue *= 1.5; // Young prospects
      else if (player.age < 25) baseValue *= 1.8; // Prime development age
      else if (player.age < 30) baseValue *= 1.2; // Peak years
      else baseValue *= 0.7; // Veteran players
      
      // Adjust based on position
      if (player.positions.includes('ST') || player.positions.includes('CF')) baseValue *= 1.4;
      else if (player.positions.includes('CAM') || player.positions.includes('CM')) baseValue *= 1.2;
      else if (player.positions.includes('GK')) baseValue *= 0.8;
      
      return sum + baseValue;
    }, 0);

    const avgAge = squadPlayers.reduce((sum, p) => sum + p.age, 0) / squadPlayers.length;
    
    const contractsExpiring = squadPlayers.filter(p => 
      p.contractExpiry && new Date(p.contractExpiry) < new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    ).length;

    return { totalValue, avgAge, contractsExpiring };
  }, [squadPlayers, selectedSquad]);

  return squadMetrics;
};
