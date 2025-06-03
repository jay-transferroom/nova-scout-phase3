
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { RequirementProfile } from "@/types/report";
import { Link, useLocation } from "react-router-dom";
import NewRequirementDialog from "@/components/NewRequirementDialog";

// Updated mock requirement profiles with squad information
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
    squad: "first-team",
    priority: "high",
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
    squad: "first-team",
    priority: "medium",
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
    squad: "under-21",
    priority: "low",
  },
  {
    id: "req-4",
    name: "Versatile Fullback",
    description: "Young fullback who can play both sides with pace",
    requiredPositions: ["LB", "RB"],
    ageRange: {
      min: 19,
      max: 24,
    },
    preferredRegions: ["Europe", "South America"],
    requiredAttributes: [
      { attributeName: "Pace", minRating: 7 },
      { attributeName: "Crossing", minRating: 6 },
      { attributeName: "Stamina", minRating: 7 },
    ],
    squad: "under-21",
    priority: "medium",
  },
  {
    id: "req-5",
    name: "Academy Striker",
    description: "Talented young striker for development",
    requiredPositions: ["ST", "CF"],
    ageRange: {
      min: 16,
      max: 19,
    },
    preferredRegions: ["Europe", "South America", "Africa"],
    requiredAttributes: [
      { attributeName: "Finishing", minRating: 6 },
      { attributeName: "Movement", minRating: 6 },
      { attributeName: "Potential", minRating: 8 },
    ],
    squad: "academy",
    priority: "low",
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getSquadColor = (squad: string) => {
  switch (squad) {
    case 'first-team': return 'bg-blue-100 text-blue-800';
    case 'under-21': return 'bg-purple-100 text-purple-800';
    case 'under-18': return 'bg-orange-100 text-orange-800';
    case 'academy': return 'bg-pink-100 text-pink-800';
    case 'reserves': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const RequirementsList = () => {
  const [requirements] = useState<RequirementProfile[]>(mockRequirementProfiles);
  const [isNewRequirementOpen, setIsNewRequirementOpen] = useState(false);
  const [initialPosition, setInitialPosition] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<string>("all");
  const location = useLocation();

  useEffect(() => {
    // Check if we came from dashboard with a position to create
    if (location.state?.position && location.state?.action === 'create') {
      setInitialPosition(location.state.position);
      setIsNewRequirementOpen(true);
    }
  }, [location.state]);

  const filterRequirementsBySquad = (squad: string) => {
    if (squad === "all") return requirements;
    return requirements.filter(req => req.squad === squad);
  };

  const RequirementCard = ({ req }: { req: RequirementProfile }) => (
    <Card key={req.id} className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{req.name}</CardTitle>
            <CardDescription className="mt-1">{req.description}</CardDescription>
          </div>
          <div className="flex flex-col gap-1 ml-2">
            {req.priority && (
              <Badge className={getPriorityColor(req.priority)} variant="secondary">
                {req.priority}
              </Badge>
            )}
            {req.squad && (
              <Badge className={getSquadColor(req.squad)} variant="outline">
                {req.squad.replace('-', ' ')}
              </Badge>
            )}
          </div>
        </div>
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
              {req.requiredAttributes?.slice(0, 3).map((attr) => (
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
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Player Requirements</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage requirements for players across different squads
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsNewRequirementOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>New Requirement</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({requirements.length})</TabsTrigger>
          <TabsTrigger value="first-team">
            First Team ({filterRequirementsBySquad("first-team").length})
          </TabsTrigger>
          <TabsTrigger value="under-21">
            Under 21 ({filterRequirementsBySquad("under-21").length})
          </TabsTrigger>
          <TabsTrigger value="under-18">
            Under 18 ({filterRequirementsBySquad("under-18").length})
          </TabsTrigger>
          <TabsTrigger value="academy">
            Academy ({filterRequirementsBySquad("academy").length})
          </TabsTrigger>
          <TabsTrigger value="reserves">
            Reserves ({filterRequirementsBySquad("reserves").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirements.map((req) => (
              <RequirementCard key={req.id} req={req} />
            ))}
          </div>
        </TabsContent>

        {["first-team", "under-21", "under-18", "academy", "reserves"].map((squad) => (
          <TabsContent key={squad} value={squad} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterRequirementsBySquad(squad).map((req) => (
                <RequirementCard key={req.id} req={req} />
              ))}
              {filterRequirementsBySquad(squad).length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <p>No requirements for {squad.replace('-', ' ')} squad yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setIsNewRequirementOpen(true)}
                  >
                    Create First Requirement
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <NewRequirementDialog 
        isOpen={isNewRequirementOpen}
        onClose={() => {
          setIsNewRequirementOpen(false);
          setInitialPosition(undefined);
        }}
        initialPosition={initialPosition}
      />
    </div>
  );
};

export default RequirementsList;
