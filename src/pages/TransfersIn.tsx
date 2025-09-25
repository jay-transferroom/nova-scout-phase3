import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayersData } from "@/hooks/usePlayersData";
import { PlusCircle, Clock, Star, Bookmark, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const TransfersIn = () => {
  const { profile } = useAuth();
  const { data: players = [], isLoading } = usePlayersData();
  const navigate = useNavigate();

  // Filter for high-rated players that could be potential transfers
  const potentialTransfers = useMemo(() => {
    return players
      .filter(player => player.transferroomRating && player.transferroomRating >= 75)
      .sort((a, b) => (b.transferroomRating || 0) - (a.transferroomRating || 0))
      .slice(0, 20);
  }, [players]);

  // Sample pitch categories
  const pitchCategories = [
    { title: "Pitches", count: 22, color: "bg-blue-50 border-blue-200 text-blue-800" },
    { title: "Plus Pitches", count: 12, color: "bg-green-50 border-green-200 text-green-800" },
    { title: "Expiring Pitches", count: 10, color: "bg-red-50 border-red-200 text-red-800" },
    { title: "Shortlisted", count: 3, color: "bg-purple-50 border-purple-200 text-purple-800" },
  ];

  // Sample requirements data
  const requirements = [
    { position: "Strikers", abbr: "ST", status: "Active", firstTeam: true, pitches: 45, expiring: 0, posted: "12 days ago", shortlistName: "strikers" },
    { position: "Goalkeeper", abbr: "GK", status: "Active", firstTeam: true, pitches: 45, expiring: 0, posted: "12 days ago" },
    { position: "Left back", abbr: "LB", status: "Active", firstTeam: true, pitches: 32, expiring: 5, posted: "12 days ago" },
    { position: "Left back", abbr: "LB", status: "Paused", firstTeam: false, pitches: 17, expiring: 5, posted: "3 months ago" },
    { position: "Right back", abbr: "RB", status: "Active", firstTeam: true, pitches: 29, expiring: 0, posted: "1 year ago" },
  ];

  if (profile?.role !== 'director') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">This section is only available for directors.</p>
        </div>
      </div>
    );
  }

  const calculateTransferFee = (rating: number, age: number) => {
    let baseValue = rating * 0.5; // Base calculation
    if (age < 23) baseValue *= 1.5;
    else if (age < 27) baseValue *= 1.2;
    else if (age > 30) baseValue *= 0.8;
    return `£${Math.round(baseValue)}M`;
  };

  const calculateSalary = (rating: number) => {
    const baseSalary = rating * 1000;
    return `£${Math.round(baseSalary / 1000)}K`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading transfer data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transfers In</h1>
          <p className="text-muted-foreground">Monitor and manage incoming transfer opportunities</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Requirement
        </Button>
      </div>

      {/* New Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">New</h2>
        
        {/* Pitch Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {pitchCategories.map((category, index) => (
            <Card key={index} className={`cursor-pointer hover:shadow-md transition-shadow ${category.color}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{category.title}</h3>
                    <p className="text-2xl font-bold mt-1">{category.count}</p>
                  </div>
                  <div className="text-right">
                    {category.title === "Plus Pitches" && <Star className="h-5 w-5" />}
                    {category.title === "Expiring Pitches" && <Clock className="h-5 w-5" />}
                    {category.title === "Shortlisted" && <Bookmark className="h-5 w-5" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Plus Pitches Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Plus Pitches ({pitchCategories[1].count})</h3>
            <Button variant="outline">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {potentialTransfers.slice(0, 4).map((player) => (
              <Card key={player.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Player Header */}
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={player.image} alt={player.name} />
                        <AvatarFallback>
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{player.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {player.positions[0]}
                          </Badge>
                          <span className="text-lg font-bold text-blue-600">
                            {player.transferroomRating?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Club and Badge */}
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {player.club}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Forward (Wing)
                      </Badge>
                    </div>

                    {/* Transfer Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transfer Fee:</span>
                        <span className="font-medium">
                          {calculateTransferFee(player.transferroomRating || 0, player.age)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gross Salary:</span>
                        <span className="font-medium">
                          {calculateSalary(player.transferroomRating || 0)}/week
                        </span>
                      </div>
                    </div>

                    {/* Agency Info */}
                    <div className="text-xs text-muted-foreground">
                      Agency365 sent this plus pitch 2d ago
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Your Requirements Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Requirements</h3>
            <Button className="bg-green-600 hover:bg-green-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Requirement
            </Button>
          </div>

          <div className="space-y-3">
            {requirements.map((req, index) => (
              <Card 
                key={index} 
                className="hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => {
                  if (req.shortlistName) {
                    navigate(`/transfers-in/requirement/${req.shortlistName}`);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Position Badge */}
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="font-bold text-sm">{req.abbr}</span>
                      </div>
                      
                      {/* Position Details */}
                      <div>
                        <h4 className="font-medium">{req.position}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{req.firstTeam ? 'First Team' : 'U21s'}</span>
                          <span>•</span>
                          <span>Posted {req.posted}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <Badge 
                        variant={req.status === 'Active' ? 'default' : 'secondary'}
                        className={req.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {req.status}
                      </Badge>
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-xl font-bold">{req.pitches}</div>
                        <div className="text-xs text-muted-foreground">Pitches</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">{req.expiring}</div>
                        <div className="text-xs text-muted-foreground">Expiring</div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Pitches</DropdownMenuItem>
                          <DropdownMenuItem>Edit Requirement</DropdownMenuItem>
                          <DropdownMenuItem>Pause</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Requirement Button */}
          <Card className="border-dashed border-2 hover:border-green-300 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <PlusCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Create Requirement</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TransfersIn;