
export interface Player {
  id: string;
  name: string;
  club: string;
  age: number;
  dateOfBirth: string;
  positions: string[];
  dominantFoot: 'Left' | 'Right' | 'Both';
  nationality: string;
  contractStatus: 'Free Agent' | 'Under Contract' | 'Loan' | 'Youth Contract' | 'Private Player';
  contractExpiry?: string;
  region: string;
  image?: string;
  xtvScore?: number;
  transferroomRating?: number;
  futureRating?: number;
  euGbeStatus?: 'Pass' | 'Fail' | 'Pending'; // Made optional to fix mock data compatibility
  recentForm?: {
    matches: number;
    goals: number;
    assists: number;
    rating: number;
  };
  // New properties for private players
  isPrivatePlayer?: boolean;
  privatePlayerData?: import('@/types/privatePlayer').PrivatePlayer;
}

export interface RecentPlayer extends Pick<Player, 'id' | 'name' | 'club' | 'positions'> {
  viewedAt: Date;
}

export type PlayerPosition = 
  | 'GK' // Goalkeeper
  | 'CB' // Center Back
  | 'LB' // Left Back
  | 'RB' // Right Back
  | 'LWB' // Left Wing Back
  | 'RWB' // Right Wing Back
  | 'CDM' // Central Defensive Midfielder
  | 'CM' // Central Midfielder
  | 'CAM' // Central Attacking Midfielder
  | 'LM' // Left Midfielder
  | 'RM' // Right Midfielder
  | 'LW' // Left Winger
  | 'RW' // Right Winger
  | 'ST' // Striker
  | 'CF'; // Center Forward
