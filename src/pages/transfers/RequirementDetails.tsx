
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Users } from "lucide-react";
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

const RequirementDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const requirement = mockRequirementProfiles.find(req => req.id === id);

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
              <CardTitle>Player Pitches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 20) + 5} new pitches received</span>
              </div>
              <Button className="mt-4" variant="outline">
                View All Pitches
              </Button>
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
