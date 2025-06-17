
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, AlertTriangle, Star } from "lucide-react";
import { Player } from "@/types/player";

interface SquadRecommendationsProps {
  players: Player[];
  selectedPosition: string | null;
  onPositionSelect: (position: string) => void;
}

const SquadRecommendations = ({ players, selectedPosition, onPositionSelect }: SquadRecommendationsProps) => {
  // Analyze squad depth by position
  const positionAnalysis = {
    'Goalkeeper': {
      current: players.filter(p => p.positions.includes('GK')).length,
      needed: 2,
      priority: 'Medium',
      recommendation: 'Backup goalkeeper needed for depth'
    },
    'Centre Back': {
      current: players.filter(p => p.positions.includes('CB')).length,
      needed: 4,
      priority: 'High',
      recommendation: 'Additional center-back required for rotation'
    },
    'Full Back': {
      current: players.filter(p => p.positions.some(pos => ['LB', 'RB', 'LWB', 'RWB'].includes(pos))).length,
      needed: 4,
      priority: 'Medium',
      recommendation: 'Good depth available'
    },
    'Central Midfield': {
      current: players.filter(p => p.positions.some(pos => ['CM', 'CDM', 'CAM'].includes(pos))).length,
      needed: 6,
      priority: 'High',
      recommendation: 'Creative midfielder with high xTV potential needed'
    },
    'Winger': {
      current: players.filter(p => p.positions.some(pos => ['LW', 'RW', 'LM', 'RM'].includes(pos))).length,
      needed: 4,
      priority: 'Low',
      recommendation: 'Adequate depth available'
    },
    'Striker': {
      current: players.filter(p => p.positions.some(pos => ['ST', 'CF'].includes(pos))).length,
      needed: 3,
      priority: 'Medium',
      recommendation: 'Consider adding pace and creativity'
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-amber-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      case 'Medium': return <Target className="h-4 w-4" />;
      case 'Low': return <TrendingUp className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Squad Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(positionAnalysis).map(([position, analysis]) => {
          const completionPercentage = Math.min((analysis.current / analysis.needed) * 100, 100);
          const isSelected = selectedPosition === position;
          
          return (
            <div 
              key={position}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onPositionSelect(position)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{position}</h3>
                  <Badge 
                    variant="secondary" 
                    className={`text-white ${getPriorityColor(analysis.priority)}`}
                  >
                    <span className="flex items-center gap-1">
                      {getPriorityIcon(analysis.priority)}
                      {analysis.priority}
                    </span>
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {analysis.current}/{analysis.needed}
                </div>
              </div>
              
              <Progress 
                value={completionPercentage} 
                className="mb-2"
              />
              
              <p className="text-sm text-muted-foreground">
                {analysis.recommendation}
              </p>
              
              {analysis.priority === 'High' && (
                <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  Immediate attention required
                </div>
              )}
            </div>
          );
        })}
        
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Star className="h-4 w-4" />
            Top Recommendations
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span className="text-sm">Priority: Creative Central Midfielder</span>
              <Badge variant="outline">90% Match</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
              <span className="text-sm">Priority: Experienced Centre Back</span>
              <Badge variant="outline">85% Match</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SquadRecommendations;
