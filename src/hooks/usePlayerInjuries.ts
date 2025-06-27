
import { useQuery } from "@tanstack/react-query";

export interface PlayerInjury {
  id: string;
  type: string;
  description: string;
  severity: 'Minor' | 'Moderate' | 'Severe';
  startDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  status: 'Active' | 'Recovering' | 'Recovered';
  affectedBodyPart: string;
}

export const usePlayerInjuries = (playerId?: string) => {
  return useQuery({
    queryKey: ['player-injuries', playerId],
    queryFn: async (): Promise<PlayerInjury[]> => {
      if (!playerId) return [];

      // Mock injury data - in a real app this would come from the database
      const mockInjuries: PlayerInjury[] = [
        {
          id: '1',
          type: 'Muscle Strain',
          description: 'Hamstring strain during training',
          severity: 'Moderate',
          startDate: '2024-06-15',
          expectedReturnDate: '2024-07-05',
          status: 'Recovering',
          affectedBodyPart: 'Hamstring'
        },
        {
          id: '2',
          type: 'Ankle Sprain',
          description: 'Ankle twist during match against Arsenal',
          severity: 'Minor',
          startDate: '2024-05-20',
          actualReturnDate: '2024-06-01',
          status: 'Recovered',
          affectedBodyPart: 'Ankle'
        },
        {
          id: '3',
          type: 'Knee Injury',
          description: 'Minor knee discomfort',
          severity: 'Minor',
          startDate: '2024-04-10',
          actualReturnDate: '2024-04-18',
          status: 'Recovered',
          affectedBodyPart: 'Knee'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockInjuries;
    },
    enabled: !!playerId,
  });
};
