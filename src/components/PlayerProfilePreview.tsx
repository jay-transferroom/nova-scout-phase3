import { Button } from "@/components/ui/button";
import { ClubBadge } from "@/components/ui/club-badge";
import { Player } from "@/types/player";
import { useNavigate } from "react-router-dom";
import { 
  calculateAge, 
  getPositionColor, 
  getFormRatingColor 
} from "@/utils/playerProfileUtils";

interface PlayerProfilePreviewProps {
  player: Player;
  onCreateReport: (player: Player) => void;
  onClose: () => void;
}

const PlayerProfilePreview = ({ player, onCreateReport, onClose }: PlayerProfilePreviewProps) => {
  const navigate = useNavigate();
  
  const handleViewFullProfile = () => {
    navigate(`/player/${player.id}`); // Fixed: changed from /players/ to /player/
    onClose();
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          {player.image ? (
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl font-bold text-muted-foreground">
                {player.name.charAt(0)}
              </span>
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-bold">{player.name}</h2>
            <div className="mt-1">
              <ClubBadge clubName={player.club} />
            </div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="rounded-full h-8 w-8 inline-flex items-center justify-center text-muted-foreground hover:bg-muted"
        >
          ✕
        </button>
      </div>
      
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Age</p>
            <p className="font-medium">{player.age} ({calculateAge(player.dateOfBirth)} yrs)</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Nationality</p>
            <p className="font-medium">{player.nationality}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Dominant Foot</p>
            <p className="font-medium">{player.dominantFoot}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Contract</p>
            <p className="font-medium">
              {player.contractStatus}
              {player.contractExpiry && (
                <span className="text-sm text-muted-foreground ml-1">
                  (until {new Date(player.contractExpiry).toLocaleDateString()})
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">Positions</p>
          <div className="flex flex-wrap gap-2">
            {player.positions.map((position) => (
              <span
                key={position}
                className={`inline-flex items-center justify-center text-xs font-bold rounded-md px-2 py-1 text-white ${getPositionColor(position)}`}
              >
                {position}
              </span>
            ))}
          </div>
        </div>
        
        {player.recentForm && (
          <div className="rounded-md border p-3">
            <h3 className="text-sm font-medium mb-2">Recent Form</h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center p-2 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">Matches</p>
                <p className="font-bold">{player.recentForm.matches}</p>
              </div>
              
              <div className="text-center p-2 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">Goals</p>
                <p className="font-bold">{player.recentForm.goals}</p>
              </div>
              
              <div className="text-center p-2 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">Assists</p>
                <p className="font-bold">{player.recentForm.assists}</p>
              </div>
              
              <div className="text-center p-2 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">Rating</p>
                <p className={`font-bold ${getFormRatingColor(player.recentForm.rating)}`}>
                  {player.recentForm.rating}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t space-y-2">
        <Button 
          className="w-full" 
          onClick={() => onCreateReport(player)}
        >
          Create Report
        </Button>
        <Button 
          variant="outline"
          className="w-full" 
          onClick={handleViewFullProfile}
        >
          View Full Profile
        </Button>
      </div>
    </div>
  );
};

export default PlayerProfilePreview;
