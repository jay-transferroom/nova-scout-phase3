
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
  recommendedTargets?: Player[];
}

export const usePositionAnalysis = (players: Player[], allPlayers: Player[] = []) => {
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

      // Get recommended targets from other clubs with similar or better ratings
      const currentBestRating = positionPlayers.length > 0 
        ? Math.max(...positionPlayers.map(p => p.transferroomRating || p.xtvScore || 50))
        : 50;
      
      const recommendedTargets = allPlayers
        .filter(p => {
          // Must play the required position
          const playsPosition = p.positions.some(playerPos => pos.requiredPositions.includes(playerPos));
          // Must not be from Chelsea
          const notChelsea = !p.club?.toLowerCase().includes('chelsea');
          // Must have similar or better rating
          const rating = p.transferroomRating || p.xtvScore || 0;
          const hasGoodRating = rating >= currentBestRating - 5; // Allow slightly lower ratings
          // Age considerations
          const reasonableAge = p.age >= 18 && p.age <= 32;
          
          return playsPosition && notChelsea && hasGoodRating && reasonableAge;
        })
        .sort((a, b) => {
          const ratingA = a.transferroomRating || a.xtvScore || 0;
          const ratingB = b.transferroomRating || b.xtvScore || 0;
          return ratingB - ratingA;
        })
        .slice(0, 5); // Top 5 recommendations

      // Risk assessment
      const contractExpiring = positionPlayers.filter(p => {
        if (!p.contractExpiry) return false;
        const expiryDate = new Date(p.contractExpiry);
        const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        return expiryDate < oneYearFromNow;
      }).length;

      const agingPlayers = positionPlayers.filter(p => p.age > 32).length;
      const injuredPlayers = 0; // Real injury data would come from API

      let priority = 'Low';
      let recommendation = 'Position is well-covered with good depth';
      
      if (positionPlayers.length === 0) {
        priority = 'Critical';
        recommendation = 'Consider immediate recruitment to fill this essential position';
      } else if (positionPlayers.length === 1) {
        priority = 'High';
        recommendation = 'Adding depth would improve rotation options and squad resilience';
      } else if (positionPlayers.length < pos.needed / 2) {
        priority = 'High';
        recommendation = 'Strategic additions could enhance squad depth and competition';
      } else if (contractExpiring > 0 || agingPlayers > 1) {
        priority = 'Medium';
        recommendation = 'Plan future recruitment to maintain long-term squad stability';
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
        players: positionPlayers,
        recommendedTargets
      };
    });
  };

  return { getPositionAnalysis };
};
