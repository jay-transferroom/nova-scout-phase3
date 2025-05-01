
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { RequirementProfile } from "@/types/report";
import { Link } from "react-router-dom";

// Mock requirement profiles for demo purposes
const mockRequirementProfiles: RequirementProfile[] = [
  {
    id: "req-1",
    name: "Central Defender",
    description: "Experienced central defender with good aerial ability and leadership",
    requiredPositions: ["CB"],
    ageRange: {
      min: 24,
      max: 29,
    },
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
    ageRange: {
      min: 20,
      max: 26,
    },
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
    ageRange: {
      min: 18,
      max: 23,
    },
    preferredRegions: ["Europe", "South America", "North America"],
    requiredAttributes: [
      { attributeName: "Reflexes", minRating: 7 },
      { attributeName: "Distribution", minRating: 7 },
    ],
  },
];

const RequirementsList = () => {
  const [requirements] = useState<RequirementProfile[]>(mockRequirementProfiles);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Player Requirements</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage requirements for players your club is looking for
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Requirement</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requirements.map((req) => (
          <Card key={req.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{req.name}</CardTitle>
              <CardDescription>{req.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Positions</h4>
                  <div className="flex flex-wrap gap-2">
                    {req.requiredPositions.map((pos) => (
                      <Badge key={pos} variant="outline">
                        {pos}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-1">Age Range</h4>
                  <p className="text-sm">
                    {req.ageRange?.min || "?"} - {req.ageRange?.max || "?"} years
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-1">Required Attributes</h4>
                  <ul className="text-sm space-y-1">
                    {req.requiredAttributes?.map((attr) => (
                      <li key={attr.attributeName}>
                        {attr.attributeName}: min {attr.minRating}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-1">Regions</h4>
                  <div className="flex flex-wrap gap-2">
                    {req.preferredRegions?.map((region) => (
                      <Badge key={region} variant="secondary" className="text-xs">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                  <Link to={`/transfers/requirements/${req.id}`}>
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RequirementsList;
