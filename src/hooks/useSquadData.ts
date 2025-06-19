
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

    // U23: 20 players (age 23 and under, not in first team)
    const u23Players = clubPlayers.filter(p => 
      p.age <= 23 && !firstTeamIds.includes(p.id)
    ).slice(0, 20);

    // U21: 20 players (age 21 and under, not in first team or U23)
    const u21Players = clubPlayers.filter(p => 
      p.age <= 21 && 
      !firstTeamIds.includes(p.id) && 
      !u23Players.find(u23 => u23.id === p.id)
    ).slice(0, 20);

    // U18: 20 players (age 18 and under, not in above squads)
    const u18Players = clubPlayers.filter(p => 
      p.age <= 18 && 
      !firstTeamIds.includes(p.id) && 
      !u23Players.find(u23 => u23.id === p.id) &&
      !u21Players.find(u21 => u21.id === p.id)
    ).slice(0, 20);

    switch (selectedSquad) {
      case 'first-xi':
        return clubPlayers.filter(p => firstTeamIds.includes(p.id));
      case 'shadow-squad':
        return clubPlayers.filter(p => shadowSquadIds.includes(p.id));
      case 'u23':
        return u23Players;
      case 'u21':
        return u21Players;
      case 'u18':
        return u18Players;
      default:
        return clubPlayers.filter(p => firstTeamIds.includes(p.id));
    }
  }, [clubPlayers, selectedSquad]);

  return { squadPlayers };
};
