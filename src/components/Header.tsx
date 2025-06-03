import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { User, Settings, LogOut, Users, Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlayersData } from '@/hooks/usePlayersData';

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const { data: players = [], isLoading, error } = usePlayersData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  console.log('Players data:', players);
  console.log('Players loading:', isLoading);
  console.log('Players error:', error);

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.first_name) {
      return profile.first_name[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    return user?.email || 'User';
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Filter players based on search query
  const filteredPlayers = searchQuery.trim() 
    ? players.filter(player => {
        const searchLower = searchQuery.toLowerCase();
        const matchesName = player.name.toLowerCase().includes(searchLower);
        const matchesClub = player.club.toLowerCase().includes(searchLower);
        const matchesId = player.id.toLowerCase().includes(searchLower);
        const matchesPosition = player.positions.some(pos => pos.toLowerCase().includes(searchLower));
        
        return matchesName || matchesClub || matchesId || matchesPosition;
      }).slice(0, 5)
    : [];

  console.log('Search query:', searchQuery);
  console.log('Filtered players:', filteredPlayers);
  console.log('Show results:', showResults);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/reports', { state: { searchQuery: searchQuery.trim() } });
      setSearchQuery('');
      setShowResults(false);
    }
  };

  const handlePlayerSelect = (playerId: string) => {
    navigate(`/reports/new`, { state: { selectedPlayerId: playerId } });
    setSearchQuery('');
    setShowResults(false);
  };

  const canManageUsers = profile?.role === 'recruitment';

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger>
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <Link to="/" className="font-bold text-xl text-primary">
              Scout Pro
            </Link>
          </div>

          <div className="flex-1 max-w-lg mx-8 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isLoading ? "Loading players..." : "Search players..."}
                className="pl-10 bg-muted/30 border-muted-foreground/20 h-11"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  setShowResults(value.trim().length > 0);
                  console.log('Search input changed:', value);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) {
                    setShowResults(true);
                  }
                }}
                onBlur={() => {
                  // Delay hiding results to allow for clicks
                  setTimeout(() => setShowResults(false), 200);
                }}
                disabled={isLoading}
              />
            </form>
            
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">Loading players...</div>
                ) : error ? (
                  <div className="px-4 py-3 text-sm text-red-500">Error loading players</div>
                ) : filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player) => (
                    <button
                      key={player.id}
                      className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3 transition-colors"
                      onMouseDown={() => handlePlayerSelect(player.id)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                          {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{player.name}</p>
                        <p className="text-xs text-muted-foreground">{player.club} • {player.positions.join(", ")}</p>
                      </div>
                    </button>
                  ))
                ) : searchQuery.trim().length > 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">No players found for "{searchQuery}"</div>
                ) : null}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {profile?.role || 'scout'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  {canManageUsers && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/users" className="cursor-pointer">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Manage Users</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
