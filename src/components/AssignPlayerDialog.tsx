
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, User } from "lucide-react";
import { useScoutUsers } from "@/hooks/useScoutUsers";
import { usePlayersData } from "@/hooks/usePlayersData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AssignPlayerDialogProps {
  onAssignmentCreated?: () => void;
}

export const AssignPlayerDialog = ({ onAssignmentCreated }: AssignPlayerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedScout, setSelectedScout] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { data: scouts = [] } = useScoutUsers();
  const { data: players = [] } = usePlayersData();

  const handleSubmit = async () => {
    if (!selectedPlayer || !selectedScout || !user) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('scouting_assignments')
        .insert({
          player_id: selectedPlayer,
          assigned_to_scout_id: selectedScout,
          assigned_by_manager_id: user.id,
          priority,
          status: 'assigned',
          assignment_notes: notes || 'New scouting assignment',
          deadline: deadline || null,
          report_type: 'Standard'
        });

      if (error) throw error;

      toast.success("Player assigned successfully!");
      setOpen(false);
      setSelectedPlayer("");
      setSelectedScout("");
      setPriority("Medium");
      setDeadline("");
      setNotes("");
      
      if (onAssignmentCreated) {
        onAssignmentCreated();
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error("Failed to assign player");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Assign Player
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Assign Player to Scout
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="player">Player *</Label>
            <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
              <SelectTrigger>
                <SelectValue placeholder="Select a player" />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name} - {player.club}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="scout">Scout *</Label>
            <Select value={selectedScout} onValueChange={setSelectedScout}>
              <SelectTrigger>
                <SelectValue placeholder="Select a scout" />
              </SelectTrigger>
              <SelectContent>
                {scouts.map((scout) => (
                  <SelectItem key={scout.id} value={scout.id}>
                    {scout.first_name} {scout.last_name} ({scout.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="deadline">Deadline (Optional)</Label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label htmlFor="notes">Assignment Notes</Label>
            <Textarea
              placeholder="Add any specific instructions or requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Assigning..." : "Assign Player"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
