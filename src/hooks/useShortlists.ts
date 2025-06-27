
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Shortlist {
  id: string;
  name: string;
  description: string;
  color: string;
  filter: (player: any) => boolean;
  playerIds: string[]; // Track manually added players
}

// Mock shortlist storage - in a real app this would be in a database
const SHORTLISTS_STORAGE_KEY = 'chelsea_shortlists';

const getDefaultShortlists = (): Shortlist[] => [
  {
    id: "striker-targets",
    name: "Striker Targets",
    description: "Center forwards to strengthen attack",
    color: "bg-blue-500",
    playerIds: ["private-herbie-hughes"], // Herbie Hughes is manually added
    filter: (player: any) => 
      (player.positions.some((pos: string) => 
        pos?.toLowerCase().includes('st') || 
        pos?.toLowerCase().includes('cf') ||
        pos?.toLowerCase().includes('striker') ||
        pos?.toLowerCase().includes('forward')
      ) && 
      player.transferroomRating && player.transferroomRating >= 75 &&
      player.age && player.age <= 28)
  },
  {
    id: "cb-reinforcements",
    name: "Centre-Back Options",
    description: "Defensive reinforcements for back line",
    color: "bg-red-500",
    playerIds: [],
    filter: (player: any) => 
      (player.positions.some((pos: string) => 
        pos?.toLowerCase().includes('cb') || 
        pos?.toLowerCase().includes('centre') ||
        pos?.toLowerCase().includes('center')
      ) && 
      player.transferroomRating && player.transferroomRating >= 70 &&
      player.age && player.age >= 22 && player.age <= 30)
  },
  {
    id: "loan-prospects",
    name: "Loan Prospects",
    description: "Young talents for loan opportunities",
    color: "bg-green-500",
    playerIds: ["private-herbie-hughes"], // Herbie Hughes is also on loan prospects
    filter: (player: any) => 
      (player.age && player.age <= 22 &&
      player.futureRating && player.futureRating >= 75 &&
      player.transferroomRating && player.transferroomRating >= 60)
  },
  {
    id: "bargain-deals",
    name: "Contract Expiry Watch",  
    description: "Players with expiring contracts",
    color: "bg-purple-500",
    playerIds: [],
    filter: (player: any) => {
      if (!player.contractExpiry) return false;
      const contractYear = new Date(player.contractExpiry).getFullYear();
      const currentYear = new Date().getFullYear();
      return (contractYear <= currentYear + 1 && 
              player.transferroomRating && player.transferroomRating >= 70);
    }
  }
];

export const useShortlists = () => {
  const { toast } = useToast();
  
  // Load shortlists from localStorage or use defaults
  const loadShortlists = useCallback((): Shortlist[] => {
    try {
      const stored = localStorage.getItem(SHORTLISTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure all shortlists have the required properties
        return parsed.map((shortlist: any) => ({
          ...shortlist,
          playerIds: shortlist.playerIds || []
        }));
      }
    } catch (error) {
      console.error('Error loading shortlists:', error);
    }
    return getDefaultShortlists();
  }, []);

  const [shortlists, setShortlists] = useState<Shortlist[]>(loadShortlists);

  // Save shortlists to localStorage
  const saveShortlists = useCallback((newShortlists: Shortlist[]) => {
    try {
      localStorage.setItem(SHORTLISTS_STORAGE_KEY, JSON.stringify(newShortlists));
      setShortlists(newShortlists);
    } catch (error) {
      console.error('Error saving shortlists:', error);
      toast({
        title: "Error",
        description: "Failed to save shortlists",
        variant: "destructive"
      });
    }
  }, [toast]);

  const createShortlist = useCallback((name: string, description: string) => {
    const newShortlist: Shortlist = {
      id: `shortlist-${Date.now()}`,
      name,
      description,
      color: "bg-gray-500", // Default color
      playerIds: [],
      filter: () => false // Custom shortlists don't have auto-filters
    };

    const updatedShortlists = [...shortlists, newShortlist];
    saveShortlists(updatedShortlists);
    
    toast({
      title: "Shortlist Created",
      description: `"${name}" has been created successfully`,
    });

    return newShortlist;
  }, [shortlists, saveShortlists, toast]);

  const addPlayerToShortlist = useCallback((shortlistId: string, playerId: string) => {
    const updatedShortlists = shortlists.map(shortlist => {
      if (shortlist.id === shortlistId) {
        const playerIds = shortlist.playerIds || [];
        if (!playerIds.includes(playerId)) {
          return {
            ...shortlist,
            playerIds: [...playerIds, playerId]
          };
        }
      }
      return shortlist;
    });
    saveShortlists(updatedShortlists);
  }, [shortlists, saveShortlists]);

  const removePlayerFromShortlist = useCallback((shortlistId: string, playerId: string) => {
    const updatedShortlists = shortlists.map(shortlist => {
      if (shortlist.id === shortlistId) {
        const playerIds = shortlist.playerIds || [];
        return {
          ...shortlist,
          playerIds: playerIds.filter(id => id !== playerId)
        };
      }
      return shortlist;
    });
    saveShortlists(updatedShortlists);
  }, [shortlists, saveShortlists]);

  const getPlayerShortlists = useCallback((playerId: string) => {
    return shortlists.filter(shortlist => {
      const playerIds = shortlist.playerIds || [];
      return playerIds.includes(playerId);
    });
  }, [shortlists]);

  return {
    shortlists,
    createShortlist,
    addPlayerToShortlist,
    removePlayerFromShortlist,
    getPlayerShortlists
  };
};
