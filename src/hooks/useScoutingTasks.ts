
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ScoutingTask {
  id: string;
  playerName: string;
  club: string;
  position: string;
  location: string;
  priority: "High" | "Medium" | "Low";
  upcomingMatch: {
    date: string;
    opposition: string;
    competition: string;
    venue: string;
  } | null;
  requirementId: string;
  playerId: string;
}

export const useScoutingTasks = () => {
  return useQuery({
    queryKey: ['scouting-tasks'],
    queryFn: async (): Promise<ScoutingTask[]> => {
      const { data: players, error } = await supabase
        .from('players')
        .select('*')
        .limit(10);

      if (error) {
        console.error('Error fetching players for scouting tasks:', error);
        throw error;
      }

      // Transform players into scouting tasks with some mock task data
      const tasks: ScoutingTask[] = players.map((player, index) => {
        const priorities: ("High" | "Medium" | "Low")[] = ["High", "Medium", "Low"];
        const competitions = ["Premier League", "Champions League", "Europa League", "FA Cup"];
        const venues = ["Home", "Away"];
        
        return {
          id: `st-${player.id}`,
          playerName: player.name,
          club: player.club,
          position: player.positions[0] || "Unknown",
          location: player.region,
          priority: priorities[index % 3],
          upcomingMatch: Math.random() > 0.3 ? {
            date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            opposition: `vs ${["Manchester City", "Liverpool", "Arsenal", "Chelsea", "Tottenham"][Math.floor(Math.random() * 5)]}`,
            competition: competitions[Math.floor(Math.random() * competitions.length)],
            venue: `${venues[Math.floor(Math.random() * venues.length)]} - ${player.club} Stadium`,
          } : null,
          requirementId: `req-${(index % 3) + 1}`,
          playerId: player.id,
        };
      });

      return tasks;
    },
  });
};
