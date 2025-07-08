import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { usePrivatePlayerProfile } from "@/hooks/usePrivatePlayerProfile";
import { PlayerHeader } from "@/components/PlayerHeader";
import { PlayerBasicInfo } from "@/components/PlayerBasicInfo";
import { PlayerClubInfo } from "@/components/PlayerClubInfo";
import { PlayerNotes } from "@/components/PlayerNotes";
import { PlayerReports } from "@/components/PlayerReports";
import PlayerRatingsCard from "@/components/PlayerRatingsCard";
import PlayerAIRecommendation from "@/components/PlayerAIRecommendation";
import { groupReportsByPlayer } from "@/utils/reportGrouping";

const PrivatePlayerProfile = () => {
  const { id: playerId } = useParams();
  const navigate = useNavigate();
  const [notesOpen, setNotesOpen] = useState(false);

  const { player, isLoading, error, playerReports, reportsLoading } = usePrivatePlayerProfile(playerId);

  // Calculate aggregated data from reports
  const aggregatedData = playerReports && playerReports.length > 0 ? (() => {
    const groupedReports = groupReportsByPlayer(playerReports);
    const playerData = groupedReports[0]; // Should only be one player's reports
    
    return {
      avgRating: playerData?.avgRating || null,
      recommendation: playerData?.recommendation || null,
      reportCount: playerData?.reportCount || 0
    };
  })() : undefined;

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
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
    if (!dateString) return 'N/A';
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
      'Expired': 'bg-red-100 text-red-800',
      'Under Contract': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const onCreateReport = () => {
    navigate('/report-builder', { 
      state: { selectedPrivatePlayer: player } 
    });
  };

  const onOpenNotes = () => {
    setNotesOpen(true);
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">Loading private player data...</div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 mb-2">Private player not found</p>
          <p className="text-gray-600 mb-4">
            This private player either doesn't exist, has been removed, or you don't have permission to view it. 
            Private players can only be viewed by the user who created them.
          </p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      <div className="mb-6">
        <PlayerHeader
          player={player}
          onCreateReport={onCreateReport}
          onOpenNotes={onOpenNotes}
          calculateAge={calculateAge}
          getPositionColor={getPositionColor}
          aggregatedData={aggregatedData}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
        <div className="xl:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
          
          {/* Player Reports Section */}
          <PlayerReports 
            playerReports={playerReports || []}
            reportsLoading={reportsLoading}
            onViewReport={handleViewReport}
            playerId={player.id}
            playerName={player.name}
          />
          
          {/* Notes Section */}
          {player.notes && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Scout Notes</h3>
                <p className="text-gray-700">{player.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Source Context */}
          {player.source_context && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Source</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {player.source_context}
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="xl:col-span-1 space-y-6">
          <PlayerRatingsCard player={player} aggregatedData={aggregatedData} />
          <PlayerAIRecommendation player={player} />
        </div>
      </div>

      <PlayerNotes
        playerId={player.id || ""}
        playerName={player.name}
        open={notesOpen}
        onOpenChange={setNotesOpen}
      />
    </div>
  );
};

export default PrivatePlayerProfile;
