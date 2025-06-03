
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, TrendingUp, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlayersData } from "@/hooks/usePlayersData";
import FootballPitch from "@/components/FootballPitch";

const SquadView = () => {
  const navigate = useNavigate();
  const { data: players = [], isLoading } = usePlayersData();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading squad data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Squad Analysis</h1>
            <p className="text-muted-foreground mt-2">
              Analyze your current squad and identify areas for improvement
            </p>
          </div>
        </div>
      </div>

      {/* Football Pitch Visualization */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Squad Formation</h2>
        <FootballPitch players={players} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Squad Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Players</span>
                <span className="font-medium">{players.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Age</span>
                <span className="font-medium">
                  {players.length > 0 ? (players.reduce((sum, p) => sum + p.age, 0) / players.length).toFixed(1) : '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Contract Expiring</span>
                <span className="font-medium text-amber-600">
                  {players.filter(p => p.contractExpiry && new Date(p.contractExpiry) < new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Goals Scored</span>
                <span className="font-medium">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Goals Conceded</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Clean Sheets</span>
                <span className="font-medium">8</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Priority Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">1. </span>
                <span>Central Defender</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">2. </span>
                <span>Creative Midfielder</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">3. </span>
                <span>Backup Goalkeeper</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Position Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                position: 'Goalkeeper', 
                players: players.filter(p => p.positions.includes('GK')).length, 
                avgAge: players.filter(p => p.positions.includes('GK')).reduce((sum, p, _, arr) => sum + p.age / arr.length, 0) || 0, 
                needs: 'Backup needed' 
              },
              { 
                position: 'Defenders', 
                players: players.filter(p => p.positions.some(pos => ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos))).length, 
                avgAge: players.filter(p => p.positions.some(pos => ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pos))).reduce((sum, p, _, arr) => sum + p.age / arr.length, 0) || 0, 
                needs: 'Strong depth' 
              },
              { 
                position: 'Midfielders', 
                players: players.filter(p => p.positions.some(pos => ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(pos))).length, 
                avgAge: players.filter(p => p.positions.some(pos => ['CM', 'CDM', 'CAM', 'LM', 'RM'].includes(pos))).reduce((sum, p, _, arr) => sum + p.age / arr.length, 0) || 0, 
                needs: 'Creative player needed' 
              },
              { 
                position: 'Forwards', 
                players: players.filter(p => p.positions.some(pos => ['ST', 'CF', 'LW', 'RW'].includes(pos))).length, 
                avgAge: players.filter(p => p.positions.some(pos => ['ST', 'CF', 'LW', 'RW'].includes(pos))).reduce((sum, p, _, arr) => sum + p.age / arr.length, 0) || 0, 
                needs: 'Good balance' 
              },
            ].map((pos) => (
              <div key={pos.position} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{pos.position}</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Players:</span>
                    <span>{pos.players}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Age:</span>
                    <span>{pos.avgAge ? pos.avgAge.toFixed(1) : '0'}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">{pos.needs}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SquadView;
