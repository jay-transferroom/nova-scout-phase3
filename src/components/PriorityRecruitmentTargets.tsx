
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";
import { PositionAnalysis } from "@/hooks/usePositionAnalysis";

interface PriorityRecruitmentTargetsProps {
  positionAnalysis: PositionAnalysis[];
}

const PriorityRecruitmentTargets = ({ positionAnalysis }: PriorityRecruitmentTargetsProps) => {
  // Get top recommendations across all positions
  const allRecommendations = positionAnalysis
    .filter(analysis => analysis.recommendedTargets && analysis.recommendedTargets.length > 0)
    .flatMap(analysis => 
      analysis.recommendedTargets!.slice(0, 2).map(player => ({
        ...player,
        position: analysis.name,
        priority: analysis.priority
      }))
    )
    .sort((a, b) => {
      const priorityOrder = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      const aRating = a.transferroomRating || a.xtvScore || 0;
      const bRating = b.transferroomRating || b.xtvScore || 0;
      return bRating - aRating;
    })
    .slice(0, 6);

  if (allRecommendations.length === 0) {
    return null;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mt-6 pt-6 border-t">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 text-yellow-600" />
        <h3 className="font-semibold">Priority Recruitment Targets</h3>
      </div>
      
      <div className="space-y-3">
        {allRecommendations.map((player, index) => (
          <div key={`${player.id}-${index}`} className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow">
            <Avatar className="w-12 h-12">
              <AvatarImage src={player.image} alt={player.name} />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium truncate">{player.name}</h4>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getPriorityColor(player.priority)}`}
                >
                  {player.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{player.club} • {player.position}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">Age {player.age}</Badge>
                <Badge variant="outline" className="text-xs">{player.nationality}</Badge>
                {player.positions.slice(0, 2).map((pos, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">{pos}</Badge>
                ))}
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-lg text-primary">
                {player.transferroomRating || player.xtvScore || 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-4">
        View All Recommendations
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default PriorityRecruitmentTargets;
