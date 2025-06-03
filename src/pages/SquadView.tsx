
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, TrendingUp, AlertTriangle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SquadPlayer {
  id: string;
  name: string;
  position: string;
  age: number;
  nationality: string;
  contractExpiry: string;
  marketValue: string;
  status: 'first-team' | 'backup' | 'youth' | 'injured' | 'loan';
  image?: string;
}

interface PositionGroup {
  position: string;
  players: SquadPlayer[];
  ideal: number;
  current: number;
  needsReinforcement: boolean;
}

const SquadView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("current");

  // Mock Bayern Munich squad data
  const squadData: PositionGroup[] = [
    {
      position: "Goalkeeper",
      ideal: 3,
      current: 2,
      needsReinforcement: true,
      players: [
        { id: "1", name: "Manuel Neuer", position: "GK", age: 37, nationality: "Germany", contractExpiry: "2024", marketValue: "€4M", status: "first-team" },
        { id: "2", name: "Sven Ulreich", position: "GK", age: 35, nationality: "Germany", contractExpiry: "2025", marketValue: "€1M", status: "backup" }
      ]
    },
    {
      position: "Centre Back",
      ideal: 4,
      current: 3,
      needsReinforcement: true,
      players: [
        { id: "3", name: "Dayot Upamecano", position: "CB", age: 25, nationality: "France", contractExpiry: "2026", marketValue: "€60M", status: "first-team" },
        { id: "4", name: "Min-jae Kim", position: "CB", age: 27, nationality: "South Korea", contractExpiry: "2028", marketValue: "€50M", status: "first-team" },
        { id: "5", name: "Eric Dier", position: "CB", age: 30, nationality: "England", contractExpiry: "2025", marketValue: "€15M", status: "backup" }
      ]
    },
    {
      position: "Full Back",
      ideal: 4,
      current: 4,
      needsReinforcement: false,
      players: [
        { id: "6", name: "Alphonso Davies", position: "LB", age: 23, nationality: "Canada", contractExpiry: "2025", marketValue: "€70M", status: "first-team" },
        { id: "7", name: "Joshua Kimmich", position: "RB", age: 29, nationality: "Germany", contractExpiry: "2025", marketValue: "€70M", status: "first-team" },
        { id: "8", name: "Noussair Mazraoui", position: "RB", age: 26, nationality: "Morocco", contractExpiry: "2026", marketValue: "€25M", status: "backup" },
        { id: "9", name: "Raphael Guerreiro", position: "LB", age: 30, nationality: "Portugal", contractExpiry: "2026", marketValue: "€25M", status: "backup" }
      ]
    },
    {
      position: "Central Midfielder",
      ideal: 5,
      current: 4,
      needsReinforcement: true,
      players: [
        { id: "10", name: "Leon Goretzka", position: "CM", age: 29, nationality: "Germany", contractExpiry: "2026", marketValue: "€40M", status: "first-team" },
        { id: "11", name: "Aleksandar Pavlovic", position: "CM", age: 20, nationality: "Germany", contractExpiry: "2028", marketValue: "€15M", status: "first-team" },
        { id: "12", name: "Konrad Laimer", position: "CM", age: 27, nationality: "Austria", contractExpiry: "2027", marketValue: "€30M", status: "backup" },
        { id: "13", name: "João Palhinha", position: "DM", age: 29, nationality: "Portugal", contractExpiry: "2028", marketValue: "€50M", status: "first-team" }
      ]
    },
    {
      position: "Attacking Midfielder",
      ideal: 3,
      current: 2,
      needsReinforcement: true,
      players: [
        { id: "14", name: "Jamal Musiala", position: "CAM", age: 21, nationality: "Germany", contractExpiry: "2026", marketValue: "€110M", status: "first-team" },
        { id: "15", name: "Thomas Müller", position: "CAM", age: 34, nationality: "Germany", contractExpiry: "2025", marketValue: "€8M", status: "first-team" }
      ]
    },
    {
      position: "Winger",
      ideal: 4,
      current: 3,
      needsReinforcement: true,
      players: [
        { id: "16", name: "Leroy Sané", position: "RW", age: 28, nationality: "Germany", contractExpiry: "2025", marketValue: "€65M", status: "first-team" },
        { id: "17", name: "Serge Gnabry", position: "RW", age: 29, nationality: "Germany", contractExpiry: "2026", marketValue: "€45M", status: "first-team" },
        { id: "18", name: "Kingsley Coman", position: "LW", age: 28, nationality: "France", contractExpiry: "2027", marketValue: "€50M", status: "injured" }
      ]
    },
    {
      position: "Forward",
      ideal: 3,
      current: 2,
      needsReinforcement: true,
      players: [
        { id: "19", name: "Harry Kane", position: "ST", age: 31, nationality: "England", contractExpiry: "2027", marketValue: "€100M", status: "first-team" },
        { id: "20", name: "Mathys Tel", position: "ST", age: 19, nationality: "France", contractExpiry: "2027", marketValue: "€20M", status: "backup" }
      ]
    }
  ];

  const getStatusColor = (status: SquadPlayer['status']) => {
    switch (status) {
      case 'first-team': return 'bg-green-100 text-green-800';
      case 'backup': return 'bg-blue-100 text-blue-800';
      case 'youth': return 'bg-purple-100 text-purple-800';
      case 'injured': return 'bg-red-100 text-red-800';
      case 'loan': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPlayers = squadData.reduce((acc, group) => acc + group.current, 0);
  const idealTotal = squadData.reduce((acc, group) => acc + group.ideal, 0);
  const reinforcementNeeded = squadData.filter(group => group.needsReinforcement).length;

  const handleCreateRequirement = (position: string) => {
    navigate('/transfers/requirements', { state: { position } });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bayern Munich Squad</h1>
            <p className="text-muted-foreground mt-2">
              Manage your squad composition and identify recruitment opportunities
            </p>
          </div>
          <Button onClick={() => navigate('/transfers/requirements')} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Requirement
          </Button>
        </div>

        {/* Squad Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">Total Squad</h3>
              </div>
              <p className="text-2xl font-bold">{totalPlayers}</p>
              <p className="text-sm text-muted-foreground">of {idealTotal} ideal</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h3 className="font-medium">Needs Reinforcement</h3>
              </div>
              <p className="text-2xl font-bold">{reinforcementNeeded}</p>
              <p className="text-sm text-muted-foreground">positions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="font-medium">Avg Age</h3>
              </div>
              <p className="text-2xl font-bold">26.8</p>
              <p className="text-sm text-muted-foreground">years</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <h3 className="font-medium">Contracts Expiring</h3>
              </div>
              <p className="text-2xl font-bold">6</p>
              <p className="text-sm text-muted-foreground">in 2025</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="current">Current Squad</TabsTrigger>
          <TabsTrigger value="shadow">Shadow Squad</TabsTrigger>
          <TabsTrigger value="analysis">Gap Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <div className="space-y-6">
            {squadData.map((group) => (
              <Card key={group.position}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{group.position}</CardTitle>
                      <Badge variant={group.needsReinforcement ? "destructive" : "secondary"}>
                        {group.current}/{group.ideal} players
                      </Badge>
                      {group.needsReinforcement && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Needs Reinforcement
                        </Badge>
                      )}
                    </div>
                    {group.needsReinforcement && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCreateRequirement(group.position)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create Requirement
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {group.players.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-blue-600">{player.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{player.name}</h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{player.age} years</span>
                              <span>•</span>
                              <span>{player.nationality}</span>
                              <span>•</span>
                              <span>Contract: {player.contractExpiry}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-green-600">{player.marketValue}</span>
                          <Badge className={getStatusColor(player.status)}>
                            {player.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shadow">
          <Card>
            <CardHeader>
              <CardTitle>Shadow Squad Analysis</CardTitle>
              <p className="text-muted-foreground">
                Identify backup options and potential future signings for each position
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {squadData.filter(group => group.needsReinforcement).map((group) => (
                  <div key={group.position} className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-lg mb-2">{group.position}</h3>
                    <p className="text-muted-foreground mb-3">
                      Missing {group.ideal - group.current} player(s) for optimal squad depth
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => handleCreateRequirement(group.position)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Find {group.position} Options
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Squad Composition Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Priority Positions</h4>
                    <div className="space-y-2">
                      {squadData
                        .filter(group => group.needsReinforcement)
                        .sort((a, b) => (b.ideal - b.current) - (a.ideal - a.current))
                        .map((group) => (
                          <div key={group.position} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <span className="font-medium">{group.position}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {group.ideal - group.current} player(s) needed
                              </span>
                              <Badge variant="destructive">High Priority</Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Contract Situations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h5 className="font-medium text-orange-600 mb-2">Expiring 2025</h5>
                          <ul className="space-y-1 text-sm">
                            <li>Alphonso Davies (LB)</li>
                            <li>Joshua Kimmich (RB)</li>
                            <li>Thomas Müller (CAM)</li>
                            <li>Leroy Sané (RW)</li>
                            <li>Eric Dier (CB)</li>
                            <li>Manuel Neuer (GK)</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h5 className="font-medium text-green-600 mb-2">Secured Long-term</h5>
                          <ul className="space-y-1 text-sm">
                            <li>Jamal Musiala (CAM) - 2026</li>
                            <li>Min-jae Kim (CB) - 2028</li>
                            <li>Harry Kane (ST) - 2027</li>
                            <li>João Palhinha (DM) - 2028</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SquadView;
