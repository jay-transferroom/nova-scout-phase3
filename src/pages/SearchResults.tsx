import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Search, Filter, Loader2 } from "lucide-react";
import { usePlayersData } from "@/hooks/usePlayersData";
import { useTeamsData } from "@/hooks/useTeamsData";
import { Player } from "@/types/player";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: players = [], isLoading } = usePlayersData();
  const { data: teams = [] } = useTeamsData();
  
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [contractFilter, setContractFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  // Create a map of team names to team data for quick lookup
  const teamMap = teams.reduce((acc, team) => {
    acc[team.name] = team;
    return acc;
  }, {} as Record<string, any>);

  // Get team logo for a given club name
  const getTeamLogo = (clubName: string) => {
    const team = teamMap[clubName];
    return team?.logo_url;
  };

  // Filter players based on search query and filters
  useEffect(() => {
    if (!players.length) {
      setFilteredPlayers([]);
      return;
    }
    
    let results = [...players];
    
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase().trim();
      results = results.filter(player => 
        player.name.toLowerCase().includes(lowercaseQuery) || 
        player.club.toLowerCase().includes(lowercaseQuery) || 
        player.id.toLowerCase() === lowercaseQuery ||
        player.positions.some(pos => pos.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    if (ageFilter !== "all") {
      if (ageFilter === "u21") {
        results = results.filter(player => player.age < 21);
      } else if (ageFilter === "21-25") {
        results = results.filter(player => player.age >= 21 && player.age <= 25);
      } else if (ageFilter === "26+") {
        results = results.filter(player => player.age > 25);
      }
    }
    
    if (contractFilter !== "all") {
      results = results.filter(player => player.contractStatus === contractFilter);
    }
    
    if (regionFilter !== "all") {
      results = results.filter(player => player.region === regionFilter);
    }
    
    setFilteredPlayers(results);
  }, [searchQuery, ageFilter, contractFilter, regionFilter, players]);

  const handlePlayerClick = (player: Player) => {
    navigate(`/player/${player.id}`); // Fixed: changed from /players/ to /player/
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading players...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Search Results</h1>
          <p className="text-muted-foreground mt-2">
            {searchQuery ? `Results for "${searchQuery}"` : "All players"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search player name, club, position or ID"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Players</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Age</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setAgeFilter("all")} className={ageFilter === "all" ? "bg-accent" : ""}>
                All ages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAgeFilter("u21")} className={ageFilter === "u21" ? "bg-accent" : ""}>
                Under 21
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAgeFilter("21-25")} className={ageFilter === "21-25" ? "bg-accent" : ""}>
                21-25 years
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAgeFilter("26+")} className={ageFilter === "26+" ? "bg-accent" : ""}>
                26+ years
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Contract Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setContractFilter("all")} className={contractFilter === "all" ? "bg-accent" : ""}>
                All statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setContractFilter("Free Agent")} className={contractFilter === "Free Agent" ? "bg-accent" : ""}>
                Free Agent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setContractFilter("Under Contract")} className={contractFilter === "Under Contract" ? "bg-accent" : ""}>
                Under Contract
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setContractFilter("Loan")} className={contractFilter === "Loan" ? "bg-accent" : ""}>
                Loan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setContractFilter("Youth Contract")} className={contractFilter === "Youth Contract" ? "bg-accent" : ""}>
                Youth Contract
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Region</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setRegionFilter("all")} className={regionFilter === "all" ? "bg-accent" : ""}>
                All regions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRegionFilter("Europe")} className={regionFilter === "Europe" ? "bg-accent" : ""}>
                Europe
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRegionFilter("South America")} className={regionFilter === "South America" ? "bg-accent" : ""}>
                South America
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRegionFilter("North America")} className={regionFilter === "North America" ? "bg-accent" : ""}>
                North America
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRegionFilter("Africa")} className={regionFilter === "Africa" ? "bg-accent" : ""}>
                Africa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRegionFilter("Asia")} className={regionFilter === "Asia" ? "bg-accent" : ""}>
                Asia
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRegionFilter("Oceania")} className={regionFilter === "Oceania" ? "bg-accent" : ""}>
                Oceania
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Found {filteredPlayers.length} players
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlayers.map((player) => {
          const teamLogo = getTeamLogo(player.club);
          
          return (
            <Card 
              key={player.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handlePlayerClick(player)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={player.image} 
                      alt={player.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-muted-foreground">{player.club} • {player.positions.join(", ")}</p>
                    <p className="text-sm text-muted-foreground">{player.age} yrs • {player.nationality}</p>
                  </div>
                  
                  {teamLogo && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={teamLogo} 
                        alt={`${player.club} logo`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-xs font-semibold">
                        {player.club.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No players found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
