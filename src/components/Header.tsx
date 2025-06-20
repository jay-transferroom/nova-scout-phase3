
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Bell, User, LogOut, Settings, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayersData } from "@/hooks/usePlayersData";
import { Player } from "@/types/player";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { data: players = [] } = usePlayersData();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      const lowercaseQuery = query.toLowerCase().trim();
      const results = players.filter(player => 
        player.name.toLowerCase().includes(lowercaseQuery) || 
        player.club.toLowerCase().includes(lowercaseQuery) || 
        player.id.toLowerCase() === lowercaseQuery ||
        player.positions.some(pos => pos.toLowerCase().includes(lowercaseQuery))
      ).slice(0, 5);
      
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handlePlayerSelect = (player: Player) => {
    navigate(`/player/${player.id}`); // Fixed: using /player/ not /players/
    setSearchQuery("");
    setShowResults(false);
  };

  const handleViewAllResults = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    navigate(`/search?${params.toString()}`);
    setShowResults(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleViewAllResults();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <Link to="/" className="font-bold text-xl">
          Scout Hub
        </Link>
        
        <div className="flex-1 max-w-md relative">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => searchQuery && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
            />
          </div>
          
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md z-50">
              <div className="max-h-64 overflow-y-auto">
                {searchResults.map((player) => (
                  <div
                    key={player.id}
                    className="px-4 py-2 hover:bg-accent cursor-pointer flex items-center gap-3"
                    onClick={() => handlePlayerSelect(player)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={player.image} alt={player.name} />
                      <AvatarFallback>
                        {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{player.name}</p>
                      <p className="text-xs text-muted-foreground">{player.club} • {player.positions.join(", ")}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {searchQuery.trim() && (
                <div className="border-t p-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-left justify-start"
                    onClick={handleViewAllResults}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    View all results for "{searchQuery}"
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/ai-search">
              <Sparkles className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
