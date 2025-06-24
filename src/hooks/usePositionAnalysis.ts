
import { Player } from "@/types/player";

export interface PositionRisk {
  contractExpiring: number;
  agingPlayers: number;
  injuredPlayers: number;
}

export interface PositionAnalysis {
  name: string;
  current: number;
  needed: number;
  priority: string;
  recommendation: string;
  risks: PositionRisk;
  players: Player[];
}

export const usePositionAnalysis = (players: Player[]) => {
  const getPositionAnalysis = (): PositionAnalysis[] => {
    const positions = [
      { name: 'Goalkeeper', requiredPositions: ['GK'], needed: 2 },
      { name: 'Centre Back', requiredPositions: ['CB'], needed: 4 },
      { name: 'Full Back', requiredPositions: ['LB', 'RB', 'LWB', 'RWB'], needed: 4 },
      { name: 'Central Midfield', requiredPositions: ['CM', 'CDM', 'CAM'], needed: 6 },
      { name: 'Winger', requiredPositions: ['LW', 'RW', 'LM', 'RM'], needed: 4 },
      { name: 'Striker', requiredPositions: ['ST', 'CF'], needed: 3 }
    ];

    return positions.map(pos => {
      const positionPlayers = players.filter(p => 
        p.positions.some(playerPos => pos.requiredPositions.includes(playerPos))
      );

      // Risk assessment
      const contractExpiring = positionPlayers.filter(p => {
        if (!p.contractExpiry) return false;
        const expiryDate = new Date(p.contractExpiry);
        const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        return expiryDate < oneYearFromNow;
      }).length;

      const agingPlayers = positionPlayers.filter(p => p.age > 32).length;
      const injuredPlayers = Math.floor(Math.random() * Math.min(2, positionPlayers.length)); // Mock injury data

      let priority = 'Low';
      let recommendation = 'Squad depth is adequate';
      
      if (positionPlayers.length === 0) {
        priority = 'Critical';
        recommendation = 'URGENT: No players available in this position';
      } else if (positionPlayers.length === 1) {
        priority = 'High';
        recommendation = 'Critical lack of depth - immediate backup needed';
      } else if (positionPlayers.length < pos.needed / 2) {
        priority = 'High';
        recommendation = 'Insufficient depth for squad rotation';
      } else if (contractExpiring > 0 || agingPlayers > 1) {
        priority = 'Medium';
        recommendation = 'Squad renewal needed due to age/contract issues';
      }

      return {
        name: pos.name,
        current: positionPlayers.length,
        needed: pos.needed,
        priority,
        recommendation,
        risks: {
          contractExpiring,
          agingPlayers,
          injuredPlayers
        },
        players: positionPlayers
      };
    });
  };

  return { getPositionAnalysis };
};
