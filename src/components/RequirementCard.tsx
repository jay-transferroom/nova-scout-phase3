
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";

interface RequirementCardProps {
  position: string;
  status: 'active' | 'inactive';
  count?: string;
  onCreateAd?: () => void;
  onViewPitches?: () => void;
}

const RequirementCard = ({ position, status, count, onCreateAd, onViewPitches }: RequirementCardProps) => {
  const isActive = status === 'active';
  
  return (
    <Card className={`bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${isActive ? 'ring-2 ring-green-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 text-sm mb-1">{position}</h3>
            <p className={`text-xs ${isActive ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
              {count || 'Inactive'}
            </p>
          </div>
          {isActive ? (
            <Eye className="h-4 w-4 text-green-600" />
          ) : (
            <Plus className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        {isActive && onViewPitches ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewPitches}
            className="w-full text-xs"
          >
            View Pitches
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCreateAd}
            className="w-full text-xs"
          >
            Create Advert
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RequirementCard;
