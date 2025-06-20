import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Filter, Search, Loader2, ArrowRight } from "lucide-react";
import { Player } from "@/types/player";
import { usePlayersData } from "@/hooks/usePlayersData";
import { useTeamsData } from "@/hooks/useTeamsData";
import { useNavigate } from "react-router-dom";

interface PlayerSearchProps {
  onSelectPlayer: (player: Player) => void;
}

const PlayerSearch = ({ onSelectPlayer }: PlayerSearchProps) => {
  const { data: players = [], isLoading, error } = usePlayersData();
  const { data: teams = [] } = useTeamsData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([]);
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [contractFilter, setContractFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  const MAX_DISPLAY_RESULTS = 5;

  // Debug logging
  useEffect(() => {
    console.log('Players loading:', isLoading);
    console.log('Players error:', error);
    console.log('Search query:', searchQuery);
    console.log('Filtered players:', filteredPlayers);
    console.log('Show results:', searchQuery.length > 0);
  }, [isLoading, error, searchQuery, filteredPlayers]);

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

  // Initialize recent players from localStorage
  useEffect(() => {
    const recentPlayerIds = JSON.parse(localStorage.getItem('recentPlayers') || '[]');
    if (players.length > 0) {
      const recent = recentPlayerIds
        .map((id: string) => players.find(p => p.id === id))
        .filter((player: Player | undefined): player is Player => player !== undefined)
        .slice(0, 3);
      setRecentPlayers(recent);
    }
  }, [players]);

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

  // Handle player selection - this is the key fix
  const handleSelectPlayer = (player: Player) => {
    console.log('Selecting player:', player);
    console.log('Navigating to:', `/player/${player.id}`);
    
    // Call the callback first
    onSelectPlayer(player);
    
    // Navigate to the player profile page using the correct route
    navigate(`/player/${player.id}`);
    
    // Update recent players in localStorage
    const recentPlayerIds = JSON.parse(localStorage.getItem('recentPlayers') || '[]');
    const updatedRecent = [player.id, ...recentPlayerIds.filter((id: string) => id !== player.id)].slice(0, 3);
    localStorage.setItem('recentPlayers', JSON.stringify(updatedRecent));
    
    // Update local state
    const isAlreadyRecent = recentPlayers.some(p => p.id === player.id);
    if (!isAlreadyRecent) {
      setRecentPlayers(prev => [player, ...prev.slice(0, 2)]);
    }
  };

  const handleViewMore = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    navigate(`/search?${params.toString()}`);
  };

  const PlayerItem = ({ player }: { player: Player }) => {
    const teamLogo = getTeamLogo(player.club);
    
    return (
      <li 
        className="px-4 py-3 hover:bg-accent cursor-pointer flex items-center gap-3"
        onClick={() => handleSelectPlayer(player)}
      >
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
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm text-right">
            <p>{player.age} yrs</p>
            <p className="text-muted-foreground">{player.nationality}</p>
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
      </li>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading players...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        Error loading players. Please try again later.
      </div>
    );
  }

  const showSearchResults = searchQuery.trim().length > 0;
  const displayedResults = filteredPlayers.slice(0, MAX_DISPLAY_RESULTS);
  const hasMoreResults = filteredPlayers.length > MAX_DISPLAY_RESULTS;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
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
      
      {showSearchResults && (
        <div className="rounded-md border">
          <h3 className="px-4 py-2 text-sm font-medium border-b">Search Results ({filteredPlayers.length})</h3>
          {displayedResults.length > 0 ? (
            <>
              <ul className="divide-y">
                {displayedResults.map((player) => (
                  <PlayerItem key={player.id} player={player} />
                ))}
              </ul>
              {hasMoreResults && (
                <div className="p-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleViewMore}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    View all {filteredPlayers.length} results
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="p-4 text-center text-muted-foreground">No players found</p>
          )}
        </div>
      )}
      
      {!showSearchResults && recentPlayers.length > 0 && (
        <div className="rounded-md border">
          <h3 className="px-4 py-2 text-sm font-medium border-b">Recently Viewed</h3>
          <ul className="divide-y">
            {recentPlayers.map((player) => (
              <PlayerItem key={player.id} player={player} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlayerSearch;
