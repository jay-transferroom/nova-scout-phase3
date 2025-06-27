
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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

  // Only show for recruitment (Scout Manager) role
  if (profile?.role !== 'recruitment') {
    return null;
  }

  // Mock shortlists - in a real app this would come from the database
  const shortlists = [
    { id: "striker-targets", name: "Striker Targets" },
    { id: "cb-reinforcements", name: "Centre-Back Options" },
    { id: "loan-prospects", name: "Loan Prospects" },
    { id: "bargain-deals", name: "Contract Expiry Watch" },
  ];

  const handleAddToShortlist = () => {
    if (!selectedList) return;

    const listName = shortlists.find(list => list.id === selectedList)?.name;
    
    // Mock implementation - in a real app this would save to database
    console.log(`Adding ${playerName} to shortlist: ${listName}`);
    
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
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Shortlist</label>
            <Select value={selectedList} onValueChange={setSelectedList}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a shortlist" />
              </SelectTrigger>
              <SelectContent>
                {shortlists.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    {list.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleAddToShortlist} 
              disabled={!selectedList}
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
