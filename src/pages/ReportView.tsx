
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Download, Flag, Calendar, MapPin, User, Clock } from "lucide-react";
import { ReportWithPlayer } from "@/types/report";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useReportPlayerData } from "@/hooks/useReportPlayerData";
import { extractReportDataForDisplay } from "@/utils/reportDataExtraction";
import { formatReportDate, formatReportTime } from "@/utils/reportFormatting";
import { DEFAULT_TEMPLATES } from "@/data/defaultTemplates";
import ReportSummary from "@/components/reports/ReportSummary";

const ReportView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState<ReportWithPlayer | null>(null);
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string>("");

  // Fetch player data separately
  const { data: playerData, isLoading: playerLoading } = useReportPlayerData(playerId);

  useEffect(() => {
    // If the ID is "new", redirect to report builder
    if (id === "new") {
      navigate("/report-builder");
      return;
    }

    if (!id || !user) return;
    
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching report with ID:', id);
        
        const { data, error: fetchError } = await supabase
          .from('reports')
          .select(`
            *,
            scout_profile:profiles(*)
          `)
          .eq('id', id)
          .single();

        if (fetchError) {
          console.error('Error fetching report:', fetchError);
          setError('Failed to load report');
          return;
        }

        if (!data) {
          setError('Report not found');
          return;
        }

        // Set the player ID to fetch player data
        setPlayerId(data.player_id);

        // Try to fetch template from database first
        const { data: templateData, error: templateError } = await supabase
          .from('report_templates')
          .select('*')
          .eq('id', data.template_id)
          .single();

        let templateToUse = null;
        
        if (templateError || !templateData) {
          // If template not found in database, check default templates
          console.log('Template not found in database, checking default templates');
          templateToUse = DEFAULT_TEMPLATES.find(t => t.id === data.template_id);
          
          if (!templateToUse) {
            // Fallback to first default template
            templateToUse = DEFAULT_TEMPLATES[0];
            console.log('Using fallback template:', templateToUse.name);
          }
        } else {
          // Convert database template to our format
          templateToUse = {
            id: templateData.id,
            name: templateData.name,
            description: templateData.description || '',
            defaultTemplate: templateData.default_template || false,
            defaultRatingSystem: templateData.default_rating_system,
            sections: templateData.sections || []
          };
        }

        setTemplate(templateToUse);

        // Store the report data without player info for now
        const reportWithoutPlayer = {
          id: data.id,
          playerId: data.player_id,
          templateId: data.template_id,
          scoutId: data.scout_id,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          status: data.status as 'draft' | 'submitted' | 'reviewed',
          sections: typeof data.sections === 'string' ? JSON.parse(data.sections) : data.sections || [],
          matchContext: typeof data.match_context === 'string' ? JSON.parse(data.match_context) : data.match_context,
          tags: data.tags || [],
          flaggedForReview: data.flagged_for_review || false,
          scoutProfile: data.scout_profile ? {
            id: data.scout_profile.id,
            first_name: data.scout_profile.first_name,
            last_name: data.scout_profile.last_name,
            email: data.scout_profile.email,
            role: data.scout_profile.role as 'scout' | 'recruitment',
          } : undefined,
        };

        // We'll set the full report once player data is loaded
        setReport({ ...reportWithoutPlayer, player: null } as any);
      } catch (err) {
        console.error('Error in fetchReport:', err);
        setError('An error occurred while loading the report');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [id, user, navigate]);

  // Update report with player data when it's available
  useEffect(() => {
    if (report && playerData && !report.player) {
      setReport(prev => prev ? { ...prev, player: playerData } : null);
    }
  }, [report, playerData]);

  if (loading || playerLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-lg">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4 text-lg font-medium">{error}</p>
            <Button onClick={() => navigate("/reports")} variant="outline">
              Back to Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!report || !report.player) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="mb-4 text-lg">Report not found</p>
            <Button onClick={() => navigate("/reports")} variant="outline">
              Back to Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const reportData = extractReportDataForDisplay(report, template);
  const canEdit = report.scoutId === user?.id;

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/reports")} className="gap-2 hover:bg-gray-100">
          <ArrowLeft size={16} />
          Back to Reports
        </Button>
        
        <div className="flex gap-2">
          {canEdit && (
            <Button onClick={() => navigate(`/report/${report.id}/edit`)} className="gap-2">
              <Edit size={16} />
              Edit Report
            </Button>
          )}
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export PDF
          </Button>
          {report.flaggedForReview && (
            <Button variant="outline" className="gap-2 text-orange-600 border-orange-200 bg-orange-50">
              <Flag size={16} />
              Flagged for Review
            </Button>
          )}
        </div>
      </div>

      {/* AI Summary Component */}
      <ReportSummary report={report} template={template} />

      {/* Enhanced Player Header */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6">
            <div className="flex items-start gap-6">
              {report.player.image ? (
                <img 
                  src={report.player.image} 
                  alt={report.player.name} 
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" 
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {report.player.name.charAt(0)}
                  </span>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.player.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{report.player.club}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{report.player.positions.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{report.player.age} years old</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {report.player.positions.map((position) => (
                    <Badge key={position} variant="secondary" className="bg-blue-100 text-blue-800">
                      {position}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="text-right">
                <Badge 
                  variant={
                    report.status === 'submitted' ? 'default' : 
                    report.status === 'draft' ? 'secondary' : 'outline'
                  }
                  className="mb-2"
                >
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </Badge>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatReportDate(report.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Metadata */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Report Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Scout</p>
              <p className="font-medium">
                {report.scoutProfile 
                  ? `${report.scoutProfile.first_name} ${report.scoutProfile.last_name}`
                  : 'Unknown Scout'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Template</p>
              <p className="font-medium">{template?.name || 'Unknown Template'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created</p>
              <p className="font-medium">{formatReportTime(report.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Last Updated</p>
              <p className="font-medium">{formatReportTime(report.updatedAt)}</p>
            </div>
          </div>

          {report.matchContext && (
            <>
              <Separator className="my-4" />
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar size={16} />
                  Match Context
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="font-medium">{report.matchContext.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Opposition</p>
                    <p className="font-medium">{report.matchContext.opposition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Competition</p>
                    <p className="font-medium">{report.matchContext.competition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Minutes Played</p>
                    <p className="font-medium">{report.matchContext.minutesPlayed}'</p>
                  </div>
                </div>
                {report.matchContext.conditions && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-1">Match Conditions</p>
                    <p className="text-sm bg-gray-50 p-2 rounded">{report.matchContext.conditions}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {report.tags && report.tags.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-sm text-gray-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {report.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Report Sections */}
      <div className="space-y-6">
        {reportData.map((section, index) => (
          <Card key={section.sectionId} className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl text-gray-900">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {section.fields.map((field, fieldIndex) => (
                  <div key={field.fieldId} className={fieldIndex < section.fields.length - 1 ? "pb-4 border-b border-gray-100" : ""}>
                    <h4 className="font-semibold text-gray-900 mb-2">{field.label}</h4>
                    {field.value !== null && field.value !== undefined && field.value !== "" ? (
                      <div className="space-y-2">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-800">{field.displayValue}</p>
                        </div>
                        {field.notes && (
                          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-200">
                            <p className="text-sm text-blue-800 font-medium mb-1">Scout Notes:</p>
                            <p className="text-blue-700 text-sm italic">{field.notes}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic bg-gray-50 p-3 rounded-lg">No data recorded for this field</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportView;
