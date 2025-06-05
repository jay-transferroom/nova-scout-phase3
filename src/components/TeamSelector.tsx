
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTeamsData } from "@/hooks/useTeamsData";

interface TeamSelectorProps {
  onTeamSelect: (teamName: string | null) => void;
  selectedTeam?: string | null;
}

const TeamSelector = ({ onTeamSelect, selectedTeam }: TeamSelectorProps) => {
  const { data: teams = [], isLoading } = useTeamsData();

  // Group teams by league
  const teamsByLeague = teams.reduce((acc, team) => {
    if (!acc[team.league]) {
      acc[team.league] = [];
    }
    acc[team.league].push(team);
    return acc;
  }, {} as Record<string, typeof teams>);

  const handleValueChange = (value: string) => {
    if (value === "all") {
      onTeamSelect(null);
    } else {
      onTeamSelect(value);
    }
  };

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Loading teams..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select onValueChange={handleValueChange} value={selectedTeam || "all"}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a team">
          {selectedTeam ? (
            <div className="flex items-center gap-2">
              {(() => {
                const team = teams.find(t => t.name === selectedTeam);
                return team ? (
                  <>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={team.logo_url || undefined} alt={`${team.name} logo`} />
                      <AvatarFallback className="text-xs">
                        {team.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{team.name}</span>
                  </>
                ) : (
                  <span>{selectedTeam}</span>
                );
              })()}
            </div>
          ) : (
            "All teams"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              All
            </div>
            <span>All teams</span>
          </div>
        </SelectItem>
        
        {Object.entries(teamsByLeague).map(([league, leagueTeams]) => (
          <div key={league}>
            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
              {league}
            </div>
            {leagueTeams
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((team) => (
                <SelectItem key={team.id} value={team.name}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={team.logo_url || undefined} alt={`${team.name} logo`} />
                      <AvatarFallback className="text-xs">
                        {team.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{team.name}</span>
                  </div>
                </SelectItem>
              ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TeamSelector;
