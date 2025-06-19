import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, MapPin, Award, TrendingUp, FileText, Star, User } from "lucide-react";
import { Player } from "@/types/player";
import { ReportWithPlayer } from "@/types/report";
import { getOverallRating, getRecommendation } from "@/utils/reportDataExtraction";
import { formatDate, getRatingColor } from "@/utils/reportFormatting";

interface PlayerWithForm {
  id: string;
  name: string;
  club: string;
  age: number;
  date_of_birth: string;
  positions: string[];
  dominant_foot: 'Left' | 'Right' | 'Both';
  nationality: string;
  contract_status: 'Free Agent' | 'Under Contract' | 'Loan' | 'Youth Contract';
  contract_expiry: string | null;
  region: string;
  image_url: string | null;
  player_recent_form: Array<{
    matches: number;
    goals: number;
    assists: number;
    rating: number;
  }> | null;
}

const PlayerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: player, isLoading, error } = useQuery({
    queryKey: ['player', id],
    queryFn: async (): Promise<Player | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          player_recent_form (
            matches,
            goals,
            assists,
            rating
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching player:', error);
        throw error;
      }

      if (!data) return null;

      const playerData = data as PlayerWithForm;
      
      return {
        id: playerData.id,
        name: playerData.name,
        club: playerData.club,
        age: playerData.age,
        dateOfBirth: playerData.date_of_birth,
        positions: playerData.positions,
        dominantFoot: playerData.dominant_foot,
        nationality: playerData.nationality,
        contractStatus: playerData.contract_status,
        contractExpiry: playerData.contract_expiry,
        region: playerData.region,
        image: playerData.image_url,
        recentForm: playerData.player_recent_form?.[0] ? {
          matches: playerData.player_recent_form[0].matches,
          goals: playerData.player_recent_form[0].goals,
          assists: playerData.player_recent_form[0].assists,
          rating: playerData.player_recent_form[0].rating,
        } : undefined,
      };
    },
    enabled: !!id,
  });

  const { data: playerReports, isLoading: reportsLoading } = useQuery({
    queryKey: ['player-reports', id],
    queryFn: async (): Promise<ReportWithPlayer[]> => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          player:players(*),
          scout_profile:profiles(*)
        `)
        .eq('player_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching player reports:', error);
        throw error;
      }

      return (data || []).map((report: any) => {
        let sections = report.sections;
        if (typeof sections === 'string') {
          try {
            sections = JSON.parse(sections);
          } catch (e) {
            console.log(`Failed to parse sections for report ${report.id}:`, e);
            sections = [];
          }
        }

        return {
          id: report.id,
          playerId: report.player_id,
          templateId: report.template_id,
          scoutId: report.scout_id,
          createdAt: new Date(report.created_at),
          updatedAt: new Date(report.updated_at),
          status: report.status as 'draft' | 'submitted' | 'reviewed',
          sections: Array.isArray(sections) ? sections : [],
          matchContext: report.match_context,
          tags: report.tags || [],
          flaggedForReview: report.flagged_for_review || false,
          player: report.player,
          scoutProfile: report.scout_profile,
        };
      });
    },
    enabled: !!id,
  });

  const getPositionColor = (position: string) => {
    const colors: Record<string, string> = {
      'GK': 'bg-yellow-500',
      'CB': 'bg-blue-500',
      'LB': 'bg-blue-300',
      'RB': 'bg-blue-300',
      'LWB': 'bg-teal-400',
      'RWB': 'bg-teal-400',
      'CDM': 'bg-green-600',
      'CM': 'bg-green-500',
      'CAM': 'bg-green-400',
      'LM': 'bg-teal-300',
      'RM': 'bg-teal-300',
      'LW': 'bg-red-300',
      'RW': 'bg-red-300',
      'ST': 'bg-red-600',
      'CF': 'bg-red-500',
    };
    
    return colors[position] || 'bg-gray-400';
  };

  const getFormRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-500';
    if (rating >= 7) return 'text-blue-500';
    if (rating >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getContractStatusColor = (status: string) => {
    switch (status) {
      case 'Free Agent': return 'bg-red-100 text-red-800';
      case 'Under Contract': return 'bg-green-100 text-green-800';
      case 'Loan': return 'bg-blue-100 text-blue-800';
      case 'Youth Contract': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDateLocal = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCreateReport = () => {
    navigate('/reports/new', { state: { selectedPlayerId: id } });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <p>Loading player profile...</p>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 mb-2">Player not found</p>
          <p className="text-gray-600 mb-4">The player you're looking for doesn't exist or may have been removed.</p>
          <Button onClick={() => navigate('/reports')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      {/* Player Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-8">
            <div className="flex-shrink-0">
              {player.image ? (
                <img 
                  src={player.image} 
                  alt={player.name} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" 
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {player.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{player.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{player.club}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {player.positions.map((position) => (
                  <span
                    key={position}
                    className={`inline-flex items-center justify-center text-sm font-bold rounded-md px-3 py-1 text-white ${getPositionColor(position)}`}
                  >
                    {position}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{calculateAge(player.dateOfBirth)} years old</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{player.nationality}</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Button onClick={handleCreateReport} className="gap-2">
                <FileText className="h-4 w-4" />
                Create Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium">{player.name}</p>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm text-gray-600">Date of Birth</p>
              <p className="font-medium">{formatDateLocal(player.dateOfBirth)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="font-medium">{calculateAge(player.dateOfBirth)} years old</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Nationality</p>
              <p className="font-medium">{player.nationality}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Region</p>
              <p className="font-medium">{player.region}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Dominant Foot</p>
              <p className="font-medium">{player.dominantFoot}</p>
            </div>
          </CardContent>
        </Card>

        {/* Club & Contract Information */}
        <Card>
          <CardHeader>
            <CardTitle>Club & Contract</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Current Club</p>
              <p className="font-medium text-lg">{player.club}</p>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm text-gray-600">Contract Status</p>
              <Badge className={getContractStatusColor(player.contractStatus)}>
                {player.contractStatus}
              </Badge>
            </div>
            
            {player.contractExpiry && (
              <div>
                <p className="text-sm text-gray-600">Contract Expires</p>
                <p className="font-medium">{formatDateLocal(player.contractExpiry)}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-600">Positions</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {player.positions.map((position) => (
                  <span
                    key={position}
                    className={`inline-flex items-center justify-center text-xs font-bold rounded px-2 py-1 text-white ${getPositionColor(position)}`}
                  >
                    {position}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Form */}
        {player.recentForm ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{player.recentForm.matches}</p>
                  <p className="text-sm text-gray-600">Matches</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{player.recentForm.goals}</p>
                  <p className="text-sm text-gray-600">Goals</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{player.recentForm.assists}</p>
                  <p className="text-sm text-gray-600">Assists</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className={`text-2xl font-bold ${getFormRatingColor(player.recentForm.rating)}`}>
                    {player.recentForm.rating}
                  </p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center py-8">No recent form data available</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Scouting Reports Section */}
      {playerReports && playerReports.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Scouting Reports ({playerReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsLoading ? (
                <p className="text-center py-4">Loading reports...</p>
              ) : (
                playerReports.map((report) => {
                  const rating = getOverallRating(report);
                  const recommendation = getRecommendation(report);
                  
                  return (
                    <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="capitalize">
                              {report.status}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {formatDate(report.createdAt)}
                            </span>
                            {report.scoutProfile && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <User className="h-3 w-3" />
                                <span>
                                  {report.scoutProfile.first_name} {report.scoutProfile.last_name}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {rating !== null && (
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className={`font-medium ${getRatingColor(rating)}`}>
                                  Rating: {rating}
                                </span>
                              </div>
                            )}
                            
                            {recommendation && (
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-blue-500" />
                                <span className={`font-medium ${getRatingColor(recommendation)}`}>
                                  {recommendation}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/reports/${report.id}`)}
                        >
                          View Report
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayerProfile;
