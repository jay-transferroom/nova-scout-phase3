
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Target, TrendingUp, Star } from "lucide-react";

interface PositionPriorityBadgeProps {
  priority: string;
}

const PositionPriorityBadge = ({ priority }: PositionPriorityBadgeProps) => {
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
    <Badge 
      variant="secondary" 
      className={`text-white ${getPriorityColor(priority)}`}
    >
      <span className="flex items-center gap-1">
        {getPriorityIcon(priority)}
        {priority}
      </span>
    </Badge>
  );
};

export default PositionPriorityBadge;
