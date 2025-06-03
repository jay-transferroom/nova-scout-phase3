
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Calendar, Users, Eye, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlayerPitch {
  id: string;
  playerName: string;
  club: string;
  age: number;
  nationality: string;
  position: string;
  marketValue: string;
  pitchedBy: string;
  pitchDate: string;
  matchScore: number;
  keyStrengths: string[];
  availability: 'Available' | 'Limited Interest' | 'High Interest';
  image?: string;
}

interface PlayerPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: string;
}

const PlayerPitchModal = ({ isOpen, onClose, position }: PlayerPitchModalProps) => {
  const navigate = useNavigate();
  
  // Mock data for player pitches
  const mockPitches: PlayerPitch[] = [
    {
      id: "1",
      playerName: "João Neves",
      club: "SL Benfica",
      age: 19,
      nationality: "Portugal",
      position: "CM",
      marketValue: "€60M",
      pitchedBy: "Jorge Mendes Agency",
      pitchDate: "2024-01-15",
      matchScore: 89,
      keyStrengths: ["Ball control", "Passing range", "Press resistance"],
      availability: "High Interest"
    },
    {
      id: "2",
      playerName: "Jamal Musiala",
      club: "Bayern Munich",
      age: 21,
      nationality: "Germany",
      position: "CAM",
      marketValue: "€110M",
      pitchedBy: "Player's Representative",
      pitchDate: "2024-01-12",
      matchScore: 95,
      keyStrengths: ["Dribbling", "Creativity", "Goal threat"],
      availability: "Limited Interest"
    },
    {
      id: "3",
      playerName: "Nicolo Barella",
      club: "Inter Milan",
      age: 27,
      nationality: "Italy",
      position: "CM",
      marketValue: "€70M",
      pitchedBy: "Inter Milan",
      pitchDate: "2024-01-10",
      matchScore: 87,
      keyStrengths: ["Work rate", "Versatility", "Leadership"],
      availability: "Available"
    }
  ];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Limited Interest': return 'bg-yellow-100 text-yellow-800';
      case 'High Interest': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleScoutPlayer = (playerId: string) => {
    navigate(`/reports/new`, { state: { selectedPlayerId: playerId } });
    onClose();
  };

  const handleViewProfile = (playerId: string) => {
    navigate(`/players/${playerId}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Player Pitches - {position}
          </DialogTitle>
          <p className="text-muted-foreground">
            Review players that have been pitched for the {position} position
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {mockPitches.map((pitch) => (
            <Card key={pitch.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">
                        {pitch.playerName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{pitch.playerName}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                        <span>{pitch.club}</span>
                        <span>•</span>
                        <span>{pitch.age} years</span>
                        <span>•</span>
                        <span>{pitch.nationality}</span>
                        <span>•</span>
                        <span>{pitch.position}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {pitch.marketValue}
                        </Badge>
                        <Badge className={getAvailabilityColor(pitch.availability)}>
                          {pitch.availability}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{pitch.matchScore}% match</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewProfile(pitch.id)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Profile
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleScoutPlayer(pitch.id)}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Scout Player
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-1 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Pitched By
                    </h4>
                    <p className="text-muted-foreground">{pitch.pitchedBy}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Pitch Date
                    </h4>
                    <p className="text-muted-foreground">{new Date(pitch.pitchDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Key Strengths</h4>
                    <div className="flex flex-wrap gap-1">
                      {pitch.keyStrengths.map((strength, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => navigate('/transfers/pitches')}>
            View All Pitches
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerPitchModal;
