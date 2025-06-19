
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { ReportWithPlayer } from "@/types/report";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ReportEditSection from "@/components/ReportEditSection";
import { useReportEdit } from "@/hooks/useReportEdit";
import { DEFAULT_TEMPLATES } from "@/data/defaultTemplates";

const ReportEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleSectionUpdate, handleSave, saving } = useReportEdit();
  const [report, setReport] = useState<ReportWithPlayer | null>(null);
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id || !user) return;
    
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        
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

        // Check if user can edit this report
        if (data.scout_id !== user.id) {
          setError('You can only edit your own reports');
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
  }, [id, user]);

  const onSectionUpdate = (updatedSection: any) => {
    const updatedReport = handleSectionUpdate(report, updatedSection);
    if (updatedReport) {
      setReport(updatedReport);
    }
  };

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

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(`/reports/${id}`)} className="gap-2">
          <ArrowLeft size={16} />
          Back to Report
        </Button>
        <Button onClick={() => handleSave(report)} disabled={saving} className="gap-2">
          <Save size={16} />
          {saving ? "Saving..." : "Save Report"}
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">
            Edit Report: {report.player.name}
          </CardTitle>
          <p className="text-muted-foreground">
            {report.player.club} • {report.player.positions.join(", ")}
          </p>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {report.sections.map((section) => {
          // Find the corresponding template section
          const templateSection = template?.sections?.find((ts: any) => ts.id === section.sectionId);
          
          return (
            <ReportEditSection
              key={section.sectionId}
              section={section}
              sectionTitle={templateSection?.title || section.sectionId.charAt(0).toUpperCase() + section.sectionId.slice(1)}
              templateSection={templateSection}
              onUpdate={onSectionUpdate}
              isOverallSection={section.sectionId === "overall"}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ReportEdit;
