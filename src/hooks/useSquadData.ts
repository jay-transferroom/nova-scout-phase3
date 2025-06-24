
import { useMemo } from "react";
import { Player } from "@/types/player";

export const useSquadData = (clubPlayers: Player[], selectedSquad: string) => {
  // Filter players based on selected squad type with no duplicates
  const squadPlayers = useMemo(() => {
    // Sort players by rating to get the best ones first
    const sortedPlayers = [...clubPlayers].sort((a, b) => {
      const ratingA = a.transferroomRating || a.xtvScore || 0;
      const ratingB = b.transferroomRating || b.xtvScore || 0;
      return ratingB - ratingA;
    });

    // First XI: Top 11 players (starting lineup)
    const firstXIIds = sortedPlayers.slice(0, 11).map(p => p.id);

    // Shadow Squad: Remaining players (up to 17 more for a total of 28)
    const shadowSquadIds = sortedPlayers.slice(11, 28).map(p => p.id);

    switch (selectedSquad) {
      case 'first-xi':
        return clubPlayers.filter(p => firstXIIds.includes(p.id));
      case 'shadow-squad':
        return clubPlayers.filter(p => shadowSquadIds.includes(p.id));
      default:
        return clubPlayers.filter(p => firstXIIds.includes(p.id));
    }
  }, [clubPlayers, selectedSquad]);

  return { squadPlayers };
};
