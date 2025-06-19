
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Download, Flag, Calendar, MapPin } from "lucide-react";
import { ReportWithPlayer } from "@/types/report";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { extractReportDataForDisplay } from "@/utils/reportDataExtraction";
import { formatReportDate, formatReportTime } from "@/utils/reportFormatting";
import { DEFAULT_TEMPLATES } from "@/data/defaultTemplates";

const ReportView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState<ReportWithPlayer | null>(null);
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If the ID is "new", redirect to report builder
    if (id === "new") {
      navigate("/reports/new");
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
            player:players(*),
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

        // Transform the data to match our ReportWithPlayer interface
        const transformedReport: ReportWithPlayer = {
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
          player: {
            id: data.player.id,
            name: data.player.name,
            club: data.player.club,
            age: data.player.age,
            dateOfBirth: data.player.date_of_birth,
            positions: data.player.positions,
            dominantFoot: data.player.dominant_foot as 'Left' | 'Right' | 'Both',
            nationality: data.player.nationality,
            contractStatus: data.player.contract_status as 'Free Agent' | 'Under Contract' | 'Loan' | 'Youth Contract',
            contractExpiry: data.player.contract_expiry,
            region: data.player.region,
            image: data.player.image_url,
          },
          scoutProfile: data.scout_profile ? {
            id: data.scout_profile.id,
            first_name: data.scout_profile.first_name,
            last_name: data.scout_profile.last_name,
            email: data.scout_profile.email,
            role: data.scout_profile.role as 'scout' | 'recruitment',
          } : undefined,
        };

        setReport(transformedReport);
      } catch (err) {
        console.error('Error in fetchReport:', err);
        setError('An error occurred while loading the report');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <p>Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate("/reports")} variant="outline">
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }
  
  if (!report) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Report not found</p>
          <Button onClick={() => navigate("/reports")} variant="outline">
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  const reportData = extractReportDataForDisplay(report, template);
  const canEdit = report.scoutId === user?.id;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/reports")} className="gap-2">
          <ArrowLeft size={16} />
          Back to Reports
        </Button>
        
        <div className="space-x-2">
          {canEdit && (
            <Button onClick={() => navigate(`/reports/${report.id}/edit`)} className="gap-2">
              <Edit size={16} />
              Edit Report
            </Button>
          )}
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export
          </Button>
          {report.flaggedForReview && (
            <Button variant="outline" className="gap-2 text-orange-600">
              <Flag size={16} />
              Flagged
            </Button>
          )}
        </div>
      </div>

      {/* Player Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            {report.player.image ? (
              <img 
                src={report.player.image} 
                alt={report.player.name} 
                className="w-16 h-16 rounded-full object-cover" 
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xl font-bold">{report.player.name.charAt(0)}</span>
              </div>
            )}
            
            <div className="flex-1">
              <CardTitle className="text-2xl">{report.player.name}</CardTitle>
              <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                <span>{report.player.club}</span>
                <span>•</span>
                <span>{report.player.positions.join(", ")}</span>
                <span>•</span>
                <span>{report.player.age} years</span>
              </div>
            </div>
            
            <div className="text-right">
              <Badge variant={
                report.status === 'submitted' ? 'default' : 
                report.status === 'draft' ? 'secondary' : 'outline'
              }>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </Badge>
              <div className="text-xs text-muted-foreground mt-1">
                {formatReportDate(report.createdAt)}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Report Metadata */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Report Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Scout</p>
              <p className="font-medium">
                {report.scoutProfile 
                  ? `${report.scoutProfile.first_name} ${report.scoutProfile.last_name}`
                  : 'Unknown Scout'
                }
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Template</p>
              <p className="font-medium">{template?.name || 'Unknown Template'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{formatReportTime(report.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Updated</p>
              <p className="font-medium">{formatReportTime(report.updatedAt)}</p>
            </div>
          </div>

          {report.matchContext && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Match Context
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p>{report.matchContext.date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Opposition</p>
                  <p>{report.matchContext.opposition}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Competition</p>
                  <p>{report.matchContext.competition}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Minutes Played</p>
                  <p>{report.matchContext.minutesPlayed}'</p>
                </div>
              </div>
              {report.matchContext.conditions && (
                <div className="mt-2">
                  <p className="text-muted-foreground">Conditions</p>
                  <p className="text-sm">{report.matchContext.conditions}</p>
                </div>
              )}
            </div>
          )}

          {report.tags && report.tags.length > 0 && (
            <div className="mt-4">
              <p className="text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {report.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Sections */}
      <div className="space-y-6">
        {reportData.map((section) => (
          <Card key={section.sectionId}>
            <CardHeader>
              <CardTitle className="text-xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.fieldId} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-medium mb-2">{field.label}</h4>
                    {field.value !== null && field.value !== undefined && field.value !== "" ? (
                      <div className="text-sm">
                        <p className="mb-1">{field.displayValue}</p>
                        {field.notes && (
                          <p className="text-muted-foreground italic">
                            Notes: {field.notes}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No data recorded</p>
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
