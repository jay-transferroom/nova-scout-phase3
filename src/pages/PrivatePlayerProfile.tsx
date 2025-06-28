
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { usePrivatePlayers } from "@/hooks/usePrivatePlayers";
import { PlayerHeader } from "@/components/PlayerHeader";
import { PlayerBasicInfo } from "@/components/PlayerBasicInfo";
import { PlayerClubInfo } from "@/components/PlayerClubInfo";
import { PlayerNotes } from "@/components/PlayerNotes";
import PlayerRatingsCard from "@/components/PlayerRatingsCard";
import PlayerAIRecommendation from "@/components/PlayerAIRecommendation";

const PrivatePlayerProfile = () => {
  const { playerId } = useParams();
  const { privatePlayers } = usePrivatePlayers();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (playerId && privatePlayers) {
      const foundPlayer = privatePlayers.find(p => p.id === `private-${playerId}`);
      setPlayer(foundPlayer);
    }
  }, [playerId, privatePlayers]);

  if (!player) {
    return (
      <div className="container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">Loading player data...</div>
      </div>
    );
  }

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDateLocal = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getPositionColor = (position: string) => {
    const positionColors = {
      "GK": "bg-red-500",
      "CB": "bg-blue-500",
      "LB": "bg-green-500",
      "RB": "bg-green-500",
      "CM": "bg-yellow-500",
      "CDM": "bg-yellow-500",
      "CAM": "bg-yellow-500",
      "LW": "bg-purple-500",
      "RW": "bg-purple-500",
      "ST": "bg-orange-500",
      "CF": "bg-orange-500",
    };
    return positionColors[position] || "bg-gray-500";
  };

  const getContractStatusColor = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Expiring': 'bg-yellow-100 text-yellow-800',
      'Expired': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const onCreateReport = () => {
    console.log("Create report clicked");
  };

  const onOpenNotes = () => {
    console.log("Open notes clicked");
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl px-4 sm:px-6 lg:px-8">
      <PlayerHeader
        player={player}
        onCreateReport={onCreateReport}
        onOpenNotes={onOpenNotes}
        calculateAge={calculateAge}
        getPositionColor={getPositionColor}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <PlayerBasicInfo 
            player={player} 
            calculateAge={calculateAge}
            formatDateLocal={formatDateLocal}
          />
          <PlayerClubInfo 
            player={player}
            getContractStatusColor={getContractStatusColor}
            getPositionColor={getPositionColor}
            formatDateLocal={formatDateLocal}
          />
          
          {/* Simple strengths and weaknesses cards since the components don't exist */}
          {player.strengths && player.strengths.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Strengths</h3>
                <div className="flex flex-wrap gap-2">
                  {player.strengths.map((strength, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {player.weaknesses && player.weaknesses.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Areas for Improvement</h3>
                <div className="flex flex-wrap gap-2">
                  {player.weaknesses.map((weakness, index) => (
                    <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700">
                      {weakness}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <PlayerRatingsCard player={player} />
          <PlayerAIRecommendation player={player} />
        </div>
      </div>

      <PlayerNotes
        playerId={player.id || ""}
        playerName={player.name}
        open={false}
        onOpenChange={() => {}}
      />
    </div>
  );
};

export default PrivatePlayerProfile;
