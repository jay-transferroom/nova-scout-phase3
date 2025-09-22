
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
import { usePlayerNameSearch } from "@/hooks/usePlayerNameSearch";

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

  const { data: remotePlayers = [], isLoading: remoteLoading } = usePlayerNameSearch(searchQuery, 50);

  const MAX_DISPLAY_RESULTS = 8; // Increased to show more results like in the reference

  // Debug logs removed to prevent noisy re-renders

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
    console.log('Loading recent player IDs from localStorage:', recentPlayerIds);
    
    if (players.length > 0) {
      const recent = recentPlayerIds
        .map((id: string) => players.find(p => p.id === id))
        .filter((player: Player | undefined): player is Player => player !== undefined)
        .slice(0, 3);
      
      console.log('Found recent players:', recent.map(p => p.name));
      setRecentPlayers(recent);
    }
  }, [players]);

  // Filter players based on search query and filters - Remote-first for scalability
  useEffect(() => {
    const lowercaseQuery = searchQuery.toLowerCase().trim();

    // For queries with 2+ chars, use server-side search results and merge private players
    if (lowercaseQuery.length >= 2) {
      let results: Player[] = [...remotePlayers];

      const privateMatches = players.filter(
        (p) => (p as any).isPrivatePlayer && p.name.toLowerCase().includes(lowercaseQuery)
      );
      results = [...privateMatches, ...results];

      // Detect position-like searches for better sorting
      const positionKeywords = [
        'st', 'cf', 'striker', 'forward',
        'lw', 'rw', 'winger', 'wing',
        'lm', 'rm', 'midfielder', 'mid',
        'cm', 'cam', 'cdm', 'dm',
        'cb', 'defender', 'defence', 'defense',
        'lb', 'rb', 'fullback', 'full-back',
        'lwb', 'rwb', 'wingback', 'wing-back',
        'gk', 'goalkeeper', 'keeper'
      ];
      const isPositionSearch = positionKeywords.some((k) => lowercaseQuery === k || lowercaseQuery.includes(k));
      if (isPositionSearch) {
        results.sort((a, b) => (b.transferroomRating || b.futureRating || 0) - (a.transferroomRating || a.futureRating || 0));
      }

      // Apply filters
      if (ageFilter !== 'all') {
        if (ageFilter === 'u21') results = results.filter((p) => p.age < 21);
        else if (ageFilter === '21-25') results = results.filter((p) => p.age >= 21 && p.age <= 25);
        else if (ageFilter === '26+') results = results.filter((p) => p.age > 25);
      }
      if (contractFilter !== 'all') {
        if (contractFilter === "Expiring") {
          // Filter for contracts expiring within the next 6 months
          const sixMonthsFromNow = new Date();
          sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
          results = results.filter(player => {
            if (!player.contractExpiry) return false;
            const expiryDate = new Date(player.contractExpiry);
            return expiryDate <= sixMonthsFromNow && expiryDate >= new Date();
          });
        } else {
          results = results.filter((p) => p.contractStatus === contractFilter);
        }
      }
      if (regionFilter !== 'all') results = results.filter((p) => p.region === regionFilter);

      setFilteredPlayers(results);
      return;
    }

    // No/short query: clear results (recent list is shown elsewhere)
    if (!searchQuery.trim()) {
      setFilteredPlayers([]);
      return;
    }

    // Fallback local filtering for tiny datasets
    if (!players.length) {
      setFilteredPlayers([]);
      return;
    }

    let results = [...players];
    let isPositionSearch = false;

    console.log('Filtering players for query:', lowercaseQuery);
    console.log('Total players to filter:', results.length);

    const jamesPlayers = results.filter((p) => p.name.toLowerCase().includes('james'));
    console.log('James players found:', jamesPlayers.map((p) => p.name));

    const positionKeywords = [
      'st', 'cf', 'striker', 'forward',
      'lw', 'rw', 'winger', 'wing',
      'lm', 'rm', 'midfielder', 'mid',
      'cm', 'cam', 'cdm', 'dm',
      'cb', 'defender', 'defence', 'defense',
      'lb', 'rb', 'fullback', 'full-back',
      'lwb', 'rwb', 'wingback', 'wing-back',
      'gk', 'goalkeeper', 'keeper'
    ];
    isPositionSearch = positionKeywords.some((keyword) => lowercaseQuery === keyword || lowercaseQuery.includes(keyword));

    results = results.filter((player) => {
      const nameMatch = player.name.toLowerCase().includes(lowercaseQuery);
      const clubMatch = player.club.toLowerCase().includes(lowercaseQuery);
      const idMatch = player.id.toLowerCase() === lowercaseQuery;
      const positionMatch = player.positions.some((pos) => pos.toLowerCase().includes(lowercaseQuery));
      const nationalityMatch = player.nationality?.toLowerCase().includes(lowercaseQuery);

      const matches = nameMatch || clubMatch || idMatch || positionMatch || nationalityMatch;

      if (lowercaseQuery.includes('james')) {
        console.log(`Player ${player.name}: name=${nameMatch}, club=${clubMatch}, id=${idMatch}, position=${positionMatch}, nationality=${nationalityMatch}, matches=${matches}`);
      }

      return matches;
    });

    console.log('Filtered results count:', results.length);

    if (isPositionSearch) {
      results.sort((a, b) => {
        const ratingA = a.transferroomRating || a.futureRating || 0;
        const ratingB = b.transferroomRating || b.futureRating || 0;
        return ratingB - ratingA;
      });
      console.log('Position search detected - sorted by rating');
    }

    if (ageFilter !== 'all') {
      if (ageFilter === 'u21') results = results.filter((p) => p.age < 21);
      else if (ageFilter === '21-25') results = results.filter((p) => p.age >= 21 && p.age <= 25);
      else if (ageFilter === '26+') results = results.filter((p) => p.age > 25);
    }
    if (contractFilter !== 'all') {
      if (contractFilter === "Expiring") {
        // Filter for contracts expiring within the next 6 months
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        results = results.filter(player => {
          if (!player.contractExpiry) return false;
          const expiryDate = new Date(player.contractExpiry);
          return expiryDate <= sixMonthsFromNow && expiryDate >= new Date();
        });
      } else {
        results = results.filter((p) => p.contractStatus === contractFilter);
      }
    }
    if (regionFilter !== 'all') results = results.filter((p) => p.region === regionFilter);

    setFilteredPlayers(results);
  }, [searchQuery, ageFilter, contractFilter, regionFilter, players, remotePlayers]);

  // Handle player selection
  const handleSelectPlayer = (player: Player) => {
    console.log('Selecting player:', player.name);
    
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
    console.log('Updated recent players in localStorage:', updatedRecent);
    
    // Update local state
    const isAlreadyRecent = recentPlayers.some(p => p.id === player.id);
    if (!isAlreadyRecent) {
      setRecentPlayers(prev => [player, ...prev.slice(0, 2)]);
      console.log('Updated recent players state');
    }
  };

  // Handle filter searches that navigate to search results page
  const handleFilterSearch = (filterType: string, filterValue: string) => {
    const params = new URLSearchParams();
    
    if (filterType === 'all') {
      // All players - no filters
    } else if (filterType === 'contractFilter') {
      params.set('contract', filterValue);
    } else if (filterType === 'positionFilter') {
      params.set('position', filterValue);
    } else if (filterType === 'ageFilter') {
      params.set('age', filterValue);
    }
    
    navigate(`/search?${params.toString()}`);
    setOpen(false);
    setSearchQuery("");
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
          totalResults={filteredPlayers.length}
          recentPlayers={recentPlayers}
          maxDisplayResults={MAX_DISPLAY_RESULTS}
          getTeamLogo={getTeamLogo}
          onSelectPlayer={handleSelectPlayer}
          onViewMore={handleViewMore}
          onFilterSearch={handleFilterSearch}
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
