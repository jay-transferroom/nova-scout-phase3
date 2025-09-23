import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Save } from "lucide-react";
import { useClubSettings, useUpdateClubSettings } from "@/hooks/useClubSettings";
import { useToast } from "@/hooks/use-toast";

interface SquadSettingsButtonProps {
  clubName: string;
}

const FORMATIONS = [
  "4-3-3", "4-2-3-1", "3-5-2", "4-4-2", "3-4-3", "5-3-2", "4-1-4-1", "3-4-2-1"
];

const SquadSettingsButton = ({ clubName }: SquadSettingsButtonProps) => {
  const { data: settings, isLoading } = useClubSettings(clubName);
  const updateSettings = useUpdateClubSettings();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    formation: '',
    style_of_play: '',
    philosophy: ''
  });

  const handleOpen = () => {
    if (settings) {
      setFormData({
        formation: settings.formation,
        style_of_play: settings.style_of_play || '',
        philosophy: settings.philosophy || ''
      });
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        club_name: clubName,
        ...formData
      });
      
      toast({
        title: "Settings Updated",
        description: "Club formation and philosophy settings have been saved.",
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to save club settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        <Settings className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleOpen}>
          <Settings className="h-4 w-4 mr-2" />
          Squad Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Formation & Club Philosophy
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="formation">Formation</Label>
            <Select 
              value={formData.formation} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, formation: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select formation" />
              </SelectTrigger>
              <SelectContent>
                {FORMATIONS.map(formation => (
                  <SelectItem key={formation} value={formation}>
                    {formation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="style_of_play">Style of Play</Label>
            <Input
              id="style_of_play"
              value={formData.style_of_play}
              onChange={(e) => setFormData(prev => ({ ...prev, style_of_play: e.target.value }))}
              placeholder="e.g., Possession-based with high pressing"
            />
          </div>

          <div>
            <Label htmlFor="philosophy">Club Philosophy</Label>
            <Textarea
              id="philosophy"
              value={formData.philosophy}
              onChange={(e) => setFormData(prev => ({ ...prev, philosophy: e.target.value }))}
              placeholder="Describe the club's footballing philosophy and approach..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={updateSettings.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SquadSettingsButton;