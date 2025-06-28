
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bookmark, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Shortlist } from "@/hooks/useShortlists";

interface ShortlistsSidebarProps {
  shortlists: Shortlist[];
  selectedList: string | null;
  onSelectList: (listId: string) => void;
  allPlayers: any[];
  getPrivatePlayersForShortlist: (shortlistId: string) => any[];
  onCreateShortlist: (name: string, description: string) => void;
}

export const ShortlistsSidebar = ({
  shortlists,
  selectedList,
  onSelectList,
  allPlayers,
  getPrivatePlayersForShortlist,
  onCreateShortlist
}: ShortlistsSidebarProps) => {
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");

  const handleCreateList = () => {
    if (newListName.trim()) {
      onCreateShortlist(newListName.trim(), newListDescription.trim());
      setIsCreateListOpen(false);
      setNewListName("");
      setNewListDescription("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Recruitment Lists
          </CardTitle>
          <Dialog open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Shortlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input 
                  placeholder="List name" 
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                />
                <Input 
                  placeholder="Description (optional)" 
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                />
                <Button 
                  className="w-full" 
                  onClick={handleCreateList}
                  disabled={!newListName.trim()}
                >
                  Create List
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {shortlists.map((list) => {
            // Calculate actual player count that matches the logic in useShortlistsLogic
            let publicPlayerCount = 0;
            const privatePlayerCount = getPrivatePlayersForShortlist(list.id).length;
            const manualPlayerCount = (list.playerIds || []).length;
            
            if (list.playerIds && list.playerIds.length > 0 && !list.filter) {
              // Custom shortlist - only manually added public players
              publicPlayerCount = allPlayers.filter(player => 
                list.playerIds.includes(player.id.toString())
              ).length;
            } else if (list.filter && typeof list.filter === 'function') {
              // Default lists with filters - get all filtered players
              publicPlayerCount = allPlayers.filter(list.filter).length;
              
              // Don't double count manual players that are already included via filter
              if (list.playerIds && list.playerIds.length > 0) {
                const filteredPlayerIds = new Set(allPlayers.filter(list.filter).map(p => p.id.toString()));
                const additionalManualPlayers = allPlayers.filter(player => 
                  list.playerIds.includes(player.id.toString()) &&
                  !filteredPlayerIds.has(player.id.toString())
                ).length;
                publicPlayerCount += additionalManualPlayers;
              }
            } else if (list.playerIds && list.playerIds.length > 0) {
              // Lists with only playerIds
              publicPlayerCount = allPlayers.filter(player => 
                list.playerIds.includes(player.id.toString())
              ).length;
            }
            
            const totalCount = publicPlayerCount + privatePlayerCount;
            
            return (
              <button
                key={list.id}
                onClick={() => onSelectList(list.id)}
                className={cn(
                  "w-full p-3 text-left hover:bg-muted/50 transition-colors",
                  selectedList === list.id && "bg-muted"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full", list.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{list.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {totalCount} players
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
