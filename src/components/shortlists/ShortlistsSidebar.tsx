
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Users } from "lucide-react";
import { Player } from "@/types/player";
import AddPrivatePlayerDialog from "@/components/AddPrivatePlayerDialog";
import { useNavigate } from "react-router-dom";

interface ShortlistsSidebarProps {
  shortlists: any[];
  selectedList: string | null;
  onSelectList: (listId: string) => void;
  allPlayers: Player[];
  privatePlayers: any[];
  onCreateShortlist: (name: string, playerIds: string[]) => Promise<void>;
}

export const ShortlistsSidebar = ({
  shortlists,
  selectedList,
  onSelectList,
  allPlayers,
  privatePlayers,
  onCreateShortlist
}: ShortlistsSidebarProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newShortlistName, setNewShortlistName] = useState("");
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

  const handleCreateShortlist = async () => {
    if (newShortlistName.trim()) {
      await onCreateShortlist(newShortlistName.trim(), []);
      setNewShortlistName("");
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Shortlists</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Shortlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="shortlist-name">Shortlist Name</Label>
                    <Input
                      id="shortlist-name"
                      value={newShortlistName}
                      onChange={(e) => setNewShortlistName(e.target.value)}
                      placeholder="Enter shortlist name..."
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateShortlist()}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateShortlist} disabled={!newShortlistName.trim()}>
                      Create Shortlist
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>
      
      <div className="space-y-2">
        {shortlists.map((list) => {
          const privatePlayersForList = privatePlayers.filter(player => 
            list.playerIds?.includes(player.id)
          );
          const publicPlayersForList = allPlayers.filter(player =>
            list.playerIds?.includes(player.id.toString())
          );
          const totalPlayers = publicPlayersForList.length + privatePlayersForList.length;
          
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
                  {/* Show first few public players as preview */}
                  {publicPlayersForList.slice(0, 2).map((player) => (
                    <div 
                      key={player.id} 
                      className="text-xs text-gray-600 hover:text-blue-600 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayerClick(player);
                      }}
                    >
                      {player.name} ({player.club})
                    </div>
                  ))}
                  
                  {/* Show private players */}
                  {privatePlayersForList.slice(0, 2).map((player) => (
                    <div 
                      key={player.id} 
                      className="text-xs text-gray-600 hover:text-blue-600 cursor-pointer flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayerClick({...player, isPrivatePlayer: true, privatePlayerData: player});
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

      <AddPrivatePlayerDialog
        trigger={
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Private Player
          </Button>
        }
      />
    </div>
  );
};
