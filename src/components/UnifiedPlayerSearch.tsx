
import { useState, useEffect } from "react";
import { Player } from "@/types/player";
import { useUnifiedPlayersData } from "@/hooks/useUnifiedPlayersData";
import { useTeamsData } from "@/hooks/useTeamsData";
import { useNavigate } from "react-router-dom";
import SearchInput from "./unified-search/SearchInput";
import SearchFilters from "./unified-search/SearchFilters";
import SearchResultsList from "./unified-search/SearchResultsList";
import PlayerRecentList from "./player-search/PlayerRecentList";
import HeaderSearchDialog from "./unified-search/HeaderSearchDialog";

interface UnifiedPlayerSearchProps {
  onSelectPlayer?: (player: Player) => void;
  variant?: "header" | "full";
  placeholder?: string;
  showFilters?: boolean;
}

const UnifiedPlayerSearch = ({ 
  onSelectPlayer, 
  variant = "full",
  placeholder = "Search players, reports...",
  showFilters = true 
}: UnifiedPlayerSearchProps) => {
  const { data: players = [], isLoading, error } = useUnifiedPlayersData();
  const { data: teams = [] } = useTeamsData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([]);
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [contractFilter, setContractFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  const MAX_DISPLAY_RESULTS = 5;

  // Debug logging for search issues
  useEffect(() => {
    console.log('UnifiedPlayerSearch - Players loaded:', players?.length || 0);
    console.log('UnifiedPlayerSearch - Search query:', searchQuery);
    console.log('UnifiedPlayerSearch - Filtered results:', filteredPlayers?.length || 0);
    if (searchQuery.toLowerCase().includes('herbie') || searchQuery.toLowerCase().includes('hughes')) {
      console.log('UnifiedPlayerSearch - Searching for Herbie Hughes');
      const matches = players.filter(p => 
        p.name.toLowerCase().includes('herbie') || 
        p.name.toLowerCase().includes('hughes')
      );
      console.log('UnifiedPlayerSearch - Found matches:', matches);
    }
  }, [players, searchQuery, filteredPlayers]);

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

  // Filter players based on search query and filters - IMPROVED SEARCH LOGIC
  useEffect(() => {
    if (!players.length) {
      setFilteredPlayers([]);
      return;
    }
    
    let results = [...players];
    
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase().trim();
      console.log('Filtering players for query:', lowercaseQuery);
      
      results = results.filter(player => {
        const nameMatch = player.name.toLowerCase().includes(lowercaseQuery);
        const clubMatch = player.club.toLowerCase().includes(lowercaseQuery);
        const idMatch = player.id.toLowerCase() === lowercaseQuery;
        const positionMatch = player.positions.some(pos => pos.toLowerCase().includes(lowercaseQuery));
        const nationalityMatch = player.nationality?.toLowerCase().includes(lowercaseQuery);
        
        const matches = nameMatch || clubMatch || idMatch || positionMatch || nationalityMatch;
        
        if (lowercaseQuery.includes('james') || lowercaseQuery.includes('maddison')) {
          console.log(`Player ${player.name}: name=${nameMatch}, club=${clubMatch}, matches=${matches}`);
        }
        
        return matches;
      });
      
      console.log('Filtered results count:', results.length);
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

  // Handle player selection
  const handleSelectPlayer = (player: Player) => {
    console.log('Selecting player:', player);
    
    if (onSelectPlayer) {
      onSelectPlayer(player);
    } else {
      // Route to appropriate profile page based on player type
      if (player.isPrivatePlayer) {
        navigate(`/private-player/${player.privatePlayerData?.id}`);
      } else {
        navigate(`/player/${player.id}`);
      }
    }
    
    setOpen(false);
    setSearchQuery("");
    
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
    setOpen(false);
    setSearchQuery("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((open) => !open);
    }
  };

  useEffect(() => {
    if (variant === "header") {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [variant]);

  // Loading state
  if (isLoading) {
    console.log('UnifiedPlayerSearch - Loading players...');
  }

  // Error state
  if (error) {
    console.error('UnifiedPlayerSearch - Error loading players:', error);
  }

  // Header variant
  if (variant === "header") {
    return (
      <>
        <SearchInput
          placeholder={`${placeholder} (⌘K)`}
          onClick={() => setOpen(true)}
          readOnly
        />

        <HeaderSearchDialog
          open={open}
          onOpenChange={setOpen}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder={placeholder}
          filteredPlayers={filteredPlayers}
          recentPlayers={recentPlayers}
          maxDisplayResults={MAX_DISPLAY_RESULTS}
          getTeamLogo={getTeamLogo}
          onSelectPlayer={handleSelectPlayer}
          onViewMore={handleViewMore}
        />
      </>
    );
  }

  // Full variant (for report builder and other places)
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <SearchInput
          placeholder={placeholder}
          className="flex-1"
          value={searchQuery}
          onChange={setSearchQuery}
        />
        
        {showFilters && (
          <SearchFilters
            ageFilter={ageFilter}
            contractFilter={contractFilter}
            regionFilter={regionFilter}
            onAgeFilterChange={setAgeFilter}
            onContractFilterChange={setContractFilter}
            onRegionFilterChange={setRegionFilter}
          />
        )}
      </div>
      
      <SearchResultsList
        players={filteredPlayers}
        totalCount={filteredPlayers.length}
        maxDisplayResults={MAX_DISPLAY_RESULTS}
        getTeamLogo={getTeamLogo}
        onSelectPlayer={handleSelectPlayer}
        onViewMore={handleViewMore}
        searchQuery={searchQuery}
      />
      
      {!searchQuery.trim() && (
        <PlayerRecentList
          players={recentPlayers}
          getTeamLogo={getTeamLogo}
          onSelectPlayer={handleSelectPlayer}
        />
      )}
    </div>
  );
};

export default UnifiedPlayerSearch;
