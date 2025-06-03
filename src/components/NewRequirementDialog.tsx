
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface NewRequirementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialPosition?: string;
}

const positions = [
  "Goalkeeper", "Centre Back", "Left Back", "Right Back", 
  "Defensive Midfielder", "Central Midfielder", "Attacking Midfielder",
  "Left Winger", "Right Winger", "Striker"
];

const regions = [
  "Europe", "South America", "North America", "Africa", "Asia", "Oceania"
];

const squads = [
  { value: "first-team", label: "First Team" },
  { value: "under-21", label: "Under 21" },
  { value: "under-18", label: "Under 18" },
  { value: "academy", label: "Academy" },
  { value: "reserves", label: "Reserves" },
];

const priorities = [
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" },
];

const NewRequirementDialog = ({ isOpen, onClose, initialPosition }: NewRequirementDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    positions: initialPosition ? [initialPosition] : [],
    ageMin: "",
    ageMax: "",
    preferredRegions: [],
    squad: "first-team",
    priority: "medium",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || formData.positions.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here we would normally save to the database
    console.log("Creating new requirement:", formData);
    
    toast({
      title: "Success",
      description: "New requirement created successfully",
    });
    
    onClose();
    
    // Reset form
    setFormData({
      name: "",
      description: "",
      positions: [],
      ageMin: "",
      ageMax: "",
      preferredRegions: [],
      squad: "first-team",
      priority: "medium",
    });
  };

  const addPosition = (position: string) => {
    if (!formData.positions.includes(position)) {
      setFormData(prev => ({
        ...prev,
        positions: [...prev.positions, position]
      }));
    }
  };

  const removePosition = (position: string) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.filter(p => p !== position)
    }));
  };

  const addRegion = (region: string) => {
    if (!formData.preferredRegions.includes(region)) {
      setFormData(prev => ({
        ...prev,
        preferredRegions: [...prev.preferredRegions, region]
      }));
    }
  };

  const removeRegion = (region: string) => {
    setFormData(prev => ({
      ...prev,
      preferredRegions: prev.preferredRegions.filter(r => r !== region)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Requirement</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Requirement Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Central Defender"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the type of player you're looking for..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Squad *</Label>
              <Select 
                value={formData.squad} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, squad: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {squads.map(squad => (
                    <SelectItem key={squad.value} value={squad.value}>
                      {squad.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Positions *</Label>
            <Select onValueChange={addPosition}>
              <SelectTrigger>
                <SelectValue placeholder="Add positions" />
              </SelectTrigger>
              <SelectContent>
                {positions.map(position => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.positions.map(position => (
                <Badge key={position} variant="secondary" className="gap-1">
                  {position}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removePosition(position)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ageMin">Minimum Age</Label>
              <Input
                id="ageMin"
                type="number"
                value={formData.ageMin}
                onChange={(e) => setFormData(prev => ({ ...prev, ageMin: e.target.value }))}
                placeholder="18"
                min="16"
                max="45"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ageMax">Maximum Age</Label>
              <Input
                id="ageMax"
                type="number"
                value={formData.ageMax}
                onChange={(e) => setFormData(prev => ({ ...prev, ageMax: e.target.value }))}
                placeholder="35"
                min="16"
                max="45"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferred Regions</Label>
            <Select onValueChange={addRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Add preferred regions" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.preferredRegions.map(region => (
                <Badge key={region} variant="outline" className="gap-1">
                  {region}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeRegion(region)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Requirement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRequirementDialog;
