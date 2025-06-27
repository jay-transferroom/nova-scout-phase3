
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useShortlists } from "@/hooks/useShortlists";

interface AddToShortlistButtonProps {
  playerId: string;
  playerName: string;
  isPrivatePlayer?: boolean;
}

const AddToShortlistButton = ({ playerId, playerName, isPrivatePlayer = false }: AddToShortlistButtonProps) => {
  const [open, setOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<string>("");
  const { profile } = useAuth();
  const { toast } = useToast();
  const { shortlists, addPlayerToShortlist, getPlayerShortlists } = useShortlists();

  // Only show for recruitment (Scout Manager) role
  if (profile?.role !== 'recruitment') {
    return null;
  }

  // Format player ID consistently - private players need "private-" prefix
  const formattedPlayerId = isPrivatePlayer && !playerId.startsWith('private-') 
    ? `private-${playerId}` 
    : playerId;

  // Get current shortlists for this player
  const currentPlayerShortlists = getPlayerShortlists(formattedPlayerId);
  const currentShortlistIds = currentPlayerShortlists.map(list => list.id);

  // Filter out shortlists the player is already on
  const availableShortlists = shortlists.filter(list => !currentShortlistIds.includes(list.id));

  const handleAddToShortlist = () => {
    if (!selectedList) return;

    const listName = shortlists.find(list => list.id === selectedList)?.name;
    
    // Add player to the selected shortlist
    addPlayerToShortlist(selectedList, formattedPlayerId);
    
    toast({
      title: "Player Added to Shortlist",
      description: `${playerName} has been added to ${listName}`,
    });

    setOpen(false);
    setSelectedList("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bookmark className="h-4 w-4" />
          Add to Shortlist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {playerName} to Shortlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Player:</span>
            <span className="font-medium">{playerName}</span>
            {isPrivatePlayer && (
              <Badge variant="secondary">Private Player</Badge>
            )}
          </div>

          {currentPlayerShortlists.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Currently on:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {currentPlayerShortlists.map((list) => (
                  <Badge key={list.id} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {list.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Shortlist</label>
            {availableShortlists.length > 0 ? (
              <Select value={selectedList} onValueChange={setSelectedList}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a shortlist" />
                </SelectTrigger>
                <SelectContent>
                  {availableShortlists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-muted-foreground p-2 border rounded">
                This player is already on all available shortlists
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleAddToShortlist} 
              disabled={!selectedList || availableShortlists.length === 0}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add to List
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToShortlistButton;
