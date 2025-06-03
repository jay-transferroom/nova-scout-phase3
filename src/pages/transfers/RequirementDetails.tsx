
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Users, Star, MapPin, Calendar, Eye, FileText } from "lucide-react";
import { RequirementProfile } from "@/types/report";

// Mock requirement profiles (same as in RequirementsList)
const mockRequirementProfiles: RequirementProfile[] = [
  {
    id: "req-1",
    name: "Central Defender",
    description: "Experienced central defender with good aerial ability and leadership",
    requiredPositions: ["CB"],
    ageRange: { min: 24, max: 29 },
    preferredRegions: ["Europe", "South America"],
    requiredAttributes: [
      { attributeName: "Aerial Ability", minRating: 8 },
      { attributeName: "Leadership", minRating: 7 },
      { attributeName: "Positioning", minRating: 8 },
    ],
  },
  {
    id: "req-2",
    name: "Creative Midfielder",
    description: "Technical attacking midfielder with vision and creativity",
    requiredPositions: ["CAM", "CM"],
    ageRange: { min: 20, max: 26 },
    preferredRegions: ["Europe", "South America"],
    requiredAttributes: [
      { attributeName: "Technical", minRating: 8 },
      { attributeName: "Vision", minRating: 8 },
      { attributeName: "Creativity", minRating: 7 },
    ],
  },
  {
    id: "req-3",
    name: "Promising Goalkeeper",
    description: "Young goalkeeper with good reflexes and distribution",
    requiredPositions: ["GK"],
    ageRange: { min: 18, max: 23 },
    preferredRegions: ["Europe", "South America", "North America"],
    requiredAttributes: [
      { attributeName: "Reflexes", minRating: 7 },
      { attributeName: "Distribution", minRating: 7 },
    ],
  },
];

// Mock pitches data for each requirement
const mockPitches = {
  "req-1": [
    {
      id: "p1",
      playerName: "Alessandro Bastoni",
      club: "Inter Milan", 
      age: 25,
      nationality: "Italy",
      position: "CB",
      marketValue: "€65M",
      pitchedBy: "Inter Milan",
      pitchDate: "2024-01-15",
      matchScore: 92,
      keyStrengths: ["Ball-playing ability", "Pace", "Left-footed"],
      availability: "Limited Interest"
    },
    {
      id: "p2",
      playerName: "William Saliba",
      club: "Arsenal",
      age: 23,
      nationality: "France",
      position: "CB",
      marketValue: "€80M",
      pitchedBy: "CAA Stellar",
      pitchDate: "2024-01-12",
      matchScore: 89,
      keyStrengths: ["Aerial ability", "Composure", "Leadership"],
      availability: "Available"
    },
    {
      id: "p3",
      playerName: "Josko Gvardiol",
      club: "Manchester City",
      age: 22,
      nationality: "Croatia",
      position: "CB",
      marketValue: "€90M",
      pitchedBy: "Wasserman",
      pitchDate: "2024-01-10",
      matchScore: 95,
      keyStrengths: ["Versatility", "Pace", "Technical ability"],
      availability: "High Interest"
    }
  ],
  "req-2": [
    {
      id: "p4",
      playerName: "Bruno Guimarães",
      club: "Newcastle United",
      age: 26,
      nationality: "Brazil",
      position: "CM",
      marketValue: "€100M",
      pitchedBy: "Base Soccer",
      pitchDate: "2024-01-14",
      matchScore: 91,
      keyStrengths: ["Box-to-box", "Creativity", "Work rate"],
      availability: "Available"
    },
    {
      id: "p5",
      playerName: "Jamal Musiala",
      club: "Bayern Munich",
      age: 21,
      nationality: "Germany",
      position: "CAM",
      marketValue: "€110M",
      pitchedBy: "ROOF",
      pitchDate: "2024-01-11",
      matchScore: 96,
      keyStrengths: ["Dribbling", "Creativity", "Goal threat"],
      availability: "Limited Interest"
    }
  ],
  "req-3": [
    {
      id: "p6",
      playerName: "Gianluigi Donnarumma",
      club: "Paris Saint-Germain",
      age: 25,
      nationality: "Italy", 
      position: "GK",
      marketValue: "€60M",
      pitchedBy: "Mino Raiola Agency",
      pitchDate: "2024-01-13",
      matchScore: 88,
      keyStrengths: ["Shot-stopping", "Distribution", "Experience"],
      availability: "Available"
    },
    {
      id: "p7",
      playerName: "Diogo Costa",
      club: "FC Porto",
      age: 24,
      nationality: "Portugal",
      position: "GK",
      marketValue: "€45M",
      pitchedBy: "Gestifute",
      pitchDate: "2024-01-09",
      matchScore: 85,
      keyStrengths: ["Reflexes", "Composure", "Distribution"],
      availability: "High Interest"
    }
  ]
};

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case 'Available': return 'bg-green-100 text-green-800';
    case 'Limited Interest': return 'bg-yellow-100 text-yellow-800';
    case 'High Interest': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const RequirementDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const requirement = mockRequirementProfiles.find(req => req.id === id);
  const pitches = id ? mockPitches[id as keyof typeof mockPitches] || [] : [];

  if (!requirement) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Requirement Not Found</h1>
          <Button onClick={() => navigate("/transfers/requirements")} variant="outline">
            Back to Requirements
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/transfers/requirements")} className="gap-2">
            <ArrowLeft size={16} />
            Back to Requirements
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{requirement.name}</h1>
            <p className="text-muted-foreground mt-2">{requirement.description}</p>
          </div>
        </div>
        <Button className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Requirement
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Player Pitches ({pitches.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pitches.length > 0 ? (
                <div className="space-y-4">
                  {pitches.map((pitch) => (
                    <div key={pitch.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              {pitch.playerName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{pitch.playerName}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{pitch.club}</span>
                              <span>•</span>
                              <span>{pitch.age} years</span>
                              <span>•</span>
                              <span>{pitch.nationality}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{pitch.matchScore}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {pitch.marketValue}
                          </Badge>
                          <Badge className={getAvailabilityColor(pitch.availability)}>
                            {pitch.availability}
                          </Badge>
                          <div className="flex flex-wrap gap-1">
                            {pitch.keyStrengths.slice(0, 2).map((strength, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button size="sm" className="gap-1">
                            <FileText className="h-3 w-3" />
                            Scout
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>Pitched by {pitch.pitchedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(pitch.pitchDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-4">
                    View All Pitches
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pitches received yet</p>
                  <p className="text-sm">Agents and clubs will submit player recommendations here</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {requirement.requiredAttributes?.map((attr) => (
                  <div key={attr.attributeName} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">{attr.attributeName}</span>
                    <Badge variant="secondary">Min {attr.minRating}/10</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Positions</h4>
                <div className="flex flex-wrap gap-2">
                  {requirement.requiredPositions.map((pos) => (
                    <Badge key={pos} variant="outline">{pos}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Age Range</h4>
                <p className="text-sm">
                  {requirement.ageRange?.min || "?"} - {requirement.ageRange?.max || "?"} years
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Preferred Regions</h4>
                <div className="flex flex-wrap gap-2">
                  {requirement.preferredRegions?.map((region) => (
                    <Badge key={region} variant="secondary" className="text-xs">
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
              <p className="text-sm text-muted-foreground mt-2">
                This requirement is currently active and receiving pitches.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequirementDetails;
