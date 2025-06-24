import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useScouts } from "@/hooks/useScouts";
import { useCreateAssignment } from "@/hooks/useScoutingAssignments";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { usePlayerAssignments } from "@/hooks/usePlayerAssignments";

interface Player {
  id: string;
  name: string;
  club: string;
  positions: string[];
}

interface AssignScoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
}

const AssignScoutDialog = ({ isOpen, onClose, player }: AssignScoutDialogProps) => {
  const { user, profile } = useAuth();
  const { data: scouts = [] } = useScouts();
  const { data: playerAssignments = [] } = usePlayerAssignments();
  const createAssignment = useCreateAssignment();

  const [selectedScout, setSelectedScout] = useState<string>("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [reportType, setReportType] = useState("Standard");
  const [deadline, setDeadline] = useState<Date>();
  const [notes, setNotes] = useState("");

  // Find existing assignment for this player
  const existingAssignment = player ? 
    playerAssignments.find(assignment => assignment.player_id === player.id) : 
    null;

  // Combine current user with other scouts for the dropdown
  const allScoutOptions = [
    // Add current user if they have scout role
    ...(profile?.role === 'scout' ? [{
      id: user?.id || '',
      first_name: profile?.first_name || 'Me',
      last_name: profile?.last_name ? `(${profile.last_name})` : '',
      email: profile?.email || ''
    }] : []),
    // Add other scouts
    ...scouts.filter(scout => scout.id !== user?.id)
  ];

  // Pre-populate form with existing assignment data when dialog opens
  useEffect(() => {
    if (isOpen && existingAssignment) {
      setSelectedScout(existingAssignment.assigned_to_scout_id);
      setPriority(existingAssignment.priority);
      // Reset other fields for reassignment
      setReportType("Standard");
      setDeadline(undefined);
      setNotes("");
    } else if (isOpen && !existingAssignment) {
      // Reset form for new assignment
      setSelectedScout("");
      setPriority("Medium");
      setReportType("Standard");
      setDeadline(undefined);
      setNotes("");
    }
  }, [isOpen, existingAssignment]);

  const handleSubmit = async () => {
    if (!player || !selectedScout || !user) return;

    try {
      console.log("Creating assignment with player ID:", player.id, "type:", typeof player.id);
      
      // Use the players_new ID directly as a string in the assignment
      await createAssignment.mutateAsync({
        player_id: player.id, // This should be the players_new.id as string
        assigned_to_scout_id: selectedScout,
        assigned_by_manager_id: user.id,
        priority,
        status: 'assigned',
        assignment_notes: notes || undefined,
        deadline: deadline ? deadline.toISOString().split('T')[0] : undefined,
        report_type: reportType,
      });

      // Find the selected scout's name for the notification
      const selectedScoutInfo = allScoutOptions.find(scout => scout.id === selectedScout);
      const scoutName = selectedScoutInfo ? 
        `${selectedScoutInfo.first_name} ${selectedScoutInfo.last_name}`.trim() || selectedScoutInfo.email :
        'Unknown Scout';

      const actionType = existingAssignment ? "reassigned to" : "assigned to";
      toast({
        title: existingAssignment ? "Assignment Updated" : "Assignment Created",
        description: `${player.name} has been ${actionType} ${scoutName} for scouting.`,
      });

      onClose();
      // Reset form
      setSelectedScout("");
      setPriority("Medium");
      setReportType("Standard");
      setDeadline(undefined);
      setNotes("");
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: "Error",
        description: `Failed to ${existingAssignment ? 'update' : 'create'} assignment. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingAssignment ? 'Reassign Scout' : 'Assign Scout'}
          </DialogTitle>
        </DialogHeader>
        
        {player && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium">{player.name}</h4>
              <p className="text-sm text-gray-600">{player.club} • {player.positions.join(', ')}</p>
              {existingAssignment && (
                <p className="text-sm text-orange-600 mt-1">
                  Currently assigned to: {existingAssignment.assigned_to_scout?.first_name} {existingAssignment.assigned_to_scout?.last_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scout">
                {existingAssignment ? 'Reassign to Scout' : 'Assign to Scout'}
              </Label>
              <Select value={selectedScout} onValueChange={setSelectedScout}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a scout" />
                </SelectTrigger>
                <SelectContent>
                  {allScoutOptions.map((scout) => (
                    <SelectItem key={scout.id} value={scout.id}>
                      {scout.first_name} {scout.last_name} ({scout.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value: "High" | "Medium" | "Low") => setPriority(value)}>
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

              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Detailed">Detailed</SelectItem>
                    <SelectItem value="Quick">Quick</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Deadline (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : "Select deadline"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Assignment Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add specific instructions or context for the scout..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="flex-1"
                disabled={!selectedScout || createAssignment.isPending}
              >
                {createAssignment.isPending ? 
                  (existingAssignment ? "Reassigning..." : "Assigning...") : 
                  (existingAssignment ? "Reassign Scout" : "Assign Scout")
                }
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssignScoutDialog;
