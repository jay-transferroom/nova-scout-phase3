
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
    id: 'strikers-shortlist',
    name: 'strikers',
    description: 'Striker targets for the first team',
    color: 'bg-blue-500',
    playerIds: ['1', '2', '3', '4', '5'], // Sample striker player IDs
    filter: () => false
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

  const createShortlist = useCallback(async (name: string, playerIds: string[]) => {
    const newShortlist: Shortlist = {
      id: `shortlist-${Date.now()}`,
      name,
      description: `Custom shortlist: ${name}`,
      color: "bg-gray-500", // Default color
      playerIds: playerIds || [],
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

  const updateShortlist = useCallback((id: string, updates: Partial<Shortlist>) => {
    const updatedShortlists = shortlists.map(shortlist => 
      shortlist.id === id ? { ...shortlist, ...updates } : shortlist
    );
    saveShortlists(updatedShortlists);
  }, [shortlists, saveShortlists]);

  const deleteShortlist = useCallback((id: string) => {
    const updatedShortlists = shortlists.filter(shortlist => shortlist.id !== id);
    saveShortlists(updatedShortlists);
  }, [shortlists, saveShortlists]);

  return {
    shortlists,
    createShortlist,
    updateShortlist,
    deleteShortlist,
    addPlayerToShortlist,
    removePlayerFromShortlist,
    getPlayerShortlists
  };
};
