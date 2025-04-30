
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
import { Filter, Search } from "lucide-react";
import { Player } from "@/types/player";
import { mockPlayers, recentlyViewedPlayers } from "@/data/mockPlayers";

interface PlayerSearchProps {
  onSelectPlayer: (player: Player) => void;
}

const PlayerSearch = ({ onSelectPlayer }: PlayerSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([]);
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [contractFilter, setContractFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  // Initialize recent players
  useEffect(() => {
    const recent = recentlyViewedPlayers
      .sort((a, b) => b.viewedAt.getTime() - a.viewedAt.getTime())
      .slice(0, 3)
      .map(recent => {
        const player = mockPlayers.find(p => p.id === recent.playerId);
        return player;
      })
      .filter((player): player is Player => player !== undefined);
    
    setRecentPlayers(recent);
  }, []);

  // Filter players based on search query and filters
  useEffect(() => {
    let results = [...mockPlayers];
    
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
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
  }, [searchQuery, ageFilter, contractFilter, regionFilter]);

  // Handle player selection
  const handleSelectPlayer = (player: Player) => {
    onSelectPlayer(player);
    
    // Add to recent players (in a real app, this would persist to storage)
    const isAlreadyRecent = recentPlayers.some(p => p.id === player.id);
    if (!isAlreadyRecent) {
      setRecentPlayers(prev => [player, ...prev.slice(0, 2)]);
    }
  };

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
      
      {searchQuery && (
        <div className="rounded-md border">
          <h3 className="px-4 py-2 text-sm font-medium border-b">Search Results</h3>
          {filteredPlayers.length > 0 ? (
            <ul className="divide-y">
              {filteredPlayers.map((player) => (
                <li 
                  key={player.id} 
                  className="px-4 py-2 hover:bg-accent cursor-pointer flex items-center"
                  onClick={() => handleSelectPlayer(player)}
                >
                  <div className="flex-1">
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-muted-foreground">{player.club} • {player.positions.join(", ")}</p>
                  </div>
                  <div className="text-sm text-right">
                    <p>{player.age} yrs</p>
                    <p className="text-muted-foreground">{player.nationality}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-center text-muted-foreground">No players found</p>
          )}
        </div>
      )}
      
      {!searchQuery && recentPlayers.length > 0 && (
        <div className="rounded-md border">
          <h3 className="px-4 py-2 text-sm font-medium border-b">Recently Viewed</h3>
          <ul className="divide-y">
            {recentPlayers.map((player) => (
              <li 
                key={player.id} 
                className="px-4 py-2 hover:bg-accent cursor-pointer flex items-center"
                onClick={() => handleSelectPlayer(player)}
              >
                <div className="flex-1">
                  <p className="font-medium">{player.name}</p>
                  <p className="text-sm text-muted-foreground">{player.club} • {player.positions.join(", ")}</p>
                </div>
                <div className="text-sm text-right">
                  <p>{player.age} yrs</p>
                  <p className="text-muted-foreground">{player.nationality}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlayerSearch;
