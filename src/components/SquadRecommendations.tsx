
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, AlertTriangle, Star, Clock, Activity } from "lucide-react";
import { Player } from "@/types/player";

interface SquadRecommendationsProps {
  players: Player[];
  selectedPosition: string | null;
  onPositionSelect: (position: string) => void;
}

const SquadRecommendations = ({ players, selectedPosition, onPositionSelect }: SquadRecommendationsProps) => {
  // Analyze squad depth by position with detailed risk assessment
  const getPositionAnalysis = () => {
    const positions = [
      { name: 'Goalkeeper', requiredPositions: ['GK'], needed: 2 },
      { name: 'Centre Back', requiredPositions: ['CB'], needed: 4 },
      { name: 'Full Back', requiredPositions: ['LB', 'RB', 'LWB', 'RWB'], needed: 4 },
      { name: 'Central Midfield', requiredPositions: ['CM', 'CDM', 'CAM'], needed: 6 },
      { name: 'Winger', requiredPositions: ['LW', 'RW', 'LM', 'RM'], needed: 4 },
      { name: 'Striker', requiredPositions: ['ST', 'CF'], needed: 3 }
    ];

    return positions.map(pos => {
      const positionPlayers = players.filter(p => 
        p.positions.some(playerPos => pos.requiredPositions.includes(playerPos))
      );

      // Risk assessment
      const contractExpiring = positionPlayers.filter(p => {
        if (!p.contractExpiry) return false;
        const expiryDate = new Date(p.contractExpiry);
        const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        return expiryDate < oneYearFromNow;
      }).length;

      const agingPlayers = positionPlayers.filter(p => p.age > 32).length;
      const injuredPlayers = Math.floor(Math.random() * Math.min(2, positionPlayers.length)); // Mock injury data

      let priority = 'Low';
      let recommendation = 'Squad depth is adequate';
      
      if (positionPlayers.length === 0) {
        priority = 'Critical';
        recommendation = 'URGENT: No players available in this position';
      } else if (positionPlayers.length === 1) {
        priority = 'High';
        recommendation = 'Critical lack of depth - immediate backup needed';
      } else if (positionPlayers.length < pos.needed / 2) {
        priority = 'High';
        recommendation = 'Insufficient depth for squad rotation';
      } else if (contractExpiring > 0 || agingPlayers > 1) {
        priority = 'Medium';
        recommendation = 'Squad renewal needed due to age/contract issues';
      }

      return {
        name: pos.name,
        current: positionPlayers.length,
        needed: pos.needed,
        priority,
        recommendation,
        risks: {
          contractExpiring,
          agingPlayers,
          injuredPlayers
        },
        players: positionPlayers
      };
    });
  };

  const positionAnalysis = getPositionAnalysis();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-600';
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-amber-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return <AlertTriangle className="h-4 w-4" />;
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
          Squad Depth Analysis & Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {positionAnalysis.map((analysis) => {
          const completionPercentage = Math.min((analysis.current / analysis.needed) * 100, 100);
          const isSelected = selectedPosition === analysis.name;
          const hasRisks = analysis.risks.contractExpiring > 0 || analysis.risks.agingPlayers > 0 || analysis.risks.injuredPlayers > 0;
          
          return (
            <div 
              key={analysis.name}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onPositionSelect(analysis.name)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{analysis.name}</h3>
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
              
              <p className="text-sm text-muted-foreground mb-2">
                {analysis.recommendation}
              </p>

              {/* Risk indicators */}
              {hasRisks && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {analysis.risks.contractExpiring > 0 && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      <Clock className="h-3 w-3" />
                      {analysis.risks.contractExpiring} contract{analysis.risks.contractExpiring > 1 ? 's' : ''} expiring
                    </div>
                  )}
                  {analysis.risks.agingPlayers > 0 && (
                    <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                      <TrendingUp className="h-3 w-3" />
                      {analysis.risks.agingPlayers} aging player{analysis.risks.agingPlayers > 1 ? 's' : ''}
                    </div>
                  )}
                  {analysis.risks.injuredPlayers > 0 && (
                    <div className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                      <Activity className="h-3 w-3" />
                      {analysis.risks.injuredPlayers} injured
                    </div>
                  )}
                </div>
              )}
              
              {(analysis.priority === 'High' || analysis.priority === 'Critical') && (
                <div className="mt-2 flex items-center gap-2 text-xs text-red-600">
                  <AlertTriangle className="h-3 w-3" />
                  {analysis.priority === 'Critical' ? 'URGENT ACTION REQUIRED' : 'Immediate attention required'}
                </div>
              )}

              {/* Show key players for this position */}
              {analysis.players.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-muted-foreground mb-1">Key players:</p>
                  <div className="flex flex-wrap gap-1">
                    {analysis.players.slice(0, 3).map((player, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {player.name.split(' ')[0]} ({player.age})
                      </Badge>
                    ))}
                    {analysis.players.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{analysis.players.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Star className="h-4 w-4" />
            Priority Recruitment Targets
          </div>
          <div className="space-y-2">
            {positionAnalysis
              .filter(p => p.priority === 'Critical' || p.priority === 'High')
              .slice(0, 3)
              .map((pos, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm">
                    {pos.priority === 'Critical' ? '🚨' : '⚡'} {pos.name} - {pos.recommendation}
                  </span>
                  <Badge variant="outline">{pos.priority}</Badge>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SquadRecommendations;
