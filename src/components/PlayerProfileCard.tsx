import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface PlayerData {
  id: number;
  name: string;
  age?: number;
  firstnationality?: string;
  currentteam?: string;
  firstposition?: string;
  secondposition?: string;
  rating?: number;
  potential?: number;
  basevalue?: number;
  imageurl?: string;
}

interface PlayerProfileCardProps {
  player: PlayerData;
  className?: string;
}

const PlayerProfileCard: React.FC<PlayerProfileCardProps> = ({ player, className = "" }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/player/${player.id.toString()}`);
  };

  const formatValue = (value?: number) => {
    if (!value) return 'N/A';
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    }
    return `€${value}`;
  };

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${className}`} onClick={handleViewProfile}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Player Image */}
          <div className="flex-shrink-0">
            {player.imageurl ? (
              <img
                src={player.imageurl}
                alt={player.name}
                className="w-12 h-12 rounded-full object-cover bg-gray-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${player.imageurl ? 'hidden' : ''}`}>
              <User className="h-6 w-6 text-gray-400" />
            </div>
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-sm truncate">{player.name}</h3>
                
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  {player.age && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{player.age}y</span>
                    </div>
                  )}
                  {player.firstnationality && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{player.firstnationality}</span>
                    </div>
                  )}
                </div>

                {player.currentteam && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {player.currentteam}
                  </p>
                )}

                <div className="flex items-center gap-1 mt-2">
                  {player.firstposition && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      {player.firstposition}
                    </Badge>
                  )}
                  {player.secondposition && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {player.secondposition}
                    </Badge>
                  )}
                </div>
              </div>

              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 mt-2 text-xs">
              {player.rating && (
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium">{player.rating.toFixed(1)}</span>
                </div>
              )}
              {player.potential && (
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground">Potential</span>
                  <span className="font-medium">{player.potential.toFixed(1)}</span>
                </div>
              )}
              {player.basevalue && (
                <div className="flex flex-col items-center">
                  <span className="text-muted-foreground">Value</span>
                  <span className="font-medium">{formatValue(player.basevalue)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerProfileCard;