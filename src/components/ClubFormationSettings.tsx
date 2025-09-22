import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save } from "lucide-react";
import { useClubSettings, useUpdateClubSettings } from "@/hooks/useClubSettings";
import { useToast } from "@/hooks/use-toast";

interface ClubFormationSettingsProps {
  clubName: string;
}

const FORMATIONS = [
  "4-3-3", "4-2-3-1", "3-5-2", "4-4-2", "3-4-3", "5-3-2", "4-1-4-1", "3-4-2-1"
];

const ClubFormationSettings = ({ clubName }: ClubFormationSettingsProps) => {
  const { data: settings, isLoading } = useClubSettings(clubName);
  const updateSettings = useUpdateClubSettings();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    formation: '',
    style_of_play: '',
    philosophy: ''
  });

  const handleEdit = () => {
    if (settings) {
      setFormData({
        formation: settings.formation,
        style_of_play: settings.style_of_play || '',
        philosophy: settings.philosophy || ''
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      console.log('Attempting to save club settings:', {
        club_name: clubName,
        ...formData
      });
      
      await updateSettings.mutateAsync({
        club_name: clubName,
        ...formData
      });
      
      console.log('Club settings saved successfully');
      
      toast({
        title: "Settings Updated",
        description: "Club formation and philosophy settings have been saved.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save club settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      formation: '',
      style_of_play: '',
      philosophy: ''
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading club settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Formation & Club Philosophy
          </CardTitle>
          {!isEditing && (
            <Button variant="outline" onClick={handleEdit}>
              <Settings className="h-4 w-4 mr-2" />
              Edit Settings
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          // Display Mode
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Formation</Label>
              <p className="text-2xl font-bold text-primary mt-1">
                {settings?.formation || '4-3-3'}
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Style of Play</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {settings?.style_of_play || 'No style defined'}
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Club Philosophy</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {settings?.philosophy || 'No philosophy defined'}
              </p>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-4">
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

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={updateSettings.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClubFormationSettings;