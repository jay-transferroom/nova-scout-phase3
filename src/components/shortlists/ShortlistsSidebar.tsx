import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users } from "lucide-react";
import { Player } from "@/types/player";
import AddToShortlistDialog from "@/components/AddToShortlistDialog";
import { useNavigate } from "react-router-dom";

interface ShortlistsSidebarProps {
  shortlists: any[];
  selectedList: string | null;
  onSelectList: (listId: string) => void;
  allPlayers: Player[];
  getPrivatePlayersForShortlist: (shortlistId: string) => Player[];
  onCreateShortlist: (name: string, playerIds: string[]) => Promise<void>;
}

export const ShortlistsSidebar = ({
  shortlists,
  selectedList,
  onSelectList,
  allPlayers,
  getPrivatePlayersForShortlist,
  onCreateShortlist
}: ShortlistsSidebarProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handlePlayerClick = (player: Player) => {
    console.log('ShortlistsSidebar - Player clicked:', player);
    
    if (player.isPrivatePlayer && player.privatePlayerData) {
      console.log('ShortlistsSidebar - Navigating to private player:', player.privatePlayerData.id);
      navigate(`/private-player/${player.privatePlayerData.id}`);
    } else {
      console.log('ShortlistsSidebar - Navigating to public player:', player.id);
      navigate(`/player/${player.id}`);
    }
  };

  const handleCreateShortlist = async (name: string, playerIds: string[]) => {
    await onCreateShortlist(name, playerIds);
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Shortlists</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </div>
        </CardHeader>
      </Card>
      
      <div className="space-y-2">
        {shortlists.map((list) => {
          const privatePlayersForList = getPrivatePlayersForShortlist(list.id);
          const totalPlayers = (list.playerIds?.length || 0) + privatePlayersForList.length;
          
          return (
            <Card
              key={list.id}
              className={`cursor-pointer transition-colors ${
                selectedList === list.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => onSelectList(list.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{list.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {totalPlayers}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  {/* Show first few players as preview */}
                  {list.playerIds?.slice(0, 2).map((playerId: string) => {
                    const player = allPlayers.find(p => p.id === playerId);
                    if (!player) return null;
                    
                    return (
                      <div 
                        key={playerId} 
                        className="text-xs text-gray-600 hover:text-blue-600 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayerClick(player);
                        }}
                      >
                        {player.name} ({player.club})
                      </div>
                    );
                  })}
                  
                  {/* Show private players */}
                  {privatePlayersForList.slice(0, 2).map((player) => (
                    <div 
                      key={player.id} 
                      className="text-xs text-gray-600 hover:text-blue-600 cursor-pointer flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayerClick(player);
                      }}
                    >
                      {player.name} ({player.club})
                      <Badge variant="outline" className="text-xs px-1 py-0">Private</Badge>
                    </div>
                  ))}
                  
                  {totalPlayers > 2 && (
                    <div className="text-xs text-gray-400">
                      +{totalPlayers - 2} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AddToShortlistDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        allPlayers={allPlayers}
        onCreateShortlist={handleCreateShortlist}
      />
    </div>
  );
};
