
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, TrendingUp, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SquadView = () => {
  const navigate = useNavigate();

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
                <span className="font-medium">25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Age</span>
                <span className="font-medium">24.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Contract Expiring</span>
                <span className="font-medium text-amber-600">3</span>
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
              { position: 'Goalkeeper', players: 2, avgAge: 26, needs: 'Backup needed' },
              { position: 'Defenders', players: 8, avgAge: 25, needs: 'Strong depth' },
              { position: 'Midfielders', players: 8, avgAge: 23, needs: 'Creative player needed' },
              { position: 'Forwards', players: 7, avgAge: 24, needs: 'Good balance' },
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
                    <span>{pos.avgAge}</span>
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
