
import { useState, useMemo } from "react";
import { Search, ArrowUpDown, Download, Plus, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, FileText, UserPlus, Bookmark, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PlayerSearchDialog } from "./PlayerSearchDialog";
import { useAuth } from "@/contexts/AuthContext";

interface ShortlistsContentProps {
  currentList: any;
  sortedPlayers: any[];
  allPlayers: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: () => void;
  euGbeFilter: string;
  onEuGbeFilterChange: (value: string) => void;
  getAssignmentBadge: (playerId: string) => { variant: any; className?: string; children: string };
  getEuGbeBadge: (status: string) => { variant: any; className?: string; children: string };
  getPlayerAssignment: (playerId: string) => any;
  formatXtvScore: (score: number) => string;
  onAssignScout: (player: any) => void;
  onRemovePlayer: (playerId: string) => void;
  onExportList: () => void;
  onAddPlayersToShortlist: (playerIds: string[]) => void;
}

export const ShortlistsContent = ({
  currentList,
  sortedPlayers,
  allPlayers,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  euGbeFilter,
  onEuGbeFilterChange,
  getAssignmentBadge,
  getEuGbeBadge,
  getPlayerAssignment,
  formatXtvScore,
  onAssignScout,
  onRemovePlayer,
  onExportList,
  onAddPlayersToShortlist
}: ShortlistsContentProps) => {
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const { profile } = useAuth();

  // Check if user is director
  const isDirector = profile?.role === 'director';

  if (!currentList) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Select a shortlist to view players</p>
        </CardContent>
      </Card>
    );
  }

  const handleCreateReport = (player: any) => {
    // This will be handled by the parent component
    console.log("Creating report for:", player);
  };

  // Auto-suggest players based on shortlist name
  const suggestedPlayers = useMemo(() => {
    if (!currentList || !allPlayers || allPlayers.length === 0) return [];

    const listName = currentList.name.toLowerCase();
    const positionKeywords = {
      'striker': ['st', 'cf', 'striker', 'forward'],
      'winger': ['lw', 'rw', 'lm', 'rm', 'wing'],
      'midfielder': ['cm', 'cam', 'cdm', 'dm', 'mid'],
      'defender': ['cb', 'lb', 'rb', 'lwb', 'rwb', 'def'],
      'goalkeeper': ['gk', 'keeper'],
      'fullback': ['lb', 'rb', 'back'],
      'centreback': ['cb', 'centre', 'center'],
      'centremid': ['cm', 'centre', 'center'],
      'attacking': ['cam', 'cf', 'lw', 'rw', 'attack'],
      'defensive': ['cdm', 'cb', 'dm', 'def']
    };

    // Get current shortlist player IDs to exclude them
    const currentPlayerIds = new Set(currentList.playerIds || []);

    // Find matching positions based on shortlist name
    let relevantPositions: string[] = [];
    for (const [keyword, positions] of Object.entries(positionKeywords)) {
      if (listName.includes(keyword)) {
        relevantPositions.push(...positions);
      }
    }

    // If no specific keywords found, try to match exact position abbreviations
    if (relevantPositions.length === 0) {
      const allPositions = Object.values(positionKeywords).flat();
      relevantPositions = allPositions.filter(pos => listName.includes(pos.toLowerCase()));
    }

    if (relevantPositions.length === 0) return [];

    // Filter players by matching positions and exclude already added players
    const suggested = allPlayers
      .filter(player => {
        const playerId = player.isPrivatePlayer ? player.id : player.id.toString();
        if (currentPlayerIds.has(playerId)) return false;
        
        return player.positions?.some((pos: string) => 
          relevantPositions.some(relevantPos => 
            pos.toLowerCase().includes(relevantPos.toLowerCase())
          )
        );
      })
      .slice(0, 10); // Limit to 10 suggestions

    return suggested;
  }, [currentList, allPlayers]);

  const handleAddSuggestedPlayers = () => {
    const playerIds = suggestedPlayers.map(player => 
      player.isPrivatePlayer ? player.id : player.id.toString()
    );
    onAddPlayersToShortlist(playerIds);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {currentList.name}
            <Badge variant="secondary">{sortedPlayers.length} players</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onExportList}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            {isDirector && (
              <Button size="sm" onClick={() => setIsSearchDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={onSortByChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="age">Age</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="potential">Potential</SelectItem>
                <SelectItem value="xtv">XTV</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={onSortOrderChange}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>

            <Select value={euGbeFilter} onValueChange={onEuGbeFilterChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pass">Pass</SelectItem>
                <SelectItem value="fail">Fail</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Auto-suggestions section */}
        {isDirector && suggestedPlayers.length > 0 && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Suggested Players</h4>
                <Badge variant="secondary">{suggestedPlayers.length} found</Badge>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleAddSuggestedPlayers}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add All
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Based on your shortlist name "{currentList.name}", we found these matching players:
            </p>
            <div className="space-y-2">
              {suggestedPlayers.map((player) => {
                const rating = player.transferroomRating || 0;
                const suitability = rating >= 85 ? 'Excellent' : rating >= 75 ? 'Good' : rating >= 65 ? 'Average' : 'Below Average';
                const suitabilityColor = rating >= 85 ? 'bg-green-100 text-green-800' : 
                                       rating >= 75 ? 'bg-blue-100 text-blue-800' : 
                                       rating >= 65 ? 'bg-yellow-100 text-yellow-800' : 
                                       'bg-gray-100 text-gray-800';
                
                return (
                  <div 
                    key={player.id} 
                    className="flex items-center justify-between p-3 bg-background rounded-lg border hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => onAddPlayersToShortlist([player.isPrivatePlayer ? player.id : player.id.toString()])}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={player.image} alt={player.name} />
                        <AvatarFallback className="text-xs">
                          {player.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.club}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {player.positions?.[0]}
                      </Badge>
                      {rating > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {rating.toFixed(1)}
                        </Badge>
                      )}
                      <Badge variant="outline" className={`text-xs ${suitabilityColor} border-0`}>
                        {suitability}
                      </Badge>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Players Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Positions</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Potential</TableHead>
                <TableHead>XTV (£M)</TableHead>
                <TableHead>EU/GBE</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlayers.length > 0 ? (
                sortedPlayers.map((player) => {
                  const assignmentBadgeProps = getAssignmentBadge(player.id.toString());
                  const euGbeBadgeProps = getEuGbeBadge(player.euGbeStatus || 'Pass');
                  
                  return (
                    <TableRow key={player.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={player.image} alt={player.name} />
                            <AvatarFallback>
                              {player.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{player.name}</div>
                            <div className="text-sm text-muted-foreground">{player.club}</div>
                            {player.isPrivate && (
                              <Badge variant="secondary" className="text-xs mt-1">Private</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{player.age || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {player.positions?.slice(0, 2).map((pos: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {pos}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {player.transferroomRating ? player.transferroomRating.toFixed(1) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {player.futureRating ? player.futureRating.toFixed(1) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {player.xtvScore ? formatXtvScore(player.xtvScore) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {!player.isPrivate && <Badge {...euGbeBadgeProps} />}
                      </TableCell>
                      <TableCell>
                        {!player.isPrivate && <Badge {...assignmentBadgeProps} />}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={player.profilePath}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCreateReport(player)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Create Report
                            </DropdownMenuItem>
                            {!player.isPrivate && !getPlayerAssignment(player.id.toString()) ? (
                              <DropdownMenuItem onClick={() => onAssignScout(player)}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Assign Scout
                              </DropdownMenuItem>
                            ) : !player.isPrivate && (
                              <DropdownMenuItem onClick={() => onAssignScout(player)}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Reassign Scout
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Bookmark className="h-4 w-4 mr-2" />
                              Move to list
                            </DropdownMenuItem>
                            {isDirector && (
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => onRemovePlayer(player.id.toString())}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove from list
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                    No players found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Player Search Dialog */}
      {isDirector && (
        <PlayerSearchDialog
          open={isSearchDialogOpen}
          onOpenChange={setIsSearchDialogOpen}
          onAddPlayers={onAddPlayersToShortlist}
          excludePlayerIds={sortedPlayers.map(p => p.id.toString())}
        />
      )}
    </Card>
  );
};
