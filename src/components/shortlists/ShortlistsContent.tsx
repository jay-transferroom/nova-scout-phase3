
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShortlistsHeader } from "./ShortlistsHeader";
import { ShortlistFilters } from "./ShortlistFilters";
import { PlayerCard } from "./PlayerCard";

interface Shortlist {
  id: string;
  name: string;
  description: string;
  color: string;
  filter: (player: any) => boolean;
}

interface ShortlistsContentProps {
  currentList: Shortlist | undefined;
  sortedPlayers: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: () => void;
  euGbeFilter: string;
  onEuGbeFilterChange: (value: string) => void;
  getAssignmentBadge: (playerId: string) => JSX.Element;
  getEuGbeBadge: (status: string) => JSX.Element;
  getPlayerAssignment: (playerId: string) => any;
  formatXtvScore: (score: number) => string;
  onAssignScout: (player: any) => void;
  onRemovePlayer: (playerId: string) => void;
  onExportList: () => void;
}

export const ShortlistsContent = ({
  currentList,
  sortedPlayers,
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
  onExportList
}: ShortlistsContentProps) => {
  return (
    <Card>
      <CardHeader>
        <ShortlistsHeader 
          currentList={currentList}
          playerCount={sortedPlayers.length}
          onExportList={onExportList}
        />
        
        <ShortlistFilters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          onSortByChange={onSortByChange}
          sortOrder={sortOrder}
          onSortOrderChange={onSortOrderChange}
          euGbeFilter={euGbeFilter}
          onEuGbeFilterChange={onEuGbeFilterChange}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              getAssignmentBadge={getAssignmentBadge}
              getEuGbeBadge={getEuGbeBadge}
              getPlayerAssignment={getPlayerAssignment}
              formatXtvScore={formatXtvScore}
              onAssignScout={onAssignScout}
              onRemovePlayer={onRemovePlayer}
            />
          ))}
        </div>

        {sortedPlayers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              No players found matching your criteria
            </div>
            <Button onClick={() => {
              onSearchChange("");
              onEuGbeFilterChange("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
