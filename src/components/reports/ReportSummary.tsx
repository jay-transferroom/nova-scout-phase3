
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Save, Send, Edit, Copy, Check } from "lucide-react";
import { ReportWithPlayer } from "@/types/report";
import { toast } from "sonner";

interface ReportSummaryProps {
  report: ReportWithPlayer;
  template: any;
}

const ReportSummary = ({ report, template }: ReportSummaryProps) => {
  const [summary, setSummary] = useState("");
  const [editedSummary, setEditedSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI generation - in reality this would call an edge function
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSummary = `Executive Summary for ${report.player?.name}

RECOMMENDATION: Monitor closely for future opportunities

KEY HIGHLIGHTS:
• Strong technical ability with excellent ball control and passing range
• Shows good positional awareness and tactical understanding
• Physical attributes suitable for professional level
• Demonstrates leadership qualities on the pitch

AREAS FOR DEVELOPMENT:
• Consistency in high-pressure situations needs improvement
• Aerial ability could be enhanced
• Decision-making in final third requires refinement

OVERALL ASSESSMENT:
A promising talent with solid fundamentals and room for growth. Recommended for continued monitoring with potential for squad integration in 12-18 months with proper development.

NEXT STEPS:
• Schedule follow-up assessment in 3 months
• Monitor performance in upcoming fixtures
• Consider loan opportunity for development`;

      setSummary(mockSummary);
      setEditedSummary(mockSummary);
    } catch (error) {
      toast.error("Failed to generate summary");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Here you would save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSummary(editedSummary);
      setIsEditing(false);
      toast.success("Summary saved successfully");
    } catch (error) {
      toast.error("Failed to save summary");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedSummary || summary);
      setCopied(true);
      toast.success("Summary copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy summary");
    }
  };

  const handleSend = () => {
    // Here you would integrate with email or messaging system
    toast.success("Summary sent to sporting director");
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI Summary for Sporting Director
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              Executive Brief
            </Badge>
          </div>
          
          <div className="flex gap-2">
            {!summary && (
              <Button 
                onClick={generateSummary} 
                disabled={isGenerating}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Summary"}
              </Button>
            )}
            
            {summary && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
                
                {isEditing && (
                  <Button 
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                )}
                
                <Button 
                  size="sm"
                  onClick={handleSend}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      {summary && (
        <CardContent>
          {isEditing ? (
            <Textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Edit your summary..."
            />
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-medium text-gray-800">
                {summary}
              </pre>
            </div>
          )}
        </CardContent>
      )}
      
      {isGenerating && (
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-4"></div>
            <p className="text-muted-foreground">Analyzing report data and generating executive summary...</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ReportSummary;
