
import { useMemo } from "react";
import { Player } from "@/types/player";

export const useSquadData = (clubPlayers: Player[], selectedSquad: string) => {
  // Filter players based on selected squad type with no duplicates
  const squadPlayers = useMemo(() => {
    // First XI: 25 players (most valuable senior players)
    const firstTeamIds = clubPlayers
      .filter(p => !p.id.includes('23_') && !p.id.includes('21_') && !p.id.includes('18_'))
      .slice(0, 25)
      .map(p => p.id);

    // Shadow Squad: 11 players (subset of first team)
    const shadowSquadIds = firstTeamIds.slice(0, 11);

    switch (selectedSquad) {
      case 'first-xi':
        return clubPlayers.filter(p => firstTeamIds.includes(p.id));
      case 'shadow-squad':
        return clubPlayers.filter(p => shadowSquadIds.includes(p.id));
      default:
        return clubPlayers.filter(p => firstTeamIds.includes(p.id));
    }
  }, [clubPlayers, selectedSquad]);

  return { squadPlayers };
};
