import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { usePrivatePlayers } from "@/hooks/usePrivatePlayers";
import { PlayerHeader } from "@/components/PlayerHeader";
import PlayerBasicInfo from "@/components/PlayerBasicInfo";
import PlayerClubInfo from "@/components/PlayerClubInfo";
import PlayerStrengths from "@/components/PlayerStrengths";
import PlayerWeaknesses from "@/components/PlayerWeaknesses";
import PlayerNotes from "@/components/PlayerNotes";
import PlayerRatingsCard from "@/components/PlayerRatingsCard";

// Add SquadRecommendations import
import SquadRecommendations from "@/components/SquadRecommendations";

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

  const onCreateReport = () => {
    console.log("Create report clicked");
  };

  const onOpenNotes = () => {
    console.log("Open notes clicked");
  };

  // In the return statement, add SquadRecommendations after PlayerRatingsCard:
  return (
    <div className="container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <PlayerHeader
        player={player}
        onCreateReport={onCreateReport}
        onOpenNotes={onOpenNotes}
        calculateAge={calculateAge}
        getPositionColor={getPositionColor}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PlayerBasicInfo player={player} calculateAge={calculateAge} />
          <PlayerClubInfo player={player} />
          <PlayerStrengths player={player} />
          <PlayerWeaknesses player={player} />
          <PlayerNotes player={player} />
        </div>
        
        <div className="space-y-6">
          <PlayerRatingsCard player={player} />
          
          {/* Add Squad Recommendations */}
          <SquadRecommendations 
            players={[player]} 
            selectedPosition={null}
            onPositionSelect={() => {}}
            allPlayers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default PrivatePlayerProfile;
